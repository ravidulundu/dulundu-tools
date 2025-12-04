import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { JsValidator } from '@/features/JsValidator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('JsValidator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<JsValidator />);
    expect(document.body).toBeDefined();
  });
});
