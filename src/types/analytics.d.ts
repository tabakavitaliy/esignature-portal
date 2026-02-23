interface Window {
  /**
   * OneTrust active consent groups string, e.g. "C0001,C0002,C0003".
   * Set by the OneTrust SDK after consent is given/updated.
   * Undefined until the SDK initialises.
   */
  OnetrustActiveGroups?: string;

  /**
   * OneTrust SDK API surface exposed after script load.
   */
  OneTrust?: {
    /** Opens the OneTrust preference centre modal. */
    ToggleInfoDisplay: () => void;
    /** Returns the domain configuration data. */
    GetDomainData: () => unknown;
  };

  /**
   * Google Analytics 4 global function.
   * Undefined until gtag.js is loaded (which only happens after Performance consent).
   */
  gtag?: (...args: unknown[]) => void;

  /**
   * GA4 data layer array. Initialised alongside gtag().
   */
  dataLayer?: unknown[];
}
