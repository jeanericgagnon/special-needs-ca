import { test, expect } from '@playwright/test';

test.describe('Find Help Tools Hub & Redirections E2E Tests', () => {
  test('/find-help page loads, contains title, selector, and navigation link', async ({ page }) => {
    const response = await page.goto('/find-help');
    expect(response?.status()).toBe(200);

    // Title checks
    const h1 = page.locator('h1');
    await expect(h1).toHaveText(/Parent Support & Tools Hub/i);

    // Dynamic State selector exists
    const select = page.locator('select');
    await expect(select).toBeVisible();

    // Default value is California
    await expect(select).toHaveValue('california');

    // Cards exist
    const cards = page.locator('.glass-panel');
    const count = await cards.count();
    // 9 cards + 1 selector panel = 10 panels
    expect(count).toBeGreaterThanOrEqual(10);

    // Check header link
    const findHelpNavLink = page.locator('header nav a:has-text("Find Help")');
    await expect(findHelpNavLink).toBeVisible();
    await expect(findHelpNavLink).toHaveAttribute('href', '/find-help');
  });

  test('state selector modifies card content dynamically', async ({ page }) => {
    await page.goto('/find-help');

    // Initially California: check that IHSS is mentioned
    await expect(page.locator('body')).toContainText('IHSS Protective Supervision');
    await expect(page.locator('body')).toContainText('California DDS Purchase of Service');

    // Select Texas
    await page.selectOption('select', 'texas');

    // Check that Texas local agency LIDDA and Texas Medicaid waiver are mentioned
    await expect(page.locator('body')).toContainText('LIDDA');
    await expect(page.locator('body')).not.toContainText('California DDS Purchase of Service');

    // Select Florida
    await page.selectOption('select', 'florida');
    await expect(page.locator('body')).toContainText('ABLE United');
  });

  test('/counties root route redirects to /counties/california', async ({ page }) => {
    // Navigate to /counties and verify it redirects to /counties/california
    await page.goto('/counties');
    expect(page.url()).toContain('/counties/california');
  });
});
