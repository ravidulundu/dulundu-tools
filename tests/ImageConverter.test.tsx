import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ImageConverter } from '@/features/ImageConverter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('ImageConverter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ImageConverter />);
    expect(document.body).toBeDefined();
  });
});
