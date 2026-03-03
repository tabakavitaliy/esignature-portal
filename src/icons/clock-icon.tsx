import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ClockIconProps {
  className?: string;
  size?: number;
  stroke?: string;
}

export function ClockIcon({
  className,
  size = 44,
  stroke = 'var(--brand-primary)',
}: ClockIconProps): ReactNode {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Clock"
        role="img"
      >
        <path
          d="M22 10V22L30 26M42 22C42 33.0457 33.0457 42 22 42C10.9543 42 2 33.0457 2 22C2 10.9543 10.9543 2 22 2C33.0457 2 42 10.9543 42 22Z"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
