import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ChmodCalculator } from '@/features/ChmodCalculator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('ChmodCalculator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ChmodCalculator />);
    expect(document.body).toBeDefined();
  });
});
