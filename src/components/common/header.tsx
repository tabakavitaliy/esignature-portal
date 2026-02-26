import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { MainLogo } from './main-logo';

interface HeaderProps {
  text: string;
  subtitle?: string;
  className?: string;
}

/**
 * Header component with Liberty logo and customizable text
 * @param text - Header text to display on the right side (required)
 * @param subtitle - Optional subtitle displayed below the header text
 * @param className - Additional CSS classes to apply
 * @returns ReactNode
 */
export function Header({ text, subtitle, className }: HeaderProps): ReactNode {
  return (
    <header
      className={cn(
        'flex w-full items-center justify-between bg-[var(--header-bg)] px-6 py-4',
        className
      )}
    >
      <MainLogo size="small" />
      <div className="text-right">
        <h1 className="text-base font-bold text-white">{text}</h1>
        {subtitle && (
          <p className="text-xs font-normal text-white">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
