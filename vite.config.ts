import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

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
        include: ['buffer', 'stream', 'util', 'events'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
      // Gzip compression
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240, // Only compress files > 10KB
        deleteOriginFile: false,
      }),
      // Brotli compression for better compression ratio
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false,
      }),
      // Bundle analyzer (only in analyze mode)
      process.env.ANALYZE && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
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
      sourcemap: true, // Enable source maps for debugging and Lighthouse analysis
      chunkSizeWarningLimit: 2000,
      // Prevent preloading of lazy-loaded crypto chunks to save LCP bandwidth
      modulePreload: {
        resolveDependencies: (filename, deps, context) => {
          return deps.filter(dep => !dep.includes('crypto-'));
        },
      },
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // Optimize chunk naming for better caching
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
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
            
            if (id.includes('lucide-react') || id.includes('@radix-ui/react-icons')) {
              return 'icons';
            }
            
            if (id.includes('marked')) {
              return 'markdown';
            }
            
            // Crypto/Utility libraries - MORE GRANULAR SPLITTING
            // This addresses the 107KB unused crypto issue
            if (id.includes('bcryptjs')) {
              return 'crypto-bcrypt';
            }
            
            if (id.includes('crypto-browserify')) {
              return 'crypto-browser';
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
