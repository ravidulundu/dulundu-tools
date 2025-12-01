import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import winston from 'winston';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== LOGGING SETUP ==========
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
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

// Add file logging in production
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error' 
    }));
    logger.add(new winston.transports.File({ 
        filename: 'logs/combined.log' 
    }));
}

// ========== STARTUP VALIDATION ==========
function validateEnvironment() {
    const requiredEnvVars = ['GEMINI_API_KEY'];
    const missing = requiredEnvVars.filter(v => !process.env[v] && !process.env[`VITE_${v}`]);
    
    if (missing.length > 0) {
        logger.warn(`Missing environment variables: ${missing.join(', ')}`);
        logger.warn('AI features will be disabled');
    }
    
    logger.info('Environment validation complete');
}

validateEnvironment();

// ========== EXPRESS SETUP ==========
const app = express();
const PORT = process.env.PORT || 3000;

// Trust the first proxy (Dokploy/Traefik/Nginx)
app.set('trust proxy', 1);

// ========== MIDDLEWARE ==========
const allowedOrigins = [
    'https://dulundu.tools',
    'https://www.dulundu.tools'
];

if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000');
    allowedOrigins.push('http://localhost:5173');
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'CORS policy does not allow access from the specified origin.';
            logger.warn(`CORS blocked: ${origin}`);
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

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

// ========== RATE LIMITING ==========
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ error: 'Too many requests, please try again later' });
    }
});

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        ai_configured: !!ai,
        environment: process.env.NODE_ENV || 'development'
    });
});

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

    logger.debug(`AI paraphrase request: ${tone || 'professional'}`);

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

// ========== STATIC FILES ==========
app.use(express.static(path.join(__dirname, 'dist')));

// ========== SPA ROUTING ==========
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ========== GLOBAL ERROR HANDLER ==========
app.use((err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// ========== SERVER STARTUP ==========
const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`✓ Server running on port ${PORT}`);
    logger.info(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`✓ AI configured: ${!!ai}`);
});

// ========== GRACEFUL SHUTDOWN ==========
const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully...`);
    
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
