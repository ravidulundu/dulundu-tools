import express from 'express';

import {
  checkAiConfig,
  generateCode,
  generateEmail,
  paraphraseText,
  summarizeText,
} from '../controllers/ai.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

// Apply AI rate limiter and config check to all AI routes
router.use(aiLimiter);
router.use(checkAiConfig);

router.post('/generate', asyncHandler(generateCode));
router.post('/paraphrase', asyncHandler(paraphraseText));
router.post('/email', asyncHandler(generateEmail));
router.post('/summarize', asyncHandler(summarizeText));

export default router;
