'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SignatoryFormCardProps {
  heading: string;
  description: string;
  signatoryDetailsHeading: string;
  children: ReactNode;
  className?: string;
}

export function SignatoryFormCard({
  heading,
  description,
  signatoryDetailsHeading,
  children,
  className,
}: SignatoryFormCardProps): ReactNode {
  return (
    <div
      className={cn(
        'flex-1 rounded-2xl px-4 py-5',
        'bg-[var(--login-card-bg)] backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-base font-bold text-white">{heading}</h2>
        <p className="text-sm text-white">{description}</p>
      </div>

      <div className="h-px w-[24px] bg-white/20 mb-4 mx-auto" />

      <h3 className="text-base font-bold text-white mb-6">
        {signatoryDetailsHeading}
      </h3>

      {children}
    </div>
  );
}
