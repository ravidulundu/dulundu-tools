// ========== VULNERABILITY SCANNER BLOCK ==========
// Return 404 for common attack paths to stop bots from scanning
// This runs before SPA fallback to avoid returning index.html for .php etc.
// Updated: 2026-01 with latest scanner patterns

const BLOCKED_PATTERNS = [
  // Server-side scripting files (never used in React SPA)
  /\.php$/i, // PHP files
  /\.asp$/i, // ASP files
  /\.aspx$/i, // ASPX files
  /\.jsp$/i, // JSP files
  /\.cgi$/i, // CGI scripts
  /\.pl$/i, // Perl scripts
  /\.py$/i, // Python scripts (web context)

  // WordPress (most common target)
  /\/wp-admin/i, // wp-admin anywhere
  /\/wp-content/i, // wp-content anywhere
  /\/wp-includes/i, // wp-includes anywhere
  /\/wlwmanifest\.xml/i, // Windows Live Writer manifest
  /\/xmlrpc\.php/i, // XML-RPC anywhere (usually .php)
  /^\/wordpress\//i, // WordPress directory
  /^\/wp\//i, // Common WP directory

  // Other CMS/Frameworks probing
  /^\/admin/i, // Generic admin paths
  /^\/phpmyadmin/i, // phpMyAdmin
  /^\/pma/i, // phpMyAdmin shorthand
  /^\/adminer/i, // Adminer
  /^\/cgi-bin\//i, // CGI bin directory

  // VPN Panel probing (SSPanel, v2board, etc.) - 2025/2026 trend
  /^\/theme\//i, // Theme directory probing
  /^\/staff$/i, // SSPanel staff page
  /^\/auth\/login$/i, // VPN panel login
  /^\/api\/v1\/guest\//i, // v2board guest API
  /\/umi\.js/i, // Umi.js framework detection
  /\/umi\.min\.js/i, // Umi.js minified

  // Config/Environment files
  /\.env/i, // All .env variants
  /\.ini$/i, // INI config files
  /\.conf$/i, // Config files
  /\.yml$/i, // YAML files
  /\.yaml$/i, // YAML files

  // Version control and development
  /\/\.git/i, // Git directory and files
  /\/\.svn/i, // SVN directory
  /\/\.DS_Store/i, // macOS files
  /\/node_modules/i, // Node modules

  // Server config files
  /\/\.htaccess/i, // Apache config
  /\/\.htpasswd/i, // Apache password
  /\/web\.config/i, // IIS config

  // Backup and sensitive files
  /\.bak$/i, // Backup files
  /\.sql$/i, // SQL dumps
  /\.zip$/i, // Zip archives at suspicious paths
  /\/backup/i, // Backup directories
  /\/dump/i, // Database dumps

  // Spring Boot / Java actuator endpoints - 2025/2026 common target
  /^\/actuator/i, // Spring Boot actuator
  /^\/console/i, // H2 console, other consoles
  /^\/debug/i, // Debug endpoints
  /^\/trace/i, // Trace endpoints
  /^\/heapdump/i, // Java heap dump
  /^\/jolokia/i, // JMX over HTTP
  // Cloud/SSH Credentials - CRITICAL
  /^\/\.aws/i, // AWS CLI credentials
  /^\/\.ssh/i, // SSH keys
  /^\/\.gcloud/i, // Google Cloud CLI
  /^\/\.azure/i, // Azure CLI
  /^\/\.kube/i, // Kubernetes config
  /^\/\.docker/i, // Docker config
  /^\/\.npmrc/i, // NPM config
  /^\/config\.json/i, // Generic config
  /^\/config\.js/i, // Generic config
];

export const scannerBlocker = (req, res, next) => {
  const path = req.path;

  // Check for dotfiles (hidden files) - CRITICAL SECURITY
  // Block any path starting with /., except /.well-known (SSL)
  // This covers .env, .git, .aws, .ssh, .config, etc. automatically
  if (path.startsWith('/.') && !path.startsWith('/.well-known')) {
    req._blocked = true;
    return res.status(404).send('Not Found');
  }

  // Check if path matches any blocked pattern
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(path)) {
      // Mark request as blocked so logger skips it
      req._blocked = true;
      return res.status(404).send('Not Found');
    }
  }
  next();
};
