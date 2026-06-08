import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { CheckpointManager } from './helpers/checkpoint.js';
import { RateLimiter } from './helpers/rateLimiter.js';
import { launchBrowser, createContext, createStealthPage, getRandomUserAgent, USER_AGENTS } from './helpers/browser.js';

async function runAdversarialTests() {
  console.log('=== SCRAPER INFRASTRUCTURE ADVERSARIAL TESTS ===\n');
  let testsRun = 0;
  let testsFailed = 0;

  function runTest(name, fn) {
    testsRun++;
    console.log(`Running: ${name}...`);
    try {
      fn();
      console.log(`✓ Passed: ${name}\n`);
    } catch (error) {
      testsFailed++;
      console.error(`✗ FAILED: ${name}`);
      console.error(error);
      console.log('\n');
    }
  }

  async function runAsyncTest(name, fn) {
    testsRun++;
    console.log(`Running (async): ${name}...`);
    try {
      await fn();
      console.log(`✓ Passed: ${name}\n`);
    } catch (error) {
      testsFailed++;
      console.error(`✗ FAILED: ${name}`);
      console.error(error);
      console.log('\n');
    }
  }

  // --- PART 1: CheckpointManager ---

  runTest('CheckpointManager: Missing scraperName and/or state throws', () => {
    assert.throws(() => new CheckpointManager(), /CheckpointManager requires both scraperName and state/);
    assert.throws(() => new CheckpointManager('copaa'), /CheckpointManager requires both scraperName and state/);
    assert.throws(() => new CheckpointManager('', 'NY'), /CheckpointManager requires both scraperName and state/);
    assert.throws(() => new CheckpointManager('copaa', ''), /CheckpointManager requires both scraperName and state/);
    assert.throws(() => new CheckpointManager(null, 'NY'), /CheckpointManager requires both scraperName and state/);
    assert.throws(() => new CheckpointManager('copaa', undefined), /CheckpointManager requires both scraperName and state/);
  });

  runTest('CheckpointManager: Non-string inputs throw TypeError', () => {
    assert.throws(() => new CheckpointManager(123, 'NY'), TypeError);
    assert.throws(() => new CheckpointManager('copaa', {}), TypeError);
    assert.throws(() => new CheckpointManager([], 'NY'), TypeError);
    assert.throws(() => new CheckpointManager('copaa', true), TypeError);
  });

  runTest('CheckpointManager: Malformed JSON file handled gracefully', () => {
    const testDir = path.join(process.cwd(), 'src/scrapers/national/data/checkpoints');
    const manager = new CheckpointManager('test_malformed', 'ZZ', { checkpointDir: testDir });
    
    // Ensure file doesn't exist
    manager.clear();
    
    // Write invalid JSON directly to the expected file path
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(manager.filePath, '{ invalid json: true ', 'utf8');
    
    // Attempt to load should not throw, it should return null
    const result = manager.load();
    assert.strictEqual(result, null);
    
    // Clean up
    manager.clear();
  });

  runTest('CheckpointManager: save() with object spreading constraints', () => {
    const testDir = path.join(process.cwd(), 'src/scrapers/national/data/checkpoints');
    const manager = new CheckpointManager('test_save_edge', 'ZZ', { checkpointDir: testDir });
    manager.clear();

    // Passing undefined should work because of default parameter data = {}
    manager.save();
    let loaded = manager.load();
    assert.strictEqual(loaded.scraper, 'test_save_edge');
    assert.strictEqual(loaded.state, 'ZZ');
    assert.strictEqual(loaded.completed, false);

    // Passing null directly should throw TypeError
    assert.throws(() => {
      manager.save(null);
    }, TypeError, 'save() with null should throw TypeError');

    // Passing primitive string should throw TypeError
    assert.throws(() => {
      manager.save("hello");
    }, TypeError, 'save() with string should throw TypeError');

    // Passing an array should throw TypeError
    assert.throws(() => {
      manager.save([10, 20]);
    }, TypeError, 'save() with array should throw TypeError');

    manager.clear();
  });

  // --- PART 2: RateLimiter ---

  runTest('RateLimiter: Default values verify', () => {
    const limiter = new RateLimiter();
    assert.strictEqual(limiter.baseDelay, 2000);
    assert.strictEqual(limiter.maxJitter, 3000);
    assert.strictEqual(limiter.backoffFactor, 2);
    assert.strictEqual(limiter.maxBackoff, 60000);
    assert.strictEqual(limiter.backoffLevel, 0);
  });

  runTest('RateLimiter: Negative and extreme options handled', () => {
    const limiter = new RateLimiter({ baseDelay: -100, maxJitter: -50, maxBackoff: -10 });
    const delay = limiter.getDelay();
    assert.ok(delay <= limiter.maxBackoff);
  });

  runTest('RateLimiter: maxBackoff smaller than baseDelay is capped immediately', () => {
    const limiter = new RateLimiter({ baseDelay: 1000, maxJitter: 0, maxBackoff: 500 });
    const delay = limiter.getDelay();
    assert.strictEqual(delay, 500);
  });

  runTest('RateLimiter: backoff level caps correctly at maxBackoff', () => {
    const baseDelay = 100;
    const maxBackoff = 1000;
    const limiter = new RateLimiter({ baseDelay, maxJitter: 0, backoffFactor: 2, maxBackoff });

    // level 0: 100 * 2^0 = 100
    assert.strictEqual(limiter.getDelay(), 100);

    // level 1: 100 * 2^1 = 200
    limiter.backoff();
    assert.strictEqual(limiter.getDelay(), 200);

    // level 2: 100 * 2^2 = 400
    limiter.backoff();
    assert.strictEqual(limiter.getDelay(), 400);

    // level 3: 100 * 2^3 = 800
    limiter.backoff();
    assert.strictEqual(limiter.getDelay(), 800);

    // level 4: 100 * 2^4 = 1600 (capped at 1000)
    limiter.backoff();
    assert.strictEqual(limiter.getDelay(), 1000);

    // level 5: capped at 1000
    limiter.backoff();
    assert.strictEqual(limiter.getDelay(), 1000);

    // level 50: backoff multiplier is Math.pow(2, 50) = 1.12e15. Capped at 1000.
    for (let i = 0; i < 45; i++) {
      limiter.backoff();
    }
    assert.strictEqual(limiter.getDelay(), 1000);

    // level 1000: Math.pow(2, 1000) is Infinity. Capped at 1000.
    for (let i = 0; i < 1000; i++) {
      limiter.backoff();
    }
    const hugeDelay = limiter.getDelay();
    assert.strictEqual(hugeDelay, 1000);
  });

  runTest('RateLimiter: reset restores original delay', () => {
    const limiter = new RateLimiter({ baseDelay: 100, maxJitter: 0, maxBackoff: 1000 });
    limiter.backoff(); // 200
    limiter.backoff(); // 400
    limiter.reset();
    assert.strictEqual(limiter.getDelay(), 100);
    assert.strictEqual(limiter.backoffLevel, 0);
  });

  // --- PART 3: Browser ---

  runTest('Browser: User Agent distribution is reasonable', () => {
    const counts = {};
    for (const ua of USER_AGENTS) {
      counts[ua] = 0;
    }

    const iterations = 14000;
    for (let i = 0; i < iterations; i++) {
      const ua = getRandomUserAgent();
      counts[ua] = (counts[ua] || 0) + 1;
    }

    const expectedPortion = 1 / USER_AGENTS.length; // ~0.1428
    const tolerance = 0.035; // Allow range [10.7%, 17.8%]

    console.log('User Agent Distribution:');
    for (const ua of USER_AGENTS) {
      const portion = counts[ua] / iterations;
      console.log(`  - ${ua.substring(0, 40)}...: ${(portion * 100).toFixed(2)}% (count: ${counts[ua]})`);
      assert.ok(counts[ua] > 0, `User agent was never selected: ${ua}`);
      assert.ok(
        Math.abs(portion - expectedPortion) < tolerance,
        `User agent distribution out of tolerance. Expected ~${(expectedPortion * 100).toFixed(1)}%, got ${(portion * 100).toFixed(1)}%`
      );
    }
  });

  await runAsyncTest('Browser: Concurrent context creation and navigation', async () => {
    const browser = await launchBrowser({ headless: true });
    
    // Create 10 contexts concurrently
    const contextPromises = [];
    for (let i = 0; i < 10; i++) {
      contextPromises.push(createContext(browser));
    }
    const contexts = await Promise.all(contextPromises);
    assert.strictEqual(contexts.length, 10);

    // Navigating their pages concurrently
    const pagePromises = contexts.map(async (context, index) => {
      const page = await context.newPage();
      await page.goto('about:blank');
      const webdriverVal = await page.evaluate(() => navigator.webdriver);
      assert.strictEqual(webdriverVal, undefined, `Context ${index} did not patch navigator.webdriver`);
      return page;
    });

    await Promise.all(pagePromises);
    
    // Cleanup
    await browser.close();
  });

  await runAsyncTest('Browser: Concurrent createStealthPage calls', async () => {
    const pagePromises = [
      createStealthPage({ headless: true }),
      createStealthPage({ headless: true }),
      createStealthPage({ headless: true })
    ];

    const results = await Promise.all(pagePromises);
    assert.strictEqual(results.length, 3);

    for (const { browser, page } of results) {
      await page.goto('about:blank');
      const webdriverVal = await page.evaluate(() => navigator.webdriver);
      assert.strictEqual(webdriverVal, undefined);
      await browser.close();
    }
  });

  console.log('=== VERIFICATION SUMMARY ===');
  console.log(`Total tests run: ${testsRun}`);
  console.log(`Total failures: ${testsFailed}`);
  console.log('============================');

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAdversarialTests();
