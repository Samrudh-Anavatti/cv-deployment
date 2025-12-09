targetScope = 'resourceGroup'

@description('Location for all resources')
param location string

@description('Application Name (used for naming resources)')
param appName string

@description('Unique suffix for resource names')
param uniqueSuffix string

@description('Existing Storage Account Name')
param storageAccountName string

@description('Azure OpenAI Endpoint')
param aiEndpoint string

@description('Azure AI Search Endpoint')
param searchEndpoint string

// Deploy Function App
module function 'modules/hybrid-function.bicep' = {
  name: 'function-deployment'
  params: {
    location: location
    appName: appName
    uniqueSuffix: uniqueSuffix
    storageAccountName: storageAccountName
    aiEndpoint: aiEndpoint
    searchEndpoint: searchEndpoint
  }
}

// Deploy Frontend Storage
module frontend 'modules/frontend.bicep' = {
  name: 'frontend-deployment'
  params: {
    location: location
    appName: appName
    environment: 'dev'
    uniqueSuffix: uniqueSuffix
  }
}

output functionAppName string = function.outputs.functionAppName
output frontendStorageName string = frontend.outputs.storageAccountName
output frontendUrl string = frontend.outputs.staticWebsiteUrl
