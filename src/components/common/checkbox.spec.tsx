import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders without crashing', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Test Label" value={false} onChange={onChange} />);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('renders label text', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Accept terms" value={false} onChange={onChange} />);
    const label = screen.getByText('Accept terms');
    expect(label).toBeInTheDocument();
  });

  it('label is associated with checkbox (accessibility)', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Agree" value={false} onChange={onChange} />);
    const label = screen.getByText('Agree');
    const checkbox = screen.getByRole('checkbox');
    
    expect(label).toHaveAttribute('for');
    expect(checkbox).toHaveAttribute('id');
    expect(label.getAttribute('for')).toBe(checkbox.getAttribute('id'));
  });

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Click me" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('reflects value={true} as checked state', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Checked" value={true} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('reflects value={false} as unchecked state', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Unchecked" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('applies custom className to container', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Checkbox 
        label="Custom" 
        value={false} 
        onChange={onChange} 
        className="custom-container-class" 
      />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-container-class');
  });

  it('uses custom id when provided', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Custom ID" id="custom-checkbox-id" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'custom-checkbox-id');
  });

  it('is keyboard accessible (Space key toggles)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Keyboard" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    checkbox.focus();
    expect(checkbox).toHaveFocus();
    
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('has correct role="checkbox" for accessibility', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Accessible" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('has correct aria-checked attribute when checked', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Checked" value={true} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('has correct aria-checked attribute when unchecked', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Unchecked" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange with false when unchecking', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Uncheck me" value={true} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('clicking label toggles checkbox', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Click label" value={false} onChange={onChange} />);
    const label = screen.getByText('Click label');
    
    await user.click(label);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('has white label text styling', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Styled Label" value={false} onChange={onChange} />);
    const label = screen.getByText('Styled Label');
    expect(label).toHaveClass('text-white');
  });

  it('has 14px font size on label', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Font Size" value={false} onChange={onChange} />);
    const label = screen.getByText('Font Size');
    expect(label).toHaveClass('text-[14px]');
  });

  it('has cursor pointer on label', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Cursor" value={false} onChange={onChange} />);
    const label = screen.getByText('Cursor');
    expect(label).toHaveClass('cursor-pointer');
  });

  it('checkbox has correct size classes', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Size" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('h-4');
    expect(checkbox).toHaveClass('w-4');
  });

  it('checkbox has white border styling', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Border" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('border-checkbox-border');
  });

  it('checkbox has transparent background when unchecked', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Background" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('bg-transparent');
  });

  it('updates checked state when value prop changes', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox label="Toggle" value={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    
    rerender(<Checkbox label="Toggle" value={true} onChange={onChange} />);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });
});
