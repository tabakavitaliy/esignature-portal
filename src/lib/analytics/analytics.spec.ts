import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent } from './analytics';

describe('trackEvent', () => {
  beforeEach(() => {
    delete window.gtag;
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete window.gtag;
  });

  it('does nothing when window.gtag is not defined', () => {
    expect(() => trackEvent('test_event')).not.toThrow();
  });

  it('calls window.gtag with the correct event name', () => {
    const gtagMock = vi.fn();
    window.gtag = gtagMock;

    trackEvent('test_event');

    expect(gtagMock).toHaveBeenCalledWith('event', 'test_event', undefined);
  });

  it('calls window.gtag with event name and params', () => {
    const gtagMock = vi.fn();
    window.gtag = gtagMock;

    trackEvent('button_click', { label: 'sign_now', page: '/sign' });

    expect(gtagMock).toHaveBeenCalledWith('event', 'button_click', {
      label: 'sign_now',
      page: '/sign',
    });
  });

  it('does not throw when called without params', () => {
    const gtagMock = vi.fn();
    window.gtag = gtagMock;

    expect(() => trackEvent('no_params_event')).not.toThrow();
    expect(gtagMock).toHaveBeenCalledTimes(1);
  });
});
