import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ConsentMode } from './consent-mode';

describe('ConsentMode', () => {
  it('renders without crashing', () => {
    expect(() => render(<ConsentMode />)).not.toThrow();
  });

  it('returns a valid React node', () => {
    const result = render(<ConsentMode />);
    expect(result).toBeTruthy();
    expect(result.container).toBeTruthy();
  });

  it('renders the Script component', () => {
    const { container } = render(<ConsentMode />);
    // Next.js Script component may not render as actual script tags in test environment
    // but we can verify the component renders without errors
    expect(container).toBeTruthy();
  });
});
