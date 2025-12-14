import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { JwtDecoder } from '@/features/JwtDecoder';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('JwtDecoder', () => {
  it('renders without crashing', () => {
    renderWithProviders(<JwtDecoder />);
    expect(document.body).toBeDefined();
  });
});
