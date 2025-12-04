import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { MirrorOnline } from '@/features/MirrorOnline';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('MirrorOnline', () => {
  it('renders without crashing', () => {
    renderWithProviders(<MirrorOnline />);
    expect(document.body).toBeDefined();
  });
});
