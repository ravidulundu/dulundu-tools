import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { RsaGenerator } from '@/features/RsaGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('RsaGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<RsaGenerator />);
    expect(document.body).toBeDefined();
  });
});
