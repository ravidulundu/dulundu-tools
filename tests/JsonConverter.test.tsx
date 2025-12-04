import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { JsonConverter } from '@/features/JsonConverter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('JsonConverter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<JsonConverter />);
    expect(document.body).toBeDefined();
  });
});
