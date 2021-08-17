type Object = { [key: string]: any }

interface IENV {
  GOOGLE_APPLICATION_CREDENTIALS?: string
  ENV_MANAGEMENT_FIREBASE_CONFIG?: string
  NODE_ENV?: 'development' | 'production'
  DEBUG?: string
}
