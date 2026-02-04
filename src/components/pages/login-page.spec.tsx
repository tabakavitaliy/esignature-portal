import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoginPage } from './login-page';
import translations from '@/i18n/en.json';

describe('LoginPage', () => {
  const { loginPage: t } = translations;

  it('renders without crashing', () => {
    render(<LoginPage />);
    const heading = screen.getByText(t.signaturePortal);
    expect(heading).toBeInTheDocument();
  });

  it('displays the logo', () => {
    render(<LoginPage />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toBeInTheDocument();
  });

  it('shows Signature Portal heading', () => {
    render(<LoginPage />);
    const heading = screen.getByRole('heading', { name: t.signaturePortal });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('shows powered by text', () => {
    render(<LoginPage />);
    const poweredBy = screen.getByText(t.poweredBy);
    expect(poweredBy).toBeInTheDocument();
  });

  it('displays welcome message', () => {
    render(<LoginPage />);
    const welcomeMessage = screen.getByText(t.welcomeMessage);
    expect(welcomeMessage).toBeInTheDocument();
  });

  it('displays credential hint', () => {
    render(<LoginPage />);
    const credentialHint = screen.getByText(t.credentialHint);
    expect(credentialHint).toBeInTheDocument();
  });

  it('renders input with correct label', () => {
    render(<LoginPage />);
    const input = screen.getByLabelText(t.credentialLabel);
    expect(input).toBeInTheDocument();
  });

  it('renders input with correct placeholder', () => {
    render(<LoginPage />);
    const input = screen.getByPlaceholderText(t.credentialPlaceholder);
    expect(input).toBeInTheDocument();
  });

  it('input has text type', () => {
    render(<LoginPage />);
    const input = screen.getByLabelText(t.credentialLabel);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('has gradient background styling', () => {
    const { container } = render(<LoginPage />);
    const main = container.querySelector('main');
    expect(main).toHaveClass('bg-gradient-to-b');
  });

  it('has full-screen height', () => {
    const { container } = render(<LoginPage />);
    const main = container.querySelector('main');
    expect(main).toHaveClass('min-h-screen');
  });

  it('heading has white text', () => {
    render(<LoginPage />);
    const heading = screen.getByRole('heading', { name: t.signaturePortal });
    expect(heading).toHaveClass('text-white');
  });
});
