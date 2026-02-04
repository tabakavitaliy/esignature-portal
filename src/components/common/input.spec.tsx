import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input label="Test Label" />);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('renders with label text', () => {
    render(<Input label="Email Address" />);
    const label = screen.getByText('Email Address');
    expect(label).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input label="Email" placeholder="Enter your email" />);
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
  });

  it('uses default type="text" when not specified', () => {
    render(<Input label="Username" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('accepts custom type prop', () => {
    render(<Input label="Password" type="password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('accepts email type', () => {
    render(<Input label="Email" type="email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('label is properly associated with input (accessibility)', () => {
    render(<Input label="Full Name" />);
    const label = screen.getByText('Full Name');
    const input = screen.getByLabelText('Full Name');
    
    expect(label).toHaveAttribute('for');
    expect(input).toHaveAttribute('id');
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });

  it('uses custom id when provided', () => {
    render(<Input label="Custom ID" id="custom-input-id" />);
    const input = screen.getByLabelText('Custom ID');
    expect(input).toHaveAttribute('id', 'custom-input-id');
  });

  it('merges custom className to container', () => {
    render(<Input label="Test" className="custom-container-class" />);
    const container = screen.getByText('Test').parentElement;
    expect(container).toHaveClass('custom-container-class');
  });

  it('merges custom inputClassName to input element', () => {
    render(<Input label="Test" inputClassName="custom-input-class" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveClass('custom-input-class');
  });

  it('has white label text styling', () => {
    render(<Input label="Styled Label" />);
    const label = screen.getByText('Styled Label');
    expect(label).toHaveClass('text-white');
  });

  it('has white background on input', () => {
    render(<Input label="Styled Input" />);
    const input = screen.getByLabelText('Styled Input');
    expect(input).toHaveClass('bg-white');
  });

  it('renders with both placeholder and custom type', () => {
    render(
      <Input 
        label="Password" 
        type="password" 
        placeholder="Enter password" 
      />
    );
    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toBeInTheDocument();
  });
});
