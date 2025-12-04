import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import MegaMenu from '@/components/MegaMenu';
import { ThemeProvider } from '@/contexts/ThemeProvider';

describe('MegaMenu', () => {
  it('renders without crashing when open', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MegaMenu isOpen={true} onClose={vi.fn()} />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
