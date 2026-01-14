import { logger } from '../middleware/logging.js';
import { sanitizeUrl } from '../utils/sanitizer.js';

export const checkUrl = async (req, res) => {
  const { url } = req.body;

  // Use sanitizeUrl for input validation and SSRF protection
  let sanitizedUrl;
  try {
    sanitizedUrl = sanitizeUrl(url);
  } catch (error) {
    logger.warn(`URL validation failed: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }

  logger.debug(`URL check request: ${sanitizedUrl}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    // sanitizedUrl is guaranteed to be safe by sanitizeUrl()
    const response = await fetch(sanitizedUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Dulundu-Tools-HealthCheck/1.0',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    res.json({
      online: true,
      status: response.status,
      statusText: response.statusText,
      url: sanitizedUrl,
    });
  } catch (error) {
    clearTimeout(timeoutId);

    // Determine error type
    let errorMessage = 'Unknown error';
    let errorCode = 'UNKNOWN';

    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out (10s)';
      errorCode = 'TIMEOUT';
    } else if (error.cause?.code === 'ENOTFOUND') {
      errorMessage = 'Domain not found (DNS error)';
      errorCode = 'DNS_ERROR';
    } else if (error.cause?.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused';
      errorCode = 'CONNECTION_REFUSED';
    } else if (error.cause?.code === 'ECONNRESET') {
      errorMessage = 'Connection reset';
      errorCode = 'CONNECTION_RESET';
    } else if (error.message) {
      errorMessage = error.message;
    }

    logger.debug(`URL check failed for ${sanitizedUrl}: ${errorCode}`);

    res.json({
      online: false,
      error: errorMessage,
      errorCode,
      url: sanitizedUrl,
    });
  }
};
