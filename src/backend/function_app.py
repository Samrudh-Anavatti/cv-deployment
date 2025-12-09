import azure.functions as func
import logging
import json
import os

app = func.FunctionApp()

# Helper functions - imports moved inside to avoid trigger detection issues
def get_openai_client():
    from openai import AzureOpenAI
    from config import config
    return AzureOpenAI(
        api_key=config.AZURE_OPENAI_API_KEY,
        api_version=config.AZURE_OPENAI_API_VERSION,
        azure_endpoint=config.AZURE_OPENAI_ENDPOINT
    )

def get_blob_service_client():
    from azure.storage.blob import BlobServiceClient
    from config import config
    return BlobServiceClient.from_connection_string(config.AZURE_STORAGE_CONNECTION_STRING)

def get_search_index_client():
    from azure.search.documents.indexes import SearchIndexClient
    from azure.core.credentials import AzureKeyCredential
    from config import config
    return SearchIndexClient(
        endpoint=config.AZURE_SEARCH_ENDPOINT,
        credential=AzureKeyCredential(config.AZURE_SEARCH_KEY)
    )

def get_search_client(index_name="documents"):
    from azure.search.documents import SearchClient
    from azure.core.credentials import AzureKeyCredential
    from config import config
    return SearchClient(
        endpoint=config.AZURE_SEARCH_ENDPOINT,
        index_name=index_name,
        credential=AzureKeyCredential(config.AZURE_SEARCH_KEY)
    )

def create_index_if_not_exists(index_name="documents"):
    from azure.search.documents.indexes.models import (
        SearchIndex,
        SimpleField,
        SearchField,
        SearchFieldDataType,
        VectorSearch,
        HnswAlgorithmConfiguration,
        VectorSearchProfile
    )
    client = get_search_index_client()
    if index_name not in client.list_index_names():
        fields = [
            SimpleField(name="id", type=SearchFieldDataType.String, key=True),
            SimpleField(name="filename", type=SearchFieldDataType.String, filterable=True),
            SearchField(name="content", type=SearchFieldDataType.String, searchable=True),
            SearchField(
                name="contentVector",
                type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
                searchable=True,
                vector_search_dimensions=1536,
                vector_search_profile_name="my-vector-profile"
            )
        ]
        
        vector_search = VectorSearch(
            algorithms=[HnswAlgorithmConfiguration(name="my-hnsw")],
            profiles=[VectorSearchProfile(name="my-vector-profile", algorithm_configuration_name="my-hnsw")]
        )
        
        index = SearchIndex(name=index_name, fields=fields, vector_search=vector_search)
        client.create_index(index)

# Document Management Functions
@app.route(route="documents/upload", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def upload_document(req: func.HttpRequest) -> func.HttpResponse:
    from config import config
    try:
        file = req.files.get('file')
        if not file:
            return func.HttpResponse("No file part", status_code=400)

        filename = file.filename
        blob_service_client = get_blob_service_client()
        container_client = blob_service_client.get_container_client(config.AZURE_STORAGE_CONTAINER_NAME)
        
        if not container_client.exists():
            container_client.create_container()

        blob_client = container_client.get_blob_client(filename)
        blob_client.upload_blob(file.read(), overwrite=True)

        return func.HttpResponse(
            json.dumps({"message": "File uploaded successfully", "filename": filename}),
            status_code=201,
            mimetype="application/json"
        )
    except Exception as e:
        logging.error(f"Error uploading document: {e}")
        return func.HttpResponse(str(e), status_code=500)

@app.route(route="documents", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def list_documents(req: func.HttpRequest) -> func.HttpResponse:
    from config import config
    try:
        blob_service_client = get_blob_service_client()
        container_client = blob_service_client.get_container_client(config.AZURE_STORAGE_CONTAINER_NAME)
        
        if not container_client.exists():
            return func.HttpResponse(json.dumps([]), mimetype="application/json")

        blobs = container_client.list_blobs()
        documents = [{"name": b.name, "size": b.size} for b in blobs]

        return func.HttpResponse(json.dumps(documents), mimetype="application/json")
    except Exception as e:
        logging.error(f"Error listing documents: {e}")
        return func.HttpResponse(str(e), status_code=500)

@app.route(route="documents/{name}", methods=["DELETE"], auth_level=func.AuthLevel.ANONYMOUS)
def delete_document(req: func.HttpRequest) -> func.HttpResponse:
    from config import config
    filename = req.route_params.get('name')
    try:
        blob_service_client = get_blob_service_client()
        container_client = blob_service_client.get_container_client(config.AZURE_STORAGE_CONTAINER_NAME)
        blob_client = container_client.get_blob_client(filename)
        
        if blob_client.exists():
            blob_client.delete_blob()
            return func.HttpResponse(json.dumps({"message": "Deleted"}), mimetype="application/json")
        else:
            return func.HttpResponse("Not found", status_code=404)
    except Exception as e:
        logging.error(f"Error deleting document: {e}")
        return func.HttpResponse(str(e), status_code=500)

# Embedding Function
@app.route(route="embed", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def embed_document(req: func.HttpRequest) -> func.HttpResponse:
    import io
    import pypdf
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from config import config
    
    try:
        req_body = req.get_json()
        filename = req_body.get('fileName')
        
        if not filename:
            return func.HttpResponse("FileName required", status_code=400)

        # Read file from Blob
        blob_service_client = get_blob_service_client()
        blob_client = blob_service_client.get_blob_client(container=config.AZURE_STORAGE_CONTAINER_NAME, blob=filename)
        
        if not blob_client.exists():
            return func.HttpResponse("File not found", status_code=404)
            
        stream = blob_client.download_blob()
        file_content = stream.readall()
        
        # Extract Text
        text = ""
        if filename.lower().endswith('.pdf'):
            pdf_file = io.BytesIO(file_content)
            pdf_reader = pypdf.PdfReader(pdf_file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        else:
            text = file_content.decode('utf-8', errors='ignore')

        # Chunk Text
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = splitter.split_text(text)

        # Generate Embeddings & Index
        openai_client = get_openai_client()
        create_index_if_not_exists()
        search_client = get_search_client()
        
        documents_to_index = []
        for i, chunk in enumerate(chunks):
            response = openai_client.embeddings.create(
                input=chunk,
                model=config.OPENAI_EMBEDDING_MODEL
            )
            embedding = response.data[0].embedding
            
            doc = {
                "id": f"{filename}-{i}".replace(".", "_").replace(" ", "_"),
                "filename": filename,
                "content": chunk,
                "contentVector": embedding
            }
            documents_to_index.append(doc)
            
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

# Chat Function
@app.route(route="generate", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def generate_response(req: func.HttpRequest) -> func.HttpResponse:
    from azure.search.documents.models import VectorizedQuery
    from config import config
    
    try:
        req_body = req.get_json()
        prompt = req_body.get('prompt')
        enable_rag = req_body.get('enableRag', True)
        
        if not prompt:
            return func.HttpResponse("Prompt required", status_code=400)

        openai_client = get_openai_client()
        context = ""
        citations = []

        if enable_rag:
            # Embed Query
            emb_response = openai_client.embeddings.create(
                input=prompt,
                model=config.OPENAI_EMBEDDING_MODEL
            )
            query_vector = emb_response.data[0].embedding

            # Search
            search_client = get_search_client()
            vector_query = VectorizedQuery(vector=query_vector, k_nearest_neighbors=3, fields="contentVector")
            
            results = search_client.search(
                search_text=prompt,
                vector_queries=[vector_query],
                select=["content", "filename"],
                top=3
            )

            # Construct Context
            for result in results:
                context += f"Source: {result['filename']}\nContent: {result['content']}\n\n"
                citations.append(result['filename'])

        # Generate Response
        system_message = "You are a helpful assistant."
        if context:
            system_message += f"\nUse the following context to answer the user's question:\n\n{context}"

        chat_response = openai_client.chat.completions.create(
            model=config.OPENAI_CHAT_MODEL,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = chat_response.choices[0].message.content

        return func.HttpResponse(
            json.dumps({
                "response": response_text,
                "citations": list(set(citations)),
                "success": True
            }),
            mimetype="application/json"
        )

    except Exception as e:
        logging.error(f"Chat error: {e}")
        return func.HttpResponse(str(e), status_code=500)
