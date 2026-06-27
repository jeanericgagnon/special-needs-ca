import { test, expect } from '@playwright/test';

test.describe('Forms and Guides E2E Tests', () => {
  test('forms index page /forms loads and lists core documents', async ({ page }) => {
    const response = await page.goto('/forms');
    expect(response?.status()).toBe(200);

    const h1 = page.locator('h1');
    await expect(h1).toHaveText(/California Special Needs Forms Directory/i);

    // Verify presence of form links
    const soc873Link = page.locator('a[href="/forms/soc-873"]');
    await expect(soc873Link).toBeVisible();

    const iepLink = page.locator('a[href="/forms/iep-assessment-request"]');
    await expect(iepLink).toBeVisible();

    const cdeLink = page.locator('a[href="/forms/cde-state-complaint"]');
    await expect(cdeLink).toBeVisible();
  });

  const targetForms = [
    '/forms/soc-873',
    '/forms/soc-821',
    '/forms/ccs-application',
    '/forms/iep-assessment-request',
    '/forms/cde-state-complaint',
    '/forms/due-process-complaint'
  ];

  for (const formPath of targetForms) {
    test(`form detail page ${formPath} renders all layout details`, async ({ page }) => {
      const response = await page.goto(formPath);
      expect(response?.status()).toBe(200);

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // Quick Answer section
      const bodyText = await page.innerText('body');
      expect(bodyText).toContain('Quick Answer');
      expect(bodyText).toContain('What to Do First');
      expect(bodyText).toContain('Documents & Evidence to Gather');

      // Check official download link
      const downloadLink = page.locator('a:has-text("Official Portal"), a:has-text("Source Website"), a:has-text("Open Source"), a:has-text("Download Official Form")');
      await expect(downloadLink.first()).toBeAttached();

      // Freshness Footnotes
      const freshness = page.getByText(/Source (Notes|Verified Sources) & Freshness Information/i);
      await expect(freshness).toBeVisible();

      // Printable templates or script helper (e.g. Call Script or Letter template)
      expect(bodyText).toMatch(/Phone Script|Cover Letter|Briefing Document|Request Letter|Intake Phone Script/i);
    });
  }

  const targetGuides = [
    '/situations/ihss-protective-supervision',
    '/situations/early-start-age-3-transition',
    '/programs/ihss-for-children',
    '/programs/ssi-for-children',
    '/programs/medi-cal-epsdt',
    '/programs/ccs',
    '/programs/calable'
  ];

  for (const guidePath of targetGuides) {
    test(`resource guide page ${guidePath} loads and is complete`, async ({ page }) => {
      const response = await page.goto(guidePath);
      expect(response?.status()).toBe(200);

      // Verify header/title
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      const bodyText = await page.innerText('body');
      expect(bodyText).toContain('Quick Answer');
      expect(bodyText).toContain('Common Mistakes');

      // Check freshness disclosure
      const freshness = page.getByText(/Source (Notes|Verified Sources) & Freshness Information/i);
      await expect(freshness).toBeVisible();

      // Assert no null placeholders
      expect(bodyText).not.toContain('undefined');
      expect(bodyText).not.toContain('null');
      expect(bodyText).not.toContain('NaN');
    });
  }
});
