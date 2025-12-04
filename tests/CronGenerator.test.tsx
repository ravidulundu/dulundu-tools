import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { CronGenerator } from '@/features/CronGenerator';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('CronGenerator', () => {
  it('renders without crashing', () => {
    renderWithProviders(<CronGenerator />);
    expect(document.body).toBeDefined();
  });
});
