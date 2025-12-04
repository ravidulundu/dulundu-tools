import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { PrivacyPolicy } from '@/features/PrivacyPolicy';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('PrivacyPolicy', () => {
  it('renders without crashing', () => {
    renderWithProviders(<PrivacyPolicy />);
    expect(document.body).toBeDefined();
  });
});
