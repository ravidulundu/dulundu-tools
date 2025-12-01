import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollToTop } from '../components/ScrollToTop';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('ScrollToTop', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
