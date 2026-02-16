'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
  className?: string;
}

/**
 * Checkbox component with label
 * @param value - Controlled checked state (required)
 * @param onChange - Callback when checkbox is toggled (required)
 * @param label - Label text (required)
 * @param id - Optional custom id for the checkbox
 * @param className - Additional CSS classes for the container
 * @returns ReactNode
 */
export function Checkbox({
  value,
  onChange,
  label,
  id,
  className,
}: CheckboxProps): ReactNode {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <BaseCheckbox
        id={checkboxId}
        checked={value}
        onCheckedChange={onChange}
        className={cn(
          'h-4 w-4 rounded border-2',
          'border-checkbox-border bg-transparent',
          'data-[state=checked]:bg-checkbox-checked-bg data-[state=checked]:border-checkbox-checked-bg',
          'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
        )}
      />
      <Label
        htmlFor={checkboxId}
        className="text-[14px] text-white cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
}
