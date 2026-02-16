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

afterEach(() => {
  cleanup();
});
