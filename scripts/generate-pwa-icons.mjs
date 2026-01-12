#!/usr/bin/env node
/**
 * Generate PWA icons from favicon.svg
 * Run: node scripts/generate-pwa-icons.mjs
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svgPath = join(publicDir, 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
];

async function generateIcons() {
  console.log('Generating PWA icons from favicon.svg...\n');

  for (const { name, size, maskable } of sizes) {
    const outputPath = join(publicDir, name);

    // For maskable icons, add padding (safe zone is inner 80%)
    const padding = maskable ? Math.round(size * 0.1) : 0;
    const innerSize = size - padding * 2;

    await sharp(svgBuffer)
      .resize(innerSize, innerSize)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: '#3b82f6', // Match theme color
      })
      .png()
      .toFile(outputPath);

    console.log(`✓ ${name} (${size}x${size})`);
  }

  console.log('\nDone! Icons saved to public/');
}

generateIcons().catch(console.error);
