import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { MainLogo } from './main-logo';

interface HeaderProps {
  text: string;
  className?: string;
}

/**
 * Header component with Liberty logo and customizable text
 * @param text - Header text to display on the right side (required)
 * @param className - Additional CSS classes to apply
 * @returns ReactNode
 */
export function Header({ text, className }: HeaderProps): ReactNode {
  return (
    <header
      className={cn(
        'flex w-full items-center justify-between bg-[hsl(var(--header-bg))] px-6 py-4',
        className
      )}
    >
      <MainLogo size="small" />
      <h1 className="text-base italic text-white">{text}</h1>
    </header>
  );
}
