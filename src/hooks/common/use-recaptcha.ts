'use client';

interface UseRecaptchaReturn {
  getToken: (action: string) => Promise<string>;
}

/**
 * Provides a `getToken` function that obtains a reCAPTCHA Enterprise token
 * for the given action. Fails closed: throws if the site key is missing,
 * the enterprise API is unavailable, or execute() rejects.
 * Always call `getToken` immediately before the protected request — tokens
 * expire after 2 minutes.
 */
export function useRecaptcha(): UseRecaptchaReturn {
  const getToken = (action: string): Promise<string> => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      return Promise.reject(
        new Error('reCAPTCHA site key is not configured. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.')
      );
    }

    if (typeof window === 'undefined' || !window.grecaptcha?.enterprise) {
      return Promise.reject(new Error('reCAPTCHA Enterprise script has not loaded yet.'));
    }

    const enterprise = window.grecaptcha.enterprise;

    return new Promise<string>((resolve, reject) => {
      enterprise.ready(() => {
        enterprise.execute(siteKey, { action }).then(resolve).catch(reject);
      });
    });
  };

  return { getToken };
}
