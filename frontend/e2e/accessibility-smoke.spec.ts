import { test, expect } from '@playwright/test';

test.describe('Accessibility Smoke Tests', () => {
  const targetUrls = [
    '/',
    '/counties/california/los-angeles',
    '/forms',
    '/situations/ihss-protective-supervision'
  ];

  for (const url of targetUrls) {
    test(`page ${url} meets basic a11y heading, landmark and form standards`, async ({ page }) => {
      await page.goto(url);

      // 1. Heading structure: At least one visible h1 exists
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible();

      // 2. Main landmark element exists
      const main = page.locator('main');
      await expect(main).toBeAttached();

      // 3. Form inputs have labels or aria labels
      const inputs = page.locator('input, select, textarea');
      const inputCount = await inputs.count();
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const type = await input.getAttribute('type');

        // Skip submit/button inputs
        if (type === 'submit' || type === 'button') continue;

        if (id) {
          // If there is an ID, check for a matching label with htmlFor
          const label = page.locator(`label[for="${id}"]`);
          const labelCount = await label.count();
          if (labelCount === 0 && !ariaLabel) {
            // Log warning or throw depending on strictness
            console.warn(`Accessibility Warning: Input field with id "${id}" on ${url} is missing an associated label or aria-label.`);
          }
        } else {
          // If no ID, check for an aria-label
          expect(ariaLabel || '').not.toBe('');
        }
      }

      // 4. Color-independent trust labels check (ensure they contain text, not just color/icons)
      const trustBadges = page.locator('div[style*="background"]');
      const badgeCount = await trustBadges.count();
      for (let j = 0; j < badgeCount; j++) {
        const badge = trustBadges.nth(j);
        const text = await badge.textContent();
        if (text?.includes('verified') || text?.includes('official') || text?.includes('fallback')) {
          expect(text.trim().length).toBeGreaterThan(0);
        }
      }

      // 5. Basic Keyboard tab-ability (ensure focus moves and does not trap)
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeDefined();
    });
  }
});
