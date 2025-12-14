import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { CodeEditor } from '@/components/common/CodeEditor';
import { ThemeProvider } from '@/contexts/ThemeProvider';

describe('CodeEditor', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <CodeEditor 
            value="test" 
            onChange={vi.fn()} 
            language="javascript"
            placeholder="Enter code"
          />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
