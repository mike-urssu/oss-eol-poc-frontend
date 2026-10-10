/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin, default `http://localhost:8080`. */
  readonly VITE_API_BASE_URL?: string;
  /** `true` serves fixture data instead of calling the backend. */
  readonly VITE_API_MOCK?: string;
}
