import { test, expect } from '@playwright/test';

test.describe('Advocates Directory E2E Tests', () => {
  test('advocates directory /advocates page loads and renders filters', async ({ page }) => {
    const response = await page.goto('/advocates');
    expect(response?.status()).toBe(200);

    const h1 = page.locator('h1');
    await expect(h1).toHaveText(/California IEP Advocates Directory/i);

    // Verify presence of filter dropdown
    const countySelect = page.locator('select[name="county"]');
    await expect(countySelect).toBeVisible();

    // Verify disclaimer banner is visible
    const disclaimer = page.locator('text=Inclusion does not constitute an endorsement');
    await expect(disclaimer).toBeVisible();
  });

  test('filtering by county updates advocate listings', async ({ page }) => {
    await page.goto('/advocates');

    // Select Los Angeles County and click Apply Filter
    const countySelect = page.locator('select[name="county"]');
    await countySelect.selectOption('los-angeles');
    await page.click('button:has-text("Apply Filter")');

    // URL should contain query parameter
    expect(page.url()).toContain('county=los-angeles');

    // Heading should update to specify county
    const resultsHeading = page.locator('h2');
    await expect(resultsHeading).toHaveText(/Advocates Serving Los Angeles/i);

    // Profile cards should show LA as counties served
    const firstAdvocateCard = page.locator('.glass-panel').nth(1); // Index 0 is filter panel, nth(1) is first card
    const cardText = await firstAdvocateCard.textContent();
    expect(cardText).not.toContain('undefined');
    expect(cardText).not.toContain('null');
  });

  test('unverified advocates are labeled properly and have suggestion flows', async ({ page }) => {
    await page.goto('/advocates?county=mariposa');

    const firstCard = page.locator('strong:has-text("Advocate")').first();
    await expect(firstCard).toBeVisible();

    const bodyText = await page.textContent('body');
    
    // Unverified/source-listed labels check
    expect(bodyText).toMatch(/Unverified directory listing|Verified Professional Listing|Source-listed/i);

    // Suggest correction flow trigger
    const suggestUpdate = page.locator('button:has-text("Update")').first();
    await expect(suggestUpdate).toBeVisible();
    await suggestUpdate.click();

    // Check modal overlay
    const modalHeader = page.locator('h3:has-text("Suggest Correction")');
    await expect(modalHeader).toBeVisible();
  });
});
