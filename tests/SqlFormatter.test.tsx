import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { SqlFormatter } from '@/features/SqlFormatter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('SqlFormatter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<SqlFormatter />);
    expect(document.body).toBeDefined();
  });
});
