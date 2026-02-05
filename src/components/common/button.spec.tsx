import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button text="Click me" />);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('renders with text', () => {
    render(<Button text="Submit" />);
    const button = screen.getByText('Submit');
    expect(button).toBeInTheDocument();
  });

  it('renders with kind="primary" by default', () => {
    render(<Button text="Primary Button" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('text-[#3A238C]');
  });

  it('renders iconBefore when provided', () => {
    render(
      <Button 
        text="Back" 
        iconBefore={<ArrowLeft data-testid="icon-before" />} 
      />
    );
    const icon = screen.getByTestId('icon-before');
    expect(icon).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    const buttonText = screen.getByText('Back');
    
    // Check that icon appears before text in DOM order
    expect(button.firstChild).toContainElement(icon);
  });

  it('renders iconAfter when provided', () => {
    render(
      <Button 
        text="Next" 
        iconAfter={<ArrowRight data-testid="icon-after" />} 
      />
    );
    const icon = screen.getByTestId('icon-after');
    expect(icon).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    const buttonText = screen.getByText('Next');
    
    // Check that icon appears after text in DOM order
    expect(button.lastChild).toContainElement(icon);
  });

  it('renders both icons together', () => {
    render(
      <Button 
        text="Middle" 
        iconBefore={<ArrowLeft data-testid="icon-before" />}
        iconAfter={<ArrowRight data-testid="icon-after" />} 
      />
    );
    const iconBefore = screen.getByTestId('icon-before');
    const iconAfter = screen.getByTestId('icon-after');
    const text = screen.getByText('Middle');
    
    expect(iconBefore).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(iconAfter).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button text="Custom" className="custom-button-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button-class');
  });

  it('forwards type attribute', () => {
    render(<Button text="Submit Form" type="submit" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('forwards disabled attribute', () => {
    render(<Button text="Disabled" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('forwards onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button text="Click Handler" onClick={handleClick} />);
    const button = screen.getByRole('button');
    
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is focusable for accessibility', () => {
    render(<Button text="Focusable" />);
    const button = screen.getByRole('button');
    
    button.focus();
    expect(button).toHaveFocus();
  });

  it('has correct role for accessibility', () => {
    render(<Button text="Accessible Button" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has primary button styling', () => {
    render(<Button text="Styled Button" />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('text-[#3A238C]');
    expect(button).toHaveClass('rounded-xl');
    expect(button).toHaveClass('w-full');
  });

  it('applies disabled styling when disabled', () => {
    render(<Button text="Disabled Button" disabled />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  it('forwards aria-label for accessibility', () => {
    render(<Button text="Button" aria-label="Custom aria label" />);
    const button = screen.getByRole('button', { name: 'Custom aria label' });
    expect(button).toBeInTheDocument();
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button text="Disabled Click" onClick={handleClick} disabled />);
    const button = screen.getByRole('button');
    
    button.click();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
