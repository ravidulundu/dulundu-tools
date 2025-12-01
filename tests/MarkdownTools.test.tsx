import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownTools } from '../features/MarkdownTools';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('MarkdownTools', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MarkdownTools />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
