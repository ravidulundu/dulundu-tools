import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { TwitterCardGenerator } from '@/features/TwitterCardGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('TwitterCardGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<TwitterCardGenerator />);
    expect(document.body).toBeDefined();
  });
});
