param location string
param appName string
param environment string
param uniqueSuffix string

var aiName = 'ai-${appName}-${environment}-${uniqueSuffix}'

resource aiAccount 'Microsoft.CognitiveServices/accounts@2024-04-01-preview' = {
  name: aiName
  location: location
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: aiName
    publicNetworkAccess: 'Enabled'
  }
}

// NOTE: Models will be deployed manually through Azure Portal
// This allows you to see exactly what models are available for your subscription and region


output aiName string = aiAccount.name
output aiEndpoint string = aiAccount.properties.endpoint
