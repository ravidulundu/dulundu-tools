import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SqlFormatter } from '../features/SqlFormatter';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('SqlFormatter', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <SqlFormatter />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
