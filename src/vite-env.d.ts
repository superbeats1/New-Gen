/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_GOOGLE_API_KEY: string
    readonly GEMINI_API_KEY: string
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string
    readonly VITE_HUNTER_API_KEY: string
    readonly VITE_CLEARBIT_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
