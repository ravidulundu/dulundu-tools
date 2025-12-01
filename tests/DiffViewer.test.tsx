import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiffViewer } from '../features/DiffViewer';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('DiffViewer', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <DiffViewer />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
