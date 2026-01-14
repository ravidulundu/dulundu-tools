import crypto from 'crypto';

import cors from 'cors';
import helmet from 'helmet';

// Generate cryptographically secure nonce for CSP
const generateNonce = () => crypto.randomBytes(16).toString('base64');

// Nonce middleware - generates nonce for each request
export const nonceMiddleware = (req, res, next) => {
  res.locals.cspNonce = generateNonce();
  next();
};

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        // Nonce-based approach: 'unsafe-inline' removed for better XSS protection
        (req, res) => `'nonce-${res.locals.cspNonce}'`,
        'https://cdn.jsdelivr.net',
        'https://umami.dulundu.tools',
        'https://stats.dulundu.tools',
        'https://static.cloudflareinsights.com',
      ],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ["'self'", 'blob:'],
      styleSrc: [
        "'self'",
        // Nonce-based approach: 'unsafe-inline' removed for better XSS protection
        (req, res) => `'nonce-${res.locals.cspNonce}'`,
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net',
      ],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      imgSrc: [
        "'self'",
        'data:',
        'blob:',
        'https://api.qrserver.com',
        'https://images.unsplash.com',
      ],
      connectSrc: [
        "'self'",
        'https://api.iconify.design',
        'https://umami.dulundu.tools',
        'https://stats.dulundu.tools',
        'https://cdn.jsdelivr.net',
        'https://api.ipify.org',
        'https://api64.ipify.org',
        'https://api.db-ip.com',
        'https://rdap.org',
        'https://dns.google',
        'https://api.qrserver.com',
      ],
      upgradeInsecureRequests: null, // Disable this if not running strictly on https locally
    },
  },
  // Note: COEP disabled to allow cross-origin resources (analytics, fonts, CDN).
  // Enabling require-corp would break third-party integrations.
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

const allowedOrigins = [
  process.env.VITE_APP_URL || 'https://dulundu.tools',
  'https://www.dulundu.tools',
];

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000');
  allowedOrigins.push('http://localhost:3001');
  allowedOrigins.push('http://localhost:5173');
}

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(
        new Error('The CORS policy for this site does not allow access from the specified Origin.'),
        false
      );
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  credentials: true,
});
