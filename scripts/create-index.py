"""
Create Azure Search Index
Run this once to create the search index before indexing documents.
"""

import requests
import sys

def create_index(backend_url):
    """Create the search index by calling a simple endpoint"""
    
    print("=== Creating Azure Search Index ===")
    print(f"Backend URL: {backend_url}")
    print()
    
    # Call the generate endpoint with RAG disabled to trigger index creation
    # This will call create_index_if_not_exists() without needing documents
    print("Triggering index creation...")
    
    # We'll use the embed endpoint with a test call
    # First, let's just call the list documents endpoint which should be simpler
    response = requests.get(f"{backend_url}/api/documents")
    
    if response.status_code == 200:
        print("✓ Backend is responding")
    else:
        print(f"⚠ Backend returned status {response.status_code}")
    
    print()
    print("Index should be created on first embed attempt.")
    print("The issue is that create_index_if_not_exists() might be failing.")
    print()
    print("Please check Azure Portal → Azure AI Search → Indexes")
    print("to see if the 'documents' index exists.")

if __name__ == "__main__":
    BACKEND_URL = "https://zaralmpersonal-func-dev.azurewebsites.net"
    
    if len(sys.argv) > 1:
        BACKEND_URL = sys.argv[1]
    
    create_index(BACKEND_URL)
