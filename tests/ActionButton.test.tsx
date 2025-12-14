import { render } from '@testing-library/react';
import { Copy } from 'lucide-react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { ActionButton } from '@/components/common/ActionButton';
import { ThemeProvider } from '@/contexts/ThemeProvider';

describe('ActionButton', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <ActionButton onClick={vi.fn()} icon={Copy} title="Copy" />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
