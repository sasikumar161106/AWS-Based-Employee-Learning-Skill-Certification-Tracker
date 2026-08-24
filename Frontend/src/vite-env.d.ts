/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_API: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_COURSE_API_BASE_URL: string;
  readonly VITE_QUIZ_API_BASE_URL: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_APP_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}