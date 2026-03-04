interface GrecaptchaEnterprise {
  /**
   * Waits until the reCAPTCHA Enterprise library is ready, then invokes the callback.
   */
  ready: (callback: () => void) => void;

  /**
   * Executes a reCAPTCHA Enterprise challenge and returns a token.
   * @param siteKey - The public site key registered in Google Cloud Console.
   * @param options - Action descriptor used for scoring and analytics.
   */
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

interface Window {
  /**
   * Google reCAPTCHA Enterprise global, injected by the enterprise.js script.
   * Undefined until the script has loaded.
   */
  grecaptcha?: {
    enterprise: GrecaptchaEnterprise;
  };
}
