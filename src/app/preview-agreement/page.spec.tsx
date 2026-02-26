import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PreviewAgreementPage from './page';

describe('PreviewAgreementPage', () => {
  it('renders without crashing', () => {
    render(<PreviewAgreementPage />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('displays placeholder content', () => {
    render(<PreviewAgreementPage />);
    const placeholderText = screen.getByText(/Agreement preview — coming soon/i);
    expect(placeholderText).toBeInTheDocument();
  });

  it('has centered layout', () => {
    render(<PreviewAgreementPage />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex');
    expect(main).toHaveClass('min-h-screen');
    expect(main).toHaveClass('items-center');
    expect(main).toHaveClass('justify-center');
  });

  it('placeholder text has proper styling', () => {
    render(<PreviewAgreementPage />);
    const placeholderText = screen.getByText(/Agreement preview — coming soon/i);
    expect(placeholderText).toHaveClass('text-center');
    expect(placeholderText).toHaveClass('text-sm');
  });

  it('has semantic main element', () => {
    render(<PreviewAgreementPage />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main.tagName).toBe('MAIN');
  });
});
