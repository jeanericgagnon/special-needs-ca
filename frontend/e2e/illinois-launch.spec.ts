import { isIndexableState } from '../src/lib/publicTruth';
import { test, expect } from '@playwright/test';
import { expectCountyBenefitsSitemapMatchesRobots } from './helpers/launch-sitemap';

test.describe('Illinois Multi-State Launch Smoke Tests', () => {
  
  test('Illinois hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for Illinois
    const hubResponse = await page.goto('/benefits/illinois', { waitUntil: 'domcontentloaded' });
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
    const countiesResponse = await page.goto('/counties/illinois', { waitUntil: 'domcontentloaded' });
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
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
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
      expect(bodyText).toMatch(/(Source (Notes|Verified Sources) & Freshness Information|Sources, Review Dates, and Confidence|Sources, Last Checked Dates, Confidence, and Estimate Notes|Last reviewed:|Last checked:)/i);
      
      // Verify correction flow triggers exist (rendered inside TrustBadge) if the state is index-safe
      if (isIndexableState('illinois')) {
        const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
        await expect(correctionTriggers.first()).toBeVisible();
      }
    }
  });

  test('Illinois county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/illinois/cook-il';
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Cook');
    expect(bodyText.toUpperCase()).toContain('ISC AGENCY');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('Illinois forms catalog holds and unpublished detail pages stay gated', async ({ page }) => {
    // 1. Illinois Forms Catalog page
    const formsResponse = await page.goto('/forms?state=illinois', { waitUntil: 'domcontentloaded' });
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/Illinois Forms Verification In Progress/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('We are still verifying local entries, current forms libraries, and submission routes for Illinois.');
    expect(bodyText).toContain('We have not yet published a source-backed Illinois forms directory that meets our launch standard.');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');

    // 2. Non-published Illinois detail guides should stay fail-closed until source-safe.
    const guideResponse = await page.goto('/forms/il-iep-evaluation-request', { waitUntil: 'domcontentloaded' });
    expect(guideResponse?.status()).toBe(404);
  });

  test('Sitemap quality gates include Illinois county roots and leaves in sitemap', async ({ page }) => {
    await expectCountyBenefitsSitemapMatchesRobots(page, 'illinois', 'cook-il');
  });
});
