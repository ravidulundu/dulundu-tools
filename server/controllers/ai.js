import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

import {
  AI_INPUT_LIMITS,
  ALLOWED_EMAIL_TONES,
  config,
  SUMMARY_LENGTH_INSTRUCTIONS,
} from '../config/index.js';
import { logger } from '../middleware/logging.js';
import { sanitizeForPrompt } from '../utils/sanitizer.js';

// ========== AI PROVIDERS SETUP ==========
const groq = config.GROQ_API_KEY ? new Groq({ apiKey: config.GROQ_API_KEY }) : null;
const gemini = config.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: config.GEMINI_API_KEY }) : null;

if (!groq && !gemini) {
  logger.error('AI not initialized: Missing both GROQ_API_KEY and GEMINI_API_KEY');
} else {
  logger.info(`AI providers: Groq=${!!groq}, Gemini=${!!gemini}`);
}

// Middleware to check AI service configuration
export const checkAiConfig = (req, res, next) => {
  if (!groq && !gemini) {
    logger.error('AI service configuration missing');
    return res.status(503).json({ error: 'AI service currently unavailable' });
  }
  next();
};

// AI Provider Abstraction
const callAI = async prompt => {
  // Try Groq first
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

// Controllers
export const generateCode = async (req, res) => {
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
};

export const paraphraseText = async (req, res) => {
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
};

export const generateEmail = async (req, res) => {
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
};

export const summarizeText = async (req, res) => {
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
};
