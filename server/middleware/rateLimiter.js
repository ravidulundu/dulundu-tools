import rateLimit from 'express-rate-limit';

// Rate Limiter for AI endpoints - strict limits (not a chatbot!)
export const aiLimiter = rateLimit({
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
export const shareLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 shares per hour per IP
  message: { error: 'Too many share requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiter for URL check endpoint (prevent abuse)
export const urlCheckLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: { error: 'Too many URL check requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
