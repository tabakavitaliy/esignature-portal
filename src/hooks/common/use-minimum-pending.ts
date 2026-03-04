import { useState, useEffect, useRef } from 'react';

/**
 * Ensures a loading state stays visible for at least `minimumDurationMs`,
 * preventing a visual "blink" when API responses resolve very quickly.
 *
 * When `isPending` flips to true the hook immediately returns true.
 * When `isPending` flips to false the hook only returns false after the
 * minimum display duration has elapsed (measured from when isPending first
 * became true). If the real request already took longer the state is cleared
 * synchronously with no artificial delay.
 *
 * @param isPending - The raw pending flag from a TanStack Query mutation.
 * @param minimumDurationMs - Minimum time (ms) to display the loading state. Defaults to 600.
 */
export function useMinimumPending(isPending: boolean, minimumDurationMs = 1000): boolean {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPending) {
      startTimeRef.current = Date.now();
      setIsDisplayed(true);
      return;
    }

    if (startTimeRef.current === null) {
      return;
    }

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = minimumDurationMs - elapsed;
    startTimeRef.current = null;

    if (remaining <= 0) {
      setIsDisplayed(false);
      return;
    }

    const timerId = setTimeout(() => setIsDisplayed(false), remaining);
    return () => clearTimeout(timerId);
  }, [isPending, minimumDurationMs]);

  return isDisplayed;
}
