import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParaphrasingTool } from '../features/ParaphrasingTool';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('ParaphrasingTool', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ParaphrasingTool />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
