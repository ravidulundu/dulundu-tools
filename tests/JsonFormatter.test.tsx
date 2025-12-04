import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { JsonFormatter } from '@/features/JsonFormatter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('JsonFormatter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<JsonFormatter />);
    expect(document.body).toBeDefined();
  });
});
