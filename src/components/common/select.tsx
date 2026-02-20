'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
  selectClassName?: string;
}

/**
 * Select component with label
 * @param label - Label text (required)
 * @param placeholder - Placeholder text
 * @param options - Array of options with value and label
 * @param value - Selected value (controlled)
 * @param onChange - Callback when selection changes
 * @param id - Optional custom id for the select
 * @param className - Additional CSS classes for the container
 * @param selectClassName - Additional CSS classes for the select trigger
 * @returns ReactNode
 */
export function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
  id,
  className,
  selectClassName,
}: SelectProps): ReactNode {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={selectId} className="text-xs text-white">
        {label}
      </Label>
      <BaseSelect 
        {...(value !== undefined ? { value } : {})}
        {...(onChange !== undefined ? { onValueChange: onChange } : {})}
      >
        <SelectTrigger
          id={selectId}
          className={cn(
            'bg-white text-gray-900 text-sm [&>span[data-placeholder]]:text-[#999999]',
            selectClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                'text-sm cursor-pointer',
                'data-[state=checked]:bg-[hsl(var(--select-item-selected))]',
                'focus:bg-[hsl(var(--select-item-selected))]'
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </BaseSelect>
    </div>
  );
}
