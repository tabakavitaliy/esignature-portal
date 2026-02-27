import { test, expect } from '@playwright/test';

test.describe('Inactivity Timeout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/confirm-name');
    
    await page.evaluate(() => {
      sessionStorage.setItem('token', 'TEST-1234-5678-9012');
    });
    await page.reload();
  });

  test('shows warning modal after 10 minutes of inactivity', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(10 * 60 * 1000);

    const modal = page.getByText(
      'Are you still there? Your session will expire soon due to inactivity'
    );
    await expect(modal).toBeVisible();
  });

  test('warning modal displays countdown timer', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(10 * 60 * 1000);
    
    const modal = page.getByText(
      'Are you still there? Your session will expire soon due to inactivity'
    );
    await expect(modal).toBeVisible();

    const minutes = page.getByText('02');
    const seconds = page.getByText('00');
    await expect(minutes).toBeVisible();
    await expect(seconds).toBeVisible();
  });

  test('warning modal displays clock icon', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(10 * 60 * 1000);

    const clockIcon = page.getByRole('img', { name: 'Clock' });
    await expect(clockIcon).toBeVisible();
  });

  test('warning modal displays both buttons', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(10 * 60 * 1000);

    const imHereButton = page.getByRole('button', { name: "I'm here" });
    const logOffButton = page.getByRole('button', { name: 'Log off' });

    await expect(imHereButton).toBeVisible();
    await expect(logOffButton).toBeVisible();
  });

  test('I\'m here button dismisses modal and resets timer', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(10 * 60 * 1000);

    const modal = page.getByText(
      'Are you still there? Your session will expire soon due to inactivity'
    );
    await expect(modal).toBeVisible();

    const imHereButton = page.getByRole('button', { name: "I'm here" });
    await imHereButton.click();

    await expect(modal).not.toBeVisible();
    
    await page.clock.fastForward(9 * 60 * 1000);
    await expect(modal).not.toBeVisible();
    
    await page.clock.fastForward(1 * 60 * 1000);
    await expect(modal).toBeVisible();
  });

  test('Log off button navigates to expired session page', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(10 * 60 * 1000);

    const logOffButton = page.getByRole('button', { name: 'Log off' });
    await logOffButton.click();

    await expect(page).toHaveURL('/expired-session');
  });

  test('redirects to expired session when countdown reaches zero', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(10 * 60 * 1000);

    const modal = page.getByText(
      'Are you still there? Your session will expire soon due to inactivity'
    );
    await expect(modal).toBeVisible();

    await page.clock.fastForward(120 * 1000);

    await expect(page).toHaveURL('/expired-session');
  });

  test('click activity resets inactivity timer', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(9 * 60 * 1000);

    await page.mouse.click(100, 100);

    await page.clock.fastForward(9 * 60 * 1000);

    const modal = page.getByText(
      'Are you still there? Your session will expire soon due to inactivity'
    );
    await expect(modal).not.toBeVisible();
  });

  test('scroll activity resets inactivity timer', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(9 * 60 * 1000);

    await page.mouse.wheel(0, 100);

    await page.clock.fastForward(9 * 60 * 1000);

    const modal = page.getByText(
      'Are you still there? Your session will expire soon due to inactivity'
    );
    await expect(modal).not.toBeVisible();
  });

  test('expired session page displays correct message', async ({ page }) => {
    await page.goto('/expired-session');

    const message = page.getByText(
      'Your session has expired due to inactivity. Use the eSignature credential to login again'
    );
    await expect(message).toBeVisible();
  });

  test('expired session page displays clock icon', async ({ page }) => {
    await page.goto('/expired-session');

    const clockIcon = page.getByRole('img', { name: 'Clock' });
    await expect(clockIcon).toBeVisible();
  });

  test('expired session page displays login button', async ({ page }) => {
    await page.goto('/expired-session');

    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
  });

  test('login button on expired session page navigates to home', async ({ page }) => {
    await page.goto('/expired-session');

    const loginButton = page.getByRole('button', { name: 'Login' });
    await loginButton.click();

    await expect(page).toHaveURL('/');
  });

  test('does not show modal on login page', async ({ page }) => {
    await page.goto('/');
    
    await page.clock.install({ time: new Date() });
    await page.clock.fastForward(10 * 60 * 1000);

    const modal = page.getByText(
      'Are you still there? Your session will expire soon due to inactivity'
    );
    await expect(modal).not.toBeVisible();
  });

  test('does not show modal on expired session page', async ({ page }) => {
    await page.goto('/expired-session');
    
    await page.clock.install({ time: new Date() });
    await page.clock.fastForward(10 * 60 * 1000);

    const modal = page.getByText(
      'Are you still there? Your session will expire soon due to inactivity'
    );
    await expect(modal).not.toBeVisible();
  });

  test('token is cleared after logout', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(10 * 60 * 1000);

    const logOffButton = page.getByRole('button', { name: 'Log off' });
    await logOffButton.click();

    const token = await page.evaluate(() => sessionStorage.getItem('token'));
    expect(token).toBeNull();
  });

  test('expired session page has correct header', async ({ page }) => {
    await page.goto('/expired-session');

    const header = page.getByRole('heading', { name: 'Signature Portal' });
    await expect(header).toBeVisible();

    const subtitle = page.getByText('Powered by Liberty Blume');
    await expect(subtitle).toBeVisible();
  });

  test('modal overlay has correct styling', async ({ page }) => {
    await page.clock.install({ time: new Date() });
    
    await page.clock.fastForward(10 * 60 * 1000);

    const modal = page.getByText(
      'Are you still there? Your session will expire soon due to inactivity'
    );
    await expect(modal).toBeVisible();

    const overlay = page.locator('.backdrop-blur-\\[2px\\]').first();
    await expect(overlay).toBeVisible();
  });
});
