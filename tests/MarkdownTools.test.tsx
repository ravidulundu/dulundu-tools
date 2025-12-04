import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { MarkdownTools } from '@/features/MarkdownTools';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('MarkdownTools', () => {
  it('renders without crashing', () => {
    renderWithProviders(<MarkdownTools />);
    expect(document.body).toBeDefined();
  });
});
