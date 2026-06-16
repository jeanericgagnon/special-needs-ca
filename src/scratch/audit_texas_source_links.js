import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const auditReportPath = path.resolve(__dirname, '../../docs/launch/texas-source-link-audit.md');

const db = new Database(dbPath);

console.log('=== Texas Broken Source Link Audit ===');

// Extract unique URLs
const urlsToTest = new Set();
const urlOrigins = new Map(); // url -> Array of {table, id}

function addUrl(url, table, id) {
  if (!url || typeof url !== 'string') return;
  const cleaned = url.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) return;
  
  urlsToTest.add(cleaned);
  if (!urlOrigins.has(cleaned)) {
    urlOrigins.set(cleaned, []);
  }
  urlOrigins.get(cleaned).push({ table, id });
}

// 1. Query county offices
db.prepare("SELECT id, website, source_url FROM county_offices WHERE county_id LIKE '%-tx'").all().forEach(r => {
  addUrl(r.website, 'county_offices', r.id);
  addUrl(r.source_url, 'county_offices', r.id);
});

// 2. Query state resource agencies
db.prepare("SELECT id, website, source_url FROM state_resource_agencies WHERE state_id = 'texas'").all().forEach(r => {
  addUrl(r.website, 'state_resource_agencies', r.id);
  addUrl(r.source_url, 'state_resource_agencies', r.id);
});

// 3. Query clinics
db.prepare("SELECT id, source_url FROM resource_providers WHERE county_id LIKE '%-tx'").all().forEach(r => {
  addUrl(r.source_url, 'resource_providers', r.id);
});

// 4. Query waitlists & sources
db.prepare(`
  SELECT s.id, s.source_url FROM sources s JOIN programs p ON s.program_id = p.id WHERE p.state_id = 'texas'
`).all().forEach(r => {
  addUrl(r.source_url, 'sources', r.id);
});

db.prepare(`
  SELECT pw.id, pw.estimate_source_url FROM program_waitlists pw JOIN programs p ON pw.program_id = p.id WHERE p.state_id = 'texas'
`).all().forEach(r => {
  addUrl(r.estimate_source_url, 'program_waitlists', r.id);
});

// 5. Query unique nonprofit websites (sample or top ones to avoid hammering)
const nonprofits = db.prepare("SELECT id, website FROM nonprofit_organizations WHERE county_id LIKE '%-tx'").all();
// Just select unique websites to test
const uniqueNpWebsites = new Set();
nonprofits.forEach(r => {
  if (r.website && !uniqueNpWebsites.has(r.website)) {
    uniqueNpWebsites.add(r.website);
    addUrl(r.website, 'nonprofit_organizations', r.id);
  }
});

// 6. Query unique school district websites
const schoolDistricts = db.prepare(`
  SELECT sd.id, sd.website FROM school_districts sd JOIN counties c ON sd.county_id = c.id WHERE c.state_id = 'texas'
`).all();
const uniqueSdWebsites = new Set();
schoolDistricts.forEach(r => {
  if (r.website && !uniqueSdWebsites.has(r.website)) {
    uniqueSdWebsites.add(r.website);
    addUrl(r.website, 'school_districts', r.id);
  }
});

console.log(`Identified ${urlsToTest.size} unique URLs to test.`);

const urlList = Array.from(urlsToTest);
const results = [];

// Helper to check a URL
function checkUrl(url) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 4000,
      rejectUnauthorized: false // Ignore certificate errors for QA checks
    };

    const reqLib = parsed.protocol === 'https:' ? https : http;
    
    const req = reqLib.request(url, options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        statusText: res.statusMessage || '',
        redirect: res.statusCode >= 300 && res.statusCode < 400 ? res.headers.location : null
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 0,
        statusText: err.message,
        redirect: null
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        statusText: 'Timeout',
        redirect: null
      });
    });

    req.end();
  });
}

// Run tests in batches of 15 concurrent requests
async function runAudit() {
  const batchSize = 15;
  for (let i = 0; i < urlList.length; i += batchSize) {
    const batch = urlList.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(urlList.length / batchSize)}...`);
    const batchResults = await Promise.all(batch.map(url => checkUrl(url)));
    results.push(...batchResults);
  }

  // Analyze results
  console.log('\n--- Link Audit Complete ---');
  let active = 0;
  let redirected = 0;
  let broken = 0;

  const logs = [];

  results.forEach(r => {
    const origins = urlOrigins.get(r.url) || [];
    const originStr = origins.slice(0, 3).map(o => `${o.table}(${o.id})`).join(', ') + (origins.length > 3 ? `... (+${origins.length - 3} more)` : '');
    
    if (r.status >= 200 && r.status < 300) {
      active++;
    } else if (r.status >= 300 && r.status < 400) {
      redirected++;
      logs.push(`- [REDIRECT ${r.status}] ${r.url} -> ${r.redirect} (Used by: ${originStr})`);
    } else {
      broken++;
      logs.push(`- [BROKEN Status: ${r.status} / ${r.statusText}] ${r.url} (Used by: ${originStr})`);
    }
  });

  console.log(`Active (2xx):  ${active}`);
  console.log(`Redirects:     ${redirected}`);
  console.log(`Broken/Errors: ${broken}`);

  // Write Report
  const reportContent = `# Texas Broken Source Link Audit

Conducted on: ${new Date().toISOString().split('T')[0]}

---

## Summary Metrics
*   **Total Unique URLs Checked:** ${urlList.length}
*   **Active (2xx OK):** ${active}
*   **Redirects (3xx):** ${redirected}
*   **Broken / Failed (4xx, 5xx, or Connection Error):** ${broken}

---

## Detailed Audit Logs

### Broken & Failed Links
${broken === 0 ? '*None detected! All tested links responded successfully.*' : logs.filter(l => l.includes('[BROKEN')).join('\n')}

### Redirected Links (Review Recommended)
${redirected === 0 ? '*No redirects detected.*' : logs.filter(l => l.includes('[REDIRECT')).join('\n')}
`;

  fs.writeFileSync(auditReportPath, reportContent, 'utf8');
  console.log(`✓ Report saved to docs/launch/texas-source-link-audit.md`);
  db.close();
}

runAudit();
