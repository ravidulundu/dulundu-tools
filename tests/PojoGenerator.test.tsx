import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { PojoGenerator } from '@/features/PojoGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('PojoGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<PojoGenerator />);
    expect(document.body).toBeDefined();
  });
});
