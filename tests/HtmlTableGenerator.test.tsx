import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HtmlTableGenerator } from '../features/HtmlTableGenerator';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('HtmlTableGenerator', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <HtmlTableGenerator />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
