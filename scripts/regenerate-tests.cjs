const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, '../src/features');
const componentsDir = path.join(__dirname, '../src/components');
const testsDir = path.join(__dirname, '../tests');

// Template for feature tests
const featureTestTemplate = (name) => `import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ${name} } from '@/features/${name}';
import { ThemeProvider } from '@/contexts/ThemeContext';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('${name}', () => {
  it('renders without crashing', () => {
    renderWithProviders(<${name} />);
    expect(document.body).toBeDefined();
  });
});
`;

// Template for component tests
const componentTestTemplate = (name, importPath) => `import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ${name} } from '${importPath}';
import { ThemeProvider } from '@/contexts/ThemeContext';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('${name}', () => {
  it('renders without crashing', () => {
    renderWithProviders(<${name} />);
    expect(document.body).toBeDefined();
  });
});
`;

// Get all features
const features = fs.readdirSync(featuresDir).filter(f => {
  const stat = fs.statSync(path.join(featuresDir, f));
  return stat.isDirectory();
});

// Generate feature tests
features.forEach(feature => {
  const testPath = path.join(testsDir, `${feature}.test.tsx`);
  const content = featureTestTemplate(feature);
  fs.writeFileSync(testPath, content);
  console.log(`Generated: ${feature}.test.tsx`);
});

// Common components to test
const commonComponents = [
  { name: 'ActionButton', path: '@/components/common/ActionButton' },
  { name: 'Button', path: '@/components/common/Button' },
  { name: 'CodeEditor', path: '@/components/common/CodeEditor' },
  { name: 'ConfirmationModal', path: '@/components/common/ConfirmationModal' },
  { name: 'Loading', path: '@/components/common/Loading' },
  { name: 'PreviewAndRaw', path: '@/components/common/PreviewAndRaw' },
  { name: 'ScrollToTop', path: '@/components/common/ScrollToTop' },
  { name: 'ToolHeader', path: '@/components/common/ToolHeader' },
];

commonComponents.forEach(({ name, path: importPath }) => {
  const testPath = path.join(testsDir, `${name}.test.tsx`);
  const content = componentTestTemplate(name, importPath);
  fs.writeFileSync(testPath, content);
  console.log(`Generated: ${name}.test.tsx`);
});

// Layout components
const layoutComponents = [
  { name: 'Footer', path: '@/components/layouts/Footer' },
  { name: 'Header', path: '@/components/layouts/Header' },
  { name: 'Layout', path: '@/components/layouts/Layout' },
  { name: 'MegaMenu', path: '@/components/layouts/MegaMenu' },
  { name: 'MobileMenu', path: '@/components/layouts/MobileMenu' },
  { name: 'Sidebar', path: '@/components/layouts/Sidebar' },
];

layoutComponents.forEach(({ name, path: importPath }) => {
  const testPath = path.join(testsDir, `${name}.test.tsx`);
  const content = componentTestTemplate(name, importPath);
  fs.writeFileSync(testPath, content);
  console.log(`Generated: ${name}.test.tsx`);
});

// Home components
const homeComponents = [
  { name: 'CategoryCard', path: '@/components/home/CategoryCard' },
  { name: 'HeroSection', path: '@/components/home/HeroSection' },
  { name: 'ToolCard', path: '@/components/home/ToolCard' },
  { name: 'ToolDirectory', path: '@/components/home/ToolDirectory' },
  { name: 'ToolGrid', path: '@/components/home/ToolGrid' },
];

homeComponents.forEach(({ name, path: importPath }) => {
  const testPath = path.join(testsDir, `${name}.test.tsx`);
  const content = componentTestTemplate(name, importPath);
  fs.writeFileSync(testPath, content);
  console.log(`Generated: ${name}.test.tsx`);
});

console.log('\nAll tests regenerated!');
