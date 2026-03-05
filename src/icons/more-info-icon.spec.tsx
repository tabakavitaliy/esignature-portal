import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MoreInfoIcon } from './more-info-icon';

describe('MoreInfoIcon', () => {
  it('renders without crashing', () => {
    render(<MoreInfoIcon />);
    const icon = screen.getByRole('img', { name: 'More options' });
    expect(icon).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<MoreInfoIcon />);
    const icon = screen.getByRole('img', { name: 'More options' });
    expect(icon).toHaveAttribute('aria-label', 'More options');
  });

  it('applies custom className', () => {
    const { container } = render(<MoreInfoIcon className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('uses default size of 13', () => {
    const { container } = render(<MoreInfoIcon />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: '13px', height: '13px' });
  });

  it('applies custom size', () => {
    const { container } = render(<MoreInfoIcon size={20} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: '20px', height: '20px' });
  });

  it('renders SVG element', () => {
    const { container } = render(<MoreInfoIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 3 13');
  });

  it('centers icon with flex layout', () => {
    const { container } = render(<MoreInfoIcon />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('items-center');
    expect(wrapper).toHaveClass('justify-center');
  });
});
