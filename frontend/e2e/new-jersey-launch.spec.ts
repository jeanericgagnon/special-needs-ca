import { isIndexableState } from '../src/lib/publicTruth';
import { test, expect } from '@playwright/test';
import { expectCountyBenefitsSitemapMatchesRobots } from './helpers/launch-sitemap';

test.describe('New Jersey Multi-State Launch Smoke Tests', () => {
  
  test('New Jersey hub and counties list pages load cleanly', async ({ page }) => {
    // 1. Benefits state hub for New Jersey
    const hubResponse = await page.goto('/benefits/new-jersey', { waitUntil: 'domcontentloaded' });
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
    const countiesResponse = await page.goto('/counties/new-jersey', { waitUntil: 'domcontentloaded' });
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
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify dynamic terminology has replaced California/Texas terms
      expect(bodyText).toContain('Medicaid');
      expect(bodyText).not.toContain('LIDDA');
      expect(bodyText).not.toContain('Regional Center');
      expect(bodyText).not.toContain('Medi-Cal');
      expect(bodyText).not.toContain('IHSS');
      expect(bodyText).not.toContain('SELPA');

      // Verify source freshness disclosure is rendered at the bottom
      expect(bodyText).toMatch(/(Source (Notes|Verified Sources) & Freshness Information|Sources, Review Dates, and Confidence)/i);
      
      // Verify correction flow triggers exist (rendered inside TrustBadge) if the state is index-safe
      if (isIndexableState('new-jersey')) {
        const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
        await expect(correctionTriggers.first()).toBeVisible();
      }
    }
  });

  test('New Jersey county benefits pages load cleanly', async ({ page }) => {
    const path = '/benefits/new-jersey/bergen-nj';
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('Bergen');
    expect(bodyText).not.toContain('LIDDA');
    expect(bodyText).not.toContain('Regional Center');
  });

  test('New Jersey forms catalog loads correctly', async ({ page }) => {
    const formsResponse = await page.goto('/forms?state=new-jersey', { waitUntil: 'domcontentloaded' });
    expect(formsResponse?.status()).toBe(200);

    const formsH1 = page.locator('h1');
    await expect(formsH1).toHaveText(/New Jersey Forms Verification In Progress/i);

    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('We are still verifying local entries, current forms libraries, and submission routes for New Jersey.');
    expect(bodyText).toContain('We have not yet published a source-backed New Jersey forms directory that meets our launch standard.');
    expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');
  });

  test('Sitemap quality gates include New Jersey county roots and leaves in sitemap', async ({ page }) => {
    await expectCountyBenefitsSitemapMatchesRobots(page, 'new-jersey', 'bergen-nj');
  });
});
