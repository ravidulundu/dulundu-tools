import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CsvXmlConverter } from '../features/CsvXmlConverter';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('CsvXmlConverter', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <CsvXmlConverter />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
