import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EscapeTools } from '../features/EscapeTools';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('EscapeTools', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <EscapeTools />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
