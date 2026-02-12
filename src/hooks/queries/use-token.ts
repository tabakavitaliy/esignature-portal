import { useCallback } from 'react';

const TOKEN_KEY = 'token';

interface UseTokenReturn {
  token: string | null;
  setToken: (token: string) => void;
}

export function useToken(): UseTokenReturn {
  const token = sessionStorage.getItem(TOKEN_KEY);

  const setToken = useCallback((newToken: string): void => {
    sessionStorage.setItem(TOKEN_KEY, newToken);
  }, []);

  return { token, setToken };
}
