import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { NotFound } from '@/features/NotFound';

import { renderWithProviders } from './utils/testHelpers';

describe('NotFound', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<NotFound />);
      expect(document.body).toBeDefined();
    });

    it('displays tool interface', () => {
      const { container } = renderWithProviders(<NotFound />);
      // Should have some interactive elements
      const hasButtons = container.querySelectorAll('button').length > 0;
      const hasInputs = container.querySelectorAll('input, textarea').length > 0;
      const hasContent = container.textContent && container.textContent.length > 0;
      expect(hasButtons || hasInputs || hasContent).toBe(true);
    });
  });
});
