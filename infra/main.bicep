targetScope = 'subscription'

@description('Resource Group Name')
param resourceGroupName string

@description('Location for all resources')
param location string

@description('Application Name (used for naming resources)')
param appName string

@description('Environment (dev, prod)')
param environment string

var uniqueSuffix = uniqueString(subscription().id, resourceGroupName, appName)

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
  tags: {
    Application: appName
    Environment: environment
  }
}

module storage 'modules/storage.bicep' = {
  scope: rg
  name: 'storage-deployment'
  params: {
    location: location
    appName: appName
    environment: environment
    uniqueSuffix: uniqueSuffix
  }
}

module ai 'modules/ai-foundry.bicep' = {
  scope: rg
  name: 'ai-deployment'
  params: {
    location: location
    appName: appName
    environment: environment
    uniqueSuffix: uniqueSuffix
  }
}

module search 'modules/ai-search.bicep' = {
  scope: rg
  name: 'search-deployment'
  params: {
    location: location
    appName: appName
    environment: environment
    uniqueSuffix: uniqueSuffix
  }
}

module function 'modules/function.bicep' = {
  scope: rg
  name: 'function-deployment'
  params: {
    location: location
    appName: appName
    environment: environment
    uniqueSuffix: uniqueSuffix
    storageAccountName: storage.outputs.storageAccountName
    aiEndpoint: ai.outputs.aiEndpoint
    aiName: ai.outputs.aiName
    searchEndpoint: search.outputs.searchEndpoint
    searchName: search.outputs.searchName
  }
}

module frontend 'modules/frontend.bicep' = {
  scope: rg
  name: 'frontend-deployment'
  params: {
    location: location
    appName: appName
    environment: environment
    uniqueSuffix: uniqueSuffix
  }
}

output functionAppName string = function.outputs.functionAppName
output frontendStorageName string = frontend.outputs.storageAccountName
output frontendUrl string = frontend.outputs.staticWebsiteUrl
