import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ListComparator } from '@/features/ListComparator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('ListComparator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ListComparator />);
    expect(document.body).toBeDefined();
  });
});
