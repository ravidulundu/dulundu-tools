import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { BcryptGenerator } from '@/features/BcryptGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('BcryptGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<BcryptGenerator />);
    expect(document.body).toBeDefined();
  });
});
