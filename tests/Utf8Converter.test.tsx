import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { Utf8Converter } from '@/features/Utf8Converter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('Utf8Converter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Utf8Converter />);
    expect(document.body).toBeDefined();
  });
});
