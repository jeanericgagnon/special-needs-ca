import { test, expect } from '@playwright/test';

test.describe('Public Launch Smoke Tests', () => {
  test('homepage loads, contains H1 and canonical URL', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // H1 check
    const h1 = page.locator('h1');
    await expect(h1).toHaveText(/Find California disability benefits and local special-needs resources/i);

    // Canonical check
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://ablefull.org');
  });

  test('/benefits redirects to /benefits/california', async ({ page }) => {
    // Navigate to /benefits and verify it redirects to /benefits/california
    await page.goto('/benefits');
    expect(page.url()).toContain('/benefits/california');
  });

  test('/benefits/california, /counties/california, /forms, /advocates load without crash', async ({ page }) => {
    const pages = [
      '/benefits/california',
      '/counties/california',
      '/forms',
      '/advocates'
    ];

    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      // Verify no runtime crash text
      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Application error: a client-side exception has occurred');
      expect(bodyText).not.toContain('Internal Server Error');

      // Verify page has a title
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      // Verify page has a canonical tag
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toBeAttached();
    }
  });

  test('/robots.txt loads and contains sitemap', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);

    const text = await response?.text();
    expect(text).toContain('Sitemap:');
    expect(text).toContain('/sitemap.xml');
    expect(text).toContain('Allow: /forms');
    expect(text).toContain('Disallow: /dashboard');
  });

  test('/sitemap.xml loads and references child sitemaps', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const text = await response?.text();
    expect(text).toContain('sitemaps/static.xml');
    expect(text).toContain('sitemaps/counties.xml');

    // Verify dashboard/login/api routes are NOT exposed in sitemap index
    expect(text).not.toContain('/dashboard');
    expect(text).not.toContain('/login');
    expect(text).not.toContain('/register');
    expect(text).not.toContain('/api/');
  });
});
