import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { name: /esignature portal/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the welcome message', () => {
    render(<HomePage />);
    const message = screen.getByText(/welcome to the esignature portal/i);
    expect(message).toBeInTheDocument();
  });

  it('has proper semantic structure with main element', () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
