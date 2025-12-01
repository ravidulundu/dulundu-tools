import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HtmlEditor } from '../features/HtmlEditor';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('HtmlEditor', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <HtmlEditor />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
