import { test, expect } from '@playwright/test';

// Helper to extract URLs from XML text using regex
function extractUrls(xmlText: string): string[] {
  const matches = xmlText.matchAll(/<loc>([^<]+)<\/loc>/g);
  return Array.from(matches).map(m => m[1].trim());
}

test.describe('SEO Sitemap and Indexation E2E Tests', () => {
  let staticUrls: string[] = [];
  let countiesUrls: string[] = [];

  test.beforeAll(async ({ request }) => {
    // Fetch child sitemaps
    const staticRes = await request.get('/sitemaps/static.xml');
    expect(staticRes.status()).toBe(200);
    staticUrls = extractUrls(await staticRes.text());

    const countiesRes = await request.get('/sitemaps/counties.xml');
    expect(countiesRes.status()).toBe(200);
    countiesUrls = extractUrls(await countiesRes.text());
  });

  test('static sitemap contains core pages', () => {
    // Root benefits & forms
    const hasForms = staticUrls.some(url => url.endsWith('/forms'));
    const hasBenefits = staticUrls.some(url => url.endsWith('/benefits'));
    const hasAdvocates = staticUrls.some(url => url.endsWith('/advocates'));

    expect(hasForms).toBe(true);
    expect(hasBenefits).toBe(true);
    expect(hasAdvocates).toBe(true);

    // High value guide pages
    const hasIhssChildren = staticUrls.some(url => url.includes('/programs/ihss-for-children'));
    const hasSoc873 = staticUrls.some(url => url.includes('/forms/soc-873'));
    const hasProtectiveSupervision = staticUrls.some(url => url.includes('/situations/ihss-protective-supervision'));

    expect(hasIhssChildren).toBe(true);
    expect(hasSoc873).toBe(true);
    expect(hasProtectiveSupervision).toBe(true);

    // Excluded routes
    const hasDashboard = staticUrls.some(url => url.includes('/dashboard'));
    const hasLogin = staticUrls.some(url => url.includes('/login'));
    expect(hasDashboard).toBe(false);
    expect(hasLogin).toBe(false);
  });

  test('counties sitemap contains 58 counties but gates county x diagnosis leaves', () => {
    // All 58 counties roots benefits and counties pages
    const caCounties = [
      'los-angeles', 'san-diego', 'orange', 'riverside', 'san-bernardino', 
      'santa-clara', 'alameda', 'sacramento', 'contra-costa', 'fresno',
      'ventura', 'san-francisco', 'kern', 'san-mateo', 'san-joaquin', 
      'stanislaus', 'sonoma', 'solano', 'santa-barbara', 'tulare', 
      'monterey', 'placer', 'san-luis-obispo', 'santa-cruz', 'merced',
      'mariposa' // and others
    ];

    // Check a representative sample of counties exist in counties sitemap
    for (const county of caCounties) {
      const hasBenefitsPath = countiesUrls.some(url => url.endsWith(`/benefits/california/${county}`));
      const hasCountiesPath = countiesUrls.some(url => url.endsWith(`/counties/california/${county}`));
      expect(hasBenefitsPath).toBe(true);
      expect(hasCountiesPath).toBe(true);
    }

    // Verify sitemap contains county x diagnosis leaves ONLY for LA and Orange
    const leafUrls = countiesUrls.filter(url => {
      const pathParts = url.replace(/https?:\/\/[^\/]+/, '').split('/').filter(Boolean);
      // Path format: ["benefits", "california", "diagnosis-slug", "county-slug"]
      return pathParts.length === 4 && pathParts[0] === 'benefits' && pathParts[1] === 'california';
    });

    for (const leafUrl of leafUrls) {
      const parts = leafUrl.split('/');
      const county = parts[parts.length - 1];
      expect(['los-angeles', 'orange']).toContain(county);
    }

    // Explicitly verify a weak county is not in counties.xml leaf lists
    const hasMercedAutism = countiesUrls.some(url => url.includes('/benefits/california/autism-spectrum-disorder/merced'));
    expect(hasMercedAutism).toBe(false);
  });

  test('gated county-diagnosis pages return noindex meta tag', async ({ page }) => {
    // Visit a gated page and verify noindex meta
    await page.goto('/benefits/california/autism-spectrum-disorder/merced');
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', /noindex/i);

    // Visit another gated page
    await page.goto('/benefits/california/autism-spectrum-disorder/mariposa');
    const robots2 = page.locator('meta[name="robots"]');
    await expect(robots2).toHaveAttribute('content', /noindex/i);
  });

  test('indexable county-diagnosis pages are indexable and have canonical/freshness/correction flows', async ({ page }) => {
    // Los Angeles is high-fidelity and indexable
    await page.goto('/benefits/california/autism-spectrum-disorder/los-angeles');
    
    // No noindex meta should be present
    const robots = page.locator('meta[name="robots"]');
    const count = await robots.count();
    if (count > 0) {
      const content = await robots.getAttribute('content');
      expect(content).not.toContain('noindex');
    }

    // Canonical link
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://california-navigator.org/benefits/california/autism-spectrum-disorder/los-angeles');

    // Freshness disclosure
    const freshness = page.locator('text=Verified Sources & Freshness Information');
    await expect(freshness).toBeVisible();

    // Correction badge link
    const correction = page.locator('button:has-text("Suggest update")');
    await expect(correction.first()).toBeVisible();
  });
});
