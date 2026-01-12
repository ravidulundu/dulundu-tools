import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SlugGenerator } from '@/features/SlugGenerator';

import { renderWithProviders } from './utils/testHelpers';

describe('SlugGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<SlugGenerator />);
      expect(document.body).toBeDefined();
    });
  });

  describe('Functional Tests', () => {
    it('output contains expected value (case 1)', async () => {
      const { container } = renderWithProviders(<SlugGenerator />);
      const user = userEvent.setup();

      
      const textarea = container.querySelector('textarea');
      const input = container.querySelector('input[type="text"]');
      const inputElement = textarea || input;

      if (inputElement) {
        await user.clear(inputElement);
        await user.type(inputElement, 'Hello World');
      }
      

      await waitFor(() => {
        expect(container.textContent?.toLowerCase()).toContain('hello');
      }, { timeout: 3000 });
    });

  });
});
