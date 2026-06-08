import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { createHash } from 'crypto';
import { launchBrowser, createContext, getRandomUserAgent } from './helpers/browser.js';
import { RateLimiter } from './helpers/rateLimiter.js';
import { CheckpointManager } from './helpers/checkpoint.js';

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

function analyzeSpecialties(text) {
  const lowerText = text.toLowerCase();
  const specs = [];
  if (lowerText.includes('autism') || lowerText.includes('asd')) specs.push('Autism');
  if (lowerText.includes('down syndrome')) specs.push('Down Syndrome');
  if (lowerText.includes('hearing') || lowerText.includes('deaf')) specs.push('Hearing Loss');
  if (lowerText.includes('vision') || lowerText.includes('blind')) specs.push('Vision Impairment');
  if (lowerText.includes('adhd')) specs.push('ADHD');
  if (lowerText.includes('learning') || lowerText.includes('dyslexia')) specs.push('Learning Disabilities');
  if (lowerText.includes('speech') || lowerText.includes('language')) specs.push('Speech & Language');
  if (lowerText.includes('behavior') || lowerText.includes('aba')) specs.push('Behavioral Needs');
  return specs.length > 0 ? specs.join(', ') : 'General Advocacy';
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
    console.log('Usage: node wrightslaw.js --state <STATE_CODE> [--limit <N>] [--resume]');
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
    fs.writeFileSync(path.join(outDir, 'wrightslaw.json'), '[]', 'utf8');
    process.exit(0);
  }

  const checkpointManager = new CheckpointManager('wrightslaw', state, { checkpointDir: process.env.CHECKPOINT_DIR });
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

  const baseUrl = process.env.WRIGHTSLAW_BASE_URL || 'https://www.yellowpagesforkids.com';
  const startUrl = `${baseUrl}/help/${state.toLowerCase()}.htm`;

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

    const paragraphs = await page.evaluate(() => {
      const pElements = Array.from(document.querySelectorAll('p'));
      return pElements.map(p => {
        let title = '';
        const bTag = p.querySelector('b');
        const strongTag = p.querySelector('strong');
        if (bTag) title = bTag.innerText;
        else if (strongTag) title = strongTag.innerText;
        
        let href = '';
        const anchor = p.querySelector('a');
        if (anchor) href = anchor.getAttribute('href') || '';
        
        return {
          title,
          html: p.innerHTML,
          text: p.innerText,
          href
        };
      });
    });

    console.log(`Found ${paragraphs.length} paragraphs. Processing...`);

    for (const p of paragraphs) {
      if (results.length >= limit) break;

      currentIndex++;
      // If resuming, skip already processed paragraphs
      if (currentIndex <= lastProcessedPage) {
        continue;
      }

      let name = p.title.replace(/\s+/g, ' ').trim();
      if (!name) continue;

      const lowerName = name.toLowerCase();
      if (
        name.length > 80 || 
        name.length < 3 || 
        lowerName.includes('translate') || 
        lowerName.includes('wrightslaw') || 
        lowerName.includes('yellow pages') ||
        lowerName.includes('advertising') ||
        lowerName.includes('submit') ||
        lowerName.includes('offer') ||
        lowerName.includes('flyer') ||
        lowerName.includes('store')
      ) {
        continue;
      }

      const textContent = p.text.replace(/\s+/g, ' ').trim();
      const lowerText = textContent.toLowerCase();

      const isAdvocate = lowerText.includes('advocat') || lowerText.includes('iep') || lowerText.includes('504') || lowerText.includes('consult');
      const isAttorney = lowerText.includes('attorney') || lowerText.includes('lawyer') || lowerText.includes('due process') || lowerText.includes('representation') || lowerText.includes('legal') || lowerText.includes('law firm');

      if (!isAdvocate && !isAttorney) {
        continue;
      }

      // Extract phone
      const phoneRegex = /\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
      const phoneMatch = textContent.match(phoneRegex);
      const phone = phoneMatch ? phoneMatch[0] : null;

      // Extract email (checking that simple match has domain/obfuscation, otherwise fallback)
      let email = '';
      const emailMatch = p.html.match(/Email:\s*([^\s<]+)/i);
      if (emailMatch && (emailMatch[1].includes('@') || emailMatch[1].includes('[at]') || emailMatch[1].includes('| at |'))) {
        email = emailMatch[1].trim();
      } else {
        const emailRegex = /\b[A-Za-z0-9._%+-]+\s*(?:\| at \||\[at\]|@)\s*[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i;
        const match = textContent.match(emailRegex);
        if (match) email = match[0];
      }

      if (email) {
        email = email
          .replace(/\s*\|\s*at\s*\|\s*/i, '@')
          .replace(/\s*\[\s*at\s*\]\s*/i, '@')
          .replace(/[.,;]$/, '')
          .trim();
      } else {
        email = null;
      }

      // Extract website
      let website = '';
      if (p.href && !p.href.includes('wrightslaw') && !p.href.includes('yellowpages') && !p.href.includes('mailto:')) {
        website = p.href.trim();
      }
      if (!website) {
        website = 'https://www.yellowpagesforkids.com';
      }

      const specialties = analyzeSpecialties(textContent);

      const orgName = isAttorney ? name + ' Law Firm' : 'Independent Practice';
      const hashInput = `${name.toLowerCase()}|${state.toLowerCase()}|${orgName.toLowerCase()}`;
      const id = 'yp-' + createHash('sha256').update(hashInput).digest('hex');

      let orgInfo = null;
      if (isAttorney) {
        const orgHashInput = `${orgName.toLowerCase()}|${state.toLowerCase()}`;
        const orgId = 'org-' + createHash('sha256').update(orgHashInput).digest('hex');
        orgInfo = {
          id: orgId,
          name: orgName,
          state: state,
          city: textContent.includes(',') ? textContent.split(',')[0].trim() : '',
          phone: phone,
          email: email,
          website: website,
          description: `Law firm representing clients in special education matters.`,
          source: 'wrightslaw',
          scraped_at: new Date().toISOString()
        };
      }

      results.push({
        id,
        name,
        type: isAttorney ? 'attorney' : 'advocate',
        state,
        city: textContent.includes(',') ? textContent.split(',')[0].trim() : '',
        phone,
        email,
        website,
        specialties,
        organization: orgName,
        organization_info: orgInfo,
        description: textContent,
        source: 'wrightslaw',
        scraped_at: new Date().toISOString()
      });

      // Throttle and save checkpoint
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
    fs.writeFileSync(path.join(outDir, 'wrightslaw.json'), JSON.stringify(results, null, 2), 'utf8');

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
