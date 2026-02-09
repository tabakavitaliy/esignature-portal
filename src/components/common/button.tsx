'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button as BaseButton } from '@/components/ui/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  kind?: 'primary' | 'secondary';
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  className?: string;
}

/**
 * Button component with customizable text and icons
 * @param text - Button text (required)
 * @param kind - Button variant, defaults to 'primary'
 * @param iconBefore - Optional icon to display before text
 * @param iconAfter - Optional icon to display after text
 * @param className - Additional CSS classes for the button
 * @param props - Standard button HTML attributes
 * @returns ReactNode
 */
export function Button({
  text,
  kind = 'primary',
  iconBefore,
  iconAfter,
  className,
  ...props
}: ButtonProps): ReactNode {
  const primaryStyles = cn(
    'w-full rounded-xl bg-white text-[#3A238C] text-lg font-semibold',
    'h-auto px-8 py-4',
    'hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A238C]',
    'transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const secondaryStyles = cn(
    'w-full rounded-xl bg-transparent text-white text-lg font-semibold',
    'h-auto px-8 py-4',
    'border-2 border-white',
    'hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A238C]',
    'transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const styles = kind === 'secondary' ? secondaryStyles : primaryStyles;

  return (
    <BaseButton
      className={cn(styles, className)}
      {...props}
    >
      {iconBefore && <span className="flex-shrink-0">{iconBefore}</span>}
      <span>{text}</span>
      {iconAfter && <span className="flex-shrink-0">{iconAfter}</span>}
    </BaseButton>
  );
}
