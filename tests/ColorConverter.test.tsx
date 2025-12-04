import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ColorConverter } from '@/features/ColorConverter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('ColorConverter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ColorConverter />);
    expect(document.body).toBeDefined();
  });
});
