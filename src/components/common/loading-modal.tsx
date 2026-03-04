'use client';

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingModalProps {
  isOpen: boolean;
  message: string;
}

export function LoadingModal({ isOpen, message }: LoadingModalProps): ReactNode {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className={cn('absolute inset-0', 'rounded-xl backdrop-blur-[4px]')} />

      <div
        className={cn(
          'relative z-10',
          'bg-white rounded-xl',
          'w-[335px]',
          'px-3 py-5',
          'flex flex-col gap-6 items-center'
        )}
      >
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" aria-hidden="true" />

        <p className="text-sm text-[#1e1e1e] text-center leading-[19px]">{message}</p>
      </div>
    </div>
  );
}
