import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { CategoryCard } from '@/components/CategoryCard';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ToolCategory } from '@/types';

describe('CategoryCard', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <CategoryCard category={ToolCategory.CONVERTERS} />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
