import os

class Config:
    def __init__(self):
        # All models in Sweden Central
        self.AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
        self.AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-01")
        self.AZURE_SEARCH_ENDPOINT = os.getenv("AZURE_SEARCH_ENDPOINT")
        self.AZURE_SEARCH_KEY = os.getenv("AZURE_SEARCH_KEY")
        self.AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
        self.AZURE_STORAGE_CONTAINER_NAME = os.getenv("AZURE_STORAGE_CONTAINER_NAME", "documents")
        
        # Model deployments in Sweden Central
        self.OPENAI_CHAT_MODEL = "chat"  # gpt-4.1
        self.OPENAI_EMBEDDING_MODEL = "embedding"  # text-embedding-ada-002

config = Config()
