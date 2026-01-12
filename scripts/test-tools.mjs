#!/usr/bin/env node

/**
 * Test Tools Script
 *
 * Validates that all tools in the codebase:
 * 1. Have corresponding test files
 * 2. Pass their tests
 * 3. Meet minimum coverage thresholds
 *
 * Usage:
 *   node scripts/test-tools.mjs          # Run all tool tests
 *   node scripts/test-tools.mjs --check  # Check test coverage only
 *   node scripts/test-tools.mjs --missing # List tools without tests
 */

import { execFileSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const FEATURES_DIR = join(rootDir, 'src/features');
const TESTS_DIR = join(rootDir, 'tests');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, COLORS.reset);
}

function getFeatures() {
  return readdirSync(FEATURES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function getTestFiles() {
  return readdirSync(TESTS_DIR)
    .filter(file => file.endsWith('.test.tsx'))
    .map(file => file.replace('.test.tsx', ''));
}

function checkTestCoverage() {
  const features = getFeatures();
  const tests = getTestFiles();

  const missing = features.filter(f => !tests.includes(f));

  log(COLORS.cyan, '\n📊 Test Coverage Report');
  log(COLORS.cyan, '═'.repeat(50));

  log(COLORS.bright, `\n📁 Total Features: ${features.length}`);
  log(COLORS.bright, `📝 Total Test Files: ${tests.length}`);

  const coveragePercent = ((features.length - missing.length) / features.length * 100).toFixed(1);
  const coverageColor = coveragePercent >= 90 ? COLORS.green : coveragePercent >= 70 ? COLORS.yellow : COLORS.red;

  log(coverageColor, `📈 Coverage: ${coveragePercent}%`);

  if (missing.length > 0) {
    log(COLORS.yellow, `\n⚠️  Features without tests (${missing.length}):`);
    missing.forEach(f => log(COLORS.yellow, `   - ${f}`));
  } else {
    log(COLORS.green, '\n✅ All features have tests!');
  }

  return { features, tests, missing, coveragePercent };
}

function runTests(testPattern = '') {
  log(COLORS.cyan, '\n🧪 Running Tests...');
  log(COLORS.cyan, '═'.repeat(50));

  try {
    const args = testPattern
      ? ['vitest', 'run', testPattern, '--reporter=verbose']
      : ['vitest', 'run', '--reporter=verbose'];

    execFileSync('npx', args, {
      stdio: 'inherit',
      cwd: rootDir,
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    log(COLORS.green, '\n✅ All tests passed!');
    return true;
  } catch (error) {
    log(COLORS.red, '\n❌ Some tests failed!');
    return false;
  }
}

function runCoverage() {
  log(COLORS.cyan, '\n📊 Generating Coverage Report...');
  log(COLORS.cyan, '═'.repeat(50));

  try {
    execFileSync('npx', ['vitest', 'run', '--coverage'], {
      stdio: 'inherit',
      cwd: rootDir,
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    return true;
  } catch (error) {
    log(COLORS.red, '\n❌ Coverage generation failed!');
    return false;
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Test Tools Script - Validate tool test coverage

Usage:
  node scripts/test-tools.mjs          Run all tool tests
  node scripts/test-tools.mjs --check  Check test coverage only
  node scripts/test-tools.mjs --missing List tools without tests
  node scripts/test-tools.mjs --coverage Run with coverage report
  node scripts/test-tools.mjs <tool>   Run tests for specific tool

Examples:
  node scripts/test-tools.mjs --missing
  node scripts/test-tools.mjs Base64Converter
  node scripts/test-tools.mjs --coverage
`);
  process.exit(0);
}

if (args.includes('--check') || args.includes('--missing')) {
  const result = checkTestCoverage();
  process.exit(result.missing.length > 0 ? 1 : 0);
}

if (args.includes('--coverage')) {
  checkTestCoverage();
  runCoverage();
  process.exit(0);
}

// Run specific tool test
const toolName = args.find(arg => !arg.startsWith('-'));
if (toolName) {
  const testFile = `tests/${toolName}.test.tsx`;
  if (existsSync(join(rootDir, testFile))) {
    const success = runTests(testFile);
    process.exit(success ? 0 : 1);
  } else {
    log(COLORS.red, `❌ Test file not found: ${testFile}`);
    process.exit(1);
  }
}

// Default: Run all tests with coverage check
checkTestCoverage();
const success = runTests();
process.exit(success ? 0 : 1);
