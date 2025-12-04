import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { GstCalculator } from '@/features/GstCalculator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('GstCalculator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<GstCalculator />);
    expect(document.body).toBeDefined();
  });
});
