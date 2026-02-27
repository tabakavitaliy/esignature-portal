'use client';

import type { ReactNode } from 'react';
import { useInactivityTimer } from '@/hooks/common/use-inactivity-timer';
import { InactivityWarningModal } from './inactivity-warning-modal';

interface InactivityProviderProps {
  children: ReactNode;
}

export function InactivityProvider({ children }: InactivityProviderProps): ReactNode {
  const { isWarningVisible, remainingSeconds, resetTimer, logOff } = useInactivityTimer();

  return (
    <>
      {children}
      {isWarningVisible && (
        <InactivityWarningModal
          remainingSeconds={remainingSeconds}
          onImHere={resetTimer}
          onLogOff={logOff}
        />
      )}
    </>
  );
}
