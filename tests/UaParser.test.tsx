import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { UaParser } from '@/features/UaParser';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('UaParser', () => {
  it('renders without crashing', () => {
    renderWithProviders(<UaParser />);
    expect(document.body).toBeDefined();
  });
});
