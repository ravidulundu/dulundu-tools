import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetaTagGenerator } from '../features/MetaTagGenerator';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('MetaTagGenerator', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MetaTagGenerator />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
