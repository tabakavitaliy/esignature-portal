import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('renders without crashing', () => {
    const onChange = vi.fn();
    render(<Input label="Test Label" value="" onChange={onChange} />);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('renders with label text', () => {
    const onChange = vi.fn();
    render(<Input label="Email Address" value="" onChange={onChange} />);
    const label = screen.getByText('Email Address');
    expect(label).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    const onChange = vi.fn();
    render(<Input label="Email" placeholder="Enter your email" value="" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
  });

  it('uses default type="text" when not specified', () => {
    const onChange = vi.fn();
    render(<Input label="Username" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('accepts custom type prop', () => {
    const onChange = vi.fn();
    render(<Input label="Password" type="password" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('accepts email type', () => {
    const onChange = vi.fn();
    render(<Input label="Email" type="email" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('label is properly associated with input (accessibility)', () => {
    const onChange = vi.fn();
    render(<Input label="Full Name" value="" onChange={onChange} />);
    const label = screen.getByText('Full Name');
    const input = screen.getByLabelText('Full Name');
    
    expect(label).toHaveAttribute('for');
    expect(input).toHaveAttribute('id');
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });

  it('uses custom id when provided', () => {
    const onChange = vi.fn();
    render(<Input label="Custom ID" id="custom-input-id" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Custom ID');
    expect(input).toHaveAttribute('id', 'custom-input-id');
  });

  it('merges custom className to container', () => {
    const onChange = vi.fn();
    render(<Input label="Test" className="custom-container-class" value="" onChange={onChange} />);
    const container = screen.getByText('Test').parentElement;
    expect(container).toHaveClass('custom-container-class');
  });

  it('merges custom inputClassName to input element', () => {
    const onChange = vi.fn();
    render(<Input label="Test" inputClassName="custom-input-class" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveClass('custom-input-class');
  });

  it('has white label text styling', () => {
    const onChange = vi.fn();
    render(<Input label="Styled Label" value="" onChange={onChange} />);
    const label = screen.getByText('Styled Label');
    expect(label).toHaveClass('text-white');
  });

  it('has white background on input', () => {
    const onChange = vi.fn();
    render(<Input label="Styled Input" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Styled Input');
    expect(input).toHaveClass('bg-white');
  });

  it('renders with both placeholder and custom type', () => {
    const onChange = vi.fn();
    render(
      <Input 
        label="Password" 
        type="password" 
        placeholder="Enter password"
        value=""
        onChange={onChange}
      />
    );
    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toBeInTheDocument();
  });

  describe('mask', () => {
    it('formats input with digits-only mask', () => {
      const onChange = vi.fn();
      render(<Input label="Phone" mask="999-999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Phone') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '123456' } });
      expect(onChange).toHaveBeenCalledWith('123-456');
    });

    it('inserts literal characters automatically', () => {
      const onChange = vi.fn();
      render(<Input label="Phone" mask="(999) 999-9999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Phone') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '5551234567' } });
      expect(onChange).toHaveBeenCalledWith('(555) 123-4567');
    });

    it('rejects non-digit characters for digit mask positions', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'abc123xyz' } });
      expect(onChange).toHaveBeenCalledWith('123');
    });

    it('stops accepting input beyond mask length', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '123456789' } });
      expect(onChange).toHaveBeenCalledWith('123');
    });

    it('formats letter-only mask', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="aaa-aaa" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'ABCDEF' } });
      expect(onChange).toHaveBeenCalledWith('ABC-DEF');
    });

    it('rejects non-letter characters for letter mask positions', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="aaa" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '123ABC456' } });
      expect(onChange).toHaveBeenCalledWith('ABC');
    });

    it('formats alphanumeric mask', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="***-***" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'A1B2C3' } });
      expect(onChange).toHaveBeenCalledWith('A1B-2C3');
    });

    it('rejects special characters for alphanumeric mask positions', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="***" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'A@1#B$2' } });
      expect(onChange).toHaveBeenCalledWith('A1B');
    });

    it('formats date mask', () => {
      const onChange = vi.fn();
      render(<Input label="Date" mask="99/99/9999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Date') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '12252024' } });
      expect(onChange).toHaveBeenCalledWith('12/25/2024');
    });

    it('handles partial input correctly', () => {
      const onChange = vi.fn();
      render(<Input label="Phone" mask="(999) 999-9999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Phone') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '555' } });
      expect(onChange).toHaveBeenCalledWith('(555');
    });

    it('renders normally when mask is not provided', () => {
      const onChange = vi.fn();
      render(<Input label="Normal" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Normal') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'any text 123 !@#' } });
      expect(onChange).toHaveBeenCalledWith('any text 123 !@#');
    });

    it('starts with empty value when mask is provided', () => {
      const onChange = vi.fn();
      render(<Input label="Phone" mask="999-999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Phone') as HTMLInputElement;

      expect(input.value).toBe('');
    });
  });

  describe('controlled behavior', () => {
    it('calls onChange on mount when mask needs to be applied to initial value', () => {
      const onChange = vi.fn();
      render(<Input label="Phone" mask="999-999" value="123456" onChange={onChange} />);
      
      expect(onChange).toHaveBeenCalledWith('123-456');
    });

    it('calls onChange when value prop changes and needs masking', () => {
      const onChange = vi.fn();
      const { rerender } = render(<Input label="Phone" mask="999-999" value="" onChange={onChange} />);
      
      onChange.mockClear();
      rerender(<Input label="Phone" mask="999-999" value="789012" onChange={onChange} />);
      
      expect(onChange).toHaveBeenCalledWith('789-012');
    });

    it('does not call onChange when masked value matches current value', () => {
      const onChange = vi.fn();
      render(<Input label="Phone" mask="999-999" value="123-456" onChange={onChange} />);
      
      expect(onChange).not.toHaveBeenCalled();
    });

    it('calls onChange with raw value for non-masked inputs', () => {
      const onChange = vi.fn();
      render(<Input label="Name" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Name') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'John Doe' } });
      expect(onChange).toHaveBeenCalledWith('John Doe');
    });

    it('updates displayed value when value prop changes', () => {
      const onChange = vi.fn();
      const { rerender } = render(<Input label="Name" value="Initial" onChange={onChange} />);
      const input = screen.getByLabelText('Name') as HTMLInputElement;

      expect(input.value).toBe('Initial');

      rerender(<Input label="Name" value="Updated" onChange={onChange} />);
      expect(input.value).toBe('Updated');
    });

    it('applies mask to programmatically set values', () => {
      const onChange = vi.fn();
      const { rerender } = render(<Input label="Phone" mask="(999) 999-9999" value="" onChange={onChange} />);
      
      onChange.mockClear();
      rerender(<Input label="Phone" mask="(999) 999-9999" value="5551234567" onChange={onChange} />);
      
      expect(onChange).toHaveBeenCalledWith('(555) 123-4567');
    });

    it('displays the controlled value', () => {
      const onChange = vi.fn();
      render(<Input label="Phone" mask="999-999" value="123-456" onChange={onChange} />);
      const input = screen.getByLabelText('Phone') as HTMLInputElement;

      expect(input.value).toBe('123-456');
    });

    it('handles empty string value', () => {
      const onChange = vi.fn();
      render(<Input label="Phone" mask="999-999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Phone') as HTMLInputElement;

      expect(input.value).toBe('');
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
