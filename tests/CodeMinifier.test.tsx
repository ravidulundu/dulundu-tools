import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeMinifier } from '../features/CodeMinifier';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('CodeMinifier', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <CodeMinifier />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
