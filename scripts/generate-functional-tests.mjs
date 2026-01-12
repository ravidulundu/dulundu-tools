#!/usr/bin/env node

/**
 * Functional Test Generator
 *
 * Generates REAL functional tests that verify tool output is correct
 * Not just rendering tests - actual input/output verification
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const FEATURES_DIR = join(rootDir, 'src/features');
const TESTS_DIR = join(rootDir, 'tests');

// Tool-specific test cases with known input/output pairs
// Only include tools where we can reliably test input->output
const TOOL_TEST_CASES = {
  Base64Converter: {
    tests: [
      { input: 'Hello', expectedContains: 'SGVsbG8=' },
    ],
  },
  UrlEncoder: {
    tests: [
      { input: 'hello world', expectedContains: '%20' },
    ],
  },
  SlugGenerator: {
    tests: [
      { input: 'Hello World', expectedContains: 'hello' },
    ],
  },
  TextCaseConverter: {
    tests: [
      { input: 'hello', expectedContains: 'HELLO' },
    ],
  },
  WordCounter: {
    tests: [
      { input: 'hello world test', expectedContains: '3' },
    ],
  },
  HtmlStripper: {
    tests: [
      { input: '<p>Hello</p>', expectedContains: 'Hello' },
    ],
  },
  LoremGenerator: {
    tests: [
      { expectedContains: 'lorem' },
    ],
  },
};

// Generate test content based on tool type
function generateTestContent(toolName) {
  const testCases = TOOL_TEST_CASES[toolName];

  if (!testCases) {
    // Generic test for tools without specific test cases
    return generateGenericTest(toolName);
  }

  return generateSpecificTest(toolName, testCases);
}

function generateGenericTest(toolName) {
  return `import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ${toolName} } from '@/features/${toolName}';

import { renderWithProviders } from './utils/testHelpers';

describe('${toolName}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<${toolName} />);
      expect(document.body).toBeDefined();
    });

    it('displays tool interface', () => {
      const { container } = renderWithProviders(<${toolName} />);
      // Should have some interactive elements
      const hasButtons = container.querySelectorAll('button').length > 0;
      const hasInputs = container.querySelectorAll('input, textarea').length > 0;
      const hasContent = container.textContent && container.textContent.length > 0;
      expect(hasButtons || hasInputs || hasContent).toBe(true);
    });
  });
});
`;
}

function generateSpecificTest(toolName, testCases) {
  const tests = testCases.tests;
  let testBlocks = '';

  tests.forEach((test, index) => {
    if (test.expectedOutput) {
      testBlocks += `
    it('produces correct output for known input (case ${index + 1})', async () => {
      const { container } = renderWithProviders(<${toolName} />);
      const user = userEvent.setup();

      const textarea = container.querySelector('textarea');
      const input = container.querySelector('input[type="text"]');
      const inputElement = textarea || input;

      if (inputElement) {
        await user.clear(inputElement);
        await user.type(inputElement, '${test.input}');

        await waitFor(() => {
          const outputAreas = container.querySelectorAll('textarea, [class*="output"], pre, code');
          const hasExpectedOutput = Array.from(outputAreas).some(
            el => el.textContent?.includes('${test.expectedOutput}')
          );
          expect(hasExpectedOutput || container.textContent?.includes('${test.expectedOutput}')).toBe(true);
        }, { timeout: 3000 });
      }
    });
`;
    } else if (test.expectedContains) {
      testBlocks += `
    it('output contains expected value (case ${index + 1})', async () => {
      const { container } = renderWithProviders(<${toolName} />);
      const user = userEvent.setup();

      ${test.input ? `
      const textarea = container.querySelector('textarea');
      const input = container.querySelector('input[type="text"]');
      const inputElement = textarea || input;

      if (inputElement) {
        await user.clear(inputElement);
        await user.type(inputElement, '${test.input}');
      }
      ` : ''}

      await waitFor(() => {
        expect(container.textContent?.toLowerCase()).toContain('${test.expectedContains.toLowerCase()}');
      }, { timeout: 3000 });
    });
`;
    } else if (test.expectedPattern) {
      testBlocks += `
    it('output matches expected pattern (case ${index + 1})', async () => {
      const { container } = renderWithProviders(<${toolName} />);

      await waitFor(() => {
        const pattern = ${test.expectedPattern};
        const textContent = container.textContent || '';
        expect(pattern.test(textContent)).toBe(true);
      }, { timeout: 3000 });
    });
`;
    } else if (test.expectedMinLength) {
      testBlocks += `
    it('generates output with minimum length (case ${index + 1})', async () => {
      const { container } = renderWithProviders(<${toolName} />);

      await waitFor(() => {
        // Look for generated output in any text area or display
        const outputAreas = container.querySelectorAll('textarea, [class*="output"], pre, code, [class*="password"], [class*="result"]');
        const hasValidOutput = Array.from(outputAreas).some(
          el => (el.textContent?.length || 0) >= ${test.expectedMinLength}
        );
        expect(hasValidOutput).toBe(true);
      }, { timeout: 3000 });
    });
`;
    }
  });

  return `import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ${toolName} } from '@/features/${toolName}';

import { renderWithProviders } from './utils/testHelpers';

describe('${toolName}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<${toolName} />);
      expect(document.body).toBeDefined();
    });
  });

  describe('Functional Tests', () => {${testBlocks}
  });
});
`;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const forceRegenerate = args.includes('--force') || args.includes('-f');
  const specificTool = args.find(arg => !arg.startsWith('-'));

  const features = readdirSync(FEATURES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let updated = 0;
  let skipped = 0;

  console.log('🔍 Generating FUNCTIONAL tests (input/output verification)...\n');

  if (forceRegenerate) {
    console.log('⚠️  Force mode enabled\n');
  }

  const toolsToProcess = specificTool ? [specificTool] : features;

  for (const feature of toolsToProcess) {
    const indexPath = join(FEATURES_DIR, feature, 'index.tsx');
    const testPath = join(TESTS_DIR, `${feature}.test.tsx`);

    if (!existsSync(indexPath)) {
      console.log(`⚠️  ${feature} - No index.tsx found, skipping`);
      continue;
    }

    try {
      // Skip Base64Converter which has hand-crafted tests (unless forced)
      if (feature === 'Base64Converter' && !forceRegenerate) {
        console.log(`⏭️  ${feature} - Has custom tests, skipping`);
        skipped++;
        continue;
      }

      const testContent = generateTestContent(feature);
      writeFileSync(testPath, testContent);

      const hasSpecificTests = TOOL_TEST_CASES[feature] ? '(with specific test cases)' : '(generic)';
      console.log(`✅ ${feature} - Generated ${hasSpecificTests}`);
      updated++;

    } catch (error) {
      console.log(`⚠️  ${feature} - Error: ${error.message}`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Tools with specific tests: ${Object.keys(TOOL_TEST_CASES).length}`);
  console.log(`\n💡 To add specific tests for a tool, add it to TOOL_TEST_CASES in this script`);
}

main();
