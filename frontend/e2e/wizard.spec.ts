import { test, expect } from '@playwright/test';

test.describe('Eligibility Onboarding Wizard E2E Tests', () => {
  test('happy path: school-age autism in Los Angeles', async ({ page }) => {
    // 1. Homepage loads
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText(/Find California disability benefits and local special-needs resources/i);

    // 2. Step 1: Age & Location
    await page.fill('#age', '5');
    await page.selectOption('#state', 'california');
    await page.selectOption('#county', 'los-angeles');
    await page.click('button:has-text("Next Step")', { force: true });

    // 3. Step 2: Diagnosis
    // Autocomplete search
    await page.fill('#diagnosis', 'Autism Spectrum Disorder');
    // Click suggestion item
    await page.click('.autocomplete-item:has-text("Autism Spectrum Disorder")');
    await page.click('button:has-text("Next Step")', { force: true });

    // 4. Step 3: Specific Support Needs
    await page.fill('#additionalText', 'Tommy is 5 years old, wanders when outside, has extreme speech delays, and needs diapers.');
    
    // Test suggestion tag addition
    await page.click('button:has-text("Respite care relief")');
    
    // Submit Step 3
    await page.click('button:has-text("Analyze observed needs")', { force: true });

    // 5. Step 4: Optional Dynamic Refiners
    // Ensure safety refiner is visible since we input "wandering" & "autism"
    const safetyQuestion = page.locator('text=Safety Supervision');
    await expect(safetyQuestion).toBeVisible();
    
    // Answer refiners
    await page.click('button:has-text("Yes, active safety risks are present")', { force: true });
    await page.click('button:has-text("Yes, we exceed income limits")', { force: true });
    
    // Submit
    await page.click('button:has-text("Find Custom Matches")', { force: true });

    // 6. Step 5: Results View
    // Wait for loader to finish and results to appear
    const resultsHeader = page.locator('h2:has-text("Your Customized Benefit Match Plan")');
    await expect(resultsHeader).toBeVisible();

    // Verify program matches are shown in results
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Regional Center');
    expect(bodyText).toContain('In-Home Supportive Services (IHSS)');
    expect(bodyText).toContain('Special Education (IEP)');
    expect(bodyText).toContain('Medi-Cal');

    // Verify that the local Regional Center contact is loaded
    expect(bodyText).toContain('Lanman'); // Westside/Frank D. Lanterman or regional center specific
    
    // Verify explanation section is populated
    expect(bodyText).toContain('Why it matches');
  });

  test('conditional path: toddler speech delay in Orange County matches Early Start', async ({ page }) => {
    await page.goto('/');

    // Step 1: Age 2, Orange County
    await page.fill('#age', '2');
    await page.selectOption('#county', 'orange');
    await page.click('button:has-text("Next Step")', { force: true });

    // Step 2: Speech and Language Delay
    await page.fill('#diagnosis', 'Speech');
    await page.click('.autocomplete-item:has-text("Speech or Language Delay")');
    await page.click('button:has-text("Next Step")', { force: true });

    // Step 3: Needs speech therapy
    await page.fill('#additionalText', 'Delayed communication milestones, needs early speech therapy support.');
    await page.click('button:has-text("Analyze observed needs")', { force: true });

    // Step 4: Skip refiners
    await page.click('button:has-text("Skip Answers")', { force: true });

    // Step 5: Results - Verify Early Start matches (under age 3)
    await expect(page.locator('h2:has-text("Your Customized Benefit Match Plan")')).toBeVisible();
    
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Early Start Intervention');
    expect(bodyText).not.toContain('Special Education (IEP)'); // IEP is age 3+
  });

  test('fallback path: developmental delay in Mariposa County', async ({ page }) => {
    await page.goto('/');

    // Step 1: Age 5, Mariposa County
    await page.fill('#age', '5');
    await page.selectOption('#county', 'mariposa');
    await page.click('button:has-text("Next Step")', { force: true });

    // Step 2: Custom / developmental delay
    await page.fill('#diagnosis', 'Developmental Delay');
    await page.click('.autocomplete-item:has-text("Developmental Delay")');
    await page.click('button:has-text("Next Step")', { force: true });

    // Step 3: Generic needs
    await page.fill('#additionalText', 'Needs general support.');
    await page.click('button:has-text("Analyze observed needs")', { force: true });

    // Step 4: Skip refiners
    await page.click('button:has-text("Skip Answers")', { force: true });

    // Step 5: Results - Verify Mariposa local contacts do not crash
    await expect(page.locator('h2:has-text("Your Customized Benefit Match Plan")')).toBeVisible();

    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('IEP');
    expect(bodyText).toContain('Mariposa'); // checks local county name is present
  });
});
