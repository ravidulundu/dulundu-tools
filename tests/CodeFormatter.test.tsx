import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { CodeFormatter } from '@/features/CodeFormatter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('CodeFormatter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<CodeFormatter />);
    expect(document.body).toBeDefined();
  });
});
