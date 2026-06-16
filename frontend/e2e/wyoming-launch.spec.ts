import { test, expect } from '@playwright/test';

test.describe('Wyoming Multi-State Launch Smoke Tests', () => {
  
  test('Wyoming hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for Wyoming
    const hubResponse = await page.goto('/benefits/wyoming');
    expect(hubResponse?.status()).toBe(200);
    
    const hubH1 = page.locator('h1');
    await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
    
    const bodyTextHub = await page.innerText('body');
    expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
    expect(bodyTextHub).not.toContain('Internal Server Error');
    expect(bodyTextHub).toContain('Wyoming Medicaid');
    expect(bodyTextHub).not.toContain('LIDDA');
    expect(bodyTextHub).not.toContain('Regional Center');
    expect(bodyTextHub).not.toContain('Medi-Cal');

    // 2. Counties list page for Wyoming
    const countiesResponse = await page.goto('/counties/wyoming');
    expect(countiesResponse?.status()).toBe(200);
    
    const countiesH1 = page.locator('h1');
    await expect(countiesH1).toHaveText(/Wyoming Counties Directory/i);
  });

  test('At least 2 Wyoming pilot county detail pages load cleanly without California/Texas leak', async ({ page }) => {
    const pilotCounties = [
      'albany-wy',
      'laramie-wy'
    ];

    for (const county of pilotCounties) {
      const path = `/counties/wyoming/${county}`;
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California/Texas terms
      expect(bodyText).toContain('Wyoming Medicaid');
      expect(bodyText).not.toContain('LIDDA');
      expect(bodyText).not.toContain('Regional Center');
      expect(bodyText).not.toContain('Medi-Cal');
      expect(bodyText).not.toContain('IHSS');
      expect(bodyText).not.toContain('SELPA');

      // Verify source freshness disclosure is rendered at the bottom
      expect(bodyText).toContain('VERIFIED SOURCES');
      
      // Verify correction flow triggers exist (rendered inside TrustBadge)
      const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
      await expect(correctionTriggers.first()).toBeVisible();
    }
  });

  test('Wyoming county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/wyoming/albany-wy';
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Albany');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('Wyoming forms catalog loads correctly', async ({ page }) => {
    const formsResponse = await page.goto('/forms?state=wyoming');
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/Wyoming Special Needs Forms Directory/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Wyoming Medicaid');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');
  });

  test('Sitemap quality gates include Wyoming county roots and leaves in sitemap', async ({ page }) => {
    // Fetch and check counties.xml sitemap
    const sitemapResponse = await page.goto('/sitemaps/counties.xml');
    expect(sitemapResponse?.status()).toBe(200);

    const xmlText = await sitemapResponse.text();

    // Wyoming county root benefits and details pages should be in sitemap
    expect(xmlText).toContain('/benefits/wyoming/albany-wy');
    expect(xmlText).toContain('/counties/wyoming/albany-wy');

    // Wyoming county-diagnosis leaves should be included
    expect(xmlText).toContain('/benefits/wyoming/autism-spectrum-disorder/albany-wy');
    
    // Indexable county root page should not serve a robots noindex tag
    await page.goto('/benefits/wyoming/albany-wy');
    const robotsMetaRoot = page.locator('meta[name="robots"]');
    const countRoot = await robotsMetaRoot.count();
    if (countRoot > 0) {
      const content = await robotsMetaRoot.getAttribute('content');
      expect(content).not.toContain('noindex');
    }

    // Indexable county-diagnosis pages should not serve a robots noindex tag
    await page.goto('/benefits/wyoming/autism-spectrum-disorder/albany-wy');
    const robotsMeta = page.locator('meta[name="robots"]');
    const count = await robotsMeta.count();
    if (count > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });
});
