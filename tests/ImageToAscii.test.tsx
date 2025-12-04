import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ImageToAscii } from '@/features/ImageToAscii';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('ImageToAscii', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ImageToAscii />);
    expect(document.body).toBeDefined();
  });
});
