import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ComingSoon } from '@/features/ComingSoon';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('ComingSoon', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ComingSoon />);
    expect(document.body).toBeDefined();
  });
});
