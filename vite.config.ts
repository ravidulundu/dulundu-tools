import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
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
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@uiw/react-md-editor', 'lucide-react'],
            utils: ['bcryptjs', 'js-yaml', 'marked', 'ua-parser-js']
          }
        }
      }
    }
  };
});

// Trigger restart
