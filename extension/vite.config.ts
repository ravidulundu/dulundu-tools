import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        crx({ manifest }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../'),
            '@features': path.resolve(__dirname, '../features'),
            '@components': path.resolve(__dirname, '../components'),
            '@utils': path.resolve(__dirname, '../utils'),
        },
    },
    server: {
        port: 5174,
        strictPort: true,
        hmr: {
            port: 5174,
        },
    },
})
