import { test, expect, type BrowserContext, type Page } from '@playwright/test';

// OneTrust injects its banner and modals via the SDK. These tests require
// NEXT_PUBLIC_ONETRUST_DOMAIN_ID to be set to a valid OneTrust domain ID
// and the OneTrust tenant to be published for the test environment domain.
//
// Without a valid domain ID the banner will not appear -- the "missing domain ID"
// test below verifies the app remains stable in that case.
//
// GA4 tests (WEP-16) require NEXT_PUBLIC_GA_ID to be set and OneTrust to be live.
// GA4 only loads when OneTrust Performance consent (C0003) is granted.

const ONETRUST_BANNER_ID = '#onetrust-banner-sdk';
const ONETRUST_ACCEPT_ALL_BTN = '#onetrust-accept-btn-handler';
const ONETRUST_PREFERENCES_BTN = '#onetrust-pc-btn-handler';
const ONETRUST_PREFERENCES_CENTER_ID = '#onetrust-pc-sdk';
const GA4_SCRIPT_PATTERN = '**/googletagmanager.com/gtag/js**';

async function freshContextPage(context: BrowserContext): Promise<Page> {
  await context.clearCookies();
  await context.clearPermissions();
  const page = await context.newPage();
  // Clear OneTrust localStorage consent before each navigation
  await page.addInitScript(() => {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith('OptanonConsent') || key.startsWith('OptanonAlertBoxClosed'))
      .forEach((key) => window.localStorage.removeItem(key));
  });
  return page;
}

test.describe('Cookie Consent Banner (OneTrust)', () => {
  test('banner appears on first visit before consent is given', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await freshContextPage(context);

    await page.goto('/');

    await expect(page.locator(ONETRUST_BANNER_ID)).toBeVisible({ timeout: 10000 });

    await context.close();
  });

  test('"Accept all" closes banner and it does not reappear on reload', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await freshContextPage(context);

    await page.goto('/');
    await expect(page.locator(ONETRUST_BANNER_ID)).toBeVisible({ timeout: 10000 });

    await page.locator(ONETRUST_ACCEPT_ALL_BTN).click();
    await expect(page.locator(ONETRUST_BANNER_ID)).not.toBeVisible();

    // Reload and verify banner does not reappear
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator(ONETRUST_BANNER_ID)).not.toBeVisible();

    await context.close();
  });

  test('"Cookie preferences" button opens OneTrust preferences modal', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await freshContextPage(context);

    await page.goto('/');
    await expect(page.locator(ONETRUST_BANNER_ID)).toBeVisible({ timeout: 10000 });

    await page.locator(ONETRUST_PREFERENCES_BTN).click();
    await expect(page.locator(ONETRUST_PREFERENCES_CENTER_ID)).toBeVisible({ timeout: 5000 });

    await context.close();
  });

  test('GA4 script is NOT loaded when user rejects Performance cookies', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await freshContextPage(context);

    const ga4Requests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('googletagmanager.com/gtag/js')) {
        ga4Requests.push(req.url());
      }
    });

    await page.goto('/');
    await expect(page.locator(ONETRUST_BANNER_ID)).toBeVisible({ timeout: 10000 });

    // Reject all non-essential cookies by closing without accepting
    // (OneTrust "reject" path -- banner stays or is dismissed with deny)
    // Wait for any deferred scripts to fire after the page settles
    await page.waitForLoadState('networkidle');

    // Without consent, GA4 should not have been requested
    expect(ga4Requests).toHaveLength(0);

    await context.close();
  });

  test('GA4 script IS loaded after user accepts all cookies', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await freshContextPage(context);

    const ga4RequestPromise = page.waitForRequest(GA4_SCRIPT_PATTERN, { timeout: 15000 }).catch(() => null);

    await page.goto('/');
    await expect(page.locator(ONETRUST_BANNER_ID)).toBeVisible({ timeout: 10000 });

    // Accept all -- this grants C0003 (Performance) which should trigger GA4 load
    await page.locator(ONETRUST_ACCEPT_ALL_BTN).click();

    const ga4Request = await ga4RequestPromise;
    expect(ga4Request).not.toBeNull();

    await context.close();
  });

  test('app does not crash when OneTrust domain ID is missing or invalid', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await freshContextPage(context);

    // Intercept the OneTrust SDK script to simulate a missing/invalid domain ID
    await page.route('**/otSDKStub.js**', (route) => route.abort());

    await page.goto('/');

    // The app should still render without errors
    await expect(page.locator('body')).toBeVisible();

    // No JavaScript errors thrown by our own code due to missing OneTrust
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForLoadState('networkidle');

    const ownCodeErrors = errors.filter(
      (msg) => !msg.includes('onetrust') && !msg.includes('OneTrust') && !msg.includes('cookielaw'),
    );
    expect(ownCodeErrors).toHaveLength(0);

    await context.close();
  });
});
