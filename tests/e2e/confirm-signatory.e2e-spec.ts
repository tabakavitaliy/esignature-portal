import { test, expect } from '@playwright/test';

test.describe('ConfirmSignatory Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/confirm-signatory');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Signature Portal/i);
  });

  test('displays header with correct text', async ({ page }) => {
    const header = page.getByRole('heading', { name: 'Confirm your authority' });
    await expect(header).toBeVisible();
  });

  test('displays progress stepper with 4 steps', async ({ page }) => {
    const progressStepper = page.getByRole('navigation', { name: 'Progress' });
    await expect(progressStepper).toBeVisible();

    const steps = progressStepper.getByRole('listitem');
    await expect(steps).toHaveCount(4);
  });

  test('progress stepper shows step 3 as current', async ({ page }) => {
    const currentStep = page.getByLabel('Step 3 current');
    await expect(currentStep).toBeVisible();
  });

  test('progress stepper shows steps 1-2 as completed', async ({ page }) => {
    const completedStep1 = page.getByLabel('Step 1 completed');
    await expect(completedStep1).toBeVisible();

    const completedStep2 = page.getByLabel('Step 2 completed');
    await expect(completedStep2).toBeVisible();
  });

  test('progress stepper shows step 4 as upcoming', async ({ page }) => {
    const upcomingStep = page.getByLabel('Step 4 upcoming');
    await expect(upcomingStep).toBeVisible();
  });

  test('displays address count text', async ({ page }) => {
    const addressText = page.getByText(/address(es)? associated with this agreement/i);
    await expect(addressText).toBeVisible();
  });

  test('displays authority question text', async ({ page }) => {
    const question = page.getByText(/Are you authorised to consent to the wayleave agreement/i);
    await expect(question).toBeVisible();
  });

  test('displays two authority radio options', async ({ page }) => {
    const yesOption = page.getByText('Yes, I have the authority');
    const noOption = page.getByText('No, I do not have the authority');

    await expect(yesOption).toBeVisible();
    await expect(noOption).toBeVisible();
  });

  test('radio buttons are functional', async ({ page }) => {
    const radios = page.getByRole('radio');
    await expect(radios).toHaveCount(2);

    const yesRadio = radios.first();
    const noRadio = radios.last();

    await expect(yesRadio).not.toBeChecked();
    await expect(noRadio).not.toBeChecked();

    await yesRadio.click();
    await expect(yesRadio).toBeChecked();
    await expect(noRadio).not.toBeChecked();

    await noRadio.click();
    await expect(yesRadio).not.toBeChecked();
    await expect(noRadio).toBeChecked();
  });

  test('displays back and preview agreement buttons', async ({ page }) => {
    const backButton = page.getByRole('button', { name: 'Go back' });
    const nextButton = page.getByRole('button', { name: 'Preview agreement' });

    await expect(backButton).toBeVisible();
    await expect(nextButton).toBeVisible();
  });

  test('back button navigates to confirm-details page', async ({ page }) => {
    const backButton = page.getByRole('button', { name: 'Go back' });
    await backButton.click();

    await expect(page).toHaveURL('/confirm-details');
  });

  test('shows validation error when clicking Preview agreement with no selection', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: 'Preview agreement' });
    await nextButton.click();

    const errorMessage = page.getByText('You need to select an authority option to proceed');
    await expect(errorMessage).toBeVisible();
  });

  test('error clears after selecting an authority option', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: 'Preview agreement' });
    await nextButton.click();

    let errorMessage = page.getByText('You need to select an authority option to proceed');
    await expect(errorMessage).toBeVisible();

    const radios = page.getByRole('radio');
    await radios.first().click();

    await nextButton.click();

    errorMessage = page.getByText('You need to select an authority option to proceed');
    await expect(errorMessage).not.toBeVisible();
  });

  test('selecting Yes and clicking Preview agreement navigates to preview-agreement', async ({ page }) => {
    const radios = page.getByRole('radio');
    const yesRadio = radios.first();

    await yesRadio.click();
    await expect(yesRadio).toBeChecked();

    const nextButton = page.getByRole('button', { name: 'Preview agreement' });
    await nextButton.click();

    await expect(page).toHaveURL('/preview-agreement');
  });

  test('selecting No changes button text to Next', async ({ page }) => {
    const radios = page.getByRole('radio');
    const noRadio = radios.last();

    await noRadio.click();

    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeVisible();

    const previewButton = page.getByRole('button', { name: 'Preview agreement' });
    await expect(previewButton).not.toBeVisible();
  });

  test('selecting No and clicking Next navigates to not-authorized-signatory', async ({ page }) => {
    const radios = page.getByRole('radio');
    const noRadio = radios.last();

    await noRadio.click();
    await expect(noRadio).toBeChecked();

    const nextButton = page.getByRole('button', { name: 'Next' });
    await nextButton.click();

    await expect(page).toHaveURL('/not-authorized-signatory');
  });

  test('button text switches when toggling between Yes and No', async ({ page }) => {
    const radios = page.getByRole('radio');
    const yesRadio = radios.first();
    const noRadio = radios.last();

    await yesRadio.click();
    let previewButton = page.getByRole('button', { name: 'Preview agreement' });
    await expect(previewButton).toBeVisible();

    await noRadio.click();
    let nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeVisible();
    await expect(previewButton).not.toBeVisible();

    await yesRadio.click();
    previewButton = page.getByRole('button', { name: 'Preview agreement' });
    await expect(previewButton).toBeVisible();
    nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).not.toBeVisible();
  });

  test('page is responsive on mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const header = page.getByRole('heading', { name: 'Confirm your authority' });
    await expect(header).toBeVisible();

    const backButton = page.getByRole('button', { name: 'Go back' });
    const nextButton = page.getByRole('button', { name: 'Preview agreement' });

    await expect(backButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    const radios = page.getByRole('radio');
    await expect(radios).toHaveCount(2);
  });

  test('page is responsive on tablet viewport (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const header = page.getByRole('heading', { name: 'Confirm your authority' });
    await expect(header).toBeVisible();

    const backButton = page.getByRole('button', { name: 'Go back' });
    const nextButton = page.getByRole('button', { name: 'Preview agreement' });

    await expect(backButton).toBeVisible();
    await expect(nextButton).toBeVisible();
  });

  test('page is responsive on desktop viewport (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const header = page.getByRole('heading', { name: 'Confirm your authority' });
    await expect(header).toBeVisible();

    const backButton = page.getByRole('button', { name: 'Go back' });
    const nextButton = page.getByRole('button', { name: 'Preview agreement' });

    await expect(backButton).toBeVisible();
    await expect(nextButton).toBeVisible();
  });

  test('page has proper semantic structure', async ({ page }) => {
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();

    const main = page.getByRole('main');
    await expect(main).toBeVisible();

    const navigation = page.getByRole('navigation', { name: 'Progress' });
    await expect(navigation).toBeVisible();
  });

  test('customer privacy notice link is visible', async ({ page }) => {
    const privacyLink = page.getByText('Customer privacy notice');
    await expect(privacyLink).toBeVisible();
  });

  test('radio buttons can be toggled multiple times', async ({ page }) => {
    const radios = page.getByRole('radio');
    const yesRadio = radios.first();
    const noRadio = radios.last();

    await yesRadio.click();
    await expect(yesRadio).toBeChecked();

    await noRadio.click();
    await expect(noRadio).toBeChecked();
    await expect(yesRadio).not.toBeChecked();

    await yesRadio.click();
    await expect(yesRadio).toBeChecked();
    await expect(noRadio).not.toBeChecked();

    await noRadio.click();
    await expect(noRadio).toBeChecked();
    await expect(yesRadio).not.toBeChecked();
  });

  test('clicking radio label selects the radio button', async ({ page }) => {
    const yesLabel = page.getByText('Yes, I have the authority');
    const radios = page.getByRole('radio');
    const yesRadio = radios.first();

    await expect(yesRadio).not.toBeChecked();

    await yesLabel.click();

    await expect(yesRadio).toBeChecked();
  });
});
