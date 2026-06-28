import { isIndexableState } from '../src/lib/publicTruth';
import { test, expect } from '@playwright/test';
import { expectCountyBenefitsSitemapMatchesRobots } from './helpers/launch-sitemap';

test.describe('Georgia Multi-State Launch Smoke Tests', () => {
  
  test('Georgia hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for Georgia
    const hubResponse = await page.goto('/benefits/georgia', { waitUntil: 'domcontentloaded' });
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
    const countiesResponse = await page.goto('/counties/georgia', { waitUntil: 'domcontentloaded' });
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
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California/Texas terms
      expect(bodyText.toUpperCase()).toContain('DBHDD REGION');
      expect(bodyText).toContain('Medicaid');
      expect(bodyText).not.toContain('LIDDA');
      expect(bodyText).not.toContain('Regional Center');
      expect(bodyText).not.toContain('Medi-Cal');
      expect(bodyText).not.toContain('IHSS');
      expect(bodyText).not.toContain('SELPA');

      // Verify source freshness disclosure is rendered at the bottom
      expect(bodyText).toMatch(/(Source (Notes|Verified Sources) & Freshness Information|Sources, Review Dates, and Confidence)/i);
      
      // Verify correction flow triggers exist (rendered inside TrustBadge) if the state is index-safe
      if (isIndexableState('georgia')) {
        const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
        await expect(correctionTriggers.first()).toBeVisible();
      }
    }
  });

  test('Georgia county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/georgia/fulton-ga';
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Fulton');
    expect(bodyText.toUpperCase()).toContain('DBHDD REGION');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('Georgia forms catalog holds and unpublished detail pages stay gated', async ({ page }) => {
    // 1. Georgia Forms Catalog page
    const formsResponse = await page.goto('/forms?state=georgia', { waitUntil: 'domcontentloaded' });
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/Georgia Forms Verification In Progress/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('We are still verifying local entries, current forms libraries, and submission routes for Georgia.');
    expect(bodyText).toContain('We have not yet published a source-backed Georgia forms directory that meets our launch standard.');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');

    // 2. Non-published Georgia detail guides should stay fail-closed until source-safe.
    const guideResponse = await page.goto('/forms/ga-iep-evaluation-request', { waitUntil: 'domcontentloaded' });
    expect(guideResponse?.status()).toBe(404);
  });

  test('Sitemap quality gates include Georgia county roots and leaves in sitemap', async ({ page }) => {
    await expectCountyBenefitsSitemapMatchesRobots(page, 'georgia', 'fulton-ga');
  });
});
