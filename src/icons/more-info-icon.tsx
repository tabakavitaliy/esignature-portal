import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MoreInfoIconProps {
  className?: string;
  size?: number;
}

export function MoreInfoIcon({ className, size = 13 }: MoreInfoIconProps): ReactNode {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 3 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="More options"
        role="img"
      >
        <path d="M1.41667 6.75C1.78486 6.75 2.08333 6.45152 2.08333 6.08333C2.08333 5.71514 1.78486 5.41667 1.41667 5.41667C1.04848 5.41667 0.75 5.71514 0.75 6.08333C0.75 6.45152 1.04848 6.75 1.41667 6.75Z" fill="white"/>
        <path d="M1.41667 2.08333C1.78486 2.08333 2.08333 1.78486 2.08333 1.41667C2.08333 1.04848 1.78486 0.75 1.41667 0.75C1.04848 0.75 0.75 1.04848 0.75 1.41667C0.75 1.78486 1.04848 2.08333 1.41667 2.08333Z" fill="white"/>
        <path d="M1.41667 11.4167C1.78486 11.4167 2.08333 11.1182 2.08333 10.75C2.08333 10.3818 1.78486 10.0833 1.41667 10.0833C1.04848 10.0833 0.75 10.3818 0.75 10.75C0.75 11.1182 1.04848 11.4167 1.41667 11.4167Z" fill="white"/>
        <path d="M1.41667 6.75C1.78486 6.75 2.08333 6.45152 2.08333 6.08333C2.08333 5.71514 1.78486 5.41667 1.41667 5.41667C1.04848 5.41667 0.75 5.71514 0.75 6.08333C0.75 6.45152 1.04848 6.75 1.41667 6.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.41667 2.08333C1.78486 2.08333 2.08333 1.78486 2.08333 1.41667C2.08333 1.04848 1.78486 0.75 1.41667 0.75C1.04848 0.75 0.75 1.04848 0.75 1.41667C0.75 1.78486 1.04848 2.08333 1.41667 2.08333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.41667 11.4167C1.78486 11.4167 2.08333 11.1182 2.08333 10.75C2.08333 10.3818 1.78486 10.0833 1.41667 10.0833C1.04848 10.0833 0.75 10.3818 0.75 10.75C0.75 11.1182 1.04848 11.4167 1.41667 11.4167Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
