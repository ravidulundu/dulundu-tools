import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { config } from '../config/index.js';
import { logger } from '../middleware/logging.js';

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = config;

// Only initialize if credentials are present to avoid startup crashes if not configured
let s3Client = null;

if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  logger.info('R2 Storage initialized');
} else {
  logger.warn('R2 Storage credentials missing - file storage disabled');
}

export const storage = {
  /**
   * Uploads a file to R2
   * @param {string} key - File path/name
   * @param {string | Buffer} body - File content
   * @param {string} contentType - MIME type
   */
  async uploadFile(key, body, contentType) {
    if (!s3Client) throw new Error('Storage not configured');

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3Client.send(command);
  },

  /**
   * Downloads a file from R2
   * @param {string} key
   * @returns {Promise<{Body: string, ContentType: string}>}
   */
  async downloadFile(key) {
    if (!s3Client) throw new Error('Storage not configured');

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    // S3 GetObject Body is a stream in Node.js
    const str = await response.Body.transformToString();

    return {
      Body: str,
      ContentType: response.ContentType,
    };
  },

  /**
   * Deletes a file from R2
   * @param {string} key
   */
  async deleteFile(key) {
    if (!s3Client) throw new Error('Storage not configured');

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  },

  /**
   * Lists files with a prefix
   * @param {string} prefix
   */
  async listFiles(prefix) {
    if (!s3Client) throw new Error('Storage not configured');

    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);
    return response.Contents || [];
  },
};
