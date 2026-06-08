import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { CheckpointManager } from './helpers/checkpoint.js';
import { RateLimiter } from './helpers/rateLimiter.js';
import { launchBrowser, createContext, createStealthPage } from './helpers/browser.js';

async function runAdversarialTests() {
  console.log('=== Starting Adversarial & Stress Tests ===\n');
  let allPassed = true;

  // --- 1. CheckpointManager Adversarial Tests ---
  try {
    console.log('--- Testing CheckpointManager ---');

    // Test Case 1.1: Invalid inputs to constructor (missing parameters)
    assert.throws(() => {
      new CheckpointManager();
    }, /CheckpointManager requires both scraperName and state/, 'Should throw when no arguments provided');

    assert.throws(() => {
      new CheckpointManager('copaa');
    }, /CheckpointManager requires both scraperName and state/, 'Should throw when state is missing');

    assert.throws(() => {
      new CheckpointManager(null, 'NY');
    }, /CheckpointManager requires both scraperName and state/, 'Should throw when scraperName is null');

    // Test Case 1.2: Invalid types passed to constructor (expecting strings)
    assert.throws(() => {
      new CheckpointManager(123, 'NY');
    }, TypeError, 'Should throw TypeError when scraperName is a number (no toLowerCase)');

    assert.throws(() => {
      new CheckpointManager('copaa', {});
    }, TypeError, 'Should throw TypeError when state is an object (no toUpperCase)');

    // Test Case 1.3: Recursive directory creation on save
    const deepDir = path.join(process.cwd(), 'src/scrapers/national/data/checkpoints/nested/deep/test');
    const manager = new CheckpointManager('adv_test', 'ZZ', { checkpointDir: deepDir });
    
    // Ensure clean state
    if (fs.existsSync(deepDir)) {
      fs.rmSync(deepDir, { recursive: true, force: true });
    }

    manager.save({ testVal: 42 });
    assert.ok(fs.existsSync(manager.filePath), 'File should be created in nested deep directory');
    const loadedData = manager.load();
    assert.strictEqual(loadedData.testVal, 42, 'Loaded data should match saved data in deep directory');

    // Test Case 1.4: Handling of corrupted JSON files
    // Override file with malformed JSON
    fs.writeFileSync(manager.filePath, '{ malformed json: true }', 'utf8');
    const corruptedLoad = manager.load();
    assert.strictEqual(corruptedLoad, null, 'load() should return null for corrupted JSON');
    console.log('✓ Handled corrupted JSON gracefully (returned null)');

    // Test Case 1.5: Saving circular references
    const circularObj = {};
    circularObj.self = circularObj;
    assert.throws(() => {
      manager.save(circularObj);
    }, TypeError, 'save() should rethrow TypeError when JSON.stringify fails due to circular reference');
    console.log('✓ save() correctly rethrows JSON stringify failures');

    // Clean up Deep directory
    manager.clear();
    if (fs.existsSync(deepDir)) {
      fs.rmSync(deepDir, { recursive: true, force: true });
    }
    console.log('✓ CheckpointManager adversarial tests passed.\n');
  } catch (error) {
    console.error('✗ CheckpointManager adversarial tests FAILED:', error);
    allPassed = false;
  }

  // --- 2. RateLimiter Adversarial Tests ---
  try {
    console.log('--- Testing RateLimiter ---');

    // Test Case 2.1: Capping delay at maxBackoff with multiple backoffs
    const limiter = new RateLimiter({
      baseDelay: 100,
      maxJitter: 0,
      backoffFactor: 2,
      maxBackoff: 1000
    });

    // Backoff multiple times to exceed maxBackoff
    // 100 * 2^1 = 200
    // 100 * 2^2 = 400
    // 100 * 2^3 = 800
    // 100 * 2^4 = 1600 -> capped at 1000
    for (let i = 0; i < 10; i++) {
      limiter.backoff();
    }
    const dCapped = limiter.getDelay();
    assert.strictEqual(dCapped, 1000, `Delay should be capped at maxBackoff of 1000, got ${dCapped}`);
    console.log('✓ RateLimiter correctly caps delay at maxBackoff');

    // Test Case 2.2: Reset function resets backoff level and brings delay to baseline
    limiter.reset();
    const dReset = limiter.getDelay();
    assert.strictEqual(dReset, 100, `Delay should reset to baseDelay of 100, got ${dReset}`);
    console.log('✓ RateLimiter reset brings delay back to baseline');

    // Test Case 2.3: Boundary case where maxBackoff is less than baseDelay
    const customLimiter = new RateLimiter({
      baseDelay: 2000,
      maxJitter: 0,
      maxBackoff: 500
    });
    const dSmallMax = customLimiter.getDelay();
    assert.strictEqual(dSmallMax, 500, `Delay should cap at maxBackoff of 500 even when base is 2000, got ${dSmallMax}`);
    console.log('✓ RateLimiter caps when maxBackoff < baseDelay');

    // Test Case 2.4: Invalid input parameters
    // NaN values
    const nanLimiter = new RateLimiter({
      baseDelay: NaN,
      maxJitter: 0
    });
    const dNan = nanLimiter.getDelay();
    assert.strictEqual(dNan, 2000, 'Delay should fallback to default 2000 if baseDelay is NaN');

    // String instead of numbers (type coercion)
    const strLimiter = new RateLimiter({
      baseDelay: '100',
      maxJitter: '50'
    });
    // getDelay(): let delay = (this.baseDelay * backoffMultiplier) + jitter
    // baseDelay is '100' -> coerced to number. jitter is Math.random() * '50' -> coerced.
    const dStr = strLimiter.getDelay();
    assert.ok(dStr >= 100 && dStr <= 150, `Coercible string options should still work and result in number, got ${dStr}`);
    console.log('✓ RateLimiter handles string numbers via coercion');

    // Negative delays
    const negLimiter = new RateLimiter({
      baseDelay: -100,
      maxJitter: 0,
      maxBackoff: -50
    });
    const dNeg = negLimiter.getDelay();
    // baseDelay = -100 (invalid -> defaults to 2000). maxBackoff = -50 (invalid -> defaults to 60000). maxJitter = 0.
    // So expected delay is 2000.
    assert.strictEqual(dNeg, 2000, `Negative delay should fallback to default baseDelay of 2000, got ${dNeg}`);
    console.log('✓ RateLimiter handles negative inputs by falling back to defaults');

    console.log('✓ RateLimiter adversarial tests passed.\n');
  } catch (error) {
    console.error('✗ RateLimiter adversarial tests FAILED:', error);
    allPassed = false;
  }

  // --- 3. Browser Helper Concurrency & Stress Tests ---
  try {
    console.log('--- Testing Browser Context Concurrency ---');

    // Test Case 3.1: Concurrent context creation on same browser
    console.log('Launching single browser instance...');
    const browser = await launchBrowser({ headless: true });
    
    console.log('Creating 10 contexts concurrently...');
    const contextPromises = [];
    for (let i = 0; i < 10; i++) {
      contextPromises.push(createContext(browser, {
        viewport: { width: 1000 + i, height: 600 + i }
      }));
    }
    const contexts = await Promise.all(contextPromises);
    assert.strictEqual(contexts.length, 10, 'Should create exactly 10 contexts');
    console.log('✓ All 10 contexts created concurrently');

    // Open pages and check independence & stealth
    const pagePromises = contexts.map((ctx, idx) => {
      return (async () => {
        const page = await ctx.newPage();
        await page.goto('about:blank');
        const webdriver = await page.evaluate(() => navigator.webdriver);
        const vp = page.viewportSize();
        assert.strictEqual(webdriver, undefined, `Context ${idx} navigator.webdriver should be undefined`);
        assert.strictEqual(vp.width, 1000 + idx, `Context ${idx} viewport width should be distinct`);
        return page;
      })();
    });

    await Promise.all(pagePromises);
    console.log('✓ Distinct contexts verified (isolated viewports, independent stealth)');

    // Close all contexts
    await Promise.all(contexts.map(ctx => ctx.close()));
    await browser.close();
    console.log('✓ Browser closed cleanly after concurrent contexts');

    // Test Case 3.2: Concurrent createStealthPage calls (spawning multiple browsers)
    console.log('Launching 5 stealth pages (and browsers) concurrently...');
    const stealthPagePromises = [];
    for (let i = 0; i < 5; i++) {
      stealthPagePromises.push(createStealthPage({ headless: true }));
    }
    const instances = await Promise.all(stealthPagePromises);
    assert.strictEqual(instances.length, 5, 'Should launch 5 separate stealth pages');
    console.log('✓ Created 5 independent browsers and pages concurrently');

    // Verify all instances and close
    await Promise.all(instances.map(async (inst, idx) => {
      await inst.page.goto('about:blank');
      const webdriver = await inst.page.evaluate(() => navigator.webdriver);
      assert.strictEqual(webdriver, undefined, `Stealth page ${idx} navigator.webdriver should be undefined`);
      await inst.browser.close();
    }));
    console.log('✓ Closed all 5 browsers cleanly');

    console.log('✓ Browser helper concurrency tests passed.\n');
  } catch (error) {
    console.error('✗ Browser helper concurrency tests FAILED:', error);
    allPassed = false;
  }

  if (allPassed) {
    console.log('================================================');
    console.log('ALL ADVERSARIAL AND STRESS TESTS PASSED');
    console.log('================================================');
    process.exit(0);
  } else {
    console.log('================================================');
    console.log('ADVERSARIAL AND STRESS TESTS FAILED');
    console.log('================================================');
    process.exit(1);
  }
}

runAdversarialTests();
