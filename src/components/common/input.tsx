'use client';

import type { ReactNode, ChangeEvent } from 'react';
import { useId, useEffect } from 'react';
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
  mask?: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Applies a mask to the input value
 * @param value - Raw input value
 * @param mask - Mask pattern (9=digit, a=letter, *=alphanumeric, other=literal)
 * @returns Masked value
 */
function applyMask(value: string, mask: string): string {
  let maskedValue = '';
  let valueIndex = 0;

  for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
    const maskChar = mask[maskIndex];
    
    if (!maskChar) {
      break;
    }

    if (valueIndex >= value.length) {
      break;
    }

    const valueChar = value[valueIndex];
    
    if (!valueChar) {
      break;
    }

    if (maskChar === '9') {
      // Digit only
      if (/\d/.test(valueChar)) {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        valueIndex++;
        maskIndex--;
      }
    } else if (maskChar === 'a') {
      // Letter only
      if (/[a-zA-Z]/.test(valueChar)) {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        valueIndex++;
        maskIndex--;
      }
    } else if (maskChar === '*') {
      // Alphanumeric
      if (/[a-zA-Z0-9]/.test(valueChar)) {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        valueIndex++;
        maskIndex--;
      }
    } else {
      // Literal character
      maskedValue += maskChar;
      if (valueChar === maskChar) {
        valueIndex++;
      }
    }
  }

  return maskedValue;
}

/**
 * Input component with label
 * @param type - Input type, defaults to 'text'
 * @param placeholder - Placeholder text
 * @param label - Label text (required)
 * @param id - Optional custom id for the input
 * @param className - Additional CSS classes for the container
 * @param inputClassName - Additional CSS classes for the input element
 * @param mask - Optional input mask pattern (9=digit, a=letter, *=alphanumeric)
 * @returns ReactNode
 */
export function Input({
  type = 'text',
  placeholder,
  label,
  id,
  className,
  inputClassName,
  mask,
  value,
  onChange,
}: InputProps): ReactNode {
  const generatedId = useId();
  const inputId = id || generatedId;

  // Apply mask to incoming value if mask exists and value doesn't match mask format
  useEffect(() => {
    if (mask && value) {
      const rawValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const maskedValue = applyMask(rawValue, mask);
      if (maskedValue !== value) {
        onChange(maskedValue);
      }
    }
  }, [value, mask, onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (mask) {
      const rawValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const formatted = applyMask(rawValue, mask);
      onChange(formatted);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={inputId} className="text-white text-xs">
        {label}
      </Label>
      <BaseInput
        id={inputId}
        type={type}
        placeholder={placeholder}
        className={cn(
          'bg-white text-gray-900 placeholder:text-gray-400 text-sm placeholder:text-sm',
          inputClassName
        )}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
