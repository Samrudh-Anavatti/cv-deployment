# Zaralm-Personal: Simplified Azure RAG - Hybrid Deployment Guide

This guide walks you through deploying your personal RAG application using a hybrid approach (Portal + Scripts).

## Prerequisites
- **Azure Subscription**: Active subscription
- **Azure CLI**: Installed and logged in (`az login`)
- **Azure Functions Core Tools**: Installed (`func`)
- **Node.js**: Installed
- **Python 3.10+**: Installed

## Step 1: Manual Resource Creation (Azure Portal)

### 1.1 Create Resource Group
1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"Resource groups"** → Click **"Create"**
3. **Resource group name**: `rg-zaralm-personal`
4. **Region**: `West Europe`
5. Click **"Review + Create"** → **"Create"**

### 1.2 Create Azure OpenAI Service
1. In the portal, search for **"Azure OpenAI"** → Click **"Create"**
2. **Resource group**: `rg-zaralm-personal`
3. **Region**: `West Europe`
4. **Name**: `ai-zaralm-personal` (or any unique name)
5. **Pricing tier**: `Standard S0`
6. Click **"Next"** through the tabs → **"Create"**
7. **Wait for deployment to complete** (2-3 minutes)

### 1.3 Deploy AI Models
1. Go to your Azure OpenAI resource → Click **"Model deployments"** → **"Manage Deployments"**
2. This opens **Azure AI Studio**
3. Click **"+ Create new deployment"**

**Deploy Chat Model:**
- **Select a model**: Choose any available chat model (GPT-3.5-Turbo, GPT-4, etc.)
- **Deployment name**: `chat` (use exactly this name)
- **Model version**: Latest available
- **Deployment type**: Standard
- Click **"Deploy"**

**Deploy Embedding Model:**
- Click **"+ Create new deployment"** again
- **Select a model**: `text-embedding-ada-002` or `text-embedding-3-small`
- **Deployment name**: `embedding` (use exactly this name)
- **Model version**: Latest available
- Click **"Deploy"**

### 1.4 Get Azure OpenAI Details
1. Go back to your Azure OpenAI resource in the portal
2. Click **"Keys and Endpoint"** (left sidebar)
3. **Copy and save**:
   - **Endpoint** (e.g., `https://ai-zaralm-personal.openai.azure.com/`)
   - **Key 1**

### 1.5 Create Azure AI Search
1. Search for **"Azure AI Search"** → Click **"Create"**
2. **Resource group**: `rg-zaralm-personal`
3. **Service name**: `search-zaralm-personal` (or any unique name)
4. **Location**: `West Europe`
5. **Pricing tier**: `Free` (or `Basic` if you need more capacity)
6. Click **"Review + Create"** → **"Create"**
7. **Wait for deployment to complete**

### 1.6 Get Azure AI Search Details
1. Go to your Azure AI Search resource
2. Click **"Keys"** (left sidebar)
3. **Copy and save**:
   - **URL** (e.g., `https://search-zaralm-personal.search.windows.net`)
   - **Primary admin key**

### 1.7 Create Storage Account
1. Search for **"Storage accounts"** → Click **"Create"**
2. **Resource group**: `rg-zaralm-personal`
3. **Storage account name**: `stzaralmpersonal` (must be globally unique, lowercase, no hyphens)
4. **Region**: `West Europe`
5. **Performance**: `Standard`
6. **Redundancy**: `LRS` (Locally-redundant storage)
7. Click **"Review + Create"** → **"Create"**

### 1.8 Create Function App
1. Search for **"Function App"** → Click **"Create"**
2. **Resource group**: `rg-zaralm-personal`
3. **Function App name**: `func-zaralm-personal` (must be globally unique)
4. **Runtime stack**: `Python`
5. **Version**: `3.10`
6. **Region**: `West Europe`
7. **Operating System**: `Linux`
8. **Plan type**: `Consumption (Serverless)`
9. Click **"Next: Storage"**
10. **Storage account**: Select `stzaralmpersonal` (the one you just created)
11. Click **"Review + Create"** → **"Create"**
12. **Wait for deployment to complete**

### 1.9 Configure Function App Settings
1. Go to your Function App resource
2. Click **"Configuration"** (under Settings in left sidebar)
3. Click **"+ New application setting"** and add each of these:

| Name | Value |
|------|-------|
| `AZURE_OPENAI_ENDPOINT` | Your Azure OpenAI endpoint |
| `AZURE_OPENAI_API_KEY` | Your Azure OpenAI key |
| `AZURE_OPENAI_API_VERSION` | `2024-02-01` |
| `AZURE_SEARCH_ENDPOINT` | Your Azure AI Search endpoint |
| `AZURE_SEARCH_KEY` | Your Azure AI Search admin key |
| `AZURE_STORAGE_CONTAINER_NAME` | `documents` |

4. Click **"Save"** at the top
5. Click **"Continue"** when prompted about restarting

### 1.10 Get Function App Name
Copy your Function App name (e.g., `func-zaralm-personal`) - you'll need this for deployment.

## Step 2: Automated Deployment (PowerShell Script)

Now run the simplified deployment script:

```powershell
cd Zaralm-Personal/scripts
./deploy-manual.ps1
```

**When prompted, enter:**
- Your Function App name
- Your frontend storage account name

The script will:
1. Deploy the backend code to your Function App
2. Create and deploy the frontend

## Step 3: Update Backend Model Names

After deployment, update the model names in `src/backend/config.py` to match what you deployed:

```python
self.OPENAI_CHAT_MODEL = "chat"  # Or whatever you named your chat deployment
self.OPENAI_EMBEDDING_MODEL = "embedding"  # Or whatever you named your embedding deployment
```

Then redeploy the backend:
```powershell
cd Zaralm-Personal/scripts
./deploy-backend.ps1 -FunctionAppName <your-function-app-name>
```

## Step 4: Access Your Application

Your frontend will be available at the URL shown at the end of deployment (something like `https://web....z6.web.core.windows.net`).

## Troubleshooting

- **Function App deployment fails**: Make sure you're using Python 3.10 or 3.11 locally
- **Models not found**: Verify the deployment names in Azure AI Studio match `config.py`
- **CORS errors**: The Function App is configured to allow all origins for development

## Architecture

- **Frontend**: React (Vite) on Azure Storage Static Website
- **Backend**: Python Azure Functions (Linux Consumption Plan)
- **AI**: Azure OpenAI Service
- **Vector Store**: Azure AI Search
- **Document Storage**: Azure Blob Storage
