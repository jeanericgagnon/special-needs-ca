import Database from 'better-sqlite3';
import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const frontendDir = path.resolve(__dirname, '../../frontend');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}🔍 RUNNING CALIFORNIA PUBLIC SEO LAUNCH QUALITY GATE AUDIT${RESET}`);
console.log(`${BOLD}====================================================${RESET}\n`);

let db;
try {
  db = new Database(dbPath, { readonly: true });
} catch (e) {
  console.error(`${RED}❌ Error: Could not open database at ${dbPath}: ${e.message}${RESET}`);
  process.exit(1);
}

let auditPassed = true;
const failures = [];

function check(condition, label, details = '') {
  if (condition) {
    console.log(`  ${GREEN}✅ ${label}${RESET}`);
    return true;
  } else {
    console.log(`  ${RED}❌ ${label}${RESET}`);
    if (details) {
      console.log(`     ${RED}Details: ${details}${RESET}`);
      failures.push(`${label} - ${details}`);
    } else {
      failures.push(label);
    }
    auditPassed = false;
    return false;
  }
}

// Helper: fetch text from local server
function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`Failed to fetch ${url}, status code: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Fetch timeout for ${url}`));
    });
    req.on('error', reject);
    req.end();
  });
}

// Simple XML <loc> tag parser
function extractUrls(xmlText) {
  const matches = xmlText.matchAll(/<loc>([^<]+)<\/loc>/g);
  return Array.from(matches).map(m => m[1].trim());
}

// Rewrite canonical domain URLs to local port 3001
function getLocalUrl(canonicalUrl) {
  return canonicalUrl.replace(/https?:\/\/[^\/]+/, 'http://localhost:3001');
}

// Start Next.js development server on port 3001
console.log('Spawning Next.js development server on port 3001...');
const serverProcess = spawn('npx', ['next', 'dev', '-p', '3001'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'pipe'
});

// Redirect log streams so we can see what's happening or suppress it to keep output clean
serverProcess.stdout.on('data', (data) => {
  console.log(`[Next.js]: ${data.toString().trim()}`);
});
serverProcess.stderr.on('data', (data) => {
  console.error(`[Next.js Error]: ${data.toString().trim()}`);
});

// Ensure server is killed on exit
function cleanup() {
  if (serverProcess) {
    console.log('Stopping Next.js development server...');
    try {
      serverProcess.kill('SIGINT');
    } catch (e) {
      // already terminated
    }
  }
  if (db) {
    db.close();
  }
}

process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(1); });
process.on('SIGTERM', () => { cleanup(); process.exit(1); });
process.on('uncaughtException', (err) => {
  console.error(`${RED}Uncaught exception in audit script:${RESET}`, err);
  cleanup();
  process.exit(1);
});

// Wait for server port 3001 to respond
async function waitOnServer(port, timeoutMs = 30000) {
  const start = Date.now();
  console.log(`Polling localhost:${port} until responsive...`);
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/robots.txt`, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Status: ${res.statusCode}`));
        });
        req.on('error', reject);
        req.end();
      });
      console.log(`${GREEN}Server is responsive on port ${port}!${RESET}\n`);
      return;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error(`Timeout waiting for Next.js server on port ${port}`);
}

try {
  await waitOnServer(3001);

  // 1. Robots.txt check
  console.log('🤖 Auditing robots.txt...');
  const robotsTxt = await fetchText('http://localhost:3001/robots.txt');
  check(robotsTxt.includes('Disallow: /dashboard'), 'robots.txt disallows /dashboard');
  check(robotsTxt.includes('Disallow: /login'), 'robots.txt disallows /login');
  check(robotsTxt.includes('Disallow: /register'), 'robots.txt disallows /register');
  check(robotsTxt.includes('Disallow: /api/*'), 'robots.txt disallows /api/*');
  check(robotsTxt.includes('Allow: /forms'), 'robots.txt allows /forms');
  check(robotsTxt.includes('Allow: /forms/*'), 'robots.txt allows /forms/*');
  check(robotsTxt.includes('sitemap.xml'), 'robots.txt declares sitemap index location');

  // 2. Sitemap XML index check
  console.log('\n🗺️ Auditing sitemap index...');
  const sitemapXml = await fetchText('http://localhost:3001/sitemap.xml');
  const indexUrls = extractUrls(sitemapXml);
  check(indexUrls.some(url => url.endsWith('/sitemaps/static.xml')), 'Sitemap index includes static.xml');
  check(indexUrls.some(url => url.endsWith('/sitemaps/counties.xml')), 'Sitemap index includes counties.xml');

  // 3. Static sitemap check
  console.log('\n📄 Auditing static.xml...');
  const staticXmlText = await fetchText('http://localhost:3001/sitemaps/static.xml');
  const staticUrls = extractUrls(staticXmlText);
  check(staticUrls.some(url => url.endsWith('/forms')), 'static.xml includes /forms catalog root page');
  check(staticUrls.some(url => url.includes('/programs/ihss-for-children')), 'static.xml includes /programs/ihss-for-children guide');
  check(staticUrls.some(url => url.includes('/forms/soc-873')), 'static.xml includes /forms/soc-873 guide');

  // 4. Counties sitemap check
  console.log('\n🗺️ Auditing counties.xml...');
  const countiesXmlText = await fetchText('http://localhost:3001/sitemaps/counties.xml');
  const countiesUrls = extractUrls(countiesXmlText);

  // Expected 58 California counties
  const caCounties = db.prepare("SELECT id FROM counties WHERE state_id = 'california'").all();
  check(caCounties.length === 58, 'Database has exactly 58 California counties');

  // Verify all 58 county root benefits and details pages exist in sitemap
  let missingCountyRoots = 0;
  for (const c of caCounties) {
    const hasBenefits = countiesUrls.some(url => url.endsWith(`/benefits/california/${c.id}`));
    const hasCounties = countiesUrls.some(url => url.endsWith(`/counties/california/${c.id}`));
    if (!hasBenefits || !hasCounties) {
      missingCountyRoots++;
    }
  }
  check(missingCountyRoots === 0, 'All 58 CA county roots (benefits & details paths) are present in counties.xml');

  // Verify county x diagnosis leaf gating
  const leafUrls = countiesUrls.filter(url => {
    const pathParts = url.replace(/https?:\/\/[^\/]+/, '').split('/').filter(Boolean);
    // Path structure: ["benefits", "california", "diagnosis-slug", "county-slug"]
    return pathParts.length === 4 && pathParts[0] === 'benefits' && pathParts[1] === 'california';
  });

  console.log(`  County-diagnosis leaves found in counties.xml: ${leafUrls.length}`);
  const invalidLeaves = leafUrls.filter(url => {
    const parts = url.split('/');
    const countyId = parts[parts.length - 1];
    return countyId !== 'los-angeles' && countyId !== 'orange';
  });
  check(invalidLeaves.length === 0, 'Only high-fidelity (los-angeles & orange) county x diagnosis leaves are indexed in counties.xml', 
    invalidLeaves.length ? `Invalid leaves: ${invalidLeaves.slice(0, 3).join(', ')}` : ''
  );

  // 4.5. Verify redirect on /benefits
  console.log('\n↩️ Auditing /benefits redirect...');
  const benefitsRes = await new Promise((resolve) => {
    http.get('http://localhost:3001/benefits', (res) => {
      resolve(res);
    });
  });
  check(benefitsRes.statusCode === 307 || benefitsRes.statusCode === 308, 'benefits root page redirects to benefits/california', `Status code: ${benefitsRes.statusCode}`);
  const redirectLoc = benefitsRes.headers.location || '';
  check(redirectLoc === '/benefits/california' || redirectLoc.endsWith('/benefits/california'), 'benefits redirect location is correct', `Location: ${redirectLoc}`);

  // 5. Verification of indexable pages (HTML metadata, trust badges, source freshness)
  console.log('\n🔍 Auditing HTML content & SEO tags on indexable pages...');
  const targetPages = [
    'http://localhost:3001/',
    'http://localhost:3001/advocates',
    'http://localhost:3001/forms',
    'http://localhost:3001/benefits/california',
    'http://localhost:3001/counties/california',
    'http://localhost:3001/counties/california/los-angeles',
    'http://localhost:3001/counties/california/orange',
    'http://localhost:3001/benefits/california/autism-spectrum-disorder/los-angeles',
    'http://localhost:3001/benefits/california/autism-spectrum-disorder/orange',
    // 12 Target High-Intent Resource Guides
    'http://localhost:3001/situations/ihss-protective-supervision',
    'http://localhost:3001/forms/soc-821',
    'http://localhost:3001/forms/soc-873',
    'http://localhost:3001/programs/ihss-for-children',
    'http://localhost:3001/situations/regional-center-eligibility',
    'http://localhost:3001/forms/regional-center-appeal-request',
    'http://localhost:3001/situations/early-start-age-3-transition',
    'http://localhost:3001/forms/iep-assessment-request',
    'http://localhost:3001/forms/independent-educational-evaluation-request',
    'http://localhost:3001/forms/cde-state-complaint',
    'http://localhost:3001/forms/ccs-application',
    'http://localhost:3001/programs/medi-cal-epsdt',
    'http://localhost:3001/forms/medi-cal-epsdt-request'
  ];

  for (const pageUrl of targetPages) {
    try {
      const html = await fetchText(pageUrl);
      
      // A. Title tags
      const hasTitle = /<title>([^<]+)<\/title>/i.test(html);
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const titleText = titleMatch ? titleMatch[1].trim() : '';
      check(hasTitle && titleText.length > 0, `Page contains non-empty title: ${pageUrl.replace('http://localhost:3001', '')}`, `Title: ${titleText}`);

      // B. Meta Description tags
      const hasDesc = /<meta[^>]*name="description"[^>]*content="([^"]+)"|<meta[^>]*content="([^"]+)"[^>]*name="description"/i.test(html);
      check(hasDesc, `Page contains meta description: ${pageUrl.replace('http://localhost:3001', '')}`);

      // C. Canonical link tag
      const hasCanonical = /<link[^>]*rel="canonical"[^>]*href="([^"]+)"|<link[^>]*href="([^"]+)"[^>]*rel="canonical"/i.test(html);
      check(hasCanonical, `Page contains canonical link tag: ${pageUrl.replace('http://localhost:3001', '')}`);

      // D. Verify no index block is active
      const hasNoIndex = /<meta[^>]*content="[^"]*noindex[^"]*"[^>]*name="robots"|<meta[^>]*name="robots"[^>]*content="[^"]*noindex[^"]*"/i.test(html);
      check(!hasNoIndex, `Page is indexable (no noindex meta): ${pageUrl.replace('http://localhost:3001', '')}`);

      // E. For counties and benefits templates, check for Freshness Disclosure and Correction Badge
      const isCountyDetailOrLeaf = pageUrl.includes('/counties/california/') || pageUrl.includes('/benefits/california/autism-spectrum-disorder/');
      if (isCountyDetailOrLeaf) {
        const hasFreshness = html.includes('Verified Sources') || html.includes('SourceFreshnessDisclosure') || html.includes('Verified Source');
        check(hasFreshness, `Page renders SourceFreshnessDisclosure footer: ${pageUrl.replace('http://localhost:3001', '')}`);

        const hasCorrection = html.includes('Suggest update') || html.includes('CorrectionFlow') || html.includes('Suggest Correction');
        check(hasCorrection, `Page renders correction flow trigger ("Suggest update"): ${pageUrl.replace('http://localhost:3001', '')}`);
      }
    } catch (e) {
      check(false, `Successfully fetched page: ${pageUrl}`, e.message);
    }
  }

  // 6. Gated pages metadata check
  console.log('\n⛔ Auditing gated (noindex) county-diagnosis pages...');
  const gatedPages = [
    'http://localhost:3001/benefits/california/autism-spectrum-disorder/merced',
    'http://localhost:3001/benefits/california/autism-spectrum-disorder/mariposa',
    'http://localhost:3001/benefits/california/autism-spectrum-disorder/san-diego'
  ];

  for (const gatedUrl of gatedPages) {
    try {
      const html = await fetchText(gatedUrl);
      const hasNoIndex = /<meta[^>]*content="[^"]*noindex[^"]*"[^>]*name="robots"|<meta[^>]*name="robots"[^>]*content="[^"]*noindex[^"]*"/i.test(html);
      check(hasNoIndex, `Gated county-diagnosis page is blocked (noindex): ${gatedUrl.replace('http://localhost:3001', '')}`);
      
      const isExemptSitemap = countiesUrls.some(url => url.endsWith(gatedUrl.replace('http://localhost:3001', '')));
      check(!isExemptSitemap, `Gated county-diagnosis page is absent from counties.xml: ${gatedUrl.replace('http://localhost:3001', '')}`);
    } catch (e) {
      check(false, `Successfully fetched gated page: ${gatedUrl}`, e.message);
    }
  }

} catch (e) {
  console.error(`${RED}🚨 Quality check script error:${RESET}`, e);
  auditPassed = false;
} finally {
  console.log(`\n${BOLD}====================================================${RESET}`);
  if (auditPassed) {
    console.log(`${GREEN}${BOLD}🎉 PUBLIC SEO LAUNCH GATE RESULT: PASS${RESET}`);
    console.log(`${GREEN}Special Needs California Navigator is ready for search engine launch!${RESET}`);
  } else {
    console.log(`${RED}${BOLD}🚨 PUBLIC SEO LAUNCH GATE RESULT: FAIL${RESET}`);
    console.log(`${RED}Please fix the following failures before launching:${RESET}`);
    failures.forEach(f => console.log(`  - ${f}`));
  }
  console.log(`${BOLD}====================================================${RESET}\n`);

  cleanup();
  process.exit(auditPassed ? 0 : 1);
}
