import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Radio } from './radio';
import { RadioGroup as BaseRadioGroup } from '@/components/ui/radio-group';

describe('Radio', () => {
  it('renders without crashing', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Test Label" />
      </BaseRadioGroup>
    );
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('renders label text', () => {
    render(
      <BaseRadioGroup>
        <Radio value="option1" label="Option 1" />
      </BaseRadioGroup>
    );
    const label = screen.getByText('Option 1');
    expect(label).toBeInTheDocument();
  });

  it('renders radio button with correct role', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Test" />
      </BaseRadioGroup>
    );
    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
  });

  it('label is associated with radio button (accessibility)', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Accessible Label" />
      </BaseRadioGroup>
    );
    const label = screen.getByText('Accessible Label');
    const radio = screen.getByRole('radio');
    
    expect(label).toHaveAttribute('for');
    expect(radio).toHaveAttribute('id');
    expect(label.getAttribute('for')).toBe(radio.getAttribute('id'));
  });

  it('applies custom className to container', () => {
    const { container } = render(
      <BaseRadioGroup>
        <Radio value="test" label="Custom" className="custom-radio-class" />
      </BaseRadioGroup>
    );
    const wrapper = container.querySelector('.custom-radio-class');
    expect(wrapper).toBeInTheDocument();
  });

  it('uses custom id when provided', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Custom ID" id="custom-radio-id" />
      </BaseRadioGroup>
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('id', 'custom-radio-id');
  });

  it('has white label text styling', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Styled Label" />
      </BaseRadioGroup>
    );
    const label = screen.getByText('Styled Label');
    expect(label).toHaveClass('text-white');
  });

  it('has 14px font size on label', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Font Size" />
      </BaseRadioGroup>
    );
    const label = screen.getByText('Font Size');
    expect(label).toHaveClass('text-[14px]');
  });

  it('has cursor pointer on label', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Cursor" />
      </BaseRadioGroup>
    );
    const label = screen.getByText('Cursor');
    expect(label).toHaveClass('cursor-pointer');
  });

  it('radio button has correct size classes', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Size" />
      </BaseRadioGroup>
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('h-5');
    expect(radio).toHaveClass('w-5');
  });

  it('radio button has white border styling', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Border" />
      </BaseRadioGroup>
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('border-white');
  });

  it('radio button has transparent background', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Background" />
      </BaseRadioGroup>
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('bg-transparent');
  });

  it('radio button has rounded-full class', () => {
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Rounded" />
      </BaseRadioGroup>
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('rounded-full');
  });

  it('renders multiple radios with unique ids', () => {
    render(
      <BaseRadioGroup>
        <Radio value="option1" label="First" />
        <Radio value="option2" label="Second" />
      </BaseRadioGroup>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]?.getAttribute('id')).not.toBe(radios[1]?.getAttribute('id'));
  });

  it('radio button value prop is set correctly', () => {
    render(
      <BaseRadioGroup>
        <Radio value="specific-value" label="Test" />
      </BaseRadioGroup>
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('value', 'specific-value');
  });

  it('clicking label should select radio button', async () => {
    const user = userEvent.setup();
    render(
      <BaseRadioGroup>
        <Radio value="test" label="Click Label" />
      </BaseRadioGroup>
    );
    const label = screen.getByText('Click Label');
    const radio = screen.getByRole('radio');
    
    expect(radio).not.toBeChecked();
    await user.click(label);
    expect(radio).toBeChecked();
  });
});
