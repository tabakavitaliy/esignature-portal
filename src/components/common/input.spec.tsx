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

    it('handles alphanumeric mask with non-matching characters', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="***" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      // Test the else branch in alphanumeric mask (lines 72-73)
      fireEvent.change(input, { target: { value: '@#$' } });
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('handles literal mask character matching value character', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="A-B" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      // Test line 79: when valueChar matches maskChar
      fireEvent.change(input, { target: { value: 'A' } });
      expect(onChange).toHaveBeenCalledWith('A');
    });

    it('handles empty mask string by passing through value', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      // When mask is empty, the loop breaks immediately (line 35: when maskChar is falsy)
      // So the value passes through without masking
      fireEvent.change(input, { target: { value: 'ABC' } });
      expect(onChange).toHaveBeenCalledWith('ABC');
    });

    it('handles value shorter than mask', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="999-999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      // Test line 45: when valueChar is falsy (value runs out)
      fireEvent.change(input, { target: { value: '12' } });
      expect(onChange).toHaveBeenCalledWith('12');
    });

    it('handles mask with undefined maskChar (line 35)', () => {
      const onChange = vi.fn();
      // Create a scenario where maskChar could be undefined
      // This tests the break condition on line 35
      render(<Input label="Code" mask="9" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      // When mask length is reached, loop should break
      fireEvent.change(input, { target: { value: '123' } });
      expect(onChange).toHaveBeenCalledWith('1');
    });

    it('handles alphanumeric mask with completely non-matching input', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="***" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      // Test lines 72-73: alphanumeric mask when character doesn't match
      // All characters are non-alphanumeric, so valueIndex increments but nothing is added
      fireEvent.change(input, { target: { value: '@#$%' } });
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('handles value running out during mask processing (line 45)', () => {
      const onChange = vi.fn();
      render(<Input label="Code" mask="999-999-999" value="" onChange={onChange} />);
      const input = screen.getByLabelText('Code') as HTMLInputElement;

      // Test line 45: when valueIndex >= value.length, valueChar is undefined
      // Input only 2 digits but mask expects more
      fireEvent.change(input, { target: { value: '12' } });
      expect(onChange).toHaveBeenCalledWith('12');
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

    describe('restricted characters', () => {
      it('strips lowercase restricted characters (l, o, i) from masked input', () => {
        const onChange = vi.fn();
        render(<Input label="Code" mask="***-***" value="" onChange={onChange} />);
        const input = screen.getByLabelText('Code') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'alobicdef' } });
        // 'l', 'o', 'i' should be stripped, leaving 'ABCDEF'
        expect(onChange).toHaveBeenCalledWith('ABC-DEF');
      });

      it('strips uppercase restricted characters (L, O, I) from masked input', () => {
        const onChange = vi.fn();
        render(<Input label="Code" mask="***-***" value="" onChange={onChange} />);
        const input = screen.getByLabelText('Code') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'ALOBICDEF' } });
        // 'L', 'O', 'I' should be stripped, leaving 'ABCDEF'
        expect(onChange).toHaveBeenCalledWith('ABC-DEF');
      });

      it('keeps valid characters when mixed with restricted ones', () => {
        const onChange = vi.fn();
        render(<Input label="VIN" mask="*********" value="" onChange={onChange} />);
        const input = screen.getByLabelText('VIN') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '1A2bLoI3c4O5' } });
        // Should strip 'L', 'o', 'I', 'O' and keep '1A2b3c45' -> '1A2B3C45'
        expect(onChange).toHaveBeenCalledWith('1A2B3C45');
      });

      it('strips restricted characters from programmatically set value (useEffect path)', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Input label="Code" mask="***-***" value="" onChange={onChange} />);
        
        onChange.mockClear();
        // Programmatically set value with restricted chars
        rerender(<Input label="Code" mask="***-***" value="ALOBICDEF" onChange={onChange} />);
        
        // Should strip 'L', 'O', 'I' leaving 'ABCDEF' -> 'ABC-DEF'
        expect(onChange).toHaveBeenCalledWith('ABC-DEF');
      });

      it('does not affect non-masked input (no false positives)', () => {
        const onChange = vi.fn();
        render(<Input label="Name" value="" onChange={onChange} />);
        const input = screen.getByLabelText('Name') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'Olivia' } });
        // Non-masked input should keep 'o', 'i', 'l' characters
        expect(onChange).toHaveBeenCalledWith('Olivia');
      });

      it('strips all restricted characters from alphanumeric mask', () => {
        const onChange = vi.fn();
        render(<Input label="Code" mask="999-***" value="" onChange={onChange} />);
        const input = screen.getByLabelText('Code') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '123loiABC' } });
        // Should strip 'l', 'o', 'i' leaving '123ABC'
        expect(onChange).toHaveBeenCalledWith('123-ABC');
      });

      it('handles input with only restricted characters', () => {
        const onChange = vi.fn();
        render(<Input label="Code" mask="***" value="" onChange={onChange} />);
        const input = screen.getByLabelText('Code') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'loiLOI' } });
        // All characters are restricted, should result in empty string
        expect(onChange).toHaveBeenCalledWith('');
      });
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
