import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { MetaTagGenerator } from '@/features/MetaTagGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('MetaTagGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<MetaTagGenerator />);
    expect(document.body).toBeDefined();
  });
});
