/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_AZURE_FUNCTIONS_URL: string
  readonly REACT_APP_AZURE_DOCPROC_URL: string
  readonly REACT_APP_AZURE_EMBEDDING_URL: string
  readonly REACT_APP_ENVIRONMENT: string
  readonly REACT_APP_DEFAULT_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}