import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { Base64Converter } from '@/features/Base64Converter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('Base64Converter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Base64Converter />);
    expect(document.body).toBeDefined();
  });
});
