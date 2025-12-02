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

interface Window {
    umami?: {
        track: {
            (eventName: string, eventData?: Record<string, unknown>): void;
            (props: Record<string, unknown> | ((props: Record<string, unknown>) => Record<string, unknown>)): void;
        };
    };
}


