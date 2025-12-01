import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TwitterCardGenerator } from '../features/TwitterCardGenerator';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('TwitterCardGenerator', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <TwitterCardGenerator />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
