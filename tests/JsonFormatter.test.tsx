import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JsonFormatter } from '../features/JsonFormatter';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('JsonFormatter', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <JsonFormatter />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
