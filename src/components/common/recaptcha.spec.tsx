import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Recaptcha } from './recaptcha';

describe('Recaptcha', () => {
  it('renders without crashing', () => {
    render(<Recaptcha />);
    const logo = screen.getByRole('img', { name: /recaptcha logo/i });
    expect(logo).toBeInTheDocument();
  });

  it('displays reCAPTCHA text', () => {
    render(<Recaptcha />);
    const logo = screen.getByRole('img', { name: /recaptcha logo/i });
    expect(logo).toHaveAttribute('alt', 'reCAPTCHA');
  });

  it('displays "protected by reCAPTCHA" text', () => {
    render(<Recaptcha />);
    const text = screen.getByText('protected by reCAPTCHA');
    expect(text).toBeInTheDocument();
  });

  it('contains Privacy link with correct URL', () => {
    render(<Recaptcha />);
    const privacyLink = screen.getByRole('link', { name: /privacy/i });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute(
      'href',
      'https://policies.google.com/privacy'
    );
  });

  it('contains Terms link with correct URL', () => {
    render(<Recaptcha />);
    const termsLink = screen.getByRole('link', { name: /terms/i });
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute(
      'href',
      'https://policies.google.com/terms'
    );
  });

  it('opens Privacy link in new tab', () => {
    render(<Recaptcha />);
    const privacyLink = screen.getByRole('link', { name: /privacy/i });
    expect(privacyLink).toHaveAttribute('target', '_blank');
    expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('opens Terms link in new tab', () => {
    render(<Recaptcha />);
    const termsLink = screen.getByRole('link', { name: /terms/i });
    expect(termsLink).toHaveAttribute('target', '_blank');
    expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies custom className when provided', () => {
    const { container } = render(<Recaptcha className="custom-class" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('custom-class');
  });

  it('has accessible role and aria-label for logo', () => {
    render(<Recaptcha />);
    const logo = screen.getByRole('img', { name: /recaptcha logo/i });
    expect(logo).toHaveAttribute('role', 'img');
    expect(logo).toHaveAttribute('aria-label', 'reCAPTCHA logo');
  });

  it('renders image logo element', () => {
    render(<Recaptcha />);
    const logo = screen.getByRole('img', { name: /recaptcha logo/i });
    expect(logo.tagName).toBe('IMG');
  });

  it('has dark purple background styling', () => {
    const { container } = render(<Recaptcha />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-[var(--recaptcha-badge-bg)]');
  });

  it('has rounded corners', () => {
    const { container } = render(<Recaptcha />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('rounded-md');
  });

  it('displays separator between Privacy and Terms', () => {
    render(<Recaptcha />);
    const separator = screen.getByText('-');
    expect(separator).toBeInTheDocument();
  });
});
