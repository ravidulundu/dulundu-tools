import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { UrlEncoder } from '@/features/UrlEncoder';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('UrlEncoder', () => {
  it('renders without crashing', () => {
    renderWithProviders(<UrlEncoder />);
    expect(document.body).toBeDefined();
  });
});
