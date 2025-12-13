param(
    [string]$ResourceGroup = "rg-zaralm-personal",
    [string]$Location = "westeurope",
    [string]$AppName = "zaralmpersonal",
    [string]$Environment = "dev"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Zaralm Personal RAG - Simplified Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Load configuration from config.env
$configFile = Join-Path $PSScriptRoot "config.env"
if (!(Test-Path $configFile)) {
    Write-Error "Config file not found: $configFile`nPlease create config.env from config.env.template"
    exit 1
}

Write-Host "Loading configuration from config.env..." -ForegroundColor Yellow
$config = @{}
Get-Content $configFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
        $config[$matches[1].Trim()] = $matches[2].Trim()
    }
}

# Override with script parameters if provided
if ($ResourceGroup) { $config['RESOURCE_GROUP'] = $ResourceGroup }
if ($Location) { $config['LOCATION'] = $Location }
if ($AppName) { $config['APP_NAME'] = $AppName }
if ($Environment) { $config['ENVIRONMENT'] = $Environment }

$aiEndpoint = $config['AZURE_OPENAI_ENDPOINT']
$aiKey = $config['AZURE_OPENAI_KEY']
$searchEndpoint = $config['AZURE_SEARCH_ENDPOINT']
$searchKey = $config['AZURE_SEARCH_KEY']
$ResourceGroup = $config['RESOURCE_GROUP']
$Location = $config['LOCATION']
$AppName = $config['APP_NAME']
$Environment = $config['ENVIRONMENT']

Write-Host "Configuration loaded:" -ForegroundColor Green
Write-Host "  Resource Group: $ResourceGroup"
Write-Host "  Location: $Location"
Write-Host "  App Name: $AppName"
Write-Host "  Environment: $Environment"
Write-Host ""

# Create Resource Group
Write-Host "=== STEP 1: Create Resource Group ===" -ForegroundColor Green
az group create --name $ResourceGroup --location $Location

# Deploy Infrastructure
Write-Host ""
Write-Host "=== STEP 2: Deploy Infrastructure ===" -ForegroundColor Green
$deploymentName = "zaralm-deploy-$(Get-Date -Format 'yyyyMMdd-HHmm')"
$infraDeployment = az deployment group create `
    --name $deploymentName `
    --resource-group $ResourceGroup `
    --template-file "../infra/simple-main.bicep" `
    --parameters `
        appName=$AppName `
        environment=$Environment `
        location=$Location `
        aiEndpoint=$aiEndpoint `
        searchEndpoint=$searchEndpoint `
    --output json | ConvertFrom-Json

if (!$infraDeployment -or $infraDeployment.properties.provisioningState -ne "Succeeded") {
    Write-Error "Infrastructure deployment failed. Please check the errors above."
    exit 1
}

$functionAppName = $infraDeployment.properties.outputs.functionAppName.value
$frontendStorageName = $infraDeployment.properties.outputs.frontendStorageName.value
$frontendUrl = $infraDeployment.properties.outputs.frontendUrl.value

Write-Host ""
Write-Host "Infrastructure Deployed:" -ForegroundColor Green
Write-Host "  Function App: $functionAppName"
Write-Host "  Frontend Storage: $frontendStorageName"
Write-Host "  Frontend URL: $frontendUrl"

# Configure API keys and endpoints
Write-Host ""
Write-Host "=== STEP 3: Configure Environment Variables ===" -ForegroundColor Green

# Get storage connection string
$storageConnStr = az storage account show-connection-string --name stzaralmpersonal --resource-group $ResourceGroup --query connectionString --output tsv

az functionapp config appsettings set `
    --name $functionAppName `
    --resource-group $ResourceGroup `
    --settings `
        "AZURE_OPENAI_ENDPOINT=$aiEndpoint" `
        "AZURE_OPENAI_API_KEY=$aiKey" `
        "AZURE_SEARCH_ENDPOINT=$searchEndpoint" `
        "AZURE_SEARCH_KEY=$searchKey" `
        "AZURE_STORAGE_CONNECTION_STRING=$storageConnStr"

Write-Host "Environment variables configured successfully!" -ForegroundColor Green

# Deploy Backend
Write-Host ""
Write-Host "=== STEP 4: Deploy Backend ===" -ForegroundColor Green
Write-Host "Waiting for Function App to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 45

Push-Location "../src/backend"
func azure functionapp publish $functionAppName --python
Pop-Location

# Deploy Frontend
Write-Host ""
Write-Host "=== STEP 5: Deploy Frontend ===" -ForegroundColor Green
Push-Location "../Premium CV Portfolio Website"

# Create .env for build
$envContent = @"
VITE_BACKEND_URL=https://$functionAppName.azurewebsites.net
"@
$envContent | Out-File ".env" -Encoding UTF8

# Install & Build
npm install
npm run build

# Upload to Blob
$storageKey = az storage account keys list --resource-group $ResourceGroup --account-name $frontendStorageName --query '[0].value' --output tsv
az storage blob service-properties update --account-name $frontendStorageName --account-key $storageKey --static-website --index-document "index.html" --404-document "index.html"
az storage blob upload-batch --account-name $frontendStorageName --account-key $storageKey --destination "`$web" --source "build" --overwrite

Pop-Location

# Index CV
Write-Host ""
Write-Host "=== STEP 6: Index CV Document ===" -ForegroundColor Green
Write-Host "Waiting for backend to be fully ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Push-Location $PSScriptRoot
python cv-indexer.py "https://$functionAppName.azurewebsites.net"
Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access your app at: $frontendUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test SamBot by asking about Samrudh's background"
Write-Host "2. Try uploading a document to test RAG"
Write-Host "3. Verify session isolation works"

