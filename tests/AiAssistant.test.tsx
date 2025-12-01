import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AiAssistant } from '../features/AiAssistant';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('AiAssistant', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AiAssistant />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
