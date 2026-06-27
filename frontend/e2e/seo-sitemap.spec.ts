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

  test('static sitemap contains core pages', async ({ page }) => {
    // Root benefits & forms
    const hasForms = staticUrls.some(url => url.endsWith('/forms'));
    const hasBenefits = staticUrls.some(url => url.endsWith('/benefits'));
    const hasAdvocates = staticUrls.some(url => url.endsWith('/advocates'));

    expect(hasForms).toBe(true);
    expect(hasBenefits).toBe(true);
    expect(hasAdvocates).toBe(false);

    // High value guide pages must stay consistent with their live robots policy.
    const sampleGuides = [
      '/programs/ihss-for-children',
      '/forms/soc-873',
      '/situations/ihss-protective-supervision',
    ];

    for (const path of sampleGuides) {
      const inSitemap = staticUrls.some(url => url.endsWith(path));
      await page.goto(path);
      const robots = page.locator('meta[name="robots"]');
      const robotsCount = await robots.count();

      if (inSitemap) {
        if (robotsCount > 0) {
          const content = await robots.getAttribute('content');
          expect(content || '').not.toContain('noindex');
        }
      } else {
        await expect(robots).toHaveAttribute('content', /noindex/i);
      }
    }

    // Excluded routes
    const hasDashboard = staticUrls.some(url => url.includes('/dashboard'));
    const hasLogin = staticUrls.some(url => url.includes('/login'));
    expect(hasAdvocates).toBe(false);
    expect(hasDashboard).toBe(false);
    expect(hasLogin).toBe(false);
  });

  test('counties sitemap contains indexable counties but gates county x diagnosis leaves', () => {
    // Check that Los Angeles county exists in counties sitemap
    const hasLaBenefitsPath = countiesUrls.some(url => url.endsWith('/benefits/california/los-angeles'));
    expect(hasLaBenefitsPath).toBe(true);

    // Verify sitemap does not contain the old duplicate /counties/ path
    const hasLaCountiesPath = countiesUrls.some(url => url.endsWith('/counties/california/los-angeles'));
    expect(hasLaCountiesPath).toBe(false);

    // Check a sample of non-indexable/blocked CA counties are not in sitemap
    const blockedCaCounties = ['mariposa', 'alpine', 'mono', 'sierra'];
    for (const county of blockedCaCounties) {
      const hasBenefitsPath = countiesUrls.some(url => url.endsWith(`/benefits/california/${county}`));
      expect(hasBenefitsPath).toBe(false);
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

  test('county-diagnosis pages stay consistent with sitemap and robots policy', async ({ page }) => {
    const indexedLeaf = countiesUrls.find(url => {
      const pathParts = url.replace(/https?:\/\/[^\/]+/, '').split('/').filter(Boolean);
      return pathParts.length === 4 && pathParts[0] === 'benefits' && pathParts[1] === 'california';
    });

    if (indexedLeaf) {
      const indexedPath = indexedLeaf.replace(/https?:\/\/[^\/]+/, '');
      await page.goto(indexedPath);

      const robots = page.locator('meta[name="robots"]');
      const count = await robots.count();
      if (count > 0) {
        const content = await robots.getAttribute('content');
        expect(content || '').not.toContain('noindex');
      }

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', `https://ablefull.org${indexedPath}`);

      const freshness = page.getByText(/Source (Notes|Verified Sources) & Freshness Information/i);
      await expect(freshness).toBeVisible();

      const correction = page.locator('button:has-text("Suggest update")');
      await expect(correction.first()).toBeVisible();
      return;
    }

    // If no county-diagnosis leaves qualify for sitemap inclusion, the sample leaf must stay gated.
    await page.goto('/benefits/california/autism-spectrum-disorder/los-angeles');
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', /noindex/i);
  });
});
