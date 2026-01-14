import { getClientIp } from '../utils/ip.js';

/**
 * Middleware to calculate and attach real client IP to the request.
 * Sets req.realIp
 */
export const ipMiddleware = (req, res, next) => {
  req.realIp = getClientIp(req);
  next();
};
