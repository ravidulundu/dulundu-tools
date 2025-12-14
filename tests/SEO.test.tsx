import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { SEO } from '@/components/SEO';
import { ThemeProvider } from '@/contexts/ThemeProvider';

describe('SEO', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <SEO title="Test" description="Test description" />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
