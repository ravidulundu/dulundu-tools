import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { TextCaseConverter } from '@/features/TextCaseConverter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('TextCaseConverter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<TextCaseConverter />);
    expect(document.body).toBeDefined();
  });
});
