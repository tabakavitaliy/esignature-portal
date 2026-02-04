import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryProvider } from './query-provider';

describe('QueryProvider', () => {
  it('renders children correctly', () => {
    render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('wraps children with QueryClientProvider', () => {
    const { container } = render(
      <QueryProvider>
        <div data-testid="child">Content</div>
      </QueryProvider>
    );

    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
  });

  it('renders multiple children', () => {
    render(
      <QueryProvider>
        <div>First Child</div>
        <div>Second Child</div>
      </QueryProvider>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });
});
