import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CsvToExcel } from '../features/CsvToExcel';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('CsvToExcel', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <CsvToExcel />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
