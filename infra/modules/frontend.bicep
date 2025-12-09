param location string
param appName string
param environment string
param uniqueSuffix string

var storageName = 'web${replace(appName, '-', '')}${environment}${uniqueSuffix}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: take(storageName, 24)
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: true // Required for $web container usually, or at least public read access for the website
    minimumTlsVersion: 'TLS1_2'
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

// Note: Bicep cannot easily enable Static Website feature directly via properties in older API versions without a deployment script or using the $web container creation. 
// However, creating the $web container is often enough if we enable the feature via CLI later.
// For a personal project, we will enable it via the deployment script (CLI) as it's more reliable than pure Bicep for this specific toggle.

output storageAccountName string = storageAccount.name
output staticWebsiteUrl string = replace(storageAccount.properties.primaryEndpoints.web, '/', '') // Removes trailing slash
