import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Trust the first proxy (Dokploy/Traefik/Nginx)
// This is required for rate limiting to work correctly behind a reverse proxy
app.set('trust proxy', 1);

import rateLimit from 'express-rate-limit';

// Middleware
const allowedOrigins = [
    'https://dulundu.tools',
    'https://www.dulundu.tools'
];

// Only allow localhost in development
if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000');
    allowedOrigins.push('http://localhost:5173');
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Rate Limiter for AI endpoints
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// API Route for AI
app.post('/api/ai/generate', aiLimiter, async (req, res) => {
    try {
        if (!ai) {
            throw new Error('Server misconfiguration: API Key missing');
        }

        const { prompt, language } = req.body;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert developer assistant. The user needs help with ${language || 'code'}. 
      
      Task: ${prompt}
      
      Provide a clean, well-commented code solution or explanation. If generating code, wrap it in markdown code blocks. Keep the text concise.`,
        });

        const generatedText = response.text ? (typeof response.text === 'function' ? response.text() : response.text) :
            (response.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.");

        res.json({ text: generatedText });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Internal Server Error'
        });
    }
});

app.post('/api/ai/paraphrase', aiLimiter, async (req, res) => {
    try {
        if (!ai) {
            throw new Error('Server misconfiguration: API Key missing');
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
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Internal Server Error'
        });
    }
});

// Handle React Routing (SPA) - Send all other requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
