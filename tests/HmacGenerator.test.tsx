import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { HmacGenerator } from '@/features/HmacGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('HmacGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<HmacGenerator />);
    expect(document.body).toBeDefined();
  });
});
