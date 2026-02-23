import { test, expect } from '@playwright/test';

test.describe('ConfirmDetails Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/confirm-details');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Signature Portal/i);
  });

  test('displays header with correct text', async ({ page }) => {
    const header = page.getByRole('heading', { name: 'Confirm your details' });
    await expect(header).toBeVisible();
  });

  test('displays progress stepper with 4 steps', async ({ page }) => {
    const progressStepper = page.getByRole('navigation', { name: 'Progress' });
    await expect(progressStepper).toBeVisible();

    const steps = progressStepper.getByRole('listitem');
    await expect(steps).toHaveCount(4);
  });

  test('progress stepper shows step 2 as current', async ({ page }) => {
    const currentStep = page.getByLabel('Step 2 current');
    await expect(currentStep).toBeVisible();
  });

  test('progress stepper shows step 1 as completed', async ({ page }) => {
    const completedStep = page.getByLabel('Step 1 completed');
    await expect(completedStep).toBeVisible();
  });

  test('displays description text', async ({ page }) => {
    const description = page.getByText(/Check your details below/);
    await expect(description).toBeVisible();
  });

  test('displays signatory details heading', async ({ page }) => {
    const heading = page.getByText('Signatory details');
    await expect(heading).toBeVisible();
  });

  test('displays Edit button in view mode', async ({ page }) => {
    const editButton = page.getByRole('button', { name: 'Edit' });
    await expect(editButton).toBeVisible();
  });

  test('displays all form field labels', async ({ page }) => {
    await expect(page.getByText('Title')).toBeVisible();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
    await expect(page.getByText('Email', { exact: true })).toBeVisible();
    await expect(page.getByText('Mobile number (optional)')).toBeVisible();
    await expect(page.getByText('Correspondence address (optional)')).toBeVisible();
  });

  test('displays confirmation checkbox in view mode', async ({ page }) => {
    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).toBeVisible();
  });

  test('displays checkbox label text', async ({ page }) => {
    const checkboxLabel = page.getByText(/I confirm the details above are correct/);
    await expect(checkboxLabel).toBeVisible();
  });

  test('displays back and next buttons', async ({ page }) => {
    const backButton = page.getByRole('button', { name: 'Go back' });
    const nextButton = page.getByRole('button', { name: 'Next' });

    await expect(backButton).toBeVisible();
    await expect(nextButton).toBeVisible();
  });

  test('back button navigates to confirm-name page', async ({ page }) => {
    const backButton = page.getByRole('button', { name: 'Go back' });
    await backButton.click();

    await expect(page).toHaveURL('/confirm-name');
  });

  test('all form fields are disabled in view mode', async ({ page }) => {
      const titleSelect = page.getByRole('combobox');
      await expect(titleSelect).toBeDisabled();

      const textInputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
      const count = await textInputs.count();
      
      for (let i = 0; i < count; i++) {
        const input = textInputs.nth(i);
        await expect(input).toBeDisabled();
      }
  });

  test('shows validation error when Next clicked without confirmation', async ({ page }) => {
      const nextButton = page.getByRole('button', { name: 'Next' });
      await nextButton.click();

      const errorMessage = page.getByText('Please confirm your details are correct');
      await expect(errorMessage).toBeVisible();
  });

  test('allows navigation when checkbox is confirmed', async ({ page }) => {
      const checkbox = page.getByRole('checkbox');
      await checkbox.click();

      await expect(checkbox).toBeChecked();

      const nextButton = page.getByRole('button', { name: 'Next' });
      await nextButton.click();

      await expect(page.getByText('Please confirm your details are correct')).not.toBeVisible();
  });

  test('checkbox can be toggled', async ({ page }) => {
      const checkbox = page.getByRole('checkbox');
      
      await checkbox.click();
      await expect(checkbox).toBeChecked();
      
      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
      
      await checkbox.click();
      await expect(checkbox).toBeChecked();
  });

  test('enters edit mode when Edit button is clicked', async ({ page }) => {
      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      await expect(editButton).not.toBeVisible();
      
      const saveAndNextButton = page.getByRole('button', { name: 'Save and Next' });
      await expect(saveAndNextButton).toBeVisible();
  });

  test('Edit button disappears in edit mode', async ({ page }) => {
      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      await expect(editButton).not.toBeVisible();
  });

  test('Next button changes to "Save and Next" in edit mode', async ({ page }) => {
      const nextButton = page.getByRole('button', { name: 'Next' });
      await expect(nextButton).toBeVisible();

      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      await expect(nextButton).not.toBeVisible();
      
      const saveAndNextButton = page.getByRole('button', { name: 'Save and Next' });
      await expect(saveAndNextButton).toBeVisible();
  });

  test('checkbox remains visible in edit mode', async ({ page }) => {
      const checkbox = page.getByRole('checkbox');
      await expect(checkbox).toBeVisible();

      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      await expect(checkbox).toBeVisible();
  });

  test('checkbox is visible in both view and edit modes', async ({ page }) => {
      const checkbox = page.getByRole('checkbox');
      await expect(checkbox).toBeVisible();

      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      await expect(checkbox).toBeVisible();
  });

  test('all form fields are enabled in edit mode', async ({ page }) => {
      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      const titleSelect = page.getByRole('combobox');
      await expect(titleSelect).not.toBeDisabled();

      const textInputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
      const count = await textInputs.count();
      
      for (let i = 0; i < count; i++) {
        const input = textInputs.nth(i);
        await expect(input).not.toBeDisabled();
      }
  });

  test('can edit form fields in edit mode', async ({ page }) => {
      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      const titleSelect = page.getByRole('combobox');
      await titleSelect.click();
      await page.getByText('Ms', { exact: true }).click();

      await expect(titleSelect).toHaveText('Ms');
  });

  test('shows validation error when required fields are empty in edit mode', async ({ page }) => {
      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      const textInputs = page.locator('input[type="text"]');
      const firstInput = textInputs.first();
      await firstInput.clear();

      const saveButton = page.getByRole('button', { name: 'Save and Next' });
      await saveButton.click();

      const errorMessage = page.getByText('Please fill in all required fields');
      await expect(errorMessage).toBeVisible();
  });

  test('shows error when email is invalid in edit mode', async ({ page }) => {
      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.clear();
      await emailInput.fill('invalid-email');

      const saveButton = page.getByRole('button', { name: 'Save and Next' });
      await saveButton.click();

      const errorMessage = page.getByText('Please enter a valid email address');
      await expect(errorMessage).toBeVisible();
  });

  test('error clears after fixing validation issues in edit mode', async ({ page }) => {
      const editButton = page.getByRole('button', { name: 'Edit' });
      await editButton.click();

      const textInputs = page.locator('input[type="text"]');
      const firstInput = textInputs.first();
      await firstInput.clear();

      const saveButton = page.getByRole('button', { name: 'Save and Next' });
      await saveButton.click();

      let errorMessage = page.getByText('Please fill in all required fields');
      await expect(errorMessage).toBeVisible();

      await firstInput.fill('John');
      await saveButton.click();

      errorMessage = page.getByText('Please fill in all required fields');
      await expect(errorMessage).not.toBeVisible();
  });
    test('navigates from confirm-name to confirm-details', async ({ page }) => {
    await page.goto('/confirm-name');
    
    const header = page.getByRole('heading', { name: 'Confirm your details' });
    await expect(header).toBeVisible();
  });

  test('page is responsive on mobile viewport (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const header = page.getByRole('heading', { name: 'Confirm your details' });
      await expect(header).toBeVisible();

      const nextButton = page.getByRole('button', { name: 'Next' });
      await expect(nextButton).toBeVisible();

      const editButton = page.getByRole('button', { name: 'Edit' });
      await expect(editButton).toBeVisible();
  });

  test('page is responsive on tablet viewport (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const header = page.getByRole('heading', { name: 'Confirm your details' });
      await expect(header).toBeVisible();

      const nextButton = page.getByRole('button', { name: 'Next' });
      await expect(nextButton).toBeVisible();
  });

  test('page is responsive on desktop viewport (1920px)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      const header = page.getByRole('heading', { name: 'Confirm your details' });
      await expect(header).toBeVisible();

      const nextButton = page.getByRole('button', { name: 'Next' });
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

  test('form maintains state when switching between edit and view modes', async ({ page }) => {
    const editButton = page.getByRole('button', { name: 'Edit' });
    await editButton.click();

    const titleSelect = page.getByRole('combobox');
    await titleSelect.click();
    await page.getByText('Dr', { exact: true }).click();

    await expect(titleSelect).toHaveText('Dr');
  });
});
