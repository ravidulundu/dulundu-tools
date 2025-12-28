import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Base64Converter } from '@/features/Base64Converter';

import { renderWithProviders } from './utils/testHelpers';

describe('Base64Converter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<Base64Converter />);
      expect(document.body).toBeDefined();
    });
  });

  describe('Functional Tests', () => {
    it('output contains expected value (case 1)', async () => {
      const { container } = renderWithProviders(<Base64Converter />);
      const user = userEvent.setup();

      
      const textarea = container.querySelector('textarea');
      const input = container.querySelector('input[type="text"]');
      const inputElement = textarea || input;

      if (inputElement) {
        await user.clear(inputElement);
        await user.type(inputElement, 'Hello');
      }
      

      await waitFor(() => {
        expect(container.textContent?.toLowerCase()).toContain('sgvsbg8=');
      }, { timeout: 3000 });
    });

  });
});
