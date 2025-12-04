import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { CsvXmlConverter } from '@/features/CsvXmlConverter';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('CsvXmlConverter', () => {
  it('renders without crashing', () => {
    renderWithProviders(<CsvXmlConverter />);
    expect(document.body).toBeDefined();
  });
});
