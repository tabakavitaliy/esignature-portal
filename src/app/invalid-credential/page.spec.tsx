import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import InvalidCredential from './page';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe('InvalidCredential page', () => {
  it('renders InvalidCredentialPage component', () => {
    const { container } = render(<InvalidCredential />);
    expect(container).toBeTruthy();
  });
});
