import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { LuaMinifier } from '@/features/LuaMinifier';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('LuaMinifier', () => {
  it('renders without crashing', () => {
    renderWithProviders(<LuaMinifier />);
    expect(document.body).toBeDefined();
  });
});
