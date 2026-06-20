import { test, expect } from '@playwright/test';

test.describe('Find Help Tools Hub & Redirections E2E Tests', () => {
  test('/find-help page loads, contains title, selector, foundation summary, and navigation link', async ({ page }) => {
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

    // Foundation section renders
    await expect(page.getByRole('heading', { name: /Saved Resources/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(/0 saved locally/i);
    await expect(page.locator('body')).toContainText(/Saved from county and diagnosis pages:/i);
    await expect(page.getByRole('link', { name: /Browse county pages/i })).toHaveAttribute('href', '/counties/california');
    await expect(page.getByRole('link', { name: /Browse diagnosis pages/i })).toHaveAttribute('href', '/benefits/california');
    await expect(page.getByRole('heading', { name: /Live Directory Foundation/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Directory Records/i);
    await expect(page.locator('body')).toContainText(/Missing source URLs:/i);

    // Cards exist
    const cards = page.locator('.glass-panel');
    const count = await cards.count();
    // selector panel + foundation summary panel + foundation cards + tool cards
    expect(count).toBeGreaterThanOrEqual(11);

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

  test('saved resource flow persists from county page to /find-help and can be removed', async ({ page }) => {
    await page.goto('/find-help');
    await page.evaluate(() => localStorage.removeItem('ablefull_saved_directory_resources'));
    await page.reload();

    await expect(page.locator('body')).toContainText(/0 saved locally/i);

    await page.goto('/counties/california/los-angeles');

    const saveButton = page.getByRole('button', { name: /Save resource/i }).first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    const savedAfterClick = await page.evaluate(() => {
      const raw = localStorage.getItem('ablefull_saved_directory_resources');
      return raw ? JSON.parse(raw) : [];
    });
    expect(savedAfterClick.length).toBeGreaterThan(0);

    await page.goto('/find-help');
    await expect(page.locator('body')).toContainText(/1 saved locally/i);
    await expect(page.getByRole('button', { name: /Remove/i }).first()).toBeVisible();
    const backLink = page.getByRole('link', { name: /Back to this page/i }).first();
    const backHref = await backLink.getAttribute('href');
    expect(backHref).toMatch(/\/counties\/california\/los-angeles#directory-resource-/);

    await backLink.click();
    await expect(page).toHaveURL(/\/counties\/california\/los-angeles#directory-resource-/);
    const targetHash = backHref?.split('#')[1];
    const returnedCard = page.locator(`#${targetHash}`);
    await expect(returnedCard).toBeVisible();
    await expect(returnedCard).toContainText(/Returned from Saved Resources/i);
    await page.getByRole('button', { name: /Dismiss return badge/i }).click();
    await expect(returnedCard).not.toContainText(/Returned from Saved Resources/i);

    await page.goto('/find-help');
    const removeButton = page.getByRole('button', { name: /Remove/i }).first();
    await removeButton.click();
    await expect(page.locator('body')).toContainText(/0 saved locally/i);

    const savedAfterRemove = await page.evaluate(() => {
      const raw = localStorage.getItem('ablefull_saved_directory_resources');
      return raw ? JSON.parse(raw) : [];
    });
    expect(savedAfterRemove).toHaveLength(0);
  });

  test('returned-from-saved badge auto-dismisses after a short delay', async ({ page }) => {
    await page.goto('/find-help');
    await page.evaluate(() => localStorage.removeItem('ablefull_saved_directory_resources'));
    await page.goto('/counties/california/los-angeles');

    const saveButton = page.getByRole('button', { name: /Save resource/i }).first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    await page.goto('/find-help');
    const backLink = page.getByRole('link', { name: /Back to this page/i }).first();
    await backLink.click();

    const badge = page.getByText(/Returned from Saved Resources/i).first();
    await expect(badge).toBeVisible();
    await expect(badge).not.toBeVisible({ timeout: 5000 });
  });
});
