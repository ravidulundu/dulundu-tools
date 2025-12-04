import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { WordpressPasswordHash } from '@/features/WordpressPasswordHash';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('WordpressPasswordHash', () => {
  it('renders without crashing', () => {
    renderWithProviders(<WordpressPasswordHash />);
    expect(document.body).toBeDefined();
  });
});
