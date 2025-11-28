/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;
    readonly VITE_UMAMI_WEBSITE_ID: string;
    readonly VITE_UMAMI_SCRIPT_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
