import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { SeoManager } from '@/components/SeoManager';
import { ThemeProvider } from '@/contexts/ThemeProvider';

describe('SeoManager', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <SeoManager />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
