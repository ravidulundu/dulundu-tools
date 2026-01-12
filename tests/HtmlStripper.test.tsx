import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { HtmlStripper } from '@/features/HtmlStripper';

import { renderWithProviders } from './utils/testHelpers';

describe('HtmlStripper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<HtmlStripper />);
      expect(document.body).toBeDefined();
    });
  });

  describe('Functional Tests', () => {
    it('output contains expected value (case 1)', async () => {
      const { container } = renderWithProviders(<HtmlStripper />);
      const user = userEvent.setup();

      
      const textarea = container.querySelector('textarea');
      const input = container.querySelector('input[type="text"]');
      const inputElement = textarea || input;

      if (inputElement) {
        await user.clear(inputElement);
        await user.type(inputElement, '<p>Hello</p>');
      }
      

      await waitFor(() => {
        expect(container.textContent?.toLowerCase()).toContain('hello');
      }, { timeout: 3000 });
    });

  });
});
