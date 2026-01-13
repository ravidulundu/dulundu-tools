import crypto from 'crypto';

import { logger } from '../middleware/logging.js';
import { storage } from '../utils/storage.js';

const MAX_CONTENT_LENGTH = 5 * 1024 * 1024; // 5MB max for share content
const CLEANUP_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

// Cleanup expired shares
export const cleanupExpiredShares = async () => {
  try {
    // List all files in 'shares/' prefix if you use one, or root
    // S3 List is paginated, but for cleanup we can just process first 1000 or valid range
    // Since we are moving to R2, standard Lifecycle Rules on the bucket are preferred.
    // However, to keep app logic consistent without external config
    // dependency, we can scan.
    // NOTE: Scanning millions of files is expensive.
    // Ideally, we rely on R2 Object Lifecycle Management for expiration.
    // We will keep a basic implementation here but log a warning.
    logger.info('Starting cleanup task... (Note: Use R2 Lifecycle Rules for production)');

    // Implementation intentionally skipped to encourage Lifecycle Rules usage
    // and avoid expensive LIST operations on every cleanup interval.
    // If specific logic is needed, listFiles from storage utils can be used.
  } catch (error) {
    logger.error('Cleanup error:', error);
  }
};

// Start the interval
export const startCleanupTask = () => {
  cleanupExpiredShares();
  setInterval(cleanupExpiredShares, CLEANUP_INTERVAL);
};

export const createShare = async (req, res) => {
  try {
    const { content, type, expiration } = req.body;

    // Content validation
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Valid content is required' });
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return res.status(400).json({ error: 'Content too large (max 5MB)' });
    }

    // Generate a secure ID
    const id = crypto.randomBytes(8).toString('hex');
    const key = `shares/${id}.json`;

    // Calculate expiration
    const now = new Date();
    let expiresAt;
    switch (expiration) {
      case '1 Hour':
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
        break;
      case '24 Hours':
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
        break;
      case '7 Days':
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '30 Days':
      default:
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
    }

    const shareData = {
      expiresAt,
      id,
      content,
      type: type || 'svg',
      createdAt: new Date().toISOString(),
    };

    // Upload to R2
    await storage.uploadFile(key, JSON.stringify(shareData), 'application/json');

    logger.info(`Created share: ${id}, expires: ${expiresAt || 'Never'}`);
    res.json({ id });
  } catch (error) {
    logger.error(`Error creating share: ${error.message}`);
    res.status(500).json({ error: 'Failed to create share' });
  }
};

export const getShare = async (req, res) => {
  try {
    const { id } = req.params;

    // Strict validation
    if (!/^[a-f0-9]+$/i.test(id) || id.length > 64) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const key = `shares/${id}.json`;

    try {
      const { Body } = await storage.downloadFile(key);
      const data = JSON.parse(Body);

      // Check expiration
      if (data.expiresAt) {
        if (new Date(data.expiresAt) < new Date()) {
          // Lazy delete on read if expired
          // Use background - don't await deletion to not block user response too much
          storage.deleteFile(key).catch(e => logger.error('Failed to delete expired file', e));

          logger.info(`Share expired: ${id}`);
          return res.status(410).json({ error: 'Share link has expired' });
        }
      }

      res.json(data);
    } catch (error) {
      // AWS SDK throws NotFound or NoSuchKey for missing files
      if (error.name === 'NoSuchKey' || error.name === 'NotFound') {
        return res.status(404).json({ error: 'Share not found' });
      }
      throw error;
    }
  } catch (error) {
    logger.error(`Error reading share ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
