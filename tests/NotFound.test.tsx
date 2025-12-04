import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { NotFound } from '@/features/NotFound';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('NotFound', () => {
  it('renders without crashing', () => {
    renderWithProviders(<NotFound />);
    expect(document.body).toBeDefined();
  });
});
