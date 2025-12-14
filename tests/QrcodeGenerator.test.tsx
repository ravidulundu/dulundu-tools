import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { QrcodeGenerator } from '@/features/QrcodeGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('QrcodeGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<QrcodeGenerator />);
    expect(document.body).toBeDefined();
  });
});
