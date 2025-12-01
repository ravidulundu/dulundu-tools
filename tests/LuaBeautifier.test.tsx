import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LuaBeautifier } from '../features/LuaBeautifier';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('LuaBeautifier', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <LuaBeautifier />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
