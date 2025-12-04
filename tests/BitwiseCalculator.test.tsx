import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { BitwiseCalculator } from '@/features/BitwiseCalculator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('BitwiseCalculator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<BitwiseCalculator />);
    expect(document.body).toBeDefined();
  });
});
