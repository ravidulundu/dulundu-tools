import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HtmlStripper } from '../features/HtmlStripper';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('HtmlStripper', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <HtmlStripper />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
