import { test, expect } from '@playwright/test';

const targetCounties = [
  'los-angeles', 'orange', 'san-diego', 'riverside', 'sacramento', 
  'san-francisco', 'alameda', 'fresno', 'merced', 'mariposa'
];

test.describe('County Page Detail E2E Tests (Desktop)', () => {
  for (const county of targetCounties) {
    test(`county detail page /counties/california/${county} renders all sections`, async ({ page }) => {
      const response = await page.goto(`/counties/california/${county}`);
      expect(response?.status()).toBe(200);

      // 1. H1 with county name check
      const h1 = page.locator('h1');
      await expect(h1).toHaveText(new RegExp(county.replace(/-/g, ' '), 'i'));

      // 2. Main sections verification
      const bodyText = await page.textContent('body');
      
      // Regional Center Section
      expect(bodyText).toContain('Regional Center');
      expect(bodyText).not.toContain('No Regional Center contacts in database');

      // Special Ed / SELPA
      expect(bodyText).toContain('Special Education');
      expect(bodyText).not.toContain('No local special education boundaries listed in DB');

      // Offices & districts
      expect(bodyText).toContain('County Admin Support Offices');
      expect(bodyText).not.toContain('No county administrative offices listed in DB');
      
      expect(bodyText).toContain('School District');
      expect(bodyText).toContain('Nonprofit Support & Local Resources');

      // 3. Trust badge/status labels & freshness disclosure
      const freshness = page.locator('text=Verified Sources & Freshness Information');
      await expect(freshness).toBeVisible();

      // Check for correction flow
      const suggestUpdate = page.locator('button:has-text("Suggest update")');
      await expect(suggestUpdate.first()).toBeVisible();

      // 4. Integrity checks (no stubs, nulls, undefined, NaN)
      expect(bodyText).not.toContain('undefined');
      expect(bodyText).not.toContain('null');
      expect(bodyText).not.toContain('NaN');
      expect(bodyText).not.toContain('Verified local expert'); // unverified advocates shouldn't show this placeholder
    });
  }

  test('modal correction flow overlay opens and submits suggestions', async ({ page }) => {
    await page.goto('/counties/california/mariposa');
    
    // Find suggest update button and click
    const suggestButton = page.locator('button:has-text("Suggest update")').first();
    await suggestButton.click({ force: true });

    // Verify modal elements are visible
    const modalHeader = page.locator('h3:has-text("Suggest Correction")');
    await expect(modalHeader).toBeVisible();

    // Fill the form fields
    await page.fill('input[placeholder="Alex Johnson"]', 'Test User');
    await page.fill('input[placeholder="alex@example.com"]', 'test@example.com');
    await page.fill('textarea[placeholder*="Please provide the correct"]', 'Test correction details for E2E.');

    // Submit
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click({ force: true });

    // Wait for success indicator
    const successMsg = page.locator('text=Suggestion submitted successfully');
    await expect(successMsg).toBeVisible();
  });
});

test.describe('County Page Detail E2E Tests (Mobile Viewport)', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Pixel 5 viewport height/width fallback for mobile-chrome project

  test('Los Angeles and Mariposa county pages display correctly on mobile', async ({ page }) => {
    for (const county of ['los-angeles', 'mariposa']) {
      await page.goto(`/counties/california/${county}`);

      // Verify header logo and main H1 are visible
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // Verify that the correction trigger is readable and clickable
      const suggestButton = page.locator('button:has-text("Suggest update")').first();
      await expect(suggestButton).toBeVisible();
      
      // Ensure no horizontal scrolling overflow is visible
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow).toBe(false);
    }
  });
});
