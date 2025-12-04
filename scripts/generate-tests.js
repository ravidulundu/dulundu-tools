import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const featuresDir = path.join(projectRoot, 'features');
const componentsDir = path.join(projectRoot, 'components');
const testsDir = path.join(projectRoot, 'tests');

if (!fs.existsSync(testsDir)) {
  fs.mkdirSync(testsDir);
}

function generateTestContent(componentName, importPath) {
  return `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${componentName} } from '${importPath}';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <${componentName} />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
`;
}

function processDirectory(sourceDir, relativePathPrefix) {
  if (!fs.existsSync(sourceDir)) return;

  const files = fs.readdirSync(sourceDir);

  files.forEach(file => {
    const filePath = path.join(sourceDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
        processDirectory(filePath, path.join(relativePathPrefix, file));
        return;
    }

    if (!file.endsWith('.tsx')) return;
    if (file === 'index.tsx') return; // Skip index files for now

    const componentName = path.basename(file, '.tsx');
    const testFileName = `${componentName}.test.tsx`;
    const testFilePath = path.join(testsDir, testFileName);

    if (fs.existsSync(testFilePath)) {
      process.stdout.write(`Test already exists for ${componentName}\n`);
      return;
    }

    // Calculate relative import path
    // tests/Component.test.tsx -> ../features/Component.tsx
    let importPath = path.relative(testsDir, filePath).replace(/\\/g, '/');
    if (importPath.endsWith('.tsx')) {
        importPath = importPath.slice(0, -4);
    }

    // Handle default exports vs named exports? 
    // For now, assuming named exports or that the test will fail and we fix it.
    // Most components in this project seem to use named exports.
    
    // Special case for ReadmeGenerator which is a directory
    if (componentName === 'ReadmeGenerator') {
        // It's likely already handled or specific
    }

    const content = generateTestContent(componentName, importPath);
    fs.writeFileSync(testFilePath, content);
    process.stdout.write(`Created test for ${componentName}\n`);
  });
}

process.stdout.write('Generating tests...\n');
processDirectory(featuresDir, '../features');
processDirectory(componentsDir, '../components');
process.stdout.write('Done.\n');
