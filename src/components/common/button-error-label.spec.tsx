import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ButtonErrorLabel } from './button-error-label';

describe('ButtonErrorLabel', () => {
  it('renders without crashing', () => {
    render(<ButtonErrorLabel message="Error message" />);
    const label = screen.getByText('Error message');
    expect(label).toBeInTheDocument();
  });

  it('renders with message text', () => {
    render(<ButtonErrorLabel message="Invalid input" />);
    const label = screen.getByText('Invalid input');
    expect(label).toBeInTheDocument();
  });

  it('applies correct text size styling', () => {
    render(<ButtonErrorLabel message="Error" />);
    const label = screen.getByText('Error');
    expect(label).toHaveClass('text-xs');
  });

  it('applies error color styling', () => {
    render(<ButtonErrorLabel message="Error" />);
    const label = screen.getByText('Error');
    expect(label).toHaveClass('text-[hsl(var(--button-error))]');
  });

  it('applies margin top spacing', () => {
    render(<ButtonErrorLabel message="Error" />);
    const label = screen.getByText('Error');
    expect(label).toHaveClass('mt-2');
  });

  it('applies block display', () => {
    render(<ButtonErrorLabel message="Error" />);
    const label = screen.getByText('Error');
    expect(label).toHaveClass('block');
  });

  it('accepts custom className', () => {
    render(<ButtonErrorLabel message="Error" className="custom-class" />);
    const label = screen.getByText('Error');
    expect(label).toHaveClass('custom-class');
  });

  it('has role="alert" for accessibility', () => {
    render(<ButtonErrorLabel message="Error" />);
    const label = screen.getByRole('alert');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Error');
  });

  it('has aria-live="polite" for screen readers', () => {
    render(<ButtonErrorLabel message="Error" />);
    const label = screen.getByText('Error');
    expect(label).toHaveAttribute('aria-live', 'polite');
  });

  it('accepts optional id prop', () => {
    render(<ButtonErrorLabel message="Error" id="error-1" />);
    const label = screen.getByText('Error');
    expect(label).toHaveAttribute('id', 'error-1');
  });

  it('can be linked via aria-describedby', () => {
    render(
      <div>
        <button aria-describedby="button-error">Submit</button>
        <ButtonErrorLabel message="Invalid submission" id="button-error" />
      </div>
    );
    const button = screen.getByRole('button');
    const label = screen.getByText('Invalid submission');
    
    expect(button).toHaveAttribute('aria-describedby', 'button-error');
    expect(label).toHaveAttribute('id', 'button-error');
  });

  it('returns null when message is empty string', () => {
    const { container } = render(<ButtonErrorLabel message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders span element', () => {
    render(<ButtonErrorLabel message="Error" />);
    const label = screen.getByText('Error');
    expect(label.tagName).toBe('SPAN');
  });

  it('preserves custom className with default classes', () => {
    render(<ButtonErrorLabel message="Error" className="ml-4" />);
    const label = screen.getByText('Error');
    expect(label).toHaveClass('text-xs');
    expect(label).toHaveClass('mt-2');
    expect(label).toHaveClass('ml-4');
  });

  it('handles long error messages', () => {
    const longMessage = 'This is a very long error message that should still render correctly without any issues';
    render(<ButtonErrorLabel message={longMessage} />);
    const label = screen.getByText(longMessage);
    expect(label).toBeInTheDocument();
  });

  it('handles special characters in message', () => {
    const specialMessage = 'Error: Invalid format! Please use XXXX-XXXX-XXXX-XXXX';
    render(<ButtonErrorLabel message={specialMessage} />);
    const label = screen.getByText(specialMessage);
    expect(label).toBeInTheDocument();
  });
});
