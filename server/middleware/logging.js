import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

// ========== LOGGER CONFIGURATION ==========
// 2025/2026 Best Practice: Structured JSON in Prod, Readable in Dev
const { combine, timestamp, json, colorize, printf, errors } = winston.format;

// Dev format: readable, colored
const devFormat = combine(
  colorize(),
  printf(({ level, message, timestamp: _timestamp, correlationId, ...meta }) => {
    const cid = correlationId ? ` [${correlationId}]` : '';
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${level}${cid}: ${message}${metaStr}`;
  })
);

// Prod format: structured JSON with correlation ID
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }), // Include stack trace
  json()
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  defaultMeta: { service: 'dulundu-tools' }, // Add service name to all logs
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  logger.add(new winston.transports.File({ filename: 'combined.log' }));
}

// ========== MIDDLEWARE ==========

// Correlation ID Middleware
// Tracks requests across services for debugging
export const correlationMiddleware = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
};

import { getClientIp } from '../utils/ip.js';

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    // Skip logging for blocked scanner requests (reduces noise)
    if (req._blocked) return;

    const duration = Date.now() - start;

    // Get real IP (Cloudflare support)
    const ip = getClientIp(req);

    // 2025/2026 Best Practice: Structured format with Correlation ID
    logger.info({
      message: 'Incoming request',
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      correlationId: req.correlationId,
      ip: ip,
      userAgent: req.get('user-agent'),
      // PII Redaction: Don't log full headers or body
    });
  });
  next();
};
