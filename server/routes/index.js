import express from 'express';

import aiRoutes from './ai.js';
import shareRoutes from './share.js';
import toolsRoutes from './tools.js';

const router = express.Router();

router.use('/ai', aiRoutes);
router.use('/share', shareRoutes);
router.use('/', toolsRoutes);

// API 404 - Catch all unhandled API routes and return JSON instead of falling through to SPA HTML
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
    correlationId: req.correlationId,
  });
});

export default router;
