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

  // T2.F1.5: Missing --state flag outputs error and usage information
  if (!values.state) {
    console.error('Error: Missing --state flag.');
    console.log('Usage: node copaa.js --state <STATE_CODE> [--limit <N>] [--resume]');
    process.exit(1);
  }

  if (!/^[A-Za-z]{2}$/.test(values.state)) {
    console.error('Error: State must be a 2-letter alphabetic code.');
    process.exit(1);
  }

  const state = values.state.toUpperCase();
  let limit = values.limit !== undefined ? parseInt(values.limit, 10) : Infinity;

  // T2.F1.3: Crawling with negative limit throws validation error
  if (limit < 0) {
    console.error('Error: Limit must be a non-negative integer.');
    process.exit(1);
  }

  // T2.F1.2: Crawling with --limit 0 exits immediately without crawling
  if (limit === 0) {
    console.log('Limit is 0. Exiting immediately.');
    // Save empty results
    const rawDir = process.env.RAW_DIR || path.join(process.cwd(), 'src/scrapers/national/data/raw');
    const outDir = path.join(rawDir, state);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'copaa.json'), '[]', 'utf8');
    process.exit(0);
  }

  const checkpointManager = new CheckpointManager('copaa', state, { checkpointDir: process.env.CHECKPOINT_DIR });
  let lastProcessedPage = 0;
  let results = [];

  if (values.resume && checkpointManager.exists()) {
    const cpData = checkpointManager.load();
    if (cpData) {
      lastProcessedPage = cpData.lastProcessedPage || 0;
      results = cpData.metadata?.results || [];
      console.log(`Resuming from checkpoint: page ${lastProcessedPage}, loaded ${results.length} records`);
    }
  }

  const baseDelay = process.env.NODE_ENV === 'test' ? 50 : 1000;
  const maxJitter = process.env.NODE_ENV === 'test' ? 10 : 500;
  const rateLimiter = new RateLimiter({ baseDelay, maxJitter });

  const baseUrl = process.env.COPAA_BASE_URL || 'https://connect.copaa.org';
  const startUrl = `${baseUrl}/copaathrivecommunity/network/find-a-professional/find-a-professional32`;

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

  let currentPageNum = lastProcessedPage + 1;
  try {
    browser = await launchBrowser({ headless: true });
    // T1.F1.3: User-Agent rotation
    const context = await createContext(browser);
    const page = await context.newPage();

    let hasNextPage = true;

    console.log(`Navigating to start URL: ${startUrl}`);
    await page.setExtraHTTPHeaders({ 'User-Agent': getRandomUserAgent() });
    await retryAction(
      () => page.goto(startUrl, { waitUntil: 'domcontentloaded', timeout: 10000 }).then(r => {
        if (r && (r.status() >= 500 || r.status() === 429)) throw new Error(`HTTP ${r.status()}`);
        return r;
      }),
      rateLimiter
    );

    // Perform state selection and search form submission
    console.log(`Selecting state ${state}...`);
    await page.selectOption('#MainCopy_ctl06_ucCountryStateProvinceList_ddlState', { value: state }, { timeout: 1000 }).catch(() => {});
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
      page.click('#MainCopy_ctl13_FindContacts')
    ]).catch(() => {});

    // If resuming, skip page clicks
    for (let p = 1; p < currentPageNum; p++) {
      const nextButton = page.locator('a[id*="NextPageButton"]').first();
      if (await nextButton.isVisible()) {
        await page.setExtraHTTPHeaders({ 'User-Agent': getRandomUserAgent() });
        await retryAction(
          () => Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
            nextButton.click()
          ]),
          rateLimiter
        );
      } else {
        hasNextPage = false;
        break;
      }
    }

    while (hasNextPage && results.length < limit) {
      console.log(`Scraping page ${currentPageNum}...`);
      
      const newDocs = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.member-row'));
        return rows.map(row => {
          const nameEl = row.querySelector('.member-name a');
          const emailEl = row.querySelector('.member-email a');
          const phoneEl = row.querySelector('.phone-numbers');
          const companyEl = row.querySelector('.company-name');
          const titleEl = row.querySelector('.company-title');
          const addressEl = row.querySelector('.list-address-panel');

          // Find any external website links (skipping email and internal links)
          let website = '';
          const links = Array.from(row.querySelectorAll('a'));
          for (const a of links) {
            const href = a.getAttribute('href') || '';
            const text = a.textContent.trim().toLowerCase();
            if (href.startsWith('http') && 
                !href.includes('copaa.org') && 
                !href.includes('facebook.com') && 
                !href.includes('twitter.com') && 
                !href.includes('linkedin.com') && 
                !href.includes('mailto:')) {
              website = href;
              break;
            }
            if (text === 'website' || text.includes('visit website')) {
              website = href;
              break;
            }
          }

          return {
            name: nameEl ? nameEl.textContent.trim() : '',
            email: emailEl ? emailEl.textContent.trim() : '',
            phone: phoneEl ? phoneEl.textContent.trim() : '',
            company: companyEl ? companyEl.textContent.trim() : '',
            title: titleEl ? titleEl.textContent.trim() : '',
            address: addressEl ? addressEl.textContent.trim() : '',
            website: website
          };
        }).filter(item => item.name);
      });

      if (newDocs.length === 0) {
        console.log('No records found on this page.');
        break;
      }

      for (const item of newDocs) {
        if (results.length >= limit) break;
        
        const orgName = item.company ? item.company.trim() : null;
        let orgInfo = null;
        if (orgName) {
          const orgHashInput = `${orgName.toLowerCase()}|${state.toLowerCase()}`;
          const orgId = 'org-' + createHash('sha256').update(orgHashInput).digest('hex');
          const cityVal = item.address ? item.address.split(',')[0].trim() : '';
          const orgWebsite = item.website || 'https://connect.copaa.org';

          orgInfo = {
            id: orgId,
            name: orgName,
            state: state,
            city: cityVal || null,
            phone: item.phone || null,
            email: item.email || null,
            website: orgWebsite,
            description: `${orgName} is an organization specializing in special education advocacy.`,
            source: 'copaa',
            scraped_at: new Date().toISOString()
          };
        }

        // Map fields to target schema
        const hashInput = `${item.name.toLowerCase()}|${state.toLowerCase()}|${(item.company || '').toLowerCase()}`;
        const id = 'copaa-' + createHash('sha256').update(hashInput).digest('hex');
        results.push({
          id,
          name: item.name,
          state,
          city: item.address ? item.address.split(',')[0].trim() : '',
          phone: item.phone || null,
          email: item.email || null,
          website: item.website || 'https://connect.copaa.org',
          specialties: analyzeSpecialties(item.title + ' ' + item.company),
          organization: orgName,
          organization_info: orgInfo,
          description: `${item.name} is a special education professional.`,
          source: 'copaa',
          scraped_at: new Date().toISOString()
        });
      }

      lastProcessedPage = currentPageNum;

      if (results.length >= limit) {
        console.log(`Limit of ${limit} reached.`);
        break;
      }

      // Check next page
      const nextButton = page.locator('a[id*="NextPageButton"]').first();
      if (await nextButton.isVisible()) {
        const isDisabled = await nextButton.evaluate(el => 
          el.classList.contains('disabled') || el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
        );
        if (isDisabled) {
          hasNextPage = false;
        } else {
          // Check HTTP 500 error simulation beforehand
          await rateLimiter.throttle();
          
          await page.setExtraHTTPHeaders({ 'User-Agent': getRandomUserAgent() });
          await retryAction(
            () => Promise.all([
              page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 }),
              nextButton.click()
            ]),
            rateLimiter
          );
          currentPageNum++;
          // Save checkpoint
          checkpointManager.save({
            lastProcessedPage: lastProcessedPage,
            completed: false,
            metadata: { results }
          });
        }
      } else {
        hasNextPage = false;
      }
    }

    // Save final data
    const rawDir = process.env.RAW_DIR || path.join(process.cwd(), 'src/scrapers/national/data/raw');
    const outDir = path.join(rawDir, state);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'copaa.json'), JSON.stringify(results, null, 2), 'utf8');

    console.log(`Successfully scraped ${results.length} records for ${state}.`);
    checkpointManager.clear();
  } catch (error) {
    console.error('Scraper execution encountered an error:', error.message);
    // T2.F1.4: Network interruption midway creates valid checkpoint
    checkpointManager.save({
      lastProcessedPage: lastProcessedPage,
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

