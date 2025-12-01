import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhpFormatter } from '../features/PhpFormatter';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('PhpFormatter', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <PhpFormatter />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
