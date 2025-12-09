import azure.functions as func
import logging
import json
import os
from azure.storage.blob import BlobServiceClient
from config import config

documents_bp = func.Blueprint()

def get_blob_service_client():
    return BlobServiceClient.from_connection_string(config.AZURE_STORAGE_CONNECTION_STRING)

@documents_bp.route(route="documents/upload", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
@documents_bp.function_name(name="upload_document")
def upload_document(req: func.HttpRequest) -> func.HttpResponse:
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

@documents_bp.route(route="documents", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
@documents_bp.function_name(name="list_documents")
def list_documents(req: func.HttpRequest) -> func.HttpResponse:
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

@documents_bp.route(route="documents/{name}", methods=["DELETE"], auth_level=func.AuthLevel.ANONYMOUS)
@documents_bp.function_name(name="delete_document")
def delete_document(req: func.HttpRequest) -> func.HttpResponse:
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
