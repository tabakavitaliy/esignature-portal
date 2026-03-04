import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClockIcon } from './clock-icon';

describe('ClockIcon', () => {
  it('renders without crashing', () => {
    render(<ClockIcon />);
    const icon = screen.getByRole('img', { name: 'Clock' });
    expect(icon).toBeInTheDocument();
  });

  it('renders an SVG element', () => {
    render(<ClockIcon />);
    const icon = screen.getByRole('img', { name: 'Clock' });
    expect(icon.tagName).toBe('svg');
  });

  it('applies default size of 44', () => {
    render(<ClockIcon />);
    const icon = screen.getByRole('img', { name: 'Clock' });
    expect(icon).toHaveAttribute('width', '44');
    expect(icon).toHaveAttribute('height', '44');
  });

  it('applies custom size when specified', () => {
    render(<ClockIcon size={48} />);
    const icon = screen.getByRole('img', { name: 'Clock' });
    expect(icon).toHaveAttribute('width', '48');
    expect(icon).toHaveAttribute('height', '48');
  });

  it('applies default stroke color via CSS variable', () => {
    render(<ClockIcon />);
    const icon = screen.getByRole('img', { name: 'Clock' });
    const path = icon.querySelector('path');
    expect(path).toHaveAttribute('stroke', 'var(--brand-primary)');
  });

  it('applies custom stroke color when specified', () => {
    render(<ClockIcon stroke="#ffffff" />);
    const icon = screen.getByRole('img', { name: 'Clock' });
    const path = icon.querySelector('path');
    expect(path).toHaveAttribute('stroke', '#ffffff');
  });

  it('merges custom className to container div', () => {
    render(<ClockIcon className="custom-class" />);
    const container = screen.getByRole('img', { name: 'Clock' }).parentElement;
    expect(container).toHaveClass('custom-class');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });

  it('has accessible role and aria-label', () => {
    render(<ClockIcon />);
    const icon = screen.getByRole('img', { name: 'Clock' });
    expect(icon).toHaveAttribute('role', 'img');
    expect(icon).toHaveAttribute('aria-label', 'Clock');
  });

  it('maintains correct viewBox regardless of size', () => {
    const { rerender } = render(<ClockIcon size={32} />);
    let icon = screen.getByRole('img', { name: 'Clock' });
    expect(icon).toHaveAttribute('viewBox', '0 0 44 44');

    rerender(<ClockIcon size={64} />);
    icon = screen.getByRole('img', { name: 'Clock' });
    expect(icon).toHaveAttribute('viewBox', '0 0 44 44');
  });

  it('applies size to both container and svg element', () => {
    const { container } = render(<ClockIcon size={60} />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveStyle({ width: '60px', height: '60px' });

    const icon = screen.getByRole('img', { name: 'Clock' });
    expect(icon).toHaveAttribute('width', '60');
    expect(icon).toHaveAttribute('height', '60');
  });

  it('renders path with correct stroke attributes', () => {
    render(<ClockIcon />);
    const icon = screen.getByRole('img', { name: 'Clock' });
    const path = icon.querySelector('path');

    expect(path).toHaveAttribute('stroke-width', '4');
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
  });
});
