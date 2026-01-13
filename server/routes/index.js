import express from 'express';

import aiRoutes from './ai.js';
import shareRoutes from './share.js';
import toolsRoutes from './tools.js';

const router = express.Router();

router.use('/ai', aiRoutes);
router.use('/share', shareRoutes);
router.use('/', toolsRoutes); // toolsRoutes has /check-url defined in it? No, checking tools.js content.
// In tools.js I wrote `router.post('/check-url', ...)`
// So if I mount it at '/', it becomes '/api/check-url' (if this router is mounted at /api).
// Correct.

export default router;
