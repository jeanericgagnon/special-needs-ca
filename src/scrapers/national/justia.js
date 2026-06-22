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

function extractSchoolDistrict(caseName) {
  if (!caseName) return null;
  const separators = [/\s+v\.\s+/i, /\s+v\s+/i, /\s+vs\.\s+/i, /\s+vs\s+/i, /\s+versus\s+/i];
  let parts = [caseName];
  for (const sep of separators) {
    if (sep.test(caseName)) {
      parts = caseName.split(sep);
      break;
    }
  }
  
  const indicators = [
    /\b(?:unified|independent|consolidated|city|public|county)?\s*school\s*(?:district|board|department|system|committee|corp|corporation|district\s*board|board\s*of\s*education|trustees|schools)\b/i,
    /\bboard\s*of\s*education\b/i,
    /\bpublic\s*schools\b/i
  ];
  
  for (const part of parts) {
    const trimmed = part.trim();
    for (const indicator of indicators) {
      if (indicator.test(trimmed)) {
        return trimmed.replace(/^["'“‘]+|["'”’]+$/g, '').trim();
      }
    }
  }
  return null;
}

function determineOutcome(summary) {
  if (!summary) return 'unknown';
  const text = summary.toLowerCase();
  
  const parentWinTerms = [
    'in favor of parent', 'in favor of the parent', 'in favor of plaintiff',
    'reversed', 'vacated', 'remanded', 'violated the idea', 'violated fape',
    'reimbursement ordered', 'reimbursement granted', 'ordered to reimburse',
    'parent prevailed', 'student prevailed', 'ruling for parent', 'ruling for the parent'
  ];
  
  const districtWinTerms = [
    'in favor of district', 'in favor of the district', 'in favor of defendant',
    'affirmed', 'dismissed', 'judgment for district', 'judgment for the district',
    'did not violate', 'denied reimbursement', 'reimbursement denied', 'no violation',
    'district prevailed', 'ruling for district', 'ruling for the district', 'granted summary judgment to'
  ];
  
  let parentScore = 0;
  let districtScore = 0;
  
  for (const term of parentWinTerms) {
    if (text.includes(term)) parentScore++;
  }
  for (const term of districtWinTerms) {
    if (text.includes(term)) districtScore++;
  }
  
  if (parentScore > districtScore) return 'parent_win';
  if (districtScore > parentScore) return 'district_win';
  return 'unknown';
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
      
      const schoolDistrict = extractSchoolDistrict(card.caseName);
      const outcome = determineOutcome(card.summary);
      
      results.push({
        id,
        state,
        case_name: card.caseName,
        case_number: `CASE-${100 + currentIndex}`,
        decision_date: parseDateToISO(card.decisionDate),
        summary: card.summary || 'No summary provided.',
        document_url: card.documentUrl || 'https://law.justia.com',
        body_text: `Full decision body text for ${card.caseName}.`,
        school_district: schoolDistrict,
        outcome,
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
