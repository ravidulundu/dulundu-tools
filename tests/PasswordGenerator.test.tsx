import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordGenerator } from '../features/PasswordGenerator';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('PasswordGenerator', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <PasswordGenerator />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
