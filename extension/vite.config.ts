import path from 'path'

import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import manifest from './manifest.json'


export default defineConfig({
    plugins: [
        react(),
        crx({ manifest }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
            '@features': path.resolve(__dirname, '../src/features'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@utils': path.resolve(__dirname, '../src/utils'),
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
