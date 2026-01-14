import fs from 'fs';

import express from 'express';

import { config } from '../config/index.js';
import { logger } from '../middleware/logging.js';

const { INDEX_PATH, DIST_DIR } = config;

// ========== HTML TEMPLATE CACHE ==========
// Cache index.html in memory to avoid disk I/O on every request
let cachedIndexHtml = null;

// Load and cache index.html template
export const loadIndexHtml = () => {
  try {
    cachedIndexHtml = fs.readFileSync(INDEX_PATH, 'utf8');
    logger.info('index.html template cached successfully');
  } catch (err) {
    // In development, dist might not exist yet
    logger.warn('Could not cache index.html:', err.message);
  }
};

// Initial load attempt
loadIndexHtml();

// Serve static files from the dist directory with caching
export const staticFilesMiddleware = express.static(DIST_DIR, {
  maxAge: '1y', // Cache assets for 1 year (they have hashed filenames)
  etag: true,
  lastModified: true,
  index: false, // Don't serve index.html automatically (handled by SPA fallback with nonce injection)
  setHeaders: (res, filePath) => {
    // JS and CSS files with hash can be cached long-term
    if (filePath.match(/\.(js|css)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Images and fonts
    else if (filePath.match(/\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Operational files (sitemap, robots, manifest) - Short cache or no cache
    else if (filePath.match(/(sitemap\.xml|robots\.txt|manifest\.json)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  },
});

// SPA Fallback Handler
export const spaFallback = (req, res) => {
  // Fix Soft 404: If the request looks like a file (has extension) but wasn't handled by static middleware, it's a 404.
  // Exception: Some routes might look like files but are valid (unlikely in standard SPA, but good to be safe).
  // We explicitly check for common file extensions to fail fast.
  const path = req.path;
  const hasExtension = /\.[a-z0-9]+$/i.test(path);

  if (hasExtension) {
    logger.warn(`404 Not Found for static file request: ${path}`, {
      correlationId: req.correlationId,
      ip: req.ip,
    });
    return res.status(404).send('Not Found');
  }
  // Use cached template if available, otherwise read from disk (fallback for dev)
  const getHtml = callback => {
    if (cachedIndexHtml) {
      callback(null, cachedIndexHtml);
    } else {
      // Fallback: try to load and cache on first request (useful in dev)
      fs.readFile(INDEX_PATH, 'utf8', (err, html) => {
        if (!err) {
          cachedIndexHtml = html; // Cache for future requests
        }
        callback(err, html);
      });
    }
  };

  getHtml((err, html) => {
    if (err) {
      logger.error('Failed to read index.html:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Inject nonce into HTML (replace placeholder with actual nonce)
    const nonce = res.locals.cspNonce;
    const htmlWithNonce = html.replace(/__CSP_NONCE__/g, nonce);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(htmlWithNonce);
  });
};
