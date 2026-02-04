'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import translations from '@/i18n/en.json';

interface RecaptchaProps {
  className?: string;
}

/**
 * Recaptcha component displays the reCAPTCHA badge
 * @param className - Additional CSS classes to apply
 * @returns ReactNode
 */
export function Recaptcha({ className }: RecaptchaProps): ReactNode {
  const { recaptcha: t } = translations;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2',
        'bg-[var(--recaptcha-badge-bg)]',
        className
      )}
    >
      {/* reCAPTCHA icon and text */}
      <div className="flex items-center gap-1.5">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="reCAPTCHA logo"
        >
          <path
            d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z"
            fill="#4285F4"
          />
          <path
            d="M12 7C9.79 7 8 8.79 8 11V12H7V17H17V12H16V11C16 8.79 14.21 7 12 7ZM12 8.5C13.38 8.5 14.5 9.62 14.5 11V12H9.5V11C9.5 9.62 10.62 8.5 12 8.5Z"
            fill="white"
          />
        </svg>
        <span className="text-sm font-medium text-white">reCAPTCHA</span>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-white/20" />

      {/* Protected by text and links */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-white/90">{t.protectedBy}</span>
        <div className="flex items-center gap-1 text-xs">
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 underline hover:text-white"
          >
            {t.privacy}
          </a>
          <span className="text-white/60">-</span>
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 underline hover:text-white"
          >
            {t.terms}
          </a>
        </div>
      </div>
    </div>
  );
}
