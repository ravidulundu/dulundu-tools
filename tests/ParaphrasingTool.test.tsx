import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ParaphrasingTool } from '@/features/ParaphrasingTool';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('ParaphrasingTool', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ParaphrasingTool />);
    expect(document.body).toBeDefined();
  });
});
