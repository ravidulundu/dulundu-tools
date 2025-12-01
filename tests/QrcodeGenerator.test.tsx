import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QrcodeGenerator } from '../features/QrcodeGenerator';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('QrcodeGenerator', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <QrcodeGenerator />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
