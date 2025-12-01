import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JwtDecoder } from '../features/JwtDecoder';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('JwtDecoder', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <JwtDecoder />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
