import { Address4, Address6 } from 'ip-address';

/**
 * Check if URL points to private/internal networks
 * Uses ip-address library for robust IPv4/IPv6 validation
 */
export const isPrivateUrl = urlString => {
  try {
    const url = new URL(urlString);
    let hostname = url.hostname.toLowerCase();

    // Block localhost variants
    if (hostname === 'localhost') {
      return true;
    }

    // Block internal domains
    if (hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      return true;
    }

    // Remove IPv6 brackets if present
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.slice(1, -1);
    }

    // Try parsing as IPv4
    try {
      const ipv4 = new Address4(hostname);
      if (ipv4.isValid()) {
        // Check for private, loopback, link-local ranges
        const privateRanges = [
          '10.0.0.0/8', // Class A private
          '172.16.0.0/12', // Class B private
          '192.168.0.0/16', // Class C private
          '127.0.0.0/8', // Loopback
          '169.254.0.0/16', // Link-local / Cloud metadata
          '0.0.0.0/8', // Current network
        ];
        for (const range of privateRanges) {
          if (ipv4.isInSubnet(new Address4(range))) {
            return true;
          }
        }
      }
    } catch {
      // Not a valid IPv4, try IPv6
    }

    // Try parsing as IPv6
    try {
      const ipv6 = new Address6(hostname);
      if (ipv6.isValid()) {
        // Check for loopback (::1), link-local (fe80::/10), ULA (fc00::/7)
        const privateRanges = [
          '::1/128', // Loopback
          'fe80::/10', // Link-local
          'fc00::/7', // Unique Local Address (ULA)
          '::ffff:0:0/96', // IPv4-mapped IPv6
        ];
        for (const range of privateRanges) {
          if (ipv6.isInSubnet(new Address6(range))) {
            return true;
          }
        }
      }
    } catch {
      // Not a valid IPv6 either
    }

    return false;
  } catch {
    return true; // Block on parse error
  }
};

/**
 * Sanitize and validate URL for safe external requests.
 * Reconstructs URL from parsed components to break taint chain.
 */
export const sanitizeUrl = rawUrl => {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid URL: must be a non-empty string');
  }

  let inputUrl = rawUrl.trim();

  // Ensure protocol is http or https
  if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
    inputUrl = 'https://' + inputUrl;
  }

  // Validate URL format by parsing
  let parsedUrl;
  try {
    parsedUrl = new URL(inputUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  // SECURITY: Only allow http and https protocols (allowlist)
  const allowedProtocols = ['http:', 'https:'];
  if (!allowedProtocols.includes(parsedUrl.protocol)) {
    throw new Error('Invalid protocol: only HTTP and HTTPS are allowed');
  }

  // SECURITY: Block private/internal URLs (SSRF protection)
  // This reconstructs the URL from parsed components, breaking the taint chain
  const reconstructedUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

  if (isPrivateUrl(reconstructedUrl)) {
    throw new Error('URL points to private/internal network');
  }

  // Return the reconstructed URL (not the original user input)
  return reconstructedUrl;
};

/**
 * Sanitize user input for prompt injection prevention
 * Escapes < and > to prevent XML tag breakout attacks
 */
export const sanitizeForPrompt = str => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
