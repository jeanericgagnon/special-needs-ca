import { isIndexableState } from '../src/lib/publicTruth';
import { test, expect } from '@playwright/test';

test.describe('Pennsylvania Multi-State Launch Smoke Tests', () => {
  
  test('Pennsylvania hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for Pennsylvania
    const hubResponse = await page.goto('/benefits/pennsylvania');
    expect(hubResponse?.status()).toBe(200);
    
    const hubH1 = page.locator('h1');
    await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
    
    const bodyTextHub = await page.innerText('body');
    expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
    expect(bodyTextHub).not.toContain('Internal Server Error');
    expect(bodyTextHub.toUpperCase()).toContain('COUNTY MH/ID AE');
    expect(bodyTextHub).toContain('Pennsylvania Medicaid');
    expect(bodyTextHub).not.toContain('LIDDA');
    expect(bodyTextHub).not.toContain('Regional Center');
    expect(bodyTextHub).not.toContain('Medi-Cal');

    // 2. Counties list page for Pennsylvania
    const countiesResponse = await page.goto('/counties/pennsylvania');
    expect(countiesResponse?.status()).toBe(200);
    
    const countiesH1 = page.locator('h1');
    await expect(countiesH1).toHaveText(/Pennsylvania Counties Directory/i);
  });

  test('At least 5 Pennsylvania county detail pages load cleanly without California/Texas leak', async ({ page }) => {
    const pilotCounties = [
      'philadelphia-pa',
      'allegheny-pa',
      'montgomery-pa',
      'bucks-pa',
      'delaware-pa'
    ];

    for (const county of pilotCounties) {
      const path = `/counties/pennsylvania/${county}`;
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California/Texas terms
      expect(bodyText.toUpperCase()).toContain('COUNTY MH/ID AE');
      expect(bodyText).toContain('Medicaid');
      expect(bodyText).not.toContain('LIDDA');
      expect(bodyText).not.toContain('Regional Center');
      expect(bodyText).not.toContain('Medi-Cal');
      expect(bodyText).not.toContain('IHSS');
      expect(bodyText).not.toContain('SELPA');

      // Verify source freshness disclosure is rendered at the bottom
      expect(bodyText).toContain('VERIFIED SOURCES');
      
      // Verify correction flow triggers exist (rendered inside TrustBadge) if the state is index-safe
      if (isIndexableState('pennsylvania')) {
        const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
        await expect(correctionTriggers.first()).toBeVisible();
      }
    }
  });

  test('Pennsylvania county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/pennsylvania/philadelphia-pa';
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Philadelphia');
    expect(bodyText.toUpperCase()).toContain('COUNTY MH/ID AE');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('Pennsylvania forms catalog and details guide load correctly', async ({ page }) => {
    // 1. Pennsylvania Forms Catalog page
    const formsResponse = await page.goto('/forms?state=pennsylvania');
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/Pennsylvania Special Needs Forms Directory/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Pennsylvania Medicaid & Waiver Guides');
    expect(bodyText).toContain('Intermediate Units (IUs)');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');

    // 2. Individual Pennsylvania Parent Guide details page
    const guideResponse = await page.goto('/forms/pa-iep-evaluation-request');
    expect(guideResponse?.status()).toBe(200);

    const guideH1 = page.locator('h1');
    await expect(guideH1).toHaveText(/PA IEP Special Ed Evaluation Request/i);
    
    const guideBody = await page.innerText('body');
    expect(guideBody).toContain('PA IEP Special Ed Evaluation Request');
  });

  test('Sitemap quality gates include Pennsylvania county roots and leaves in sitemap', async ({ page }) => {
    const sitemapResponse = await page.goto('/sitemaps/counties.xml');
    expect(sitemapResponse?.status()).toBe(200);

    const xmlText = await sitemapResponse.text();
    const isIndexable = isIndexableState('pennsylvania');

    if (isIndexable) {
      expect(xmlText).toContain('/benefits/pennsylvania/philadelphia-pa');
    } else {
      expect(xmlText).not.toContain('/benefits/pennsylvania/philadelphia-pa');
    }
    expect(xmlText).not.toContain('/counties/pennsylvania/philadelphia-pa');
    expect(xmlText).not.toContain('/benefits/pennsylvania/autism-spectrum-disorder/philadelphia-pa');

    await page.goto('/benefits/pennsylvania/philadelphia-pa');
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

    await page.goto('/benefits/pennsylvania/autism-spectrum-disorder/philadelphia-pa');
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
  });
});
