/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;
    readonly VITE_UMAMI_WEBSITE_ID: string;
    readonly VITE_UMAMI_SCRIPT_URL: string;
    readonly VITE_APP_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare global {
    interface Window {
        umami?: {
            track: (event: string | ((props: any) => any), data?: Record<string, any>) => void;
        };
    }
}
