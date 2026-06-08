import path from 'path';
import { launchBrowser, createContext, getRandomUserAgent, USER_AGENTS } from './helpers/browser.js';
import { sleep, RateLimiter } from './helpers/rateLimiter.js';
import { CheckpointManager } from './helpers/checkpoint.js';

async function runTests() {
  console.log('=== Scraper Infrastructure Helper Verification ===\n');
  let passed = true;

  // 1. Browser Stealth & Launch Verification
  try {
    console.log('Testing browser.js helper...');
    
    // User Agent verification
    const ua = getRandomUserAgent();
    if (!USER_AGENTS.includes(ua)) {
      throw new Error(`Rotated User-Agent "${ua}" is not in the curated USER_AGENTS list.`);
    }
    console.log(`✓ User-Agent rotation works. Random choice: "${ua}"`);

    // Headless Browser Launch and Stealth verification
    console.log('Launching browser to check stealth initialization...');
    const browser = await launchBrowser({ headless: true });
    const context = await createContext(browser);
    const page = await context.newPage();

    // Verify page content loads (using about:blank to comply with CODE_ONLY network restriction)
    await page.goto('about:blank');

    // Check navigator.webdriver property
    const webdriverVal = await page.evaluate(() => navigator.webdriver);
    if (webdriverVal === true) {
      throw new Error(`Stealth failed: navigator.webdriver is true`);
    }
    console.log(`✓ Stealth validation check passed (navigator.webdriver = ${webdriverVal})`);

    await browser.close();
    console.log('✓ browser.js verification PASSED\n');
  } catch (error) {
    console.error('✗ browser.js verification FAILED:', error);
    passed = false;
  }

  // 2. RateLimiter Verification
  try {
    console.log('Testing rateLimiter.js helper...');
    
    // Sleep function verification
    const start = Date.now();
    await sleep(100);
    const elapsed = Date.now() - start;
    if (elapsed < 90) {
      throw new Error(`sleep(100) slept for only ${elapsed}ms`);
    }
    console.log(`✓ sleep(100) functioning correctly (${elapsed}ms elapsed)`);

    // RateLimiter functionality verification
    const baseDelay = 100;
    const maxJitter = 50;
    const limiter = new RateLimiter({ baseDelay, maxJitter });
    
    const d1 = limiter.getDelay();
    if (d1 < baseDelay || d1 > (baseDelay + maxJitter)) {
      throw new Error(`Delay ${d1} out of bounds for base ${baseDelay} and jitter ${maxJitter}`);
    }
    console.log(`✓ RateLimiter baseline and jitter delay within range (${d1.toFixed(2)}ms)`);

    // Backoff verification
    limiter.backoff();
    const d2 = limiter.getDelay();
    const expectedMinBackoff = baseDelay * 2;
    if (d2 < expectedMinBackoff) {
      throw new Error(`Backoff delay ${d2} is less than expected minimum ${expectedMinBackoff}`);
    }
    console.log(`✓ RateLimiter backoff functioning correctly (${d2.toFixed(2)}ms)`);

    // Reset verification
    limiter.reset();
    const d3 = limiter.getDelay();
    if (d3 >= expectedMinBackoff) {
      throw new Error(`Reset failed: delay ${d3} is still at backoff level`);
    }
    console.log(`✓ RateLimiter reset functioning correctly (${d3.toFixed(2)}ms)`);

    console.log('✓ rateLimiter.js verification PASSED\n');
  } catch (error) {
    console.error('✗ rateLimiter.js verification FAILED:', error);
    passed = false;
  }

  // 3. CheckpointManager Verification
  try {
    console.log('Testing checkpoint.js helper...');
    
    const testDir = path.join(process.cwd(), 'src/scrapers/national/data/checkpoints');
    const scraperName = 'test_scraper';
    const state = 'ZZ';
    const manager = new CheckpointManager(scraperName, state, { checkpointDir: testDir });

    // Clean up if old one exists
    manager.clear();

    if (manager.exists()) {
      throw new Error('Checkpoint exists when it should have been cleared');
    }

    const testData = {
      lastProcessedPage: 12,
      completed: false,
      metadata: { totalItems: 125, runId: 'abc-123' }
    };

    manager.save(testData);
    if (!manager.exists()) {
      throw new Error('Checkpoint file not found after save');
    }
    console.log('✓ Checkpoint file successfully created');

    const loaded = manager.load();
    if (!loaded) {
      throw new Error('Loaded checkpoint is null');
    }
    if (loaded.lastProcessedPage !== 12 || loaded.completed !== false || loaded.metadata.runId !== 'abc-123') {
      throw new Error(`Checkpoint values mismatch. Loaded: ${JSON.stringify(loaded)}`);
    }
    console.log('✓ Loaded checkpoint content matches saved metadata');

    manager.clear();
    if (manager.exists()) {
      throw new Error('Checkpoint file still exists after clear()');
    }
    console.log('✓ Checkpoint file successfully cleared/deleted');

    console.log('✓ checkpoint.js verification PASSED\n');
  } catch (error) {
    console.error('✗ checkpoint.js verification FAILED:', error);
    passed = false;
  }

  if (passed) {
    console.log('================================================');
    console.log('ALL INFRASTRUCTURE HELPER VERIFICATIONS PASSED');
    console.log('================================================');
    process.exit(0);
  } else {
    console.log('================================================');
    console.log('INFRASTRUCTURE HELPER VERIFICATION FAILED');
    console.log('================================================');
    process.exit(1);
  }
}

runTests();
