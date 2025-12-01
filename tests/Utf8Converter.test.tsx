import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Utf8Converter } from '../features/Utf8Converter';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('Utf8Converter', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Utf8Converter />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
