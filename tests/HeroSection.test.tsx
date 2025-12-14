import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { HeroSection } from '@/components/home/HeroSection';
import { ThemeProvider } from '@/contexts/ThemeProvider';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('HeroSection', () => {
  it('renders without crashing', () => {
    renderWithProviders(<HeroSection />);
    expect(document.body).toBeDefined();
  });
});
