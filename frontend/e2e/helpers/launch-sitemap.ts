import { expect, Page } from '@playwright/test';

export async function expectCountyBenefitsSitemapMatchesRobots(
  page: Page,
  stateId: string,
  countyId: string,
) {
  const sitemapResponse = await page.goto('/sitemaps/counties.xml', { waitUntil: 'domcontentloaded' });
  expect(sitemapResponse?.status()).toBe(200);

  const xmlText = await sitemapResponse!.text();
  const countyBenefitsPath = `/benefits/${stateId}/${countyId}`;

  expect(xmlText).not.toContain(`/counties/${stateId}/${countyId}`);
  expect(xmlText).not.toContain(`/benefits/${stateId}/autism-spectrum-disorder/${countyId}`);

  const countyResponse = await page.goto(countyBenefitsPath, { waitUntil: 'domcontentloaded' });
  if (countyResponse?.status() === 404) {
    expect(xmlText).not.toContain(countyBenefitsPath);
    expect(xmlText).not.toContain(`/benefits/${stateId}/autism-spectrum-disorder/${countyId}`);
    return;
  }

  const robotsMetaRoot = page.locator('meta[name="robots"]');
  const rootCount = await robotsMetaRoot.count();

  if (rootCount > 0) {
    const content = (await robotsMetaRoot.getAttribute('content')) || '';
    if (/noindex/i.test(content)) {
      expect(xmlText).not.toContain(countyBenefitsPath);
    } else {
      expect(xmlText).toContain(countyBenefitsPath);
    }
  } else {
    expect(xmlText).toContain(countyBenefitsPath);
  }

  await page.goto(`/benefits/${stateId}/autism-spectrum-disorder/${countyId}`, { waitUntil: 'domcontentloaded' });
  const robotsMeta = page.locator('meta[name="robots"]');
  await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
}
