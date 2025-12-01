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

// Rate Limiter for AI endpoints
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
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
// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

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

// ========== SPA FALLBACK ==========
// Handle React Routing (SPA) - Send all other requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ========== GLOBAL ERROR HANDLER ==========
app.use((err, req, res, next) => {
    logger.error('Unhandled Error:', err);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
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
