import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HttpStatusCodes } from '../features/HttpStatusCodes';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('HttpStatusCodes', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <HttpStatusCodes />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
