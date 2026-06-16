import { test, expect } from '@playwright/test';

test.describe('Georgia Multi-State Launch Smoke Tests', () => {
  
  test('Georgia hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for Georgia
    const hubResponse = await page.goto('/benefits/georgia');
    expect(hubResponse?.status()).toBe(200);
    
    const hubH1 = page.locator('h1');
    await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
    
    const bodyTextHub = await page.innerText('body');
    expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
    expect(bodyTextHub).not.toContain('Internal Server Error');
    expect(bodyTextHub.toUpperCase()).toContain('DBHDD REGION');
    expect(bodyTextHub).toContain('Georgia Medicaid');
    expect(bodyTextHub).not.toContain('LIDDA');
    expect(bodyTextHub).not.toContain('Regional Center');
    expect(bodyTextHub).not.toContain('Medi-Cal');

    // 2. Counties list page for Georgia
    const countiesResponse = await page.goto('/counties/georgia');
    expect(countiesResponse?.status()).toBe(200);
    
    const countiesH1 = page.locator('h1');
    await expect(countiesH1).toHaveText(/Georgia Counties Directory/i);
  });

  test('At least 5 Georgia county detail pages load cleanly without California/Texas leak', async ({ page }) => {
    const pilotCounties = [
      'fulton-ga',
      'gwinnett-ga',
      'cobb-ga',
      'dekalb-ga',
      'clayton-ga'
    ];

    for (const county of pilotCounties) {
      const path = `/counties/georgia/${county}`;
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California/Texas terms
      expect(bodyText.toUpperCase()).toContain('DBHDD REGION');
      expect(bodyText).toContain('Georgia Medicaid');
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

  test('Georgia county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/georgia/fulton-ga';
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Fulton');
    expect(bodyText.toUpperCase()).toContain('DBHDD REGION');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('Georgia forms catalog and details guide load correctly', async ({ page }) => {
    // 1. Georgia Forms Catalog page
    const formsResponse = await page.goto('/forms?state=georgia');
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/Georgia Special Needs Forms Directory/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Georgia Medicaid & Waiver Guides');
    expect(bodyText).toContain('GaDOE Special Education');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');

    // 2. Individual Georgia Parent Guide details page
    const guideResponse = await page.goto('/forms/ga-iep-evaluation-request');
    expect(guideResponse?.status()).toBe(200);

    const guideH1 = page.locator('h1');
    await expect(guideH1).toHaveText(/Georgia IEP Special Ed Evaluation Request/i);
    
    const guideBody = await page.innerText('body');
    expect(guideBody).toContain('Georgia IEP Special Ed Evaluation Request');
  });

  test('Sitemap quality gates include Georgia county roots and leaves in sitemap', async ({ page }) => {
    // Fetch and check counties.xml sitemap
    const sitemapResponse = await page.goto('/sitemaps/counties.xml');
    expect(sitemapResponse?.status()).toBe(200);

    const xmlText = await sitemapResponse.text();

    // Georgia county root benefits and details pages should be in sitemap
    expect(xmlText).toContain('/benefits/georgia/fulton-ga');
    expect(xmlText).toContain('/counties/georgia/fulton-ga');

    // Georgia county-diagnosis leaves should be included
    expect(xmlText).toContain('/benefits/georgia/autism-spectrum-disorder/fulton-ga');
    
    // Indexable county root page should not serve a robots noindex tag
    await page.goto('/benefits/georgia/fulton-ga');
    const robotsMetaRoot = page.locator('meta[name="robots"]');
    const countRoot = await robotsMetaRoot.count();
    if (countRoot > 0) {
      const content = await robotsMetaRoot.getAttribute('content');
      expect(content).not.toContain('noindex');
    }

    // Indexable county-diagnosis pages should not serve a robots noindex tag
    await page.goto('/benefits/georgia/autism-spectrum-disorder/fulton-ga');
    const robotsMeta = page.locator('meta[name="robots"]');
    const count = await robotsMeta.count();
    if (count > 0) {
      const content = await robotsMeta.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });
});
