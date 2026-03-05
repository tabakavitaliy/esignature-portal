import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Polyfill for Radix UI components in jsdom
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function () {
    return false;
  };
}

if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function () {
    // no-op
  };
}

if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = function () {
    // no-op
  };
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {
    // no-op
  };
}

// Polyfill for ResizeObserver (used in document-section.tsx)
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe(): void {
      // no-op
    }
    unobserve(): void {
      // no-op
    }
    disconnect(): void {
      // no-op
    }
  };
}

// Polyfill for DOMMatrix (used by pdf.js)
if (typeof global.DOMMatrix === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.DOMMatrix = class DOMMatrix {} as any;
}

afterEach(() => {
  cleanup();
});
