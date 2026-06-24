import { isIndexableState } from '../src/lib/publicTruth';
import { test, expect } from '@playwright/test';

const wave4States = [
  { id: 'north-carolina', name: 'North Carolina', code: 'NC', counties: ['alamance-nc', 'alexander-nc'] },
  { id: 'mississippi', name: 'Mississippi', code: 'MS', counties: ['adams-ms', 'alcorn-ms'] },
  { id: 'michigan', name: 'Michigan', code: 'MI', counties: ['alcona-mi', 'alger-mi'] },
  { id: 'minnesota', name: 'Minnesota', code: 'MN', counties: ['aitkin-mn', 'anoka-mn'] }
];

for (const state of wave4States) {
  test.describe(`${state.name} Wave 4 Launch Smoke Tests`, () => {
    
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
        expect(response?.status()).toBe(200);

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
      expect(response?.status()).toBe(200);

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
      const sitemapResponse = await page.goto('/sitemaps/counties.xml');
      expect(sitemapResponse?.status()).toBe(200);

      const xmlText = await sitemapResponse.text();
      const isIndexable = isIndexableState(state.id);

      if (isIndexable) {
        expect(xmlText).toContain(`/benefits/${state.id}/${state.counties[0]}`);
      } else {
        expect(xmlText).not.toContain(`/benefits/${state.id}/${state.counties[0]}`);
      }
      expect(xmlText).not.toContain(`/counties/${state.id}/${state.counties[0]}`);
      expect(xmlText).not.toContain(`/benefits/${state.id}/autism-spectrum-disorder/${state.counties[0]}`);
      
      await page.goto(`/benefits/${state.id}/${state.counties[0]}`);
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

      await page.goto(`/benefits/${state.id}/autism-spectrum-disorder/${state.counties[0]}`);
      const robotsMeta = page.locator('meta[name="robots"]');
      await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
    });
  });
}
