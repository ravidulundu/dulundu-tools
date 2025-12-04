import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { SlugGenerator } from '@/features/SlugGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('SlugGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<SlugGenerator />);
    expect(document.body).toBeDefined();
  });
});
