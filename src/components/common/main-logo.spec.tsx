import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainLogo } from './main-logo';

describe('MainLogo', () => {
  it('renders without crashing', () => {
    render(<MainLogo />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toBeInTheDocument();
  });

  it('renders an SVG element', () => {
    render(<MainLogo />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo.tagName).toBe('svg');
  });

  it('applies small size dimensions by default (100x40)', () => {
    render(<MainLogo />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toHaveAttribute('width', '100');
    expect(logo).toHaveAttribute('height', '40');
  });

  it('applies regular size dimensions when specified (120x48)', () => {
    render(<MainLogo size="regular" />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toHaveAttribute('width', '120');
    expect(logo).toHaveAttribute('height', '48');
  });

  it('applies small size dimensions when explicitly specified', () => {
    render(<MainLogo size="small" />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toHaveAttribute('width', '100');
    expect(logo).toHaveAttribute('height', '40');
  });

  it('merges custom className when provided', () => {
    render(<MainLogo className="custom-class" />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toHaveClass('custom-class');
  });

  it('has accessible role and aria-label', () => {
    render(<MainLogo />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toHaveAttribute('role', 'img');
    expect(logo).toHaveAttribute('aria-label', 'Liberty logo');
  });

  it('maintains correct viewBox regardless of size', () => {
    const { rerender } = render(<MainLogo size="small" />);
    let logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toHaveAttribute('viewBox', '0 0 120 48');

    rerender(<MainLogo size="regular" />);
    logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toHaveAttribute('viewBox', '0 0 120 48');
  });
});
