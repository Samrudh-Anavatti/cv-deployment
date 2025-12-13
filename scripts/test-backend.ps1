# Quick Backend Diagnostic Script
# Run this to check if the backend configuration is correct

Write-Host "=== Backend Diagnostic ===" -ForegroundColor Cyan

# Test 1: Check if backend is reachable
Write-Host "`n1. Testing backend health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://zaralmpersonal-func-dev.azurewebsites.net/api/documents" -Method GET -UseBasicParsing
    Write-Host "✓ Backend is reachable (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend not reachable: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Try to call generate endpoint
Write-Host "`n2. Testing generate endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        prompt = "Hello"
        enableRag = $false
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "https://zaralmpersonal-func-dev.azurewebsites.net/api/generate" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "✓ Generate endpoint works!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "✗ Generate endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Red
    }
}

# Test 3: Check Azure Function App configuration
Write-Host "`n3. Next steps:" -ForegroundColor Yellow
Write-Host "   - Go to Azure Portal → Function App → Configuration"
Write-Host "   - Verify AZURE_OPENAI_ENDPOINT is set correctly"
Write-Host "   - Should be: https://sanav-miximrzz-swedencentral.openai.azure.com/"
Write-Host "   - NOT: https://sanav-miximrzz-swedencentral.services.ai.azure.com/models"
Write-Host "`n   - Check Application Insights logs for detailed errors"
