import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { WhoisLookup } from '@/features/WhoisLookup';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('WhoisLookup', () => {
  it('renders without crashing', () => {
    renderWithProviders(<WhoisLookup />);
    expect(document.body).toBeDefined();
  });
});
