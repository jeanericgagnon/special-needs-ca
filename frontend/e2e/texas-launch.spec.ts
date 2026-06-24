import { isIndexableState } from '../src/lib/publicTruth';
import { test, expect } from '@playwright/test';

test.describe('Texas Multi-State Launch Smoke Tests', () => {
  
  test('Texas hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for Texas
    const hubResponse = await page.goto('/benefits/texas');
    expect(hubResponse?.status()).toBe(200);
    
    const hubH1 = page.locator('h1');
    await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
    
    const bodyTextHub = await page.innerText('body');
    expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
    expect(bodyTextHub).not.toContain('Internal Server Error');
    expect(bodyTextHub).toContain('LIDDA');
    expect(bodyTextHub).toContain('Texas Medicaid');
    expect(bodyTextHub).not.toContain('Regional Center');
    expect(bodyTextHub).not.toContain('Medi-Cal');

    // 2. Counties list page for Texas
    const countiesResponse = await page.goto('/counties/texas');
    expect(countiesResponse?.status()).toBe(200);
    
    const countiesH1 = page.locator('h1');
    await expect(countiesH1).toHaveText(/Texas Counties Directory/i);
  });

  test('At least 5 Texas county detail pages load cleanly without California leak', async ({ page }) => {
    const pilotCounties = [
      'harris-tx',
      'dallas-tx',
      'travis-tx',
      'bexar-tx',
      'tarrant-tx'
    ];

    for (const county of pilotCounties) {
      const path = `/counties/texas/${county}`;
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California terms
      expect(bodyText).toContain('LIDDA');
      expect(bodyText).toContain('Medicaid');
      expect(bodyText).not.toContain('Regional Center');
      expect(bodyText).not.toContain('Medi-Cal');
      expect(bodyText).not.toContain('IHSS');
      expect(bodyText).not.toContain('SELPA');

      // Verify source freshness disclosure is rendered at the bottom
      expect(bodyText).toContain('VERIFIED SOURCES');
      
      // Verify correction flow triggers exist (rendered inside TrustBadge) if the state is index-safe
      if (isIndexableState('texas')) {
        const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
        await expect(correctionTriggers.first()).toBeVisible();
      }
    }
  });

  test('Texas county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/texas/harris-tx';
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Harris');
    expect(bodyText).toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('Texas forms catalog and details guide load correctly', async ({ page }) => {
    // 1. Texas Forms Catalog page
    const formsResponse = await page.goto('/forms?state=texas');
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/Texas Special Needs Forms Directory/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Texas Medicaid & Waiver Guides');
    expect(bodyText).toContain('Texas Early Intervention & Support Services');
    expect(bodyText).toContain('Texas Special Education & TEA Complaints');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');

    // 2. Individual Texas Parent Guide details page
    const guideResponse = await page.goto('/forms/tx-sped-evaluation-request');
    expect(guideResponse?.status()).toBe(200);

    const guideH1 = page.locator('h1');
    await expect(guideH1).toHaveText(/TEA Special Education Evaluation Request Letter Template/i);
    
    const guideBody = await page.innerText('body');
    // Verify letter template section is visible on evaluation request guide page
    expect(guideBody).toContain('Texas IEP Evaluation Request Letter');
  });

  test('Sitemap quality gates include Texas county roots and leaves in sitemap', async ({ page }) => {
    const sitemapResponse = await page.goto('/sitemaps/counties.xml');
    expect(sitemapResponse?.status()).toBe(200);

    const xmlText = await sitemapResponse.text();
    const isIndexable = isIndexableState('texas');

    if (isIndexable) {
      expect(xmlText).toContain('/benefits/texas/harris-tx');
    } else {
      expect(xmlText).not.toContain('/benefits/texas/harris-tx');
    }
    expect(xmlText).not.toContain('/counties/texas/harris-tx');
    expect(xmlText).not.toContain('/benefits/texas/autism-spectrum-disorder/harris-tx');

    await page.goto('/benefits/texas/harris-tx');
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

    await page.goto('/benefits/texas/autism-spectrum-disorder/harris-tx');
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
  });
});
