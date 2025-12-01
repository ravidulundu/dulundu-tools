import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoanCalculator } from '../features/LoanCalculator';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('LoanCalculator', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <LoanCalculator />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
