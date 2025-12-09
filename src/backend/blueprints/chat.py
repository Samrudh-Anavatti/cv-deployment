import azure.functions as func
import logging
import json
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizedQuery
from azure.core.credentials import AzureKeyCredential
from openai import AzureOpenAI
from config import config

chat_bp = func.Blueprint()

def get_openai_client():
    return AzureOpenAI(
        api_key=config.AZURE_OPENAI_API_KEY,
        api_version=config.AZURE_OPENAI_API_VERSION,
        azure_endpoint=config.AZURE_OPENAI_ENDPOINT
    )

def get_search_client(index_name="documents"):
    return SearchClient(
        endpoint=config.AZURE_SEARCH_ENDPOINT,
        index_name=index_name,
        credential=AzureKeyCredential(config.AZURE_SEARCH_KEY)
    )

@chat_bp.route(route="generate", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
@chat_bp.function_name(name="generate_response")
def generate_response(req: func.HttpRequest) -> func.HttpResponse:
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
            # 1. Embed Query
            emb_response = openai_client.embeddings.create(
                input=prompt,
                model=config.OPENAI_EMBEDDING_MODEL
            )
            query_vector = emb_response.data[0].embedding

            # 2. Search
            search_client = get_search_client()
            vector_query = VectorizedQuery(vector=query_vector, k_nearest_neighbors=3, fields="contentVector")
            
            results = search_client.search(
                search_text=prompt,
                vector_queries=[vector_query],
                select=["content", "filename"],
                top=3
            )

            # 3. Construct Context
            for result in results:
                context += f"Source: {result['filename']}\nContent: {result['content']}\n\n"
                citations.append(result['filename'])

        # 4. Generate Response
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
