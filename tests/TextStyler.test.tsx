import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { TextStyler } from '@/features/TextStyler';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('TextStyler', () => {
  it('renders without crashing', () => {
    renderWithProviders(<TextStyler />);
    expect(document.body).toBeDefined();
  });
});
