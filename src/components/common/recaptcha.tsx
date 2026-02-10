'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
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
      <Image
        src="/recaptcha.png"
        alt="reCAPTCHA"
        width={24}
        height={24}
        className="h-6 w-auto"
        role="img"
        aria-label="reCAPTCHA logo"
      />

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
