import { test, expect } from '@playwright/test';

test.describe('New York Multi-State Launch Smoke Tests', () => {
  
  test('New York hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for New York
    const hubResponse = await page.goto('/benefits/new-york');
    expect(hubResponse?.status()).toBe(200);
    
    const hubH1 = page.locator('h1');
    await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
    
    const bodyTextHub = await page.innerText('body');
    expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
    expect(bodyTextHub).not.toContain('Internal Server Error');
    expect(bodyTextHub.toUpperCase()).toContain('OPWDD REGIONAL OFFICE');
    expect(bodyTextHub).toContain('New York Medicaid');
    expect(bodyTextHub).not.toContain('LIDDA');
    expect(bodyTextHub).not.toContain('Regional Center');
    expect(bodyTextHub).not.toContain('Medi-Cal');

    // 2. Counties list page for New York
    const countiesResponse = await page.goto('/counties/new-york');
    expect(countiesResponse?.status()).toBe(200);
    
    const countiesH1 = page.locator('h1');
    await expect(countiesH1).toHaveText(/New York Counties Directory/i);
  });

  test('At least 5 New York county detail pages load cleanly without California/Texas leak', async ({ page }) => {
    const pilotCounties = [
      'kings-ny',
      'queens-ny',
      'new-york-ny',
      'bronx-ny',
      'richmond-ny'
    ];

    for (const county of pilotCounties) {
      const path = `/counties/new-york/${county}`;
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California/Texas terms
      expect(bodyText.toUpperCase()).toContain('OPWDD REGIONAL OFFICE');
      expect(bodyText).toContain('New York Medicaid');
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

  test('New York county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/new-york/kings-ny';
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Kings');
    expect(bodyText.toUpperCase()).toContain('OPWDD REGIONAL OFFICE');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('New York forms catalog and details guide load correctly', async ({ page }) => {
    // 1. New York Forms Catalog page
    const formsResponse = await page.goto('/forms?state=new-york');
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/New York Special Needs Forms Directory/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('New York Medicaid & Waiver Guides');
    expect(bodyText).toContain('Committee on Special Education (CSE)');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');

    // 2. Individual New York Parent Guide details page
    const guideResponse = await page.goto('/forms/ny-cse-evaluation-request');
    expect(guideResponse?.status()).toBe(200);

    const guideH1 = page.locator('h1');
    await expect(guideH1).toHaveText(/CSE Special Education Evaluation Request/i);
    
    const guideBody = await page.innerText('body');
    expect(guideBody).toContain('CSE Special Education Evaluation Request');
  });

  test('Sitemap quality gates include New York county roots and leaves in sitemap', async ({ page }) => {
    // Fetch and check counties.xml sitemap
    const sitemapResponse = await page.goto('/sitemaps/counties.xml');
    expect(sitemapResponse?.status()).toBe(200);

    const xmlText = await sitemapResponse.text();

    // New York county root benefits and details pages should be in sitemap
    expect(xmlText).toContain('/benefits/new-york/kings-ny');
    expect(xmlText).toContain('/counties/new-york/kings-ny');

    // New York county-diagnosis leaves should be included
    expect(xmlText).toContain('/benefits/new-york/autism-spectrum-disorder/kings-ny');
    
    // Indexable county root page should not serve a robots noindex tag
    await page.goto('/benefits/new-york/kings-ny');
    const robotsMetaRoot = page.locator('meta[name="robots"]');
    const countRoot = await robotsMetaRoot.count();
    if (countRoot > 0) {
      const content = await robotsMetaRoot.getAttribute('content');
      expect(content).not.toContain('noindex');
    }

    // Indexable county-diagnosis pages should not serve a robots noindex tag
    await page.goto('/benefits/new-york/autism-spectrum-disorder/kings-ny');
    const robotsMeta = page.locator('meta[name="robots"]');
    const count = await robotsMeta.count();
    if (count > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });
});
