import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { GradientGenerator } from '@/features/GradientGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('GradientGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<GradientGenerator />);
    expect(document.body).toBeDefined();
  });
});
