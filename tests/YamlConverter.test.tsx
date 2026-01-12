import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { YamlConverter } from '@/features/YamlConverter';

import { renderWithProviders } from './utils/testHelpers';

describe('YamlConverter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<YamlConverter />);
      expect(document.body).toBeDefined();
    });

    it('displays tool interface', () => {
      const { container } = renderWithProviders(<YamlConverter />);
      // Should have some interactive elements
      const hasButtons = container.querySelectorAll('button').length > 0;
      const hasInputs = container.querySelectorAll('input, textarea').length > 0;
      const hasContent = container.textContent && container.textContent.length > 0;
      expect(hasButtons || hasInputs || hasContent).toBe(true);
    });
  });
});
