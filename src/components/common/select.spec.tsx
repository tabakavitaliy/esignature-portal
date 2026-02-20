import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select, type SelectOption } from './select';

const mockOptions: SelectOption[] = [
  { value: 'nate-giraffe', label: 'Nate Giraffe' },
  { value: 'justin-case', label: 'Justin Case' },
  { value: 'not-listed', label: 'My name is not listed' },
];

describe('Select', () => {
  it('renders without crashing', () => {
    render(<Select label="Test Label" options={mockOptions} />);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('renders with label text', () => {
    render(<Select label="Select your name" options={mockOptions} />);
    const label = screen.getByText('Select your name');
    expect(label).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(
      <Select
        label="Name"
        placeholder="Choose a name"
        options={mockOptions}
      />
    );
    const placeholder = screen.getByText('Choose a name');
    expect(placeholder).toBeInTheDocument();
  });

  it('renders trigger button with combobox role', () => {
    render(
      <Select
        label="Name"
        placeholder="Select name"
        options={mockOptions}
      />
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('accepts onChange callback prop', () => {
    const handleChange = vi.fn();
    render(
      <Select
        label="Name"
        placeholder="Select name"
        options={mockOptions}
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
  });

  it('displays selected value', () => {
    render(
      <Select
        label="Name"
        placeholder="Select name"
        options={mockOptions}
        value="justin-case"
      />
    );

    const selectedValue = screen.getByText('Justin Case');
    expect(selectedValue).toBeInTheDocument();
  });

  it('label is properly associated with select (accessibility)', () => {
    render(
      <Select
        label="Full Name"
        placeholder="Select"
        options={mockOptions}
      />
    );
    const label = screen.getByText('Full Name');
    const trigger = screen.getByRole('combobox');

    expect(label).toHaveAttribute('for');
    expect(trigger).toHaveAttribute('id');
    expect(label.getAttribute('for')).toBe(trigger.getAttribute('id'));
  });

  it('uses custom id when provided', () => {
    render(
      <Select
        label="Custom ID"
        id="custom-select-id"
        options={mockOptions}
      />
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('id', 'custom-select-id');
  });

  it('merges custom className to container', () => {
    render(
      <Select
        label="Test"
        className="custom-container-class"
        options={mockOptions}
      />
    );
    const container = screen.getByText('Test').parentElement;
    expect(container).toHaveClass('custom-container-class');
  });

  it('merges custom selectClassName to trigger element', () => {
    render(
      <Select
        label="Test"
        selectClassName="custom-select-class"
        options={mockOptions}
      />
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('custom-select-class');
  });

  it('has white label text styling with 12px font size', () => {
    render(<Select label="Styled Label" options={mockOptions} />);
    const label = screen.getByText('Styled Label');
    expect(label).toHaveClass('text-white');
    expect(label).toHaveClass('text-xs');
  });

  it('has white background on trigger', () => {
    render(<Select label="Styled Select" options={mockOptions} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('bg-white');
  });

  it('has 14px font size on trigger', () => {
    render(<Select label="Font Size Test" options={mockOptions} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('text-sm');
  });

  it('has placeholder color #999999 applied via Tailwind class', () => {
    render(<Select label="Placeholder Color Test" placeholder="Pick one" options={mockOptions} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger.className).toContain('[&>span[data-placeholder]]:text-[#999999]');
  });

  it('renders with empty options array', () => {
    render(<Select label="Empty" options={[]} />);
    const label = screen.getByText('Empty');
    expect(label).toBeInTheDocument();
  });

  it('renders multiple selects with unique ids', () => {
    render(
      <>
        <Select label="First" options={mockOptions} />
        <Select label="Second" options={mockOptions} />
      </>
    );

    const triggers = screen.getAllByRole('combobox');
    expect(triggers).toHaveLength(2);
    expect(triggers[0]?.getAttribute('id')).not.toBe(triggers[1]?.getAttribute('id'));
  });
});
