import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
  // Fix: DATA_DIR should be relative to the server root, or project root?
  // server.js was in root, so __dirname was root.
  // Now we are in server/config/index.js.
  // We want to keep data in project_root/data usually.
  DIST_DIR: path.join(__dirname, '../../dist'),
  INDEX_PATH: path.join(__dirname, '../../dist', 'index.html'),
  // R2 Storage Config
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
};

// Ensure directories exist
// Ensure directories exist
if (!fs.existsSync(config.DIST_DIR)) fs.mkdirSync(config.DIST_DIR, { recursive: true });

// Input length limits for AI endpoints
export const AI_INPUT_LIMITS = {
  PROMPT_MAX: 3000, // /api/ai/generate
  TEXT_MAX: 2000, // /api/ai/paraphrase
  TOPIC_MAX: 2000, // /api/ai/email
  RECIPIENT_MAX: 200, // /api/ai/email
  SUMMARY_TEXT_MAX: 5000, // /api/ai/summarize
};

export const SUMMARY_LENGTH_INSTRUCTIONS = {
  short: 'Provide a very concise, 1-2 sentence summary.',
  bullets: 'Provide a summary as a list of bullet points.',
  long: 'Provide a detailed, comprehensive summary.',
  medium: 'Provide a medium length summary.',
};

export const ALLOWED_EMAIL_TONES = [
  'Professional',
  'Friendly',
  'Urgent',
  'Apologetic',
  'Persuasive',
];
