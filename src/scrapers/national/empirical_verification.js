import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { RateLimiter } from './helpers/rateLimiter.js';
import { CheckpointManager } from './helpers/checkpoint.js';
import { createStealthPage } from './helpers/browser.js';

async function runEmpiricalVerification() {
  console.log('=== Running Empirical Verification ===\n');

  // --- 1. RateLimiter Jitter and Thundering Herd Verification ---
  console.log('1. Verifying RateLimiter delay at max backoff...');
  const baseDelay = 1000;
  const maxJitter = 500;
  const maxBackoff = 5000;
  const limiter = new RateLimiter({ baseDelay, maxJitter, maxBackoff });

  // Exceed max backoff
  for (let i = 0; i < 15; i++) {
    limiter.backoff();
  }

  const samples = 2000;
  const delays = [];
  for (let i = 0; i < samples; i++) {
    delays.push(limiter.getDelay());
  }

  // Verify delay boundaries
  const minDelay = Math.min(...delays);
  const maxDelay = Math.max(...delays);
  console.log(`   - Sampled ${samples} delays.`);
  console.log(`   - Min delay: ${minDelay.toFixed(2)}ms (Expected >= 5000ms)`);
  console.log(`   - Max delay: ${maxDelay.toFixed(2)}ms (Expected <= 5500ms)`);

  assert.ok(minDelay >= 5000, `Delay below minimum: ${minDelay}`);
  assert.ok(maxDelay <= 5500, `Delay above maximum: ${maxDelay}`);

  // Calculate mean and standard deviation
  const sum = delays.reduce((a, b) => a + b, 0);
  const mean = sum / samples;
  const variance = delays.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples;
  const stdDev = Math.sqrt(variance);

  console.log(`   - Mean delay: ${mean.toFixed(2)}ms (Expected ~5250ms)`);
  console.log(`   - StdDev: ${stdDev.toFixed(2)}ms (Expected ~144ms for uniform distribution)`);

  // Uniform distribution std dev should be approx maxJitter / Math.sqrt(12) = 500 / 3.464 = 144.33
  assert.ok(stdDev > 120 && stdDev < 160, `StdDev ${stdDev} is outside typical uniform distribution range [120, 160]`);
  
  // Verify that delays are unique/diverse to prevent thundering herd
  const uniqueDelays = new Set(delays);
  console.log(`   - Unique delays: ${uniqueDelays.size} of ${samples}`);
  assert.ok(uniqueDelays.size > samples * 0.99, 'Too many duplicate delays found!');
  console.log('✓ RateLimiter jitter and thundering herd protection verified.\n');

  // --- 2. CheckpointManager TypeError Verification ---
  console.log('2. Verifying CheckpointManager TypeError throws...');
  
  // Constructor type validations
  assert.throws(() => new CheckpointManager(123, 'NY'), TypeError, 'Should throw TypeError for number scraperName');
  assert.throws(() => new CheckpointManager('copaa', 123), TypeError, 'Should throw TypeError for number state');
  assert.throws(() => new CheckpointManager('copaa', {}), TypeError, 'Should throw TypeError for object state');

  const testDir = path.join(process.cwd(), 'src/scrapers/national/data/checkpoints');
  const manager = new CheckpointManager('test_verify', 'ZZ', { checkpointDir: testDir });
  manager.clear();

  // save() type validations
  assert.throws(() => manager.save(null), TypeError, 'Should throw TypeError when null is passed to save()');
  assert.throws(() => manager.save([]), TypeError, 'Should throw TypeError when array is passed to save()');
  assert.throws(() => manager.save('string'), TypeError, 'Should throw TypeError when string is passed to save()');
  assert.throws(() => manager.save(123), TypeError, 'Should throw TypeError when number is passed to save()');

  // Verify it works with plain object
  manager.save({ key: 'value' });
  const loaded = manager.load();
  assert.strictEqual(loaded.key, 'value');
  manager.clear();

  console.log('✓ CheckpointManager type validations verified.\n');

  // --- 3. CheckpointManager Atomic Writes Verification ---
  console.log('3. Verifying CheckpointManager atomic writes...');
  
  const originalRenameSync = fs.renameSync;
  let renameCalled = false;
  let tempFileExistedBeforeRename = false;
  let tempFileContentMatches = false;

  // Intercept renameSync to inspect the state during save
  fs.renameSync = function(oldPath, newPath) {
    renameCalled = true;
    tempFileExistedBeforeRename = fs.existsSync(oldPath);
    if (tempFileExistedBeforeRename) {
      try {
        const content = JSON.parse(fs.readFileSync(oldPath, 'utf8'));
        if (content.testKey === 'atomic_test_value') {
          tempFileContentMatches = true;
        }
      } catch (err) {
        console.error('Error reading temp file:', err);
      }
    }
    // Call the original renameSync
    return originalRenameSync(oldPath, newPath);
  };

  try {
    const atomicManager = new CheckpointManager('atomic_test', 'ZZ', { checkpointDir: testDir });
    atomicManager.clear();
    
    atomicManager.save({ testKey: 'atomic_test_value' });
    
    assert.ok(renameCalled, 'fs.renameSync was not called');
    assert.ok(tempFileExistedBeforeRename, 'Temp file did not exist before renameSync');
    assert.ok(tempFileContentMatches, 'Temp file content did not match');
    assert.ok(atomicManager.exists(), 'Target checkpoint file does not exist after save');
    
    atomicManager.clear();
  } finally {
    // Restore original renameSync
    fs.renameSync = originalRenameSync;
  }

  console.log('✓ CheckpointManager atomic writes verified.\n');

  // --- 4. Browser Process Leakage Verification ---
  console.log('4. Verifying browser.js does not leak processes...');

  function getChromeProcessCount() {
    try {
      const output = execSync("ps aux | grep -i chromium | grep -v grep | wc -l").toString().trim();
      return parseInt(output, 10);
    } catch (e) {
      console.warn('Could not run ps command:', e.message);
      return null;
    }
  }

  const initialCount = getChromeProcessCount();
  if (initialCount === null) {
    console.log('   - Skipped process counting because ps command failed/not available.');
  } else {
    console.log(`   - Initial Chromium process count: ${initialCount}`);

    // Launch a stealth page/browser
    const { browser, page } = await createStealthPage({ headless: true });
    await page.goto('about:blank');

    const activeCount = getChromeProcessCount();
    console.log(`   - Active Chromium process count: ${activeCount}`);
    assert.ok(activeCount > initialCount, 'Chromium process count did not increase after launch');

    // Close the browser
    await browser.close();

    // Give the OS 500ms to clean up Chromium helper processes
    await new Promise(r => setTimeout(r, 500));

    const postCloseCount = getChromeProcessCount();
    console.log(`   - Post-close Chromium process count: ${postCloseCount}`);
    
    // We give the system a moment to clean up process if needed, but normally it's synchronous in close()
    assert.strictEqual(postCloseCount, initialCount, `Chromium process leak detected! Initial: ${initialCount}, final: ${postCloseCount}`);
    console.log('✓ Browser process clean-up verified (no leaks).');
  }

  console.log('\n=== ALL EMPIRICAL VERIFICATIONS PASSED ===');
}

runEmpiricalVerification().catch(err => {
  console.error('\n✗ Empirical verification FAILED:', err);
  process.exit(1);
});
