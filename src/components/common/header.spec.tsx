import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header text="Test Header" />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders text from props', () => {
    render(<Header text="Confirm your details" />);
    const heading = screen.getByRole('heading', { name: 'Confirm your details' });
    expect(heading).toBeInTheDocument();
  });

  it('renders with different text', () => {
    render(<Header text="Welcome to Liberty" />);
    const heading = screen.getByRole('heading', { name: 'Welcome to Liberty' });
    expect(heading).toBeInTheDocument();
  });

  it('contains MainLogo component', () => {
    render(<Header text="Test" />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toBeInTheDocument();
  });

  it('MainLogo has small size', () => {
    render(<Header text="Test" />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toHaveAttribute('width', '100');
    expect(logo).toHaveAttribute('height', '40');
  });

  it('has semantic header element for accessibility', () => {
    render(<Header text="Test" />);
    const header = screen.getByRole('banner');
    expect(header.tagName).toBe('HEADER');
  });

  it('heading has correct text styling classes', () => {
    render(<Header text="Styled Text" />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-base');
    expect(heading).toHaveClass('font-bold');
    expect(heading).toHaveClass('text-white');
  });

  it('applies custom className', () => {
    render(<Header text="Custom" className="custom-header-class" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-header-class');
  });

  it('has flexbox layout classes', () => {
    render(<Header text="Layout Test" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('items-center');
    expect(header).toHaveClass('justify-between');
  });

  it('has full width', () => {
    render(<Header text="Width Test" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('w-full');
  });

  it('text is accessible and visible', () => {
    render(<Header text="Accessible Text" />);
    const heading = screen.getByRole('heading', { name: 'Accessible Text' });
    expect(heading).toBeVisible();
  });

  it('logo appears before text in DOM order', () => {
    render(<Header text="Order Test" />);
    const header = screen.getByRole('banner');
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    const heading = screen.getByRole('heading');
    
    expect(header.firstChild).toContainElement(logo);
    expect(header.lastChild).toContainElement(heading);
  });

  it('heading has correct semantic level (h1)', () => {
    render(<Header text="Heading Level" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
