import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { WordToHtml } from '@/features/WordToHtml';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('WordToHtml', () => {
  it('renders without crashing', () => {
    renderWithProviders(<WordToHtml />);
    expect(document.body).toBeDefined();
  });
});
