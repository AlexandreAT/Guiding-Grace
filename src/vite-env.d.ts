/// <reference types="vite/client" />

interface ImportMetaEnv {
  // URL pública do Worker do Gideon; sem ela o chat funciona só com o motor local
  readonly VITE_GIDEON_API_URL?: string;
  // Site Key do Turnstile (pública); o Worker só chama a IA com um token válido do widget
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
