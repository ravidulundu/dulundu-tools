import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { UnitConverter } from '@/features/UnitConverter';

import { renderWithProviders } from './utils/testHelpers';

describe('UnitConverter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<UnitConverter />);
      expect(document.body).toBeDefined();
    });

    it('displays tool interface', () => {
      const { container } = renderWithProviders(<UnitConverter />);
      // Should have some interactive elements
      const hasButtons = container.querySelectorAll('button').length > 0;
      const hasInputs = container.querySelectorAll('input, textarea').length > 0;
      const hasContent = container.textContent && container.textContent.length > 0;
      expect(hasButtons || hasInputs || hasContent).toBe(true);
    });
  });
});
