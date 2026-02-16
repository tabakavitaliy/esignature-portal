import { useCallback, useState, useEffect } from 'react';

const TOKEN_KEY = 'token';

interface UseTokenReturn {
  token: string | null;
  setToken: (token: string) => void;
}

export function useToken(): UseTokenReturn {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    // Only access sessionStorage on the client side
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem(TOKEN_KEY);
      setTokenState(storedToken);
    }
  }, []);

  const setToken = useCallback((newToken: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEY, newToken);
      setTokenState(newToken);
    }
  }, []);

  return { token, setToken };
}
