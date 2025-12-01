import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Analytics } from '../components/Analytics';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('Analytics', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Analytics />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
