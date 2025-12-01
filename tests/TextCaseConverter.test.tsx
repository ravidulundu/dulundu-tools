import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextCaseConverter } from '../features/TextCaseConverter';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('TextCaseConverter', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <TextCaseConverter />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
