/**
 * Get the real client IP address from the request.
 * Prioritizes Cloudflare headers, then X-Forwarded-For, then socket IP.
 *
 * @param {import('express').Request} req
 * @returns {string} ip address
 */
export const getClientIp = req => {
  // Cloudflare
  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip'];
  }

  // Standard Proxy
  if (req.headers['x-forwarded-for']) {
    // x-forwarded-for can be a list: "client, proxy1, proxy2"
    return req.headers['x-forwarded-for'].split(',')[0].trim();
  }

  // Fallback
  return req.ip;
};
