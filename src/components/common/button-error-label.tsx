'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonErrorLabelProps {
  message: string;
  id?: string;
  className?: string;
}

/**
 * ButtonErrorLabel component displays error messages below buttons
 * @param message - Error message text (required)
 * @param id - Optional id for accessibility linking with aria-describedby
 * @param className - Additional CSS classes for customization
 * @returns ReactNode
 */
export function ButtonErrorLabel({
  message,
  id,
  className,
}: ButtonErrorLabelProps): ReactNode {
  if (!message) {
    return null;
  }

  return (
    <span
      id={id}
      role="alert"
      aria-live="polite"
      className={cn(
        'text-xs text-[hsl(var(--button-error))] mt-2 block text-center',
        className
      )}
    >
      {message}
    </span>
  );
}
