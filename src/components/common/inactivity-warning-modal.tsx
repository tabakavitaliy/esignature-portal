'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ClockIcon } from '@/icons';
import translations from '@/i18n/en.json';

interface InactivityWarningModalProps {
  remainingSeconds: number;
  onImHere: () => void;
  onLogOff: () => void;
}

export function InactivityWarningModal({
  remainingSeconds,
  onImHere,
  onLogOff,
}: InactivityWarningModalProps): ReactNode {
  const { inactivityWarning: t } = translations;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={cn('absolute inset-0', 'backdrop-blur-[2px] bg-modal-overlay')} />

      <div
        className={cn(
          'relative z-10',
          'bg-white rounded-xl',
          'backdrop-blur-[8px]',
          'w-[310px]',
          'px-4 py-6',
          'flex flex-col gap-6 items-center'
        )}
      >
        <div className="flex flex-col gap-6 items-center px-4">
          <ClockIcon size={48} />

          <div className="flex gap-[6px] items-center">
            <div
              className={cn(
                'bg-timer-badge-bg',
                'border border-timer-badge-border',
                'rounded-[6px]',
                'px-2 py-[6px]',
                'flex flex-col items-center justify-center'
              )}
            >
              <p className="text-2xl font-bold text-[#111] leading-none">{formatTime(minutes)}</p>
            </div>

            <div className="text-[#111] text-xl leading-none">:</div>

            <div
              className={cn(
                'bg-timer-badge-bg',
                'border border-timer-badge-border',
                'rounded-[6px]',
                'px-2 py-[6px]',
                'flex flex-col items-center justify-center'
              )}
            >
              <p className="text-2xl font-bold text-[#111] leading-none">{formatTime(seconds)}</p>
            </div>
          </div>

          <p className="text-sm text-[#1e1e1e] text-center leading-[19px]">{t.message}</p>
        </div>

        <div className="flex gap-4 items-start justify-center w-full">
          <button
            onClick={onLogOff}
            className={cn(
              'flex-1',
              'border border-brand-primary',
              'text-brand-primary',
              'text-sm font-semibold',
              'rounded-[6px]',
              'px-3 py-[10px]',
              'min-w-[100px]',
              'hover:bg-brand-primary/10',
              'transition-colors'
            )}
          >
            {t.logOffButton}
          </button>

          <button
            onClick={onImHere}
            className={cn(
              'flex-1',
              'bg-brand-primary',
              'text-white',
              'text-sm font-semibold',
              'rounded-[6px]',
              'px-3 py-[10px]',
              'min-w-[100px]',
              'hover:bg-brand-primary/90',
              'transition-colors'
            )}
          >
            {t.imHereButton}
          </button>
        </div>
      </div>
    </div>
  );
}
