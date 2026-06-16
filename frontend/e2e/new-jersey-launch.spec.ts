import { test, expect } from '@playwright/test';

test.describe('New Jersey Multi-State Launch Smoke Tests', () => {
  
  test('New Jersey hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for New Jersey
    const hubResponse = await page.goto('/benefits/new-jersey');
    expect(hubResponse?.status()).toBe(200);
    
    const hubH1 = page.locator('h1');
    await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
    
    const bodyTextHub = await page.innerText('body');
    expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
    expect(bodyTextHub).not.toContain('Internal Server Error');
    expect(bodyTextHub).toContain('New Jersey Medicaid');
    expect(bodyTextHub).not.toContain('LIDDA');
    expect(bodyTextHub).not.toContain('Regional Center');
    expect(bodyTextHub).not.toContain('Medi-Cal');

    // 2. Counties list page for New Jersey
    const countiesResponse = await page.goto('/counties/new-jersey');
    expect(countiesResponse?.status()).toBe(200);
    
    const countiesH1 = page.locator('h1');
    await expect(countiesH1).toHaveText(/New Jersey Counties Directory/i);
  });

  test('At least 2 New Jersey pilot county detail pages load cleanly without California/Texas leak', async ({ page }) => {
    const pilotCounties = [
      'bergen-nj',
      'middlesex-nj'
    ];

    for (const county of pilotCounties) {
      const path = `/counties/new-jersey/${county}`;
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California/Texas terms
      expect(bodyText).toContain('New Jersey Medicaid');
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

  test('New Jersey county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/new-jersey/bergen-nj';
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Bergen');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('New Jersey forms catalog loads correctly', async ({ page }) => {
    const formsResponse = await page.goto('/forms?state=new-jersey');
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/New Jersey Special Needs Forms Directory/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('New Jersey Medicaid');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');
  });

  test('Sitemap quality gates include New Jersey county roots and leaves in sitemap', async ({ page }) => {
    // Fetch and check counties.xml sitemap
    const sitemapResponse = await page.goto('/sitemaps/counties.xml');
    expect(sitemapResponse?.status()).toBe(200);

    const xmlText = await sitemapResponse.text();

    // New Jersey county root benefits and details pages should be in sitemap
    expect(xmlText).toContain('/benefits/new-jersey/bergen-nj');
    expect(xmlText).toContain('/counties/new-jersey/bergen-nj');

    // New Jersey county-diagnosis leaves should be included
    expect(xmlText).toContain('/benefits/new-jersey/autism-spectrum-disorder/bergen-nj');
    
    // Indexable county root page should not serve a robots noindex tag
    await page.goto('/benefits/new-jersey/bergen-nj');
    const robotsMetaRoot = page.locator('meta[name="robots"]');
    const countRoot = await robotsMetaRoot.count();
    if (countRoot > 0) {
      const content = await robotsMetaRoot.getAttribute('content');
      expect(content).not.toContain('noindex');
    }

    // Indexable county-diagnosis pages should not serve a robots noindex tag
    await page.goto('/benefits/new-jersey/autism-spectrum-disorder/bergen-nj');
    const robotsMeta = page.locator('meta[name="robots"]');
    const count = await robotsMeta.count();
    if (count > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });
});
