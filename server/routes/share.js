import express from 'express';

import { createShare, getShare } from '../controllers/share.js';
import { shareLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

router.post('/', shareLimiter, asyncHandler(createShare));
router.get('/:id', shareLimiter, asyncHandler(getShare));

export default router;
