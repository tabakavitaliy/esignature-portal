import { test, expect } from '@playwright/test';

test.describe('AddAuthorizedSign Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/add-new-name');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Signature Portal/i);
  });

  test('displays header with correct text', async ({ page }) => {
    const header = page.getByRole('heading', { name: 'Confirm signatory details' });
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

  test('displays all form fields', async ({ page }) => {
    await expect(page.getByText('Add authorised signatory information')).toBeVisible();
    await expect(page.getByText('Signatory details')).toBeVisible();
    await expect(page.getByText('Title')).toBeVisible();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
    await expect(page.getByText(/What is this person's association/)).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Confirm email')).toBeVisible();
    await expect(page.getByText('Mobile number (optional)')).toBeVisible();
    await expect(page.getByText('Correspondence address')).toBeVisible();
  });

  test('displays legal basis text', async ({ page }) => {
    const legalText = page.getByText(/By clicking Submit, I confirm/);
    await expect(legalText).toBeVisible();
  });

  test('displays data handling text', async ({ page }) => {
    const dataHandlingText = page.getByText(/Your data will be handled/);
    await expect(dataHandlingText).toBeVisible();
  });

  test('displays back and submit buttons', async ({ page }) => {
    const backButton = page.getByRole('button', { name: 'Go back' });
    const submitButton = page.getByRole('button', { name: 'Submit' });

    await expect(backButton).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('back button navigates to confirm-name page', async ({ page }) => {
    const backButton = page.getByRole('button', { name: 'Go back' });
    await backButton.click();

    await expect(page).toHaveURL('/confirm-name');
  });

  test('shows validation error when submitting empty form', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    const errorMessage = page.getByText('Please fill in all required fields');
    await expect(errorMessage).toBeVisible();
  });

  test('shows error when emails do not match', async ({ page }) => {
    await page.getByRole('combobox').first().click();
    await page.getByText('Mr', { exact: true }).click();

    await page.getByPlaceholder('Enter first name').fill('John');
    await page.getByPlaceholder('Enter last name').fill('Doe');

    await page.getByRole('combobox').nth(1).click();
    await page.getByText('Owner', { exact: true }).click();

    const emailInputs = page.getByPlaceholder('name@email.com');
    await emailInputs.first().fill('john@example.com');
    await emailInputs.nth(1).fill('different@example.com');

    await page.getByPlaceholder('Address line 1').fill('123 Main St');
    await page.getByPlaceholder('City').fill('London');
    await page.getByPlaceholder('Postcode').fill('SW1A 1AA');

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    const errorMessage = page.getByText('Email addresses do not match');
    await expect(errorMessage).toBeVisible();
  });

  test('submits form successfully with all required fields', async ({ page }) => {
    await page.getByRole('combobox').first().click();
    await page.getByText('Mr', { exact: true }).click();

    await page.getByPlaceholder('Enter first name').fill('John');
    await page.getByPlaceholder('Enter last name').fill('Doe');

    await page.getByRole('combobox').nth(1).click();
    await page.getByText('Owner', { exact: true }).click();

    const emailInputs = page.getByPlaceholder('name@email.com');
    await emailInputs.first().fill('john@example.com');
    await emailInputs.nth(1).fill('john@example.com');

    await page.getByPlaceholder('Address line 1').fill('123 Main St');
    await page.getByPlaceholder('City').fill('London');
    await page.getByPlaceholder('Postcode').fill('SW1A 1AA');

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    const errorMessage = page.getByText('Please fill in all required fields');
    await expect(errorMessage).not.toBeVisible();
  });

  test('submits form with all fields including optional ones', async ({ page }) => {
    await page.getByRole('combobox').first().click();
    await page.getByText('Dr', { exact: true }).click();

    await page.getByPlaceholder('Enter first name').fill('Jane');
    await page.getByPlaceholder('Enter last name').fill('Smith');

    await page.getByRole('combobox').nth(1).click();
    await page.getByText('Owner', { exact: true }).click();

    const emailInputs = page.getByPlaceholder('name@email.com');
    await emailInputs.first().fill('jane.smith@example.com');
    await emailInputs.nth(1).fill('jane.smith@example.com');

    await page.getByPlaceholder('Enter mobile number').fill('07700900000');

    await page.getByPlaceholder('Address line 1').fill('456 Oak Avenue');
    await page.getByPlaceholder('Address line 2 (optional)').fill('Apartment 5B');
    await page.getByPlaceholder('Address line 3 (optional)').fill('Building C');
    await page.getByPlaceholder('City').fill('Manchester');
    await page.getByPlaceholder('County (optional)').fill('Greater Manchester');
    await page.getByPlaceholder('Postcode').fill('M1 1AA');

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    const errorMessage = page.getByText('Please fill in all required fields');
    await expect(errorMessage).not.toBeVisible();
  });

  test('title dropdown shows all options', async ({ page }) => {
    await page.getByRole('combobox').first().click();

    await expect(page.getByText('Mr', { exact: true })).toBeVisible();
    await expect(page.getByText('Mrs', { exact: true })).toBeVisible();
    await expect(page.getByText('Miss', { exact: true })).toBeVisible();
    await expect(page.getByText('Ms', { exact: true })).toBeVisible();
    await expect(page.getByText('Dr', { exact: true })).toBeVisible();
  });

  test('address association dropdown shows Owner option', async ({ page }) => {
    await page.getByRole('combobox').nth(1).click();

    await expect(page.getByText('Owner', { exact: true })).toBeVisible();
  });

  test('form fields accept user input', async ({ page }) => {
    const firstNameInput = page.getByPlaceholder('Enter first name');
    await firstNameInput.fill('Test');
    await expect(firstNameInput).toHaveValue('Test');

    const lastNameInput = page.getByPlaceholder('Enter last name');
    await lastNameInput.fill('User');
    await expect(lastNameInput).toHaveValue('User');

    const mobileInput = page.getByPlaceholder('Enter mobile number');
    await mobileInput.fill('07700900123');
    await expect(mobileInput).toHaveValue('07700900123');

    const cityInput = page.getByPlaceholder('City');
    await cityInput.fill('London');
    await expect(cityInput).toHaveValue('London');
  });

  test('email inputs are separate fields', async ({ page }) => {
    const emailInputs = page.getByPlaceholder('name@email.com');
    await expect(emailInputs).toHaveCount(2);

    await emailInputs.first().fill('first@example.com');
    await emailInputs.nth(1).fill('second@example.com');

    await expect(emailInputs.first()).toHaveValue('first@example.com');
    await expect(emailInputs.nth(1)).toHaveValue('second@example.com');
  });

  test('error clears after fixing validation issues', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    let errorMessage = page.getByText('Please fill in all required fields');
    await expect(errorMessage).toBeVisible();

    await page.getByRole('combobox').first().click();
    await page.getByText('Mr', { exact: true }).click();

    await page.getByPlaceholder('Enter first name').fill('John');
    await page.getByPlaceholder('Enter last name').fill('Doe');

    await page.getByRole('combobox').nth(1).click();
    await page.getByText('Owner', { exact: true }).click();

    const emailInputs = page.getByPlaceholder('name@email.com');
    await emailInputs.first().fill('john@example.com');
    await emailInputs.nth(1).fill('john@example.com');

    await page.getByPlaceholder('Address line 1').fill('123 Main St');
    await page.getByPlaceholder('City').fill('London');
    await page.getByPlaceholder('Postcode').fill('SW1A 1AA');

    await submitButton.click();

    errorMessage = page.getByText('Please fill in all required fields');
    await expect(errorMessage).not.toBeVisible();
  });

  test('page has proper semantic structure', async ({ page }) => {
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();

    const main = page.getByRole('main');
    await expect(main).toBeVisible();

    const navigation = page.getByRole('navigation', { name: 'Progress' });
    await expect(navigation).toBeVisible();
  });

  test('page is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const header = page.getByRole('heading', { name: 'Confirm signatory details' });
    await expect(header).toBeVisible();

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeVisible();
  });

  test('page is responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const header = page.getByRole('heading', { name: 'Confirm signatory details' });
    await expect(header).toBeVisible();

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeVisible();
  });

  test('customer privacy notice link is visible', async ({ page }) => {
    const privacyLink = page.getByText('Customer privacy notice');
    await expect(privacyLink).toBeVisible();
  });

  test('form maintains state when switching between fields', async ({ page }) => {
    await page.getByPlaceholder('Enter first name').fill('John');
    await page.getByPlaceholder('Enter last name').fill('Doe');

    const firstNameInput = page.getByPlaceholder('Enter first name');
    const lastNameInput = page.getByPlaceholder('Enter last name');

    await expect(firstNameInput).toHaveValue('John');
    await expect(lastNameInput).toHaveValue('Doe');

    await page.getByPlaceholder('City').fill('London');

    await expect(firstNameInput).toHaveValue('John');
    await expect(lastNameInput).toHaveValue('Doe');
  });
});
