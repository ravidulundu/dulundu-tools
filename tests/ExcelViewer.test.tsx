import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExcelViewer } from '../features/ExcelViewer';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('ExcelViewer', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ExcelViewer />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
