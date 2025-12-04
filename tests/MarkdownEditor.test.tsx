import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { MarkdownEditor } from '@/features/MarkdownEditor';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('MarkdownEditor', () => {
  it('renders without crashing', () => {
    renderWithProviders(<MarkdownEditor />);
    expect(document.body).toBeDefined();
  });
});
