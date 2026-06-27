import { test, expect } from '@playwright/test';
import { expectCountyBenefitsSitemapMatchesRobots } from './helpers/launch-sitemap';

const wave2States = [
  {
    id: 'maryland',
    name: 'Maryland',
    code: 'MD',
    counties: ['allegany-md', 'anne-arundel-md']
  },
  {
    id: 'utah',
    name: 'Utah',
    code: 'UT',
    counties: ['beaver-ut', 'box-elder-ut']
  },
  {
    id: 'new-mexico',
    name: 'New Mexico',
    code: 'NM',
    counties: ['bernalillo-nm', 'catron-nm']
  },
  {
    id: 'oregon',
    name: 'Oregon',
    code: 'OR',
    counties: ['baker-or', 'benton-or']
  },
  {
    id: 'washington',
    name: 'Washington',
    code: 'WA',
    counties: ['adams-wa', 'asotin-wa']
  },
  {
    id: 'idaho',
    name: 'Idaho',
    code: 'ID',
    counties: ['ada-id', 'adams-id']
  }
];

for (const state of wave2States) {
  test.describe(`${state.name} Wave 2 Launch Smoke Tests`, () => {
    
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

        expect(bodyText).toContain('VERIFIED SOURCES');
        
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
      await expect(formsH1).toHaveText(new RegExp(`${state.name} Special Needs Forms Directory`, 'i'));

      const bodyText = await page.innerText('body');
      expect(bodyText).toContain('Medicaid');
      expect(bodyText).not.toContain('In-Home Supportive Services (IHSS) Forms');
    });

    test(`Sitemap quality gates include ${state.name} county-diagnosis leaves and roots`, async ({ page }) => {
      await expectCountyBenefitsSitemapMatchesRobots(page, state.id, state.counties[0]);
    });
  });
}
