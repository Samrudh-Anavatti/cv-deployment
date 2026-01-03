# Personal CV Website with RAG-Powered Chatbot
Personal CV Website with in built RAG. Frontend designed on Figma, all infrastrcutre hosted on Azure

## Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with Tailwind-inspired utilities
- **Animations**: Framer Motion
- **Hosting**: Azure Static Web Apps

### Backend
- **Runtime**: Azure Functions (Python 3.11)
- **AI Model**: Azure OpenAI (GPT-4o)
- **Vector Database**: Azure AI Search
- **Document Storage**: Azure Blob Storage
- **Framework**: LangChain for RAG orchestration

### RAG Pipeline
1. **Document Processing**: PDFs and text files uploaded via frontend
2. **Embedding**: Azure OpenAI text-embedding-ada-002
3. **Vector Storage**: Azure AI Search with hybrid search capabilities
4. **Retrieval**: Semantic search with configurable top-k results
5. **Generation**: GPT-4o with retrieved context for grounded responses

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- Azure CLI
- Azure subscription with:
  - Azure OpenAI Service
  - Azure AI Search
  - Azure Storage Account
  - Azure Functions

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Configure VITE_BACKEND_URL in .env
npm run dev
```

Frontend runs on `http://localhost:3000`

### Backend Setup

1. Create `src/backend/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "AZURE_OPENAI_ENDPOINT": "https://your-resource.openai.azure.com/",
    "AZURE_OPENAI_KEY": "your-key",
    "AZURE_SEARCH_ENDPOINT": "https://your-search.search.windows.net",
    "AZURE_SEARCH_KEY": "your-key",
    "AZURE_STORAGE_CONNECTION_STRING": "your-connection-string"
  }
}
```

2. Install dependencies and run:

```bash
cd src/backend
python -m venv .venv
source .venv/bin/activate  # or .venv\\Scripts\\activate on Windows
pip install -r requirements.txt
func start
```

Backend runs on `http://localhost:7071`

## Deployment

### Automated Deployment

The project includes a PowerShell deployment script that handles infrastructure provisioning and deployment:

```powershell
cd scripts
# Configure config.env with your Azure credentials
.\deploy-simple.ps1
```

The script will:
1. Create Azure resource group
2. Deploy infrastructure via Bicep templates
3. Deploy backend Function App
4. Build and deploy frontend to Static Web Apps
5. Index initial CV document

### Manual Deployment

#### Backend
```bash
cd src/backend
func azure functionapp publish <function-app-name>
```

#### Frontend
```bash
cd frontend
npm run build
# Upload build/ directory to Azure Static Web Apps or Blob Storage
```

## Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Hero.tsx
│   │   │   ├── SamBot.tsx   # RAG chatbot interface
│   │   │   ├── RAGDiagram.tsx
│   │   │   └── ...
│   │   └── main.tsx
│   └── public/
│       └── images/          # Static assets
├── src/
│   └── backend/             # Azure Functions backend
│       ├── function_app.py  # Main function definitions
│       ├── requirements.txt
│       └── ...
├── infra/                   # Infrastructure as Code
│   └── simple-main.bicep    # Azure resource definitions
└── scripts/
    ├── deploy-simple.ps1    # Deployment automation
    └── config.env           # Deployment configuration
```

## API Endpoints

### POST /api/generate
Generate AI responses with optional RAG retrieval.

**Request:**
```json
{
  "prompt": "Tell me about your experience",
  "enableRag": true,
  "sessionId": "unique-session-id"
}
```

**Response:**
```json
{
  "response": "AI generated response...",
  "citations": ["document1.pdf", "document2.pdf"]
}
```

### POST /api/documents/upload
Upload documents for RAG knowledge base.

**Request:** multipart/form-data with file

**Response:**
```json
{
  "filename": "uploaded-file.pdf",
  "url": "https://storage.../uploaded-file.pdf"
}
```

### POST /api/embed
Embed uploaded documents into vector database.

**Request:**
```json
{
  "fileName": "document.pdf",
  "sessionId": "unique-session-id",
  "documentType": "temporary"
}
```

**Response:**
```json
{
  "chunks": 15,
  "message": "Document embedded successfully"
}
```

## Configuration

### Environment Variables

**Frontend (.env):**
```
VITE_BACKEND_URL=https://your-function-app.azurewebsites.net
```

**Backend (local.settings.json or Azure App Settings):**
```
AZURE_OPENAI_ENDPOINT=<your-endpoint>
AZURE_OPENAI_KEY=<your-key>
AZURE_SEARCH_ENDPOINT=<your-endpoint>
AZURE_SEARCH_KEY=<your-key>
AZURE_STORAGE_CONNECTION_STRING=<your-connection-string>
```

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Framer Motion
- Lucide React (icons)

**Backend:**
- Azure Functions (Python)
- LangChain
- Azure OpenAI SDK
- Azure AI Search SDK
- Pydantic (data validation)

**Infrastructure:**
- Azure Static Web Apps
- Azure Functions
- Azure OpenAI Service
- Azure AI Search
- Azure Blob Storage

## Development Notes

- Frontend uses Vite's dev server with HMR
- Backend uses Azure Functions Core Tools for local development
- RAG pipeline uses hybrid search (vector + keyword)
- Session isolation via unique session IDs
- Document cleanup endpoint prevents duplicate embeddings


## Contact

- Email: samrudh.anavatti@gmail.com
- LinkedIn: [linkedin.com/in/samrudh-anavatti](https://linkedin.com/in/samrudh-anavatti)
- GitHub: [github.com/samrudh-anavatti](https://github.com/samrudh-anavatti)
