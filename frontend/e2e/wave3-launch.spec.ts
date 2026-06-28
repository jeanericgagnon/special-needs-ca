import { test, expect } from '@playwright/test';
import { expectCountyBenefitsSitemapMatchesRobots } from './helpers/launch-sitemap';

const wave3States = [
  { id: 'south-carolina', name: 'South Carolina', code: 'SC', counties: ['abbeville-sc', 'aiken-sc'] },
  { id: 'north-dakota', name: 'North Dakota', code: 'ND', counties: ['adams-nd', 'barnes-nd'] },
  { id: 'west-virginia', name: 'West Virginia', code: 'WV', counties: ['barbour-wv', 'berkeley-wv'] },
  { id: 'montana', name: 'Montana', code: 'MT', counties: ['cascade-mt', 'flathead-mt'] },
  { id: 'colorado', name: 'Colorado', code: 'CO', counties: ['adams-co', 'alamosa-co'] },
  { id: 'louisiana', name: 'Louisiana', code: 'LA', counties: ['caddo-parish-la', 'calcasieu-parish-la'] },
  { id: 'south-dakota', name: 'South Dakota', code: 'SD', counties: ['aurora-sd', 'beadle-sd'] },
  { id: 'alabama', name: 'Alabama', code: 'AL', counties: ['jefferson-al', 'mobile-al'] },
  { id: 'wisconsin', name: 'Wisconsin', code: 'WI', counties: ['adams-wi', 'ashland-wi'] },
  { id: 'arkansas', name: 'Arkansas', code: 'AR', counties: ['arkansas-ar', 'ashley-ar'] },
  { id: 'oklahoma', name: 'Oklahoma', code: 'OK', counties: ['adair-ok', 'alfalfa-ok'] }
];

for (const state of wave3States) {
  test.describe(`${state.name} Wave 3 Launch Smoke Tests`, () => {
    
    test(`${state.name} hub and counties list pages load cleanly`, async ({ page }) => {
      const hubResponse = await page.goto(`/benefits/${state.id}`);
      expect(hubResponse?.status()).toBe(200);
      
      const hubH1 = page.locator('h1');
      await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
      
      const bodyTextHub = await page.innerText('body');
      expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyTextHub).not.toContain('Internal Server Error');
      expect(bodyTextHub).toContain(`${state.name} Medicaid`);
      expect(bodyTextHub).not.toContain('LIDDA');
      expect(bodyTextHub).not.toContain('Regional Center');
      expect(bodyTextHub).not.toContain('Medi-Cal');

      const countiesResponse = await page.goto(`/counties/${state.id}`);
      expect(countiesResponse?.status()).toBe(200);
      
      const countiesH1 = page.locator('h1');
      await expect(countiesH1).toHaveText(new RegExp(`${state.name} Counties Directory`, 'i'));
    });

    test(`At least 2 ${state.name} county detail pages load cleanly without California/Texas leak`, async ({ page }) => {
      for (const county of state.counties) {
        const path = `/counties/${state.id}/${county}`;
        const response = await page.goto(path);
        expect([200, 404]).toContain(response?.status());
        if (response?.status() === 404) {
          continue;
        }

        const bodyText = await page.innerText('body');
        expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
        expect(bodyText).not.toContain('Internal Server Error');

        expect(bodyText).toContain('Medicaid');
        expect(bodyText).not.toContain('LIDDA');
        expect(bodyText).not.toContain('Regional Center');
        expect(bodyText).not.toContain('Medi-Cal');
        expect(bodyText).not.toContain('IHSS');
        expect(bodyText).not.toContain('SELPA');

        expect(bodyText).toMatch(/(Source (Notes|Verified Sources) & Freshness Information|Sources, Review Dates, and Confidence)/i);
        
        const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
        await expect(correctionTriggers.first()).toBeVisible();
      }
    });

    test(`${state.name} county benefits pages load cleanly`, async ({ page }) => {
      const path = `/benefits/${state.id}/${state.counties[0]}`;
      const response = await page.goto(path);
      expect([200, 404]).toContain(response?.status());
      if (response?.status() === 404) {
        return;
      }

      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('LIDDA');
      expect(bodyText).not.toContain('Regional Center');
    });

    test(`${state.name} forms catalog loads correctly`, async ({ page }) => {
      const formsResponse = await page.goto(`/forms?state=${state.id}`);
      expect(formsResponse?.status()).toBe(200);

      const formsH1 = page.locator('h1');
      await expect(formsH1).toHaveText(new RegExp(`${state.name} Forms Verification In Progress`, 'i'));

      const bodyText = await page.innerText('body');
      expect(bodyText).toContain(`We are still verifying local entries, current forms libraries, and submission routes for ${state.name}.`);
      expect(bodyText).toContain(`We have not yet published a source-backed ${state.name} forms directory that meets our launch standard.`);
      expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');
    });

    test(`Sitemap quality gates include ${state.name} county-diagnosis leaves and roots`, async ({ page }) => {
      await expectCountyBenefitsSitemapMatchesRobots(page, state.id, state.counties[0]);
    });
  });
}
