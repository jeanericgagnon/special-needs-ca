import { test, expect } from '@playwright/test';

const targetCounties = [
  'los-angeles', 'orange', 'san-diego', 'riverside', 'sacramento', 
  'san-francisco', 'alameda', 'fresno', 'merced', 'mariposa'
];

test.describe('County Page Detail E2E Tests (Desktop)', () => {
  for (const county of targetCounties) {
    test(`county detail page /counties/california/${county} renders all sections`, async ({ page }) => {
      const response = await page.goto(`/counties/california/${county}`, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      // 1. H1 with county name check
      const h1 = page.locator('h1');
      await expect(h1).toHaveText(new RegExp(county.replace(/-/g, ' '), 'i'));

      // 2. Main sections verification
      const bodyText = await page.innerText('body');
      
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
      const freshness = page.getByText(/Source (Notes|Verified Sources) & Freshness Information/i);
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
    await page.goto('/counties/california/mariposa', { waitUntil: 'domcontentloaded' });
    
    // Find suggest update button and click
    const suggestButton = page.locator('button:has-text("Suggest update")').first();
    await suggestButton.click({ force: true });

    // Verify modal elements are visible
    const modalHeader = page.locator('h3:has-text("Suggest Correction")');
    await expect(modalHeader).toBeVisible();

    // Fill whichever suggestion form variant is active on the page.
    const nameInput = page.locator('input[placeholder="Alex Johnson"], input[placeholder="e.g. Sarah Jenkins"]').first();
    const emailInput = page.locator('input[placeholder="alex@example.com"], input[placeholder="e.g. sarah@example.com"]').first();
    const detailsInput = page.locator('textarea[placeholder*="Please provide the correct"], textarea[placeholder*="Provide specific details"]').first();
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(detailsInput).toBeVisible();
    await nameInput.fill('Test User');
    await emailInput.fill('test@example.com');
    await detailsInput.fill('Test correction details for E2E.');

    // Submit
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click({ force: true });

    // Wait for success indicator
    await expect(page.locator('body')).toContainText(/Suggestion submitted successfully|Suggestion Received!|Thank you! Your suggestion has been recorded for community review\./);
  });
});

test.describe('County Page Detail E2E Tests (Mobile Viewport)', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Pixel 5 viewport height/width fallback for mobile-chrome project

  test('Los Angeles and Mariposa county pages display correctly on mobile', async ({ page }) => {
    for (const county of ['los-angeles', 'mariposa']) {
      await page.goto(`/counties/california/${county}`, { waitUntil: 'domcontentloaded' });

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

  test('empty fields are hidden and no broken tel: links exist on pages with manual review', async ({ page }) => {
    // Navigate to Cook County, Illinois county page which has manual-review school districts with empty phone numbers
    await page.goto('/counties/illinois/cook-il', { waitUntil: 'domcontentloaded' });
    
    // 1. Verify there are no broken tel: links
    const brokenTelLinks = await page.locator('a[href="tel:"]').count();
    expect(brokenTelLinks).toBe(0);
    
    // 2. Ensure every tel: link has non-empty phone text and valid href
    const allTelLinks = await page.locator('a[href^="tel:"]').all();
    for (const link of allTelLinks) {
      const href = await link.getAttribute('href');
      expect(href).not.toBe('tel:');
      const text = await link.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });
});

test.describe('County Index Search Analytics', () => {
  test('state county search emits search, no-results, and dead-end events', async ({ page }) => {
    await page.goto('/counties/california', { waitUntil: 'domcontentloaded' });

    const searchInput = page.locator('input[placeholder*="Type county name"]');
    await searchInput.fill('zzznomatchcounty');

    await expect(page.locator('text=No counties match your search query')).toBeVisible();
    await page.waitForTimeout(500);

    const analyticsEvents = await page.evaluate(() => {
      return (window as Window & { __ABLEFULL_DIRECTORY_ANALYTICS__?: Array<{ event: string; searchQuery?: string; resultCount?: number }> })
        .__ABLEFULL_DIRECTORY_ANALYTICS__ || [];
    });

    expect(analyticsEvents.some((event) => event.event === 'directory_search' && event.searchQuery === 'zzznomatchcounty')).toBeTruthy();
    expect(analyticsEvents.some((event) => event.event === 'directory_no_results' && event.resultCount === 0)).toBeTruthy();
    expect(analyticsEvents.some((event) => event.event === 'directory_dead_end' && event.resultCount === 0)).toBeTruthy();
  });
});
