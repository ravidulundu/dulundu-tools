import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageToAscii } from '../features/ImageToAscii';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('ImageToAscii', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ImageToAscii />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
