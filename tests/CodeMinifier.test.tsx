import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { CodeMinifier } from '@/features/CodeMinifier';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('CodeMinifier', () => {
  it('renders without crashing', () => {
    renderWithProviders(<CodeMinifier />);
    expect(document.body).toBeDefined();
  });
});
