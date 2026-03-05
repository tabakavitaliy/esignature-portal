import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { RadioGroup, type RadioOption } from './radio-group';

const mockOptions: RadioOption[] = [
  { value: 'address-1', label: '123 Main St, Springfield, 12345' },
  { value: 'address-2', label: '456 Oak Ave, Riverside, 67890' },
  { value: 'address-3', label: '789 Pine Rd, Lakeside, 54321' },
];

describe('RadioGroup', () => {
  it('renders without crashing', () => {
    render(<RadioGroup label="Test Label" options={mockOptions} />);
    const legend = screen.getByText('Test Label');
    expect(legend).toBeInTheDocument();
  });

  it('renders legend text', () => {
    render(<RadioGroup label="Property Address" options={mockOptions} />);
    const legend = screen.getByText('Property Address');
    expect(legend).toBeInTheDocument();
  });

  it('legend is rendered as <legend> element', () => {
    render(<RadioGroup label="Select Address" options={mockOptions} />);
    const legend = screen.getByText('Select Address');
    expect(legend.tagName).toBe('LEGEND');
  });

  it('renders with radiogroup role', () => {
    render(<RadioGroup label="Test" options={mockOptions} />);
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
  });

  it('renders all radio options', () => {
    render(<RadioGroup label="Address" options={mockOptions} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('renders correct labels for all options', () => {
    render(<RadioGroup label="Address" options={mockOptions} />);

    expect(screen.getByText('123 Main St, Springfield, 12345')).toBeInTheDocument();
    expect(screen.getByText('456 Oak Ave, Riverside, 67890')).toBeInTheDocument();
    expect(screen.getByText('789 Pine Rd, Lakeside, 54321')).toBeInTheDocument();
  });

  it('calls onChange when radio option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioGroup label="Address" options={mockOptions} onChange={handleChange} />);

    const firstRadio = screen.getAllByRole('radio')[0];
    await user.click(firstRadio!);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('address-1');
  });

  it('calls onChange with correct value when second option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioGroup label="Address" options={mockOptions} onChange={handleChange} />);

    const secondRadio = screen.getAllByRole('radio')[1];
    await user.click(secondRadio!);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('address-2');
  });

  it('displays selected value when value prop is set', () => {
    render(<RadioGroup label="Address" options={mockOptions} value="address-2" />);

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  it('radiogroup is properly labeled for accessibility', () => {
    render(<RadioGroup label="Select Property" options={mockOptions} />);
    const radioGroup = screen.getByRole('radiogroup');
    const legend = screen.getByText('Select Property');

    expect(radioGroup).toHaveAttribute('aria-labelledby');
    expect(legend).toHaveAttribute('id');
    expect(radioGroup.getAttribute('aria-labelledby')).toBe(legend.getAttribute('id'));
  });

  it('applies custom className to fieldset container', () => {
    const { container } = render(
      <RadioGroup label="Test" options={mockOptions} className="custom-fieldset-class" />
    );
    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toHaveClass('custom-fieldset-class');
  });

  it('uses custom id when provided', () => {
    render(<RadioGroup label="Custom ID" id="custom-radio-group-id" options={mockOptions} />);
    const legend = screen.getByText('Custom ID');
    expect(legend).toHaveAttribute('id', 'custom-radio-group-id-label');
  });

  it('legend has white text styling', () => {
    render(<RadioGroup label="Styled Legend" options={mockOptions} />);
    const legend = screen.getByText('Styled Legend');
    expect(legend).toHaveClass('text-white');
  });

  it('legend has text-xs font size', () => {
    render(<RadioGroup label="Font Size" options={mockOptions} />);
    const legend = screen.getByText('Font Size');
    expect(legend).toHaveClass('text-xs');
  });

  it('renders with empty options array', () => {
    render(<RadioGroup label="Empty" options={[]} />);
    const legend = screen.getByText('Empty');
    expect(legend).toBeInTheDocument();
    const radios = screen.queryAllByRole('radio');
    expect(radios).toHaveLength(0);
  });

  it('renders multiple radio groups with unique legend ids', () => {
    render(
      <>
        <RadioGroup label="First Group" options={mockOptions} />
        <RadioGroup label="Second Group" options={mockOptions} />
      </>
    );

    const legends = screen.getAllByRole('group');
    expect(legends).toHaveLength(2);

    const firstLegend = screen.getByText('First Group');
    const secondLegend = screen.getByText('Second Group');
    expect(firstLegend.getAttribute('id')).not.toBe(secondLegend.getAttribute('id'));
  });

  it('can select different options in sequence', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioGroup label="Address" options={mockOptions} onChange={handleChange} />);

    const radios = screen.getAllByRole('radio');

    await user.click(radios[0]!);
    expect(handleChange).toHaveBeenLastCalledWith('address-1');

    await user.click(radios[2]!);
    expect(handleChange).toHaveBeenLastCalledWith('address-3');

    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('clicking label selects corresponding radio button', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioGroup label="Address" options={mockOptions} value="address-1" onChange={handleChange} />
    );

    const secondLabel = screen.getByText('456 Oak Ave, Riverside, 67890');
    const radios = screen.getAllByRole('radio');

    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();

    await user.click(secondLabel);
    expect(handleChange).toHaveBeenCalledWith('address-2');
  });

  it('each radio has correct value attribute', () => {
    render(<RadioGroup label="Address" options={mockOptions} />);
    const radios = screen.getAllByRole('radio');

    expect(radios[0]).toHaveAttribute('value', 'address-1');
    expect(radios[1]).toHaveAttribute('value', 'address-2');
    expect(radios[2]).toHaveAttribute('value', 'address-3');
  });

  it('disables all radio buttons when disabled prop is true', () => {
    render(<RadioGroup label="Address" options={mockOptions} disabled={true} />);

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('does not call onChange when disabled and radio is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioGroup label="Address" options={mockOptions} onChange={handleChange} disabled={true} />
    );

    const firstRadio = screen.getAllByRole('radio')[0];
    await user.click(firstRadio!);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('enables all radio buttons when disabled prop is false', () => {
    render(<RadioGroup label="Address" options={mockOptions} disabled={false} />);

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).not.toBeDisabled();
    });
  });
});
