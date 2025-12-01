import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LuaMinifier } from '../features/LuaMinifier';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('LuaMinifier', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <LuaMinifier />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
