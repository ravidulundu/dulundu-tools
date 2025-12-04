import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { CsvToExcel } from '@/features/CsvToExcel';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('CsvToExcel', () => {
  it('renders without crashing', () => {
    renderWithProviders(<CsvToExcel />);
    expect(document.body).toBeDefined();
  });
});
