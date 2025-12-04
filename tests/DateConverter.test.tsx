import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { DateConverter } from '@/features/DateConverter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('DateConverter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<DateConverter />);
    expect(document.body).toBeDefined();
  });
});
