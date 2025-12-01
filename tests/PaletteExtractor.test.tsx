import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaletteExtractor } from '../features/PaletteExtractor';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('PaletteExtractor', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <PaletteExtractor />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
