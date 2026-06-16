import Database from 'better-sqlite3';
import { execSync, spawn } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';
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
console.log(`${BOLD}🔍 RUNNING TEXAS MULTI-STATE REPLICATION AUDIT${RESET}`);
console.log(`${BOLD}====================================================${RESET}\n`);

// Parse command line arguments
const args = process.argv.slice(2);
const targetState = args[0] || 'texas';

if (targetState !== 'texas') {
  console.error(`${RED}❌ Error: State '${targetState}' is not supported yet for auditing.${RESET}`);
  process.exit(1);
}

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

// ----------------------------------------------------
// DATABASE CHECKS
// ----------------------------------------------------
console.log(`${BOLD}1. Auditing Texas Database Integrity...${RESET}`);

// A. Check county counts
const txCounties = db.prepare("SELECT id, name FROM counties WHERE state_id = 'texas'").all();
check(txCounties.length === 254, `Texas Counties Count: ${txCounties.length}/254`, `Expected 254 Texas counties, found ${txCounties.length}`);

// B. Check LIDDA mapping counts
const mappedCount = db.prepare(`
  SELECT COUNT(DISTINCT county_id) as cnt FROM regional_center_counties 
  WHERE county_id LIKE '%-tx'
`).get().cnt;
check(mappedCount === 254, `LIDDA County Mappings Count: ${mappedCount}/254`, `Expected 254 Texas counties to be mapped to a LIDDA agency, found ${mappedCount}`);

// C. Core programs exist
const corePrograms = [
  'tx-hcs',
  'tx-class',
  'tx-txhml',
  'tx-mdcp',
  'tx-eci',
  'tx-tea-sped',
  'tx-able',
  'ssi-for-children'
];
let coreProgramsPassed = true;
for (const progId of corePrograms) {
  const prog = db.prepare("SELECT * FROM programs WHERE id = ?").get(progId);
  if (!prog) {
    check(false, `Core program exists: ${progId}`, `Program not found in the database.`);
    coreProgramsPassed = false;
  } else {
    // D. Sources and last reviewed dates exist
    const hasSourceAndDate = prog.official_source_url && prog.last_verified_date;
    check(!!hasSourceAndDate, `Core program ${progId} has official source and last reviewed date`, `source: ${prog.official_source_url}, date: ${prog.last_verified_date}`);
  }
}

// E. Generated fallback records are not marked verified
const unverifiedOffices = db.prepare(`
  SELECT COUNT(*) as cnt FROM county_offices 
  WHERE county_id LIKE '%-tx' AND verification_status IN ('official_verified', 'verified')
`).get().cnt;
check(unverifiedOffices === 0, `Programmatic fallback offices are unverified: ${unverifiedOffices} verified`, `Expected 0 verified fallback offices in Texas, found ${unverifiedOffices}`);

// F. Trust metadata exists
const tablesToAudit = [
  { name: 'county_offices', label: 'County Offices', condition: "county_id LIKE '%-tx'" },
  { name: 'school_districts', label: 'School Districts', condition: "county_id LIKE '%-tx'" },
  { name: 'nonprofit_organizations', label: 'Nonprofit Organizations', condition: "county_id LIKE '%-tx'" }
];

for (const t of tablesToAudit) {
  const missingOrigin = db.prepare(`SELECT COUNT(*) as cnt FROM ${t.name} WHERE (${t.condition}) AND data_origin IS NULL`).get().cnt;
  const missingStatus = db.prepare(`SELECT COUNT(*) as cnt FROM ${t.name} WHERE (${t.condition}) AND verification_status IS NULL`).get().cnt;
  check(missingOrigin === 0 && missingStatus === 0, `Table '${t.name}' Texas trust metadata is complete`, `Missing origin: ${missingOrigin}, status: ${missingStatus}`);
}

// G. Forms exist in seo-data.ts (Verify via file parsing)
console.log(`\n${BOLD}2. Auditing Texas Forms in SEO Clusters...${RESET}`);
const seoDataPath = path.resolve(frontendDir, 'src/lib/seo-data.ts');
let formsExist = false;
try {
  const seoDataContent = fs.readFileSync(seoDataPath, 'utf8');
  const requiredForms = [
    'tx-medicaid-chip',
    'tx-hcs-guide',
    'tx-class-guide',
    'tx-txhml-guide',
    'tx-mdcp-guide',
    'tx-eci-referral',
    'tx-sped-evaluation-request',
    'tx-tea-complaint',
    'tx-due-process-complaint',
    'tx-records-request',
    'tx-iee-request',
    'tx-able-guide',
    'tx-ssi-checklist'
  ];
  let allFormsMatch = true;
  for (const f of requiredForms) {
    const hasForm = seoDataContent.includes(`'${f}':`) || seoDataContent.includes(`"${f}":`);
    if (!hasForm) {
      check(false, `Form exists in seo-data.ts: ${f}`);
      allFormsMatch = false;
    }
  }
  if (allFormsMatch) {
    check(true, `All 13 required Texas forms exist in seo-data.ts`);
  }
} catch (e) {
  check(false, `Read seo-data.ts`, e.message);
}

// ----------------------------------------------------
// LOCAL SERVER ROUTING & TERMINOLOGY CHECKS
// ----------------------------------------------------
let serverProcess;
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

async function runLiveAudit() {
  console.log(`\n${BOLD}3. Spawning Next.js Server for Sitemap & Terminology Audit...${RESET}`);
  serverProcess = spawn('npx', ['next', 'dev', '-p', '3001'], {
    cwd: frontendDir,
    shell: true,
    stdio: 'pipe'
  });

  serverProcess.stdout.on('data', (data) => {
    // Suppress verbose output but show ready message
    const str = data.toString();
    if (str.includes('Ready')) {
      console.log(`[Next.js]: ${str.trim()}`);
    }
  });

  process.on('exit', cleanup);
  process.on('SIGINT', () => { cleanup(); process.exit(1); });
  process.on('SIGTERM', () => { cleanup(); process.exit(1); });

  // Wait for server to respond
  const port = 3001;
  const timeoutMs = 30000;
  const start = Date.now();
  let serverReady = false;
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
      serverReady = true;
      break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!serverReady) {
    check(false, `Next.js server ready`, `Timeout waiting for server on port ${port}`);
    cleanup();
    process.exit(1);
  }

  console.log(`${GREEN}✅ Next.js server is ready! Auditing routes...${RESET}\n`);

  try {
    // A. Audit counties.xml sitemap
    console.log(`🤖 Auditing counties.xml sitemap...`);
    const countiesXmlText = await fetchText('http://localhost:3001/sitemaps/counties.xml');
    const countiesUrls = extractUrls(countiesXmlText);

    // Verify Texas county root pages that pass quality gates exist in sitemap
    // Harris and Travis should be there
    const hasHarris = countiesUrls.some(url => url.endsWith('/benefits/texas/harris-tx'));
    const hasTravis = countiesUrls.some(url => url.endsWith('/benefits/texas/travis-tx'));
    check(hasHarris && hasTravis, `Sitemap includes verified Texas counties (Harris, Travis)`, `Harris: ${hasHarris}, Travis: ${hasTravis}`);

    // Verify NO Texas county x diagnosis leaves exist in sitemap
    const texasLeaves = countiesUrls.filter(url => {
      const parts = url.split('/');
      return parts.includes('texas') && parts.length > 6; // e.g. benefits/texas/diagnosis/county
    });
    check(texasLeaves.length === 0, `Sitemap excludes Texas county-diagnosis leaves (Count: ${texasLeaves.length})`, 
      texasLeaves.length ? `Found: ${texasLeaves.slice(0, 3).join(', ')}` : ''
    );

    // B. Audit indexability and block of Texas county x diagnosis pages
    console.log(`\n⛔ Auditing robots metadata for Texas county-diagnosis pages...`);
    const harrisAutismUrl = 'http://localhost:3001/benefits/texas/autism-spectrum-disorder/harris-tx';
    const harrisHtml = await fetchText(harrisAutismUrl);
    const hasNoIndex = /<meta[^>]*content="[^"]*noindex[^"]*"[^>]*name="robots"|<meta[^>]*name="robots"[^>]*content="[^"]*noindex[^"]*"/i.test(harrisHtml);
    check(hasNoIndex, `Texas county-diagnosis page is blocked (noindex)`, `URL: ${harrisAutismUrl}`);

    // C. Terminology Leak Audit (Zero California leak on Texas pages)
    console.log(`\n🕵️ Auditing Terminology Leaks on Texas pages...`);
    const targetTexasPages = [
      'http://localhost:3001/benefits/texas',
      'http://localhost:3001/counties/texas',
      'http://localhost:3001/counties/texas/harris-tx',
      'http://localhost:3001/benefits/texas/harris-tx',
      'http://localhost:3001/forms?state=texas',
      'http://localhost:3001/forms/tx-hcs-guide'
    ];

    const caOnlyTerms = [
      { term: 'Regional Center', exceptionRegex: /LIDDA|Local/i },
      { term: 'Medi-Cal', exceptionRegex: /Texas Medicaid|Medicaid/i },
      { term: 'IHSS', exceptionRegex: /MDCP|CLASS|Consumer Directed/i },
      { term: 'SELPA', exceptionRegex: /SPEDTex|Regional Education Service/i }
    ];

    for (const pageUrl of targetTexasPages) {
      const pageHtml = await fetchText(pageUrl);
      
      // Clean HTML comments and script tags to avoid checking imports
      const cleanHtml = pageHtml
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      let leaks = 0;
      const leakedDetails = [];

      for (const rule of caOnlyTerms) {
        // Look for literal occurrences of California terms in visible text
        const regex = new RegExp(`\\b${rule.term}\\b`, 'gi');
        const matches = cleanHtml.match(regex);
        if (matches) {
          // Verify if it's not a generic word or inside code
          // Regional Center is a leak. Medi-Cal is a leak. IHSS is a leak. SELPA is a leak.
          leaks += matches.length;
          leakedDetails.push(`${rule.term} (found ${matches.length} times)`);
        }
      }

      check(leaks === 0, `No California terminology leaks on: ${pageUrl.replace('http://localhost:3001', '')}`, 
        leaks ? `Leaked terms: ${leakedDetails.join(', ')}` : ''
      );
    }

  } catch (e) {
    console.error(`${RED}🚨 Quality check server audit error:${RESET}`, e);
    auditPassed = false;
  } finally {
    cleanup();
  }

  // ----------------------------------------------------
  // RUN CALIFORNIA AUDIT PROGRAMMATICALLY
  // ----------------------------------------------------
  console.log(`\n${BOLD}4. Programmatically Running California Audits to Ensure Zero Regression...${RESET}`);
  try {
    console.log(`⏳ Running 'npm run audit:ca-coverage'...`);
    execSync('npm run audit:ca-coverage', { stdio: 'inherit' });
    console.log(`${GREEN}✅ California coverage audit passed successfully!${RESET}`);
  } catch (e) {
    check(false, `California Coverage Audit remains passing`, `Process exited with error.`);
  }

  console.log(`\n${BOLD}====================================================${RESET}`);
  if (auditPassed) {
    console.log(`${GREEN}${BOLD}🎉 AUDIT RESULT: PASS${RESET}`);
    console.log(`${GREEN}Texas multi-state replication and sitemap gates are completely hardened!${RESET}`);
  } else {
    console.log(`${RED}${BOLD}🚨 AUDIT RESULT: FAIL${RESET}`);
    console.log(`${RED}Please fix the following failures before continuing:${RESET}`);
    failures.forEach(f => console.log(`  - ${f}`));
  }
  console.log(`${BOLD}====================================================${RESET}\n`);

  process.exit(auditPassed ? 0 : 1);
}

runLiveAudit();
