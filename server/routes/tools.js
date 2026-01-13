import express from 'express';

import { checkUrl } from '../controllers/tools.js';
import { urlCheckLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

router.post('/check-url', urlCheckLimiter, asyncHandler(checkUrl));

export default router;
