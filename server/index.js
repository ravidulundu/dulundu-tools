import express from 'express';

import { config } from './config/index.js';
import { startCleanupTask } from './controllers/share.js';
import { spaFallback, staticFilesMiddleware } from './controllers/static.js';
import { scannerBlocker } from './middleware/blocker.js';
import { ipMiddleware } from './middleware/ip.js';
import { correlationMiddleware, logger, requestLogger } from './middleware/logging.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { corsMiddleware, nonceMiddleware, securityHeaders } from './middleware/security.js';
import apiRoutes from './routes/index.js';

const app = express();
const { PORT } = config;

// Disable X-Powered-By header for security
app.disable('x-powered-by');

// Trust the first proxy (Dokploy/Traefik/Nginx)
app.set('trust proxy', 1);

// ========== MIDDLEWARE ==========

// IP Resolution Middleware (Must be early)
app.use(ipMiddleware);

// Logging (Correlation ID) - Early for tracing
app.use(correlationMiddleware);

// 1. SECURITY BLOCKER (Cheap, Regex-based, No I/O)
// Block bots/scanners/dotfiles immediately before touching disk or DB
app.use(scannerBlocker);

// 2. STATIC FILES (Bypass rate limiter for assets, but AFTER blocker)
app.use(staticFilesMiddleware);

// 3. SECURITY & RATE LIMITING (For API and Dynamic Routes)
app.use(corsMiddleware);
app.use(globalLimiter); // Protect API/dynamic routes
app.use(express.json({ limit: '10mb' }));
app.use(nonceMiddleware);
app.use(securityHeaders);

// Logging (Request Logger)
app.use(requestLogger);

// ========== ROUTES ==========

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API Routes
app.use('/api', apiRoutes);

// SPA Fallback
app.get('*', spaFallback);

// ========== ERROR HANDLING ==========

app.use((err, req, res, _next) => {
  logger.error({
    message: 'Unhandled application error',
    error: err.message,
    stack: err.stack,
    correlationId: req.correlationId,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: 'Internal Server Error',
    correlationId: req.correlationId,
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ========== SERVER START ==========

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  // Start background tasks
  startCleanupTask();
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

// Global Error Safety Nets
process.on('unhandledRejection', (reason, promise) => {
  logger.error({
    message: 'Unhandled Rejection at Promise',
    reason: reason,
    promise: promise,
  });
});

process.on('uncaughtException', error => {
  logger.error({
    message: 'Uncaught Exception thrown',
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
