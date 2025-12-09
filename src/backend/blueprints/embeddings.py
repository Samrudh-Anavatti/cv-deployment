import azure.functions as func
import logging
import json
import os
from azure.storage.blob import BlobServiceClient
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SimpleField,
    SearchField,
    SearchFieldDataType,
    VectorSearch,
    HnswAlgorithmConfiguration,
    VectorSearchProfile
)
from azure.core.credentials import AzureKeyCredential
from openai import AzureOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from config import config
import io
import pypdf

embeddings_bp = func.Blueprint()

def get_openai_client():
    # Use key-based auth for simplicity in this personal project
    return AzureOpenAI(
        api_key=config.AZURE_OPENAI_API_KEY,
        api_version=config.AZURE_OPENAI_API_VERSION,
        azure_endpoint=config.AZURE_OPENAI_ENDPOINT
    )

def get_search_index_client():
    return SearchIndexClient(
        endpoint=config.AZURE_SEARCH_ENDPOINT,
        credential=AzureKeyCredential(config.AZURE_SEARCH_KEY)
    )

def get_search_client(index_name="documents"):
    return SearchClient(
        endpoint=config.AZURE_SEARCH_ENDPOINT,
        index_name=index_name,
        credential=AzureKeyCredential(config.AZURE_SEARCH_KEY)
    )

def create_index_if_not_exists(index_name="documents"):
    client = get_search_index_client()
    if index_name not in client.list_index_names():
        # Define index schema
        fields = [
            SimpleField(name="id", type=SearchFieldDataType.String, key=True),
            SimpleField(name="filename", type=SearchFieldDataType.String, filterable=True),
            SearchField(name="content", type=SearchFieldDataType.String, searchable=True),
            SearchField(
                name="contentVector",
                type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
                searchable=True,
                vector_search_dimensions=1536, # text-embedding-3-small
                vector_search_profile_name="my-vector-profile"
            )
        ]
        
        vector_search = VectorSearch(
            algorithms=[
                HnswAlgorithmConfiguration(name="my-hnsw")
            ],
            profiles=[
                VectorSearchProfile(name="my-vector-profile", algorithm_configuration_name="my-hnsw")
            ]
        )
        
        index = SearchIndex(name=index_name, fields=fields, vector_search=vector_search)
        client.create_index(index)

@embeddings_bp.route(route="embed", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
@embeddings_bp.function_name(name="embed_document")
def embed_document(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        filename = req_body.get('fileName')
        
        if not filename:
            return func.HttpResponse("FileName required", status_code=400)

        # 1. Read file from Blob
        blob_service_client = BlobServiceClient.from_connection_string(config.AZURE_STORAGE_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(container=config.AZURE_STORAGE_CONTAINER_NAME, blob=filename)
        
        if not blob_client.exists():
            return func.HttpResponse("File not found", status_code=404)
            
        stream = blob_client.download_blob()
        file_content = stream.readall()
        
        # 2. Extract Text (Simple PDF support)
        text = ""
        if filename.lower().endswith('.pdf'):
            pdf_file = io.BytesIO(file_content)
            pdf_reader = pypdf.PdfReader(pdf_file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        else:
            text = file_content.decode('utf-8', errors='ignore')

        # 3. Chunk Text
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = splitter.split_text(text)

        # 4. Generate Embeddings & Index
        openai_client = get_openai_client()
        create_index_if_not_exists()
        search_client = get_search_client()
        
        documents_to_index = []
        for i, chunk in enumerate(chunks):
            # Generate embedding
            response = openai_client.embeddings.create(
                input=chunk,
                model=config.OPENAI_EMBEDDING_MODEL
            )
            embedding = response.data[0].embedding
            
            # Create document
            doc = {
                "id": f"{filename}-{i}".replace(".", "_").replace(" ", "_"), # Simple ID sanitization
                "filename": filename,
                "content": chunk,
                "contentVector": embedding
            }
            documents_to_index.append(doc)
            
            # Batch upload every 100 chunks
            if len(documents_to_index) >= 100:
                search_client.upload_documents(documents=documents_to_index)
                documents_to_index = []

        if documents_to_index:
            search_client.upload_documents(documents=documents_to_index)

        return func.HttpResponse(
            json.dumps({"message": "Embedded successfully", "chunks": len(chunks)}),
            mimetype="application/json"
        )

    except Exception as e:
        logging.error(f"Embedding error: {e}")
        return func.HttpResponse(str(e), status_code=500)
