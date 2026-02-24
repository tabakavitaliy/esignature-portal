'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RadioProps {
  value: string;
  label: string;
  id?: string;
  className?: string;
}

/**
 * Radio component with label
 * @param value - Radio value (required)
 * @param label - Label text (required)
 * @param id - Optional custom id for the radio button
 * @param className - Additional CSS classes for the container
 * @returns ReactNode
 */
export function Radio({
  value,
  label,
  id,
  className,
}: RadioProps): ReactNode {
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <RadioGroupItem
        id={radioId}
        value={value}
        className={cn(
          'h-5 w-5 rounded-full border-2',
          'border-white bg-transparent',
          'data-[state=checked]:bg-white data-[state=checked]:border-white',
          'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
        )}
      />
      <Label
        htmlFor={radioId}
        className="text-[14px] text-white cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
}
