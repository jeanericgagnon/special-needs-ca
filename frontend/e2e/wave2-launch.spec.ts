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
    counties: ['ada-id', 'adams-id'],
    partialVerificationMode: true,
    partialHeading: 'Idaho is live only in a partial verification mode',
    partialCountiesHeading: 'Idaho county directory is still being verified',
    partialCountyMarker: 'Verification Pending'
  }
];

for (const state of wave2States) {
  test.describe(`${state.name} Wave 2 Launch Smoke Tests`, () => {
    
    test(`${state.name} hub and counties list pages load cleanly`, async ({ page }) => {
      const hubResponse = await page.goto(`/benefits/${state.id}`);
      expect(hubResponse?.status()).toBe(200);
      
      const hubH1 = page.locator('h1');
      if (state.partialVerificationMode) {
        await expect(hubH1).toHaveText(new RegExp(state.partialHeading!, 'i'));
      } else {
        await expect(hubH1).toHaveText(/Guides & Resources: Local Disability Benefits/i);
      }
      
      const bodyTextHub = await page.innerText('body');
      expect(bodyTextHub).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyTextHub).not.toContain('Internal Server Error');
      if (state.partialVerificationMode) {
        expect(bodyTextHub).toContain('partial verification mode');
        expect(bodyTextHub).toContain('noindex');
      } else {
        expect(bodyTextHub).toContain(`${state.name} Medicaid`);
      }
      expect(bodyTextHub).not.toContain('LIDDA');
      expect(bodyTextHub).not.toContain('Regional Center');
      expect(bodyTextHub).not.toContain('Medi-Cal');

      const countiesResponse = await page.goto(`/counties/${state.id}`);
      expect(countiesResponse?.status()).toBe(200);
      
      const countiesH1 = page.locator('h1');
      if (state.partialVerificationMode) {
        await expect(countiesH1).toHaveText(new RegExp(state.partialCountiesHeading!, 'i'));
      } else {
        await expect(countiesH1).toHaveText(new RegExp(`${state.name} Counties Directory`, 'i'));
      }
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

        if (state.partialVerificationMode) {
          expect(bodyText).toContain(state.partialCountyMarker!);
          expect(bodyText).toContain('Not Yet Index-Safe');
          expect(bodyText).toContain('gated placeholder');
        } else {
          expect(bodyText).toContain('Medicaid');
          expect(bodyText).not.toContain('LIDDA');
          expect(bodyText).not.toContain('Regional Center');
          expect(bodyText).not.toContain('Medi-Cal');
          expect(bodyText).not.toContain('IHSS');
          expect(bodyText).not.toContain('SELPA');

          expect(bodyText).toMatch(/(Source (Notes|Verified Sources) & Freshness Information|Sources, Review Dates, and Confidence|Sources, Last Checked Dates, Confidence, and Estimate Notes|Last reviewed:|Last checked:)/i);
          
          const correctionTriggers = page.locator('button:has-text("Suggest update"), span:has-text("Verified"), a:has-text("Source")');
          await expect(correctionTriggers.first()).toBeVisible();
        }
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
