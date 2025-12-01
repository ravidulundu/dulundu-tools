import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      nodePolyfills({
        include: ['buffer', 'crypto', 'stream', 'util', 'events'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],
    define: {
      // No sensitive keys here anymore!
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        vm: path.resolve(__dirname, 'mocks/vm.js'),
        crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      }
    },
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Core React dependencies - MUST be in the same chunk to avoid context issues
            if (
              id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom')
            ) {
              return 'vendor';
            }
            
            // Large UI libraries - separate chunks
            if (id.includes('@uiw/react-md-editor')) {
              return 'md-editor';
            }
            
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            
            if (id.includes('marked')) {
              return 'markdown';
            }
            
            // Crypto/Utility libraries - separate chunk
            if (id.includes('bcryptjs') || id.includes('crypto-browserify')) {
              return 'crypto';
            }
            
            // YAML/Parsers - separate chunk
            if (id.includes('js-yaml') || id.includes('ua-parser-js')) {
              return 'parsers';
            }
          }
        }
      }
    }
  };
});

// Trigger restart
