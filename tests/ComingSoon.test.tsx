import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComingSoon } from '../features/ComingSoon';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('ComingSoon', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ComingSoon />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
