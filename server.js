import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import winston from 'winston';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== LOGGER SETUP ==========
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    logger.add(new winston.transports.File({ filename: 'combined.log' }));
}

const app = express();
const PORT = process.env.PORT || 3000;

// Trust the first proxy (Dokploy/Traefik/Nginx)
app.set('trust proxy', 1);

// ========== MIDDLEWARE ==========
const allowedOrigins = [
    process.env.VITE_APP_URL || 'https://dulundu.tools',
    'https://www.dulundu.tools'
];

if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000');
    allowedOrigins.push('http://localhost:3001');
    allowedOrigins.push('http://localhost:5173');
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true
}));


app.use(express.json({ limit: '10mb' })); // Limit payload size for security

// Security headers middleware
app.use((req, res, next) => {
    // Content Security Policy
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://umami.dulundu.tools https://stats.dulundu.tools https://static.cloudflareinsights.com; " +
        "worker-src 'self' blob:; " +
        "child-src 'self' blob:; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; " +
        "font-src 'self' data: https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://api.iconify.design https://umami.dulundu.tools https://stats.dulundu.tools https://cdn.jsdelivr.net;"
    );
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

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
            ip: req.ip
        });
    });
    next();
});

// Rate Limiter for AI endpoints
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
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

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy'
    });
});

// ========== STATIC FILES ==========
// Serve static files from the dist directory with caching
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y', // Cache assets for 1 year (they have hashed filenames)
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // HTML files should not be cached (SPA routing)
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
        // JS and CSS files with hash can be cached long-term
        else if (filePath.match(/\.(js|css)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
        // Images and fonts
        else if (filePath.match(/\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
}));

// ========== GEMINI AI SETUP ==========
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

if (!ai) {
    logger.error('AI not initialized: Missing API key');
}

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ========== AI ENDPOINTS ==========
app.post('/api/ai/generate', aiLimiter, asyncHandler(async (req, res) => {
    if (!ai) {
        throw new Error('AI service not configured');
    }

    const { prompt, language } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ error: 'Valid prompt is required' });
    }

    if (prompt.length > 10000) {
        return res.status(400).json({ error: 'Prompt too long (max 10000 characters)' });
    }

    logger.debug(`AI generate request: ${language || 'code'}`);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert developer assistant. The user needs help with ${language || 'code'}. 
      
      Task: ${prompt}
      
      Provide a clean, well-commented code solution or explanation. If generating code, wrap it in markdown code blocks. Keep the text concise.`,
    });

    const generatedText = response.text ? (typeof response.text === 'function' ? response.text() : response.text) :
        (response.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.");

    res.json({ text: generatedText });
}));

app.post('/api/ai/paraphrase', aiLimiter, asyncHandler(async (req, res) => {
    if (!ai) {
        throw new Error('AI service not configured');
    }

    const { text, tone } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Valid text is required' });
    }

    if (text.length > 10000) {
        return res.status(400).json({ error: 'Text too long (max 10000 characters)' });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert writer. Paraphrase the following text to be more ${tone || 'professional'}. Keep the meaning the same but improve clarity and flow.
      
      Text: "${text}"
      
      Output only the paraphrased text.`,
    });

    const generatedText = response.text ? (typeof response.text === 'function' ? response.text() : response.text) :
        (response.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.");

    res.json({ text: generatedText });
}));

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

app.post('/api/share', shareLimiter, asyncHandler(async (req, res) => {
    const { content, type, expiration } = req.body;

    // Content validation
    if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Valid content is required' });
    }

    if (content.length > MAX_CONTENT_LENGTH) {
        return res.status(400).json({ error: 'Content too large (max 5MB)' });
    }

    // Generate a short ID (8 chars)
    const { randomBytes } = await import('crypto');
    const id = randomBytes(4).toString('hex');
    
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
        expiresAt
    };

    await fs.promises.writeFile(filePath, JSON.stringify(shareData));

    logger.info(`Created share: ${id}, expires: ${expiresAt || 'Never'}`);
    res.json({ id });
}));

app.get('/api/share/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Basic validation to prevent directory traversal
    if (!/^[a-f0-9]+$/i.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    const filePath = path.join(SHARES_DIR, `${id}.json`);

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
}));

// ========== SPA FALLBACK ==========
// Handle React Routing (SPA) - Send all other requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((_error, req, res, _next) => {
  logger.error('Unhandled error:', _error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? _error.message : undefined
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
