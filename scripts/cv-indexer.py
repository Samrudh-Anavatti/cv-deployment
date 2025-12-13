"""
CV Indexer Script
Uploads and indexes the CV document to Azure Search with permanent status.
Run this after deployment to pre-populate the index with your CV.
"""

import requests
import sys
import os

def cleanup_permanent_documents(backend_url):
    """Delete all permanent documents from the index before re-indexing"""
    print("Step 0: Cleaning up old CV documents...")
    
    cleanup_payload = {
        "sessionId": "global",
        "documentType": "permanent"
    }
    
    try:
        cleanup_response = requests.post(
            f"{backend_url}/api/cleanup",
            json=cleanup_payload
        )
        
        if cleanup_response.status_code == 200:
            result = cleanup_response.json()
            deleted_count = result.get('deletedCount', 0)
            print(f"✓ Cleaned up {deleted_count} old CV document(s)")
        else:
            print(f"⚠ Cleanup returned status {cleanup_response.status_code}")
            print("  Continuing with indexing anyway...")
    except Exception as e:
        print(f"⚠ Cleanup failed: {e}")
        print("  Continuing with indexing anyway...")
    
    print()

def index_cv(backend_url, cv_file_path):
    """Upload and index the CV document"""
    
    print("=== CV Indexer ===")
    print(f"Backend URL: {backend_url}")
    print(f"CV File: {cv_file_path}")
    print()
    
    if not os.path.exists(cv_file_path):
        print(f"ERROR: CV file not found: {cv_file_path}")
        return False
    
    # Step 0: Clean up old CV documents
    cleanup_permanent_documents(backend_url)
    
    # Step 1: Upload CV to blob storage
    print("Step 1: Uploading CV to blob storage...")
    filename = os.path.basename(cv_file_path)
    
    with open(cv_file_path, 'rb') as f:
        files = {'file': (filename, f, 'application/pdf')}
        upload_response = requests.post(
            f"{backend_url}/api/documents/upload",
            files=files
        )
    
    if upload_response.status_code not in [200, 201]:
        print(f"ERROR: Upload failed with status {upload_response.status_code}")
        print(upload_response.text)
        return False
    
    print(f"✓ CV uploaded successfully: {filename}")
    print()
    
    # Step 2: Embed CV with permanent status
    print("Step 2: Embedding CV into search index...")
    embed_payload = {
        "fileName": filename,
        "sessionId": "global",
        "documentType": "permanent"
    }
    
    embed_response = requests.post(
        f"{backend_url}/api/embed",
        json=embed_payload
    )
    
    if embed_response.status_code != 200:
        print(f"ERROR: Embedding failed with status {embed_response.status_code}")
        print(f"Response: {embed_response.text}")
        try:
            error_data = embed_response.json()
            print(f"Error details: {error_data}")
        except:
            pass
        return False
    
    result = embed_response.json()
    print(f"✓ CV embedded successfully!")
    print(f"  Chunks created: {result.get('chunks', 'unknown')}")
    print()
    
    # Step 3: Verify by testing a query
    print("Step 3: Verifying index with test query...")
    test_query = {
        "prompt": "What is Samrudh's background?",
        "enableRag": True,
        "sessionId": "test-session"
    }
    
    query_response = requests.post(
        f"{backend_url}/api/generate",
        json=test_query
    )
    
    if query_response.status_code == 200:
        result = query_response.json()
        if result.get('citations'):
            print(f"✓ Verification successful!")
            print(f"  Citations found: {result['citations']}")
            print()
            print("=== CV Indexing Complete ===")
            return True
        else:
            print("⚠ Warning: Query succeeded but no citations found")
            print("  The index may need time to propagate")
            return True
    else:
        print(f"⚠ Warning: Verification query failed with status {query_response.status_code}")
        print("  CV is indexed but verification failed")
        return True

if __name__ == "__main__":
    # Configuration
    BACKEND_URL = "https://zaralmpersonal-func-dev.azurewebsites.net"
    CV_FILE = "2025_CV (4).pdf"  # Update this to match your CV filename
    
    # Allow command line overrides
    if len(sys.argv) > 1:
        BACKEND_URL = sys.argv[1]
    if len(sys.argv) > 2:
        CV_FILE = sys.argv[2]
    
    # Find CV file (check current dir and parent dir)
    cv_path = CV_FILE
    if not os.path.exists(cv_path):
        cv_path = os.path.join("..", CV_FILE)
    if not os.path.exists(cv_path):
        print(f"ERROR: Could not find CV file: {CV_FILE}")
        print("Please update the CV_FILE variable in this script or pass it as an argument")
        sys.exit(1)
    
    success = index_cv(BACKEND_URL, cv_path)
    sys.exit(0 if success else 1)
