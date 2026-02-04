import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * ContentWrapper component centers content with a maximum width
 * @param children - React children to render inside the wrapper
 * @param className - Additional CSS classes to apply
 * @returns ReactNode
 */
export function ContentWrapper({ children, className }: ContentWrapperProps): ReactNode {
  return (
    <div className={cn('mx-auto w-full max-w-[600px]', className)}>
      {children}
    </div>
  );
}
