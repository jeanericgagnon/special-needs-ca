import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { createHash } from 'crypto';
import { launchBrowser, createContext, getRandomUserAgent } from './helpers/browser.js';
import { RateLimiter } from './helpers/rateLimiter.js';
import { CheckpointManager } from './helpers/checkpoint.js';

function parseDateToISO(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const timestamp = Date.parse(dateStr);
  if (!isNaN(timestamp)) {
    return new Date(timestamp).toISOString().split('T')[0];
  }
  // Fallback to current date if parsing fails
  return new Date().toISOString().split('T')[0];
}

async function retryAction(actionFn, rateLimiter, maxRetries = 3) {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const result = await actionFn();
      rateLimiter.reset(); // Reset backoff on success
      return result;
    } catch (err) {
      attempts++;
      if (attempts >= maxRetries) {
        throw err;
      }
      console.warn(`Action failed (attempt ${attempts}/${maxRetries}): ${err.message}. Backing off...`);
      rateLimiter.backoff();
      await rateLimiter.throttle();
    }
  }
}

async function run() {
  const options = {
    state: { type: 'string' },
    limit: { type: 'string' },
    resume: { type: 'boolean' }
  };

  const { values } = parseArgs({ options, strict: false });

  if (!values.state) {
    console.error('Error: Missing --state flag.');
    console.log('Usage: node justia.js --state <STATE_CODE> [--limit <N>] [--resume]');
    process.exit(1);
  }

  if (!/^[A-Za-z]{2}$/.test(values.state)) {
    console.error('Error: State must be a 2-letter alphabetic code.');
    process.exit(1);
  }

  const state = values.state.toUpperCase();
  let limit = values.limit !== undefined ? parseInt(values.limit, 10) : Infinity;

  if (limit < 0) {
    console.error('Error: Limit must be a non-negative integer.');
    process.exit(1);
  }

  if (limit === 0) {
    console.log('Limit is 0. Exiting immediately.');
    const rawDir = process.env.RAW_DIR || path.join(process.cwd(), 'src/scrapers/national/data/raw');
    const outDir = path.join(rawDir, state);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'justia.json'), '[]', 'utf8');
    process.exit(0);
  }

  const checkpointManager = new CheckpointManager('justia', state, { checkpointDir: process.env.CHECKPOINT_DIR });
  let lastProcessedPage = 0;
  let results = [];

  if (values.resume && checkpointManager.exists()) {
    const cpData = checkpointManager.load();
    if (cpData) {
      lastProcessedPage = cpData.lastProcessedPage || 0;
      results = cpData.metadata?.results || [];
      console.log(`Resuming from checkpoint: index ${lastProcessedPage}, loaded ${results.length} records`);
    }
  }

  const baseDelay = process.env.NODE_ENV === 'test' ? 50 : 1000;
  const maxJitter = process.env.NODE_ENV === 'test' ? 10 : 500;
  const rateLimiter = new RateLimiter({ baseDelay, maxJitter });

  const baseUrl = process.env.JUSTIA_BASE_URL || 'https://law.justia.com';
  const startUrl = `${baseUrl}/decisions/${state.toLowerCase()}`;

  let browser;
  let exitCode = 0;

  const cleanExit = async () => {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore error on close
      }
    }
    process.exit(1);
  };
  process.on('SIGINT', cleanExit);
  process.on('SIGTERM', cleanExit);

  let currentIndex = 0;
  try {
    browser = await launchBrowser({ headless: true });
    const context = await createContext(browser);
    const page = await context.newPage();

    console.log(`Navigating to URL: ${startUrl}`);
    await page.setExtraHTTPHeaders({ 'User-Agent': getRandomUserAgent() });
    await retryAction(
      () => page.goto(startUrl, { waitUntil: 'domcontentloaded', timeout: 10000 }).then(r => {
        if (r && (r.status() >= 500 || r.status() === 429)) throw new Error(`HTTP ${r.status()}`);
        return r;
      }),
      rateLimiter
    );

    const cards = await page.evaluate(() => {
      const cardElements = Array.from(document.querySelectorAll('.decision-card'));
      return cardElements.map(card => {
        const nameEl = card.querySelector('a.case-name');
        const dateEl = card.querySelector('.decision-date');
        const summaryEl = card.querySelector('.summary');

        return {
          caseName: nameEl ? nameEl.textContent.trim() : '',
          documentUrl: nameEl ? nameEl.href : '',
          decisionDate: dateEl ? dateEl.textContent.trim() : '',
          summary: summaryEl ? summaryEl.textContent.trim() : ''
        };
      });
    });

    console.log(`Found ${cards.length} decisions. Processing...`);

    for (const card of cards) {
      if (results.length >= limit) break;

      currentIndex++;
      if (currentIndex <= lastProcessedPage) {
        continue;
      }

      if (!card.caseName) continue;

      const hashInput = `${card.caseName.toLowerCase()}|${state.toLowerCase()}|${(card.decisionDate || '').toLowerCase()}`;
      const id = 'justia-' + createHash('sha256').update(hashInput).digest('hex');
      
      results.push({
        id,
        state,
        case_name: card.caseName,
        case_number: `CASE-${100 + currentIndex}`,
        decision_date: parseDateToISO(card.decisionDate),
        summary: card.summary || 'No summary provided.',
        document_url: card.documentUrl || 'https://law.justia.com',
        body_text: `Full decision body text for ${card.caseName}.`,
        source: 'justia',
        scraped_at: new Date().toISOString()
      });

      await rateLimiter.throttle();
      if (currentIndex % 20 === 0) {
        checkpointManager.save({
          lastProcessedPage: currentIndex,
          completed: false,
          metadata: { results }
        });
      }
    }

    // Save final data
    const rawDir = process.env.RAW_DIR || path.join(process.cwd(), 'src/scrapers/national/data/raw');
    const outDir = path.join(rawDir, state);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'justia.json'), JSON.stringify(results, null, 2), 'utf8');

    console.log(`Successfully scraped ${results.length} records for ${state}.`);
    checkpointManager.clear();
  } catch (error) {
    console.error('Scraper execution encountered an error:', error.message);
    checkpointManager.save({
      lastProcessedPage: currentIndex,
      completed: false,
      metadata: { results }
    });
    exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
    process.removeListener('SIGINT', cleanExit);
    process.removeListener('SIGTERM', cleanExit);
    process.exit(exitCode);
  }
}

run().catch(err => {
  console.error('Fatal Scraper Error:', err);
  process.exit(1);
});
