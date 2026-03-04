import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingModal } from './loading-modal';

describe('LoadingModal', () => {
  describe('rendering', () => {
    it('should render the dialog when isOpen is true', () => {
      render(<LoadingModal isOpen={true} message="Loading..." />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<LoadingModal isOpen={false} message="Loading..." />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display the provided message', () => {
      render(<LoadingModal isOpen={true} message="Saving your details, please wait..." />);

      expect(screen.getByText('Saving your details, please wait...')).toBeInTheDocument();
    });

    it('should display a different message when a different message prop is given', () => {
      render(<LoadingModal isOpen={true} message="Submitting your information, please wait..." />);

      expect(screen.getByText('Submitting your information, please wait...')).toBeInTheDocument();
    });

    it('should render the spinner element', () => {
      const { container } = render(<LoadingModal isOpen={true} message="Loading..." />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render the backdrop overlay', () => {
      const { container } = render(<LoadingModal isOpen={true} message="Loading..." />);

      const overlay = container.querySelector('.backdrop-blur-\\[4px\\]');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have aria-modal set to true', () => {
      render(<LoadingModal isOpen={true} message="Loading..." />);

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-label set to "Loading"', () => {
      render(<LoadingModal isOpen={true} message="Loading..." />);

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Loading');
    });

    it('should have aria-live set to polite', () => {
      render(<LoadingModal isOpen={true} message="Loading..." />);

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-live', 'polite');
    });

    it('should render at z-index 50 to appear above all page content', () => {
      const { container } = render(<LoadingModal isOpen={true} message="Loading..." />);

      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveClass('z-50');
    });
  });

  describe('open/close behaviour', () => {
    it('should show content when toggled from closed to open', () => {
      const { rerender } = render(<LoadingModal isOpen={false} message="Loading..." />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(<LoadingModal isOpen={true} message="Loading..." />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should hide content when toggled from open to closed', () => {
      const { rerender } = render(<LoadingModal isOpen={true} message="Loading..." />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      rerender(<LoadingModal isOpen={false} message="Loading..." />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should update message text when message prop changes', () => {
      const { rerender } = render(<LoadingModal isOpen={true} message="First message" />);
      expect(screen.getByText('First message')).toBeInTheDocument();

      rerender(<LoadingModal isOpen={true} message="Second message" />);
      expect(screen.getByText('Second message')).toBeInTheDocument();
      expect(screen.queryByText('First message')).not.toBeInTheDocument();
    });
  });
});
