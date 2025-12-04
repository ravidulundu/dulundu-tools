import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Loading } from '@/components/Loading';

describe('Loading', () => {
  it('renders without crashing', () => {
    render(<Loading />);
    expect(document.body).toBeDefined();
  });
});
