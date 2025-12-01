import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MirrorOnline } from '../features/MirrorOnline';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('MirrorOnline', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MirrorOnline />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
