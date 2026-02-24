'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import { RadioGroup as BaseRadioGroup } from '@/components/ui/radio-group';
import { Radio } from './radio';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  id?: string;
}

/**
 * RadioGroup component with label and options
 * @param label - Legend/label text for the radio group (required)
 * @param options - Array of radio options with value and label (required)
 * @param value - Selected value (controlled)
 * @param onChange - Callback when selection changes
 * @param className - Additional CSS classes for the fieldset container
 * @param id - Optional custom id for the radio group
 * @returns ReactNode
 */
export function RadioGroup({
  label,
  options,
  value,
  onChange,
  className,
  id,
}: RadioGroupProps): ReactNode {
  const generatedId = useId();
  const radioGroupId = id || generatedId;

  return (
    <fieldset className={cn('flex flex-col gap-4', className)}>
      <legend id={`${radioGroupId}-label`} className="text-xs text-white mb-2">
        {label}
      </legend>
      <BaseRadioGroup
        {...(value !== undefined ? { value } : {})}
        {...(onChange !== undefined ? { onValueChange: onChange } : {})}
        aria-labelledby={`${radioGroupId}-label`}
        className="flex flex-col gap-3"
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
          />
        ))}
      </BaseRadioGroup>
    </fieldset>
  );
}
