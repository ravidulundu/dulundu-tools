import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { RandomGenerator } from '@/features/RandomGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('RandomGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<RandomGenerator />);
    expect(document.body).toBeDefined();
  });
});
