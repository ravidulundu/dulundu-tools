const fs = require('fs');
const path = require('path');

const CONSTANTS_PATH = path.join(__dirname, '../src/config/allTools.tsx');
const PUBLIC_PATH = path.join(__dirname, '../public');
const SITEMAP_PATH = path.join(PUBLIC_PATH, 'sitemap.xml');
const ROBOTS_PATH = path.join(PUBLIC_PATH, 'robots.txt');

const BASE_URL = 'https://dulundu.tools';

const EXCLUDED_PATHS = ['/coming-soon', '/404'];

// Static pages to always include
const STATIC_PAGES = ['/privacy', '/terms'];

function generateSitemap() {
    const content = fs.readFileSync(CONSTANTS_PATH, 'utf8');
    const regex = /path:\s*['"]([^'"]+)['"]/g;
    let match;
    const paths = new Set();
    paths.add('/'); // Add home

    while ((match = regex.exec(content)) !== null) {
        const p = match[1];
        if (p && p !== '*' && !EXCLUDED_PATHS.includes(p)) {
            paths.add(p);
        }
    }

    // Add static pages
    STATIC_PAGES.forEach(p => paths.add(p));

    const today = new Date().toISOString().split('T')[0];
    const urls = Array.from(paths).map(p => {
        return `
  <url>
    <loc>${BASE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    }).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, sitemap);
    console.log(`Sitemap generated at ${SITEMAP_PATH} with ${paths.size} URLs.`);
}

function generateRobots() {
    const disallowRules = EXCLUDED_PATHS.map(p => `Disallow: ${p}`).join('\n');
    const robots = `User-agent: *
Allow: /
${disallowRules}
Sitemap: ${BASE_URL}/sitemap.xml
`;
    fs.writeFileSync(ROBOTS_PATH, robots);
    console.log(`Robots.txt generated at ${ROBOTS_PATH}`);
}

// Ensure public dir exists
if (!fs.existsSync(PUBLIC_PATH)) {
    fs.mkdirSync(PUBLIC_PATH);
}

generateSitemap();
generateRobots();
