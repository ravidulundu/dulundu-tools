import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { AiAssistant } from '@/features/AiAssistant';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('AiAssistant', () => {
  it('renders without crashing', () => {
    renderWithProviders(<AiAssistant />);
    expect(document.body).toBeDefined();
  });
});
