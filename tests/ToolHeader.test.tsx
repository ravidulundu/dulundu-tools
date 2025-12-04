import { render } from '@testing-library/react';
import { Code } from 'lucide-react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ToolHeader } from '@/components/common/ToolHeader';
import { ThemeProvider } from '@/contexts/ThemeProvider';

describe('ToolHeader', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ToolHeader 
            title="Test Tool" 
            description="Test description"
            icon={Code}
          />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
