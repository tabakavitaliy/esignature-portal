'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import { Input as BaseInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputProps {
  type?: string;
  placeholder?: string;
  label: string;
  id?: string;
  className?: string;
  inputClassName?: string;
}

/**
 * Input component with label
 * @param type - Input type, defaults to 'text'
 * @param placeholder - Placeholder text
 * @param label - Label text (required)
 * @param id - Optional custom id for the input
 * @param className - Additional CSS classes for the container
 * @param inputClassName - Additional CSS classes for the input element
 * @returns ReactNode
 */
export function Input({
  type = 'text',
  placeholder,
  label,
  id,
  className,
  inputClassName,
}: InputProps): ReactNode {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={inputId} className="text-white">
        {label}
      </Label>
      <BaseInput
        id={inputId}
        type={type}
        placeholder={placeholder}
        className={cn(
          'bg-white text-gray-900 placeholder:text-gray-400',
          inputClassName
        )}
      />
    </div>
  );
}
