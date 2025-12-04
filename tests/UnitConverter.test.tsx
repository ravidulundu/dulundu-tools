import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { UnitConverter } from '@/features/UnitConverter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('UnitConverter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<UnitConverter />);
    expect(document.body).toBeDefined();
  });
});
