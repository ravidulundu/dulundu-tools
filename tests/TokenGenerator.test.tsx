import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { TokenGenerator } from '@/features/TokenGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('TokenGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<TokenGenerator />);
    expect(document.body).toBeDefined();
  });
});
