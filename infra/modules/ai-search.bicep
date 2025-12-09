param location string
param appName string
param environment string
param uniqueSuffix string

var searchName = 'search-${appName}-${environment}-${uniqueSuffix}'

resource searchService 'Microsoft.Search/searchServices@2023-11-01' = {
  name: searchName
  location: location
  sku: {
    name: 'free' // Free tier - upgrade to basic later if needed for vector search
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
  }
}


output searchName string = searchService.name
output searchEndpoint string = 'https://${searchService.name}.search.windows.net'
