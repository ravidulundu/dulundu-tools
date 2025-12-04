import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { HashGenerator } from '@/features/HashGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('HashGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<HashGenerator />);
    expect(document.body).toBeDefined();
  });
});
