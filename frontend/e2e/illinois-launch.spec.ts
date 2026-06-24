import { isIndexableState } from '../src/lib/publicTruth';
import { test, expect } from '@playwright/test';

test.describe('Illinois Multi-State Launch Smoke Tests', () => {
  
  test('Illinois hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for Illinois
    const hubResponse = await page.goto('/benefits/illinois');
    expect(hubResponse?.status()).toBe(200);
    
    const hubH1 = page.locator('h1');
    await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
    
    const bodyTextHub = await page.innerText('body');
    expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
    expect(bodyTextHub).not.toContain('Internal Server Error');
    expect(bodyTextHub.toUpperCase()).toContain('ISC AGENCY');
    expect(bodyTextHub).toContain('Illinois Medicaid');
    expect(bodyTextHub).not.toContain('LIDDA');
    expect(bodyTextHub).not.toContain('Regional Center');
    expect(bodyTextHub).not.toContain('Medi-Cal');

    // 2. Counties list page for Illinois
    const countiesResponse = await page.goto('/counties/illinois');
    expect(countiesResponse?.status()).toBe(200);
    
    const countiesH1 = page.locator('h1');
    await expect(countiesH1).toHaveText(/Illinois Counties Directory/i);
  });

  test('At least 5 Illinois county detail pages load cleanly without California/Texas leak', async ({ page }) => {
    const pilotCounties = [
      'cook-il',
      'dupage-il',
      'lake-il',
      'will-il',
      'kane-il'
    ];

    for (const county of pilotCounties) {
      const path = `/counties/illinois/${county}`;
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California/Texas terms
      expect(bodyText.toUpperCase()).toContain('ISC AGENCY');
      expect(bodyText).toContain('Medicaid');
      expect(bodyText).not.toContain('LIDDA');
      expect(bodyText).not.toContain('Regional Center');
      expect(bodyText).not.toContain('Medi-Cal');
      expect(bodyText).not.toContain('IHSS');
      expect(bodyText).not.toContain('SELPA');

      // Verify source freshness disclosure is rendered at the bottom
      expect(bodyText).toContain('VERIFIED SOURCES');
      
      // Verify correction flow triggers exist (rendered inside TrustBadge) if the state is index-safe
      if (isIndexableState('illinois')) {
        const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
        await expect(correctionTriggers.first()).toBeVisible();
      }
    }
  });

  test('Illinois county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/illinois/cook-il';
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Cook');
    expect(bodyText.toUpperCase()).toContain('ISC AGENCY');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('Illinois forms catalog and details guide load correctly', async ({ page }) => {
    // 1. Illinois Forms Catalog page
    const formsResponse = await page.goto('/forms?state=illinois');
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/Illinois Special Needs Forms Directory/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Illinois Medicaid & Waiver Guides');
    expect(bodyText).toContain('ISBE Special Education');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');

    // 2. Individual Illinois Parent Guide details page
    const guideResponse = await page.goto('/forms/il-iep-evaluation-request');
    expect(guideResponse?.status()).toBe(200);

    const guideH1 = page.locator('h1');
    await expect(guideH1).toHaveText(/Illinois IEP Special Ed Evaluation Request/i);
    
    const guideBody = await page.innerText('body');
    expect(guideBody).toContain('Illinois IEP Special Ed Evaluation Request');
  });

  test('Sitemap quality gates include Illinois county roots and leaves in sitemap', async ({ page }) => {
    const sitemapResponse = await page.goto('/sitemaps/counties.xml');
    expect(sitemapResponse?.status()).toBe(200);

    const xmlText = await sitemapResponse.text();
    const isIndexable = isIndexableState('illinois');

    if (isIndexable) {
      expect(xmlText).toContain('/benefits/illinois/cook-il');
    } else {
      expect(xmlText).not.toContain('/benefits/illinois/cook-il');
    }
    expect(xmlText).not.toContain('/counties/illinois/cook-il');
    expect(xmlText).not.toContain('/benefits/illinois/autism-spectrum-disorder/cook-il');

    await page.goto('/benefits/illinois/cook-il');
    const robotsMetaRoot = page.locator('meta[name="robots"]');
    const rootCount = await robotsMetaRoot.count();
    if (isIndexable) {
      if (rootCount > 0) {
        const content = await robotsMetaRoot.getAttribute('content');
        expect(content).not.toContain('noindex');
      }
    } else {
      await expect(robotsMetaRoot).toHaveAttribute('content', /noindex/i);
    }

    await page.goto('/benefits/illinois/autism-spectrum-disorder/cook-il');
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
  });
});
