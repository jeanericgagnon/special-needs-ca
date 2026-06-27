import { isIndexableState } from '../src/lib/publicTruth';
import { test, expect } from '@playwright/test';
import { expectCountyBenefitsSitemapMatchesRobots } from './helpers/launch-sitemap';

test.describe('Florida Multi-State Launch Smoke Tests', () => {
  
  test('Florida hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for Florida
    const hubResponse = await page.goto('/benefits/florida', { waitUntil: 'domcontentloaded' });
    expect(hubResponse?.status()).toBe(200);
    
    const hubH1 = page.locator('h1');
    await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
    
    const bodyTextHub = await page.innerText('body');
    expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
    expect(bodyTextHub).not.toContain('Internal Server Error');
    expect(bodyTextHub.toUpperCase()).toContain('APD');
    expect(bodyTextHub).toContain('Florida Medicaid');
    expect(bodyTextHub).not.toContain('LIDDA');
    expect(bodyTextHub).not.toContain('Regional Center');
    expect(bodyTextHub).not.toContain('Medi-Cal');

    // 2. Counties list page for Florida
    const countiesResponse = await page.goto('/counties/florida', { waitUntil: 'domcontentloaded' });
    expect(countiesResponse?.status()).toBe(200);
    
    const countiesH1 = page.locator('h1');
    await expect(countiesH1).toHaveText(/Florida Counties Directory/i);
  });

  test('At least 5 Florida county detail pages load cleanly without California/Texas leak', async ({ page }) => {
    const pilotCounties = [
      'miami-dade-fl',
      'broward-fl',
      'palm-beach-fl',
      'hillsborough-fl',
      'orange-fl'
    ];

    for (const county of pilotCounties) {
      const path = `/counties/florida/${county}`;
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California/Texas terms
      expect(bodyText.toUpperCase()).toContain('APD');
      expect(bodyText).toContain('DCF');
      expect(bodyText).not.toContain('LIDDA');
      expect(bodyText).not.toContain('Regional Center');
      expect(bodyText).not.toContain('Medi-Cal');
      expect(bodyText).not.toContain('IHSS');
      expect(bodyText).not.toContain('SELPA');

      // Verify source freshness disclosure is rendered at the bottom
      expect(bodyText).toContain('VERIFIED SOURCES');
      
      // Verify correction flow triggers exist (rendered inside TrustBadge) if the state is index-safe
      if (isIndexableState('florida')) {
        const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
        await expect(correctionTriggers.first()).toBeVisible();
      }
    }
  });

  test('Florida county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/florida/miami-dade-fl';
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Miami Dade');
    expect(bodyText.toUpperCase()).toContain('APD');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('Florida forms catalog and details guide load correctly', async ({ page }) => {
    // 1. Florida Forms Catalog page
    const formsResponse = await page.goto('/forms?state=florida', { waitUntil: 'domcontentloaded' });
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/Florida Special Needs Forms Directory/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Florida Medicaid & Waiver Guides');
    expect(bodyText).toContain('Florida Early Intervention & Family Support');
    expect(bodyText).toContain('Florida Special Education & ESE Complaints');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');

    // 2. Individual Florida Parent Guide details page
    const guideResponse = await page.goto('/forms/fl-iep-evaluation-request', { waitUntil: 'domcontentloaded' });
    expect(guideResponse?.status()).toBe(200);

    const guideH1 = page.locator('h1');
    await expect(guideH1).toHaveText(/Florida IEP Evaluation Request Letter Template/i);
    
    const guideBody = await page.innerText('body');
    // Verify letter template section is visible on evaluation request guide page
    expect(guideBody).toContain('Florida IEP Evaluation Request Letter');
  });

  test('Sitemap quality gates include Florida county roots and leaves in sitemap', async ({ page }) => {
    await expectCountyBenefitsSitemapMatchesRobots(page, 'florida', 'miami-dade-fl');
  });
});
