import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { LoanCalculator } from '@/features/LoanCalculator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('LoanCalculator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<LoanCalculator />);
    expect(document.body).toBeDefined();
  });
});
