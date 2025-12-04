import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { EscapeTools } from '@/features/EscapeTools';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('EscapeTools', () => {
  it('renders without crashing', () => {
    renderWithProviders(<EscapeTools />);
    expect(document.body).toBeDefined();
  });
});
