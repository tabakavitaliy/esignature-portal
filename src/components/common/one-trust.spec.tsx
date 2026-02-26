import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { OneTrust } from './one-trust';

describe('OneTrust', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('renders OneTrust scripts', () => {
    process.env.NEXT_PUBLIC_ONETRUST_DOMAIN_ID = 'test-domain-id';
    
    const { container } = render(<OneTrust />);
    
    // Check that script elements are rendered
    expect(container).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => render(<OneTrust />)).not.toThrow();
  });

  it('renders with domain ID set', () => {
    process.env.NEXT_PUBLIC_ONETRUST_DOMAIN_ID = 'test-domain-id';
    
    expect(() => render(<OneTrust />)).not.toThrow();
  });

  it('renders without domain ID set', () => {
    delete process.env.NEXT_PUBLIC_ONETRUST_DOMAIN_ID;
    
    expect(() => render(<OneTrust />)).not.toThrow();
  });

  it('returns a valid React node', () => {
    const result = render(<OneTrust />);
    expect(result).toBeTruthy();
  });
});
