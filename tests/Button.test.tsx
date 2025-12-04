import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { Button } from '@/components/common/Button';
import { ThemeProvider } from '@/contexts/ThemeProvider';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('Button', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Button />);
    expect(document.body).toBeDefined();
  });
});
