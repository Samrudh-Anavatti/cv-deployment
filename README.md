# Samrudh Anavatti - Personal Website with SamBot

A modern personal website featuring an AI-powered RAG chatbot (SamBot) that can answer questions about my professional background, skills, and experience.

## 🌟 Features

- **Hero Section**: Professional introduction with contact details and career highlights
- **Tech Showcase**: Animated display of technologies and skills
- **SamBot**: RAG-powered AI chatbot for interactive Q&A about my background
- **Admin Panel**: Secure document management for RAG knowledge base
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Azure Functions (Python)
- **AI**: Azure OpenAI Service (GPT + Embeddings)
- **Vector Store**: Azure AI Search
- **Storage**: Azure Blob Storage

## 🚀 Local Development

### Prerequisites

- Node.js 16+
- Python 3.10+
- Azure subscription (for backend services)

### Frontend Setup

```bash
cd src/frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Create Azure resources (see deployment section)
2. Configure environment variables in `src/backend/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "AZURE_OPENAI_ENDPOINT": "your-endpoint",
    "AZURE_OPENAI_API_KEY": "your-key",
    "AZURE_OPENAI_API_VERSION": "2024-02-01",
    "AZURE_SEARCH_ENDPOINT": "your-search-endpoint",
    "AZURE_SEARCH_KEY": "your-search-key",
    "AZURE_STORAGE_CONNECTION_STRING": "your-connection-string",
    "AZURE_STORAGE_CONTAINER_NAME": "documents"
  }
}
```

3. Run the backend:

```bash
cd src/backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
func start
```

## 📝 Updating Content

### Profile Information

Edit `src/frontend/src/data/profile.json` to update:
- Name, title, location
- Contact information
- Professional summary
- Technologies/skills
- Career highlights

### SamBot Knowledge Base

1. Access admin panel:
   - Press `Ctrl+Shift+A` on the website
   - Or navigate to `/admin`
   - Enter password (default: `admin123`)

2. Upload documents (PDF, TXT, DOC)
3. Click "Embed" to process documents for RAG
4. SamBot will use these documents to answer questions

## 🔐 Admin Panel

The admin panel is password-protected and accessible via:
- Keyboard shortcut: `Ctrl+Shift+A`
- URL: `/admin`
- Small settings icon (bottom-right corner)

Default password: `admin123` (change in `.env`)

## 🌐 Azure Deployment

### Backend Deployment

```bash
cd src/backend
func azure functionapp publish <your-function-app-name>
```

### Frontend Deployment

```bash
cd src/frontend
npm run build
# Upload dist/ folder to Azure Static Web Apps or Storage Static Website
```

See the original [deployment guide](README_DEPLOYMENT.md) for detailed Azure setup instructions.

## 🎨 Customization

### Colors & Theme

Edit CSS variables in `src/frontend/src/index.css`:

```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --background: #0f172a;
  /* ... */
}
```

### SamBot Personality

Edit the system prompt in `src/backend/function_app.py`:

```python
system_message = """You are SamBot, an AI assistant..."""
```

## 📦 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Framer Motion (animations)
- React Markdown

**Backend:**
- Azure Functions
- Python 3.10
- LangChain
- Azure OpenAI
- Azure AI Search

## 📄 License

Personal project - All rights reserved

## 🤝 Contact

- Email: samrudh.anavatti@gmail.com
- LinkedIn: [linkedin.com/in/samrudh-anavatti](https://linkedin.com/in/samrudh-anavatti)
- Website: https://your-domain.dev

---

**Built with ❤️ using React, Azure Functions, and AI**
