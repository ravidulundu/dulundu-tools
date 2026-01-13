import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import Groq from 'groq-sdk';
import helmet from 'helmet';
import { Address4, Address6 } from 'ip-address';
import winston from 'winston';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== HTML TEMPLATE CACHE ==========
// Cache index.html in memory to avoid disk I/O on every request
let cachedIndexHtml = null;
const INDEX_PATH = path.join(__dirname, 'dist', 'index.html');

// ========== LOGGER SETUP ==========
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp: _ts, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${level}: ${typeof message === 'object' ? JSON.stringify(message) : message}${metaStr}`;
        })
      ),
    }),
  ],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  logger.add(new winston.transports.File({ filename: 'combined.log' }));
}

// Load and cache index.html template
const loadIndexHtml = () => {
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

const app = express();
const PORT = process.env.PORT || 3000;

// Disable X-Powered-By header for security
app.disable('x-powered-by');

// Trust the first proxy (Dokploy/Traefik/Nginx)
app.set('trust proxy', 1);

// SSRF Protection: Check if URL points to private/internal networks
// Uses ip-address library for robust IPv4/IPv6 validation
const isPrivateUrl = urlString => {
  try {
    const url = new URL(urlString);
    let hostname = url.hostname.toLowerCase();

    // Block localhost variants
    if (hostname === 'localhost') {
      return true;
    }

    // Block internal domains
    if (hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      return true;
    }

    // Remove IPv6 brackets if present
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.slice(1, -1);
    }

    // Try parsing as IPv4
    try {
      const ipv4 = new Address4(hostname);
      if (ipv4.isValid()) {
        // Check for private, loopback, link-local ranges
        const privateRanges = [
          '10.0.0.0/8', // Class A private
          '172.16.0.0/12', // Class B private
          '192.168.0.0/16', // Class C private
          '127.0.0.0/8', // Loopback
          '169.254.0.0/16', // Link-local / Cloud metadata
          '0.0.0.0/8', // Current network
        ];
        for (const range of privateRanges) {
          if (ipv4.isInSubnet(new Address4(range))) {
            return true;
          }
        }
      }
    } catch {
      // Not a valid IPv4, try IPv6
    }

    // Try parsing as IPv6
    try {
      const ipv6 = new Address6(hostname);
      if (ipv6.isValid()) {
        // Check for loopback (::1), link-local (fe80::/10), ULA (fc00::/7)
        const privateRanges = [
          '::1/128', // Loopback
          'fe80::/10', // Link-local
          'fc00::/7', // Unique Local Address (ULA)
          '::ffff:0:0/96', // IPv4-mapped IPv6
        ];
        for (const range of privateRanges) {
          if (ipv6.isInSubnet(new Address6(range))) {
            return true;
          }
        }
      }
    } catch {
      // Not a valid IPv6 either
    }

    return false;
  } catch {
    return true; // Block on parse error
  }
};

/**
 * Sanitize and validate URL for safe external requests.
 * Reconstructs URL from parsed components to break taint chain.
 * @param {string} rawUrl - User-provided URL string
 * @returns {string} - Validated and sanitized URL (reconstructed, not original)
 * @throws {Error} - If URL is invalid or private
 * @security SSRF protection via allowlist of protocols and blocklist of private IPs
 */
const sanitizeUrl = rawUrl => {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid URL: must be a non-empty string');
  }

  let inputUrl = rawUrl.trim();

  // Ensure protocol is http or https
  if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
    inputUrl = 'https://' + inputUrl;
  }

  // Validate URL format by parsing
  let parsedUrl;
  try {
    parsedUrl = new URL(inputUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  // SECURITY: Only allow http and https protocols (allowlist)
  const allowedProtocols = ['http:', 'https:'];
  if (!allowedProtocols.includes(parsedUrl.protocol)) {
    throw new Error('Invalid protocol: only HTTP and HTTPS are allowed');
  }

  // SECURITY: Block private/internal URLs (SSRF protection)
  // This reconstructs the URL from parsed components, breaking the taint chain
  const reconstructedUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

  if (isPrivateUrl(reconstructedUrl)) {
    throw new Error('URL points to private/internal network');
  }

  // Return the reconstructed URL (not the original user input)
  return reconstructedUrl;
};

// ========== MIDDLEWARE ==========
const allowedOrigins = [
  process.env.VITE_APP_URL || 'https://dulundu.tools',
  'https://www.dulundu.tools',
];

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000');
  allowedOrigins.push('http://localhost:3001');
  allowedOrigins.push('http://localhost:5173');
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error(
            'The CORS policy for this site does not allow access from the specified Origin.'
          ),
          false
        );
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' })); // Limit payload size for security

// Generate cryptographically secure nonce for CSP
const generateNonce = () => crypto.randomBytes(16).toString('base64');

// Nonce middleware - generates nonce for each request
app.use((req, res, next) => {
  res.locals.cspNonce = generateNonce();
  next();
});

// Security headers middleware with nonce-based CSP
app.use(
  helmet({
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
  })
);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  next();
});

// Rate Limiter for AI endpoints - strict limits (not a chatbot!)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per hour per IP
  message: {
    error:
      'AI rate limit reached. This tool is for code help, not general chat. Try again in an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter for Share endpoints (prevent disk flooding)
const shareLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 shares per hour per IP
  message: { error: 'Too many share requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter for URL check endpoint (prevent abuse)
const urlCheckLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: { error: 'Too many URL check requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to check AI service configuration
const checkAiConfig = (req, res, next) => {
  if (!groq && !gemini) {
    logger.error('AI service configuration missing');
    return res.status(503).json({ error: 'AI service currently unavailable' });
  }
  next();
};

// ========== VULNERABILITY SCANNER BLOCK ==========
// Return 404 for common attack paths to stop bots from scanning
// This runs before SPA fallback to avoid returning index.html for .php etc.
const BLOCKED_PATTERNS = [
  /\.php$/i, // PHP files
  /\.asp$/i, // ASP files
  /\.aspx$/i, // ASPX files
  /\.jsp$/i, // JSP files
  /\.cgi$/i, // CGI scripts
  /^\/wp-/i, // WordPress paths
  /^\/wordpress\//i, // WordPress directory
  /^\/xmlrpc/i, // XML-RPC
  /^\/admin\.php/i, // Admin PHP
  /^\/cgi-bin\//i, // CGI bin
  /\.env/i, // Environment files (.env, .env.production, .env.local, etc.)
  /\/\.git\//i, // Git directory
  /\/\.svn\//i, // SVN directory
  /\/\.htaccess/i, // Apache config
  /\/\.htpasswd/i, // Apache password
  /\/web\.config/i, // IIS config
];

app.use((req, res, next) => {
  const path = req.path;

  // Check if path matches any blocked pattern
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(path)) {
      // Don't log these to reduce noise (attackers will fill logs)
      return res.status(404).send('Not Found');
    }
  }
  next();
});

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
  });
});

// ========== STATIC FILES ==========
// Serve static files from the dist directory with caching
// Note: index: false prevents express.static from serving index.html directly,
// allowing our SPA fallback handler to inject CSP nonces
app.use(
  express.static(path.join(__dirname, 'dist'), {
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
  })
);

// ========== AI PROVIDERS SETUP ==========
// Groq (primary) - Higher rate limits
const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

// Gemini (fallback)
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const gemini = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

if (!groq && !gemini) {
  logger.error('AI not initialized: Missing both GROQ_API_KEY and GEMINI_API_KEY');
} else {
  logger.info(`AI providers: Groq=${!!groq}, Gemini=${!!gemini}`);
}

// AI Provider Abstraction - tries Groq first, then falls back to Gemini
const callAI = async prompt => {
  // Try Groq first (higher rate limits)
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
      });
      return {
        text: response.choices[0]?.message?.content || 'No response',
        provider: 'groq',
      };
    } catch (error) {
      logger.warn(`Groq failed, falling back to Gemini: ${error.message}`);
    }
  }

  // Fallback to Gemini
  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const text = response.text
        ? typeof response.text === 'function'
          ? response.text()
          : response.text
        : response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      return { text, provider: 'gemini' };
    } catch (error) {
      logger.error(`Gemini also failed: ${error.message}`);
      throw error;
    }
  }

  throw new Error('No AI provider available');
};

// Async error wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Sanitize user input for prompt injection prevention
// Escapes < and > to prevent XML tag breakout attacks
const sanitizeForPrompt = str => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// Summary length instructions (defined at module scope for performance)
// IMPORTANT: Keep values in sync with src/shared/aiConstants.ts
const SUMMARY_LENGTH_INSTRUCTIONS = {
  short: 'Provide a very concise, 1-2 sentence summary.',
  bullets: 'Provide a summary as a list of bullet points.',
  long: 'Provide a detailed, comprehensive summary.',
  medium: 'Provide a medium length summary.',
};

// Input length limits for AI endpoints (centralized for maintainability)
const AI_INPUT_LIMITS = {
  PROMPT_MAX: 3000, // /api/ai/generate
  TEXT_MAX: 2000, // /api/ai/paraphrase
  TOPIC_MAX: 2000, // /api/ai/email
  RECIPIENT_MAX: 200, // /api/ai/email
  SUMMARY_TEXT_MAX: 5000, // /api/ai/summarize
};

// Allowed tone values for email generation
// IMPORTANT: Keep in sync with src/shared/aiConstants.ts (single source of truth)
const ALLOWED_EMAIL_TONES = ['Professional', 'Friendly', 'Urgent', 'Apologetic', 'Persuasive'];

// ========== AI ENDPOINTS ==========
app.post(
  '/api/ai/generate',
  aiLimiter,
  checkAiConfig,
  asyncHandler(async (req, res) => {
    const { prompt, language } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }

    if (prompt.length > AI_INPUT_LIMITS.PROMPT_MAX) {
      return res.status(400).json({
        error: `Prompt too long (max ${AI_INPUT_LIMITS.PROMPT_MAX} characters). Keep it focused on code help.`,
      });
    }

    logger.debug(`AI generate request: ${language || 'code'}`);

    const systemPrompt = `You are an expert developer assistant. The user needs help with ${language || 'code'}.

Task:
<user_input>
${sanitizeForPrompt(prompt)}
</user_input>

Provide a clean, well-commented code solution or explanation. If generating code, wrap it in markdown code blocks. Keep the text concise.`;

    const result = await callAI(systemPrompt);
    logger.debug(`AI response from: ${result.provider}`);

    res.json({ text: result.text });
  })
);

app.post(
  '/api/ai/paraphrase',
  aiLimiter,
  checkAiConfig,
  asyncHandler(async (req, res) => {
    const { text, tone } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Valid text is required' });
    }

    if (text.length > AI_INPUT_LIMITS.TEXT_MAX) {
      return res.status(400).json({
        error: `Text too long (max ${AI_INPUT_LIMITS.TEXT_MAX} characters). Keep it to a paragraph.`,
      });
    }

    const systemPrompt = `You are an expert writer. Paraphrase the following text to be more ${tone || 'professional'}. Keep the meaning the same but improve clarity and flow.

Text:
<user_text>
${sanitizeForPrompt(text)}
</user_text>

Output only the paraphrased text.`;

    const result = await callAI(systemPrompt);
    logger.debug(`AI response from: ${result.provider}`);

    res.json({ text: result.text });
  })
);

app.post(
  '/api/ai/email',
  aiLimiter,
  checkAiConfig,
  asyncHandler(async (req, res) => {
    const { recipient, topic, tone } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Valid topic is required' });
    }

    if (topic.length > AI_INPUT_LIMITS.TOPIC_MAX) {
      return res
        .status(400)
        .json({ error: `Topic is too long (max ${AI_INPUT_LIMITS.TOPIC_MAX} characters).` });
    }

    if (recipient) {
      if (typeof recipient !== 'string') {
        return res.status(400).json({ error: 'Recipient must be a string.' });
      }
      if (recipient.length > AI_INPUT_LIMITS.RECIPIENT_MAX) {
        return res.status(400).json({
          error: `Recipient is too long (max ${AI_INPUT_LIMITS.RECIPIENT_MAX} characters).`,
        });
      }
    }

    if (tone) {
      if (typeof tone !== 'string') {
        return res.status(400).json({ error: 'Tone must be a string.' });
      }
      if (!ALLOWED_EMAIL_TONES.includes(tone)) {
        return res
          .status(400)
          .json({ error: `Invalid tone. Allowed values: ${ALLOWED_EMAIL_TONES.join(', ')}` });
      }
    }

    const systemPrompt = `You are an expert professional writer. Write an email based on the following details:

Recipient: ${sanitizeForPrompt(recipient) || 'General'}
Tone: ${sanitizeForPrompt(tone) || 'Professional'}

Topic details:
<user_topic>
${sanitizeForPrompt(topic)}
</user_topic>

Output only the email body (subject line optional but recommended). Keep it clear and effective.`;

    const result = await callAI(systemPrompt);
    logger.debug(`AI response from: ${result.provider}`);

    res.json({ text: result.text });
  })
);

app.post(
  '/api/ai/summarize',
  aiLimiter,
  checkAiConfig,
  asyncHandler(async (req, res) => {
    const { text, length: summaryLength } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Valid text is required' });
    }

    if (text.length > AI_INPUT_LIMITS.SUMMARY_TEXT_MAX) {
      return res.status(400).json({
        error: `Text too long (max ${AI_INPUT_LIMITS.SUMMARY_TEXT_MAX} characters). Please shorten your input.`,
      });
    }

    // Validate summary length against allowed values
    const allowedLengths = Object.keys(SUMMARY_LENGTH_INSTRUCTIONS);
    if (summaryLength && !allowedLengths.includes(summaryLength)) {
      return res
        .status(400)
        .json({ error: `Invalid length. Allowed values: ${allowedLengths.join(', ')}` });
    }

    const lengthInstruction =
      SUMMARY_LENGTH_INSTRUCTIONS[summaryLength] || SUMMARY_LENGTH_INSTRUCTIONS.medium;

    const systemPrompt = `You are an expert synthesizer. Summarize the following text.
${lengthInstruction}

Text:
<user_text>
${sanitizeForPrompt(text)}
</user_text>

Output only the summary.`;

    const result = await callAI(systemPrompt);
    logger.debug(`AI response from: ${result.provider}`);

    res.json({ text: result.text });
  })
);

// ========== URL CHECK ENDPOINT ==========
app.post(
  '/api/check-url',
  urlCheckLimiter,
  asyncHandler(async (req, res) => {
    const { url } = req.body;

    // Use sanitizeUrl for input validation and SSRF protection
    let sanitizedUrl;
    try {
      sanitizedUrl = sanitizeUrl(url);
    } catch (error) {
      logger.warn(`URL validation failed: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    logger.debug(`URL check request: ${sanitizedUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      // sanitizedUrl is guaranteed to be safe by sanitizeUrl()
      const response = await fetch(sanitizedUrl, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Dulundu-Tools-HealthCheck/1.0',
        },
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      res.json({
        online: true,
        status: response.status,
        statusText: response.statusText,
        url: sanitizedUrl,
      });
    } catch (error) {
      clearTimeout(timeoutId);

      // Determine error type
      let errorMessage = 'Unknown error';
      let errorCode = 'UNKNOWN';

      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out (10s)';
        errorCode = 'TIMEOUT';
      } else if (error.cause?.code === 'ENOTFOUND') {
        errorMessage = 'Domain not found (DNS error)';
        errorCode = 'DNS_ERROR';
      } else if (error.cause?.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused';
        errorCode = 'CONNECTION_REFUSED';
      } else if (error.cause?.code === 'ECONNRESET') {
        errorMessage = 'Connection reset';
        errorCode = 'CONNECTION_RESET';
      } else if (error.message) {
        errorMessage = error.message;
      }

      logger.debug(`URL check failed for ${sanitizedUrl}: ${errorCode}`);

      res.json({
        online: false,
        error: errorMessage,
        errorCode,
        url: sanitizedUrl,
      });
    }
  })
);

// ========== SHARE ENDPOINTS ==========
const DATA_DIR = path.join(__dirname, 'data');
const SHARES_DIR = path.join(DATA_DIR, 'shares');

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(SHARES_DIR)) fs.mkdirSync(SHARES_DIR);

const MAX_CONTENT_LENGTH = 5 * 1024 * 1024; // 5MB max for share content
const CLEANUP_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

// Cleanup expired shares
const cleanupExpiredShares = async () => {
  try {
    const files = await fs.promises.readdir(SHARES_DIR);
    const now = new Date();
    let deletedCount = 0;

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(SHARES_DIR, file);
      try {
        const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
        if (data.expiresAt && new Date(data.expiresAt) < now) {
          await fs.promises.unlink(filePath);
          deletedCount++;
        }
      } catch (_e) {
        // Skip corrupted files
      }
    }

    if (deletedCount > 0) {
      logger.info(`Cleanup: Deleted ${deletedCount} expired share(s)`);
    }
  } catch (error) {
    logger.error('Cleanup error:', error);
  }
};

// Run cleanup on startup and every 6 hours
cleanupExpiredShares();
setInterval(cleanupExpiredShares, CLEANUP_INTERVAL);

app.post(
  '/api/share',
  shareLimiter,
  asyncHandler(async (req, res) => {
    const { content, type, expiration } = req.body;

    // Content validation
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Valid content is required' });
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return res.status(400).json({ error: 'Content too large (max 5MB)' });
    }

    // Generate a secure ID (16 chars = 64 bits of entropy)
    const { randomBytes } = await import('crypto');
    const id = randomBytes(8).toString('hex');

    const filePath = path.join(SHARES_DIR, `${id}.json`);

    // Calculate expiration (default: 30 days max)
    const now = new Date();
    let expiresAt;
    switch (expiration) {
      case '1 Hour':
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
        break;
      case '24 Hours':
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
        break;
      case '7 Days':
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '30 Days':
      default:
        // Max 30 days for all cases (including legacy 'Never')
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
    }

    const shareData = {
      id,
      content,
      type: type || 'svg',
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    await fs.promises.writeFile(filePath, JSON.stringify(shareData));

    logger.info(`Created share: ${id}, expires: ${expiresAt || 'Never'}`);
    res.json({ id });
  })
);

app.get(
  '/api/share/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Strict validation to prevent directory traversal
    // Only allow alphanumeric hex characters (UUID format)
    if (!/^[a-f0-9]+$/i.test(id) || id.length > 64) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Construct path and verify it's within SHARES_DIR
    const filePath = path.join(SHARES_DIR, `${id}.json`);
    const resolvedPath = path.resolve(filePath);
    const resolvedSharesDir = path.resolve(SHARES_DIR);

    // Security: Ensure path doesn't escape SHARES_DIR
    if (!resolvedPath.startsWith(resolvedSharesDir)) {
      logger.warn(`Path traversal attempt blocked: ${id}`);
      return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
      const dataStr = await fs.promises.readFile(filePath, 'utf-8');
      const data = JSON.parse(dataStr);

      // Check for expiration
      if (data.expiresAt) {
        const expiresAt = new Date(data.expiresAt);
        if (expiresAt < new Date()) {
          // Expired - delete file and return 410/404
          await fs.promises.unlink(filePath);
          logger.info(`Share expired and deleted: ${id}`);
          return res.status(410).json({ error: 'Share link has expired' });
        }
      }

      res.json(data);
    } catch (_error) {
      logger.warn(`Share not found: ${id}`);
      res.status(404).json({ error: 'Share not found' });
    }
  })
);

// ========== SPA FALLBACK ==========
// Handle React Routing (SPA) - Send all other requests to index.html with nonce injection
app.get('*', (req, res) => {
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
});

// Error handling middleware
app.use((_error, req, res, _next) => {
  logger.error('Unhandled error:', _error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? _error.message : undefined,
  });
});

// ========== SERVER START ==========
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
