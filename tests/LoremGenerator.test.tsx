import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { LoremGenerator } from '@/features/LoremGenerator';

import { renderWithProviders } from './utils/testHelpers';

describe('LoremGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<LoremGenerator />);
      expect(document.body).toBeDefined();
    });
  });

  describe('Functional Tests', () => {
    it('output contains expected value (case 1)', async () => {
      const { container } = renderWithProviders(<LoremGenerator />);
      const user = userEvent.setup();

      

      await waitFor(() => {
        expect(container.textContent?.toLowerCase()).toContain('lorem');
      }, { timeout: 3000 });
    });

  });
});
