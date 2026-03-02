import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToken } from '@/hooks/queries/use-token';
import { ROUTES } from '@/constants/routes';

export const INACTIVITY_TIMEOUT_MS = 1 * 60 * 1000;
export const COUNTDOWN_SECONDS = 120;

interface UseInactivityTimerReturn {
  isWarningVisible: boolean;
  remainingSeconds: number;
  resetTimer: () => void;
  logOff: () => void;
}

export function useInactivityTimer(): UseInactivityTimerReturn {
  const router = useRouter();
  const pathname = usePathname();
  const { token, clearToken } = useToken();
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_SECONDS);
  
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathnameRef = useRef(pathname);

  const clearInactivityTimer = useCallback((): void => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const clearCountdownInterval = useCallback((): void => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const logOff = useCallback((): void => {
    clearInactivityTimer();
    clearCountdownInterval();
    setIsWarningVisible(false);
    clearToken();
    router.push(ROUTES.EXPIRED_SESSION);
  }, [clearInactivityTimer, clearCountdownInterval, clearToken, router]);

  const startCountdown = useCallback((): void => {
    setIsWarningVisible(true);
  }, []);

  useEffect(() => {
    if (isWarningVisible) {
      countdownIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
      };
    }
  }, [isWarningVisible]);

  const startInactivityTimer = useCallback((): void => {
    clearInactivityTimer();
    
    inactivityTimerRef.current = setTimeout(() => {
      startCountdown();
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearInactivityTimer, startCountdown]);

  const resetTimer = useCallback((): void => {
    clearInactivityTimer();
    clearCountdownInterval();
    setIsWarningVisible(false);
    setRemainingSeconds(COUNTDOWN_SECONDS);
    startInactivityTimer();
  }, [clearInactivityTimer, clearCountdownInterval, startInactivityTimer]);

  const handleActivity = useCallback((): void => {
    if (!isWarningVisible) {
      startInactivityTimer();
    }
  }, [isWarningVisible, startInactivityTimer]);

  useEffect(() => {
    if (isWarningVisible && remainingSeconds <= 0) {
      logOff();
    }
  }, [isWarningVisible, remainingSeconds, logOff]);

  useEffect(() => {
    const shouldMonitor = 
      token && 
      pathname !== ROUTES.HOME && 
      pathname !== ROUTES.EXPIRED_SESSION;

    if (!shouldMonitor) {
      clearInactivityTimer();
      clearCountdownInterval();
      setIsWarningVisible(false);
      return;
    }

    const pathnameChanged = prevPathnameRef.current !== pathname;
    prevPathnameRef.current = pathname;

    if (pathnameChanged) {
      resetTimer();
    } else {
      startInactivityTimer();
    }

    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearInactivityTimer();
      clearCountdownInterval();
    };
  }, [token, pathname, resetTimer, startInactivityTimer, handleActivity, clearInactivityTimer, clearCountdownInterval]);

  return {
    isWarningVisible,
    remainingSeconds,
    resetTimer,
    logOff,
  };
}
