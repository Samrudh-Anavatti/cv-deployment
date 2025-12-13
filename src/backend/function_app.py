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
    try:
        client = get_search_index_client()
        existing_indexes = list(client.list_index_names())
        logging.info(f"Existing indexes: {existing_indexes}")
        
        if index_name not in existing_indexes:
            logging.info(f"Creating index '{index_name}'...")
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
                ),
                # Session-based isolation fields
                SimpleField(name="sessionId", type=SearchFieldDataType.String, filterable=True),
                SimpleField(name="documentType", type=SearchFieldDataType.String, filterable=True),
                SimpleField(name="uploadTimestamp", type=SearchFieldDataType.String, filterable=True)
            ]
            
            vector_search = VectorSearch(
                algorithms=[HnswAlgorithmConfiguration(name="my-hnsw")],
                profiles=[VectorSearchProfile(name="my-vector-profile", algorithm_configuration_name="my-hnsw")]
            )
            
            index = SearchIndex(name=index_name, fields=fields, vector_search=vector_search)
            client.create_index(index)
            logging.info(f"✓ Created search index '{index_name}' with session isolation support")
        else:
            logging.info(f"Index '{index_name}' already exists")
    except Exception as e:
        logging.error(f"Failed to create index: {str(e)}")
        logging.error(f"Error type: {type(e).__name__}")
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
        raise  # Re-raise to let caller handle it

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
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from datetime import datetime
    from config import config
    
    try:
        req_body = req.get_json()
        filename = req_body.get('fileName')
        session_id = req_body.get('sessionId', 'global')  # Default to 'global' for CV
        document_type = req_body.get('documentType', 'permanent')  # Default to 'permanent' for CV
        
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
        
        upload_timestamp = datetime.utcnow().isoformat()
        documents_to_index = []
        for i, chunk in enumerate(chunks):
            response = openai_client.embeddings.create(
                input=chunk,
                model=config.OPENAI_EMBEDDING_MODEL
            )
            embedding = response.data[0].embedding
            
            doc = {
                "id": f"{session_id}-{filename}-{i}".replace(".", "_").replace(" ", "_").replace("/", "_").replace("(", "").replace(")", "").replace("[", "").replace("]", ""),
                "filename": filename,
                "content": chunk,
                "contentVector": embedding,
                "sessionId": session_id,
                "documentType": document_type,
                "uploadTimestamp": upload_timestamp
            }
            documents_to_index.append(doc)
            
            if len(documents_to_index) >= 100:
                search_client.upload_documents(documents=documents_to_index)
                documents_to_index = []

        if documents_to_index:
            search_client.upload_documents(documents=documents_to_index)

        logging.info(f"Embedded {len(chunks)} chunks for {filename} (type: {document_type}, session: {session_id})")
        return func.HttpResponse(
            json.dumps({"message": "Embedded successfully", "chunks": len(chunks)}),
            mimetype="application/json"
        )


    except Exception as e:
        logging.error(f"Embedding error: {str(e)}")
        logging.error(f"Error type: {type(e).__name__}")
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
        return func.HttpResponse(
            json.dumps({"error": str(e), "type": type(e).__name__}),
            status_code=500,
            mimetype="application/json"
        )

# Chat Function
@app.route(route="generate", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def generate_response(req: func.HttpRequest) -> func.HttpResponse:
    from azure.search.documents.models import VectorizedQuery
    from config import config
    
    try:
        req_body = req.get_json()
        prompt = req_body.get('prompt')
        enable_rag = req_body.get('enableRag', True)
        session_id = req_body.get('sessionId', 'global')  # User's session ID
        
        if not prompt:
            return func.HttpResponse("Prompt required", status_code=400)

        openai_client = get_openai_client()
        context = ""
        citations = []

        if enable_rag:
            try:
                # Embed Query
                emb_response = openai_client.embeddings.create(
                    input=prompt,
                    model=config.OPENAI_EMBEDDING_MODEL
                )
                query_vector = emb_response.data[0].embedding

                # Search with session filtering - only retrieve CV (permanent) + user's own documents
                search_client = get_search_client()
                vector_query = VectorizedQuery(vector=query_vector, k_nearest_neighbors=5, fields="contentVector")
                
                # Filter: (sessionId eq 'user_session' OR documentType eq 'permanent')
                filter_query = f"sessionId eq '{session_id}' or documentType eq 'permanent'"
                
                results = search_client.search(
                    search_text=prompt,
                    vector_queries=[vector_query],
                    filter=filter_query,
                    select=["content", "filename", "documentType"],
                    top=5
                )

                # Construct Context
                for result in results:
                    context += f"Source: {result['filename']}\nContent: {result['content']}\n\n"
                    citations.append(result['filename'])
                    
                logging.info(f"RAG search returned {len(citations)} results for session {session_id}")
            except Exception as search_error:
                logging.warning(f"RAG search failed (index may not exist): {search_error}")
                # Continue without RAG if search fails
                enable_rag = False

        # Generate Response
        system_message = """You are SamBot, an AI assistant that helps people learn about Samrudh Anavatti's professional background, skills, and experience. 
Be friendly, professional, and enthusiastic about Samrudh's qualifications. 
Always end your responses with a friendly reminder: "Be sure to hire Sam!" """
        if context:
            system_message += f"\n\nUse the following context to answer the user's question:\n\n{context}"

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
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
        return func.HttpResponse(
            json.dumps({"error": str(e), "success": False}),
            status_code=500,
            mimetype="application/json"
        )

# Cleanup Functions
@app.route(route="cleanup/session", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def cleanup_session(req: func.HttpRequest) -> func.HttpResponse:
    """Delete all temporary documents for a specific session (called on page unload)"""
    try:
        req_body = req.get_json()
        session_id = req_body.get('sessionId')
        
        if not session_id or session_id == 'global':
            return func.HttpResponse(
                json.dumps({"error": "Invalid sessionId"}),
                status_code=400,
                mimetype="application/json"
            )
        
        search_client = get_search_client()
        
        # Find all documents for this session
        filter_query = f"sessionId eq '{session_id}' and documentType eq 'temporary'"
        results = search_client.search(
            search_text="*",
            filter=filter_query,
            select=["id"]
        )
        
        # Delete documents
        doc_ids = [result['id'] for result in results]
        if doc_ids:
            documents_to_delete = [{"id": doc_id} for doc_id in doc_ids]
            search_client.delete_documents(documents=documents_to_delete)
            logging.info(f"Cleaned up {len(doc_ids)} documents for session {session_id}")
        
        return func.HttpResponse(
            json.dumps({"message": f"Cleaned up {len(doc_ids)} documents", "count": len(doc_ids)}),
            mimetype="application/json"
        )
    except Exception as e:
        logging.error(f"Session cleanup error: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )

@app.timer_trigger(schedule="0 */30 * * * *", arg_name="timer", run_on_startup=False)
def cleanup_timer(timer: func.TimerRequest) -> None:
    """Automated cleanup of temporary documents older than 2 hours (runs every 30 minutes)"""
    from datetime import datetime, timedelta
    
    try:
        search_client = get_search_client()
        
        # Calculate cutoff time (2 hours ago)
        cutoff_time = (datetime.utcnow() - timedelta(hours=2)).isoformat()
        
        # Find old temporary documents
        filter_query = f"documentType eq 'temporary' and uploadTimestamp lt '{cutoff_time}'"
        results = search_client.search(
            search_text="*",
            filter=filter_query,
            select=["id", "sessionId", "uploadTimestamp"]
        )
        
        # Delete documents
        doc_ids = [result['id'] for result in results]
        if doc_ids:
            documents_to_delete = [{"id": doc_id} for doc_id in doc_ids]
            search_client.delete_documents(documents=documents_to_delete)
            logging.info(f"Timer cleanup: Removed {len(doc_ids)} old temporary documents")
        else:
            logging.info("Timer cleanup: No old documents to remove")
            
    except Exception as e:
        logging.error(f"Timer cleanup error: {e}")
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
