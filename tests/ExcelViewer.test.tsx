import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ExcelViewer } from '@/features/ExcelViewer';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('ExcelViewer', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ExcelViewer />);
    expect(document.body).toBeDefined();
  });
});
