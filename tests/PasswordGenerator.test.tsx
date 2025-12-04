import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { PasswordGenerator } from '@/features/PasswordGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('PasswordGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<PasswordGenerator />);
    expect(document.body).toBeDefined();
  });
});
