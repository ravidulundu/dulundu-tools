import path from 'path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';

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
      // PWA support with optimized offline caching
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt'],
        manifest: false, // Use manifest.json from public folder
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          // Skip API routes from precaching
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/sitemap\.xml$/, /^\/robots\.txt$/],
          runtimeCaching: [
            // Google Fonts - cache first (rarely changes)
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            // CDN assets (Iconify, etc.) - stale while revalidate
            {
              urlPattern: /^https:\/\/api\.iconify\.design\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'iconify-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            // Static assets - cache first
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            // JS/CSS chunks - cache first (hashed filenames)
            {
              urlPattern: /\.(?:js|css)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            // API calls - network only (never cache)
            {
              urlPattern: /^\/api\/.*/i,
              handler: 'NetworkOnly',
            },
          ],
        },
      }),
    ],
    define: {
      // No sensitive keys here anymore!
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        vm: path.resolve(__dirname, 'mocks/vm.js'),
        crypto: path.resolve(__dirname, 'mocks/empty.js'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      }
    },
    build: {
      sourcemap: true, // Enable source maps for debugging and Lighthouse analysis
      chunkSizeWarningLimit: 2000,
      // Disable CSS code splitting - prevents all CSS from being render-blocking
      // With cssCodeSplit: false, all CSS goes into one file which is better for:
      // 1. Caching (one file with long cache)
      // 2. Performance (no waterfall of CSS files blocking render)
      cssCodeSplit: false,
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
            // Core React - must be together
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/scheduler')
            ) {
              return 'vendor';
            }

            // Monaco Editor - very large, separate chunk
            if (id.includes('monaco-editor') || id.includes('@monaco-editor')) {
              return 'monaco';
            }

            // CodeMirror - also large
            if (id.includes('codemirror') || id.includes('@codemirror')) {
              return 'codemirror';
            }

            // Prettier and parsers - large formatters
            if (id.includes('prettier')) {
              return 'prettier';
            }

            // Icons - lots of SVGs
            if (id.includes('lucide-react') || id.includes('@radix-ui/react-icons') || id.includes('iconify')) {
              return 'icons';
            }

            // Markdown processing
            if (id.includes('marked') || id.includes('dompurify')) {
              return 'markdown';
            }

            // YAML/JSON/XML parsers
            if (id.includes('js-yaml') || id.includes('ua-parser-js') || id.includes('fast-xml-parser')) {
              return 'parsers';
            }

            // Crypto libraries
            if (id.includes('bcryptjs') || id.includes('node-forge') || id.includes('jose')) {
              return 'crypto';
            }

            // Excel/CSV processing
            if (id.includes('xlsx') || id.includes('papaparse') || id.includes('exceljs')) {
              return 'spreadsheet';
            }

            // QR Code
            if (id.includes('qrcode')) {
              return 'qrcode';
            }

            // Image processing
            if (id.includes('pica') || id.includes('gif.js') || id.includes('browser-image-compression')) {
              return 'image';
            }

            // MD Editor - very large
            if (id.includes('@uiw/react-md-editor') || id.includes('@uiw/react-markdown-preview')) {
              return 'md-editor';
            }

            // Diff libraries
            if (id.includes('diff') || id.includes('diff2html')) {
              return 'diff-lib';
            }

            // Note: Feature components (SvgViewer, MarkdownEditor, etc.) are NOT
            // manually chunked here. React.lazy + Suspense handles their code
            // splitting naturally, without forcing CSS extraction to index.html.
          }
        }
      }
    }
  };
});

// Trigger restart
