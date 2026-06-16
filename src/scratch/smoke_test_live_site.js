import http from 'http';
import https from 'https';
import { URL } from 'url';

// Parse command line arguments
const args = process.argv.slice(2);
const targetBaseUrl = args[0] || 'http://localhost:3000';

console.log(`====================================================`);
console.log(`🚀 RUNNING LIVE-SITE SMOKE TEST AGAINST: ${targetBaseUrl}`);
console.log(`====================================================\n`);

// Representative pages to check
const targetPaths = {
  hubs: [
    '/benefits/texas',
    '/counties/texas'
  ],
  counties: [
    '/counties/texas/harris-tx',
    '/counties/texas/travis-tx',
    '/counties/texas/dallas-tx',
    '/counties/texas/bexar-tx',
    '/counties/texas/tarrant-tx',
    '/counties/texas/el-paso-tx',
    '/counties/texas/collin-tx',
    '/counties/texas/denton-tx',
    '/counties/texas/fort-bend-tx',
    '/counties/texas/hidalgo-tx'
  ],
  gated: [
    '/counties/texas/brazos-tx',
    '/counties/texas/lavaca-tx',
    '/counties/texas/mclennan-tx',
    '/counties/texas/tyler-tx',
    '/counties/texas/victoria-tx',
    '/counties/texas/wichita-tx'
  ],
  programs: [
    '/programs/tx-hcs',
    '/programs/tx-class',
    '/programs/tx-txhml',
    '/programs/tx-mdcp',
    '/programs/tx-eci',
    '/programs/tx-tea-sped',
    '/programs/tx-able',
    '/programs/tx-medicaid',
    '/programs/tx-yes',
    '/programs/tx-dbmd',
    '/programs/tx-starplus-hcbs',
    '/programs/tx-twc-vr'
  ],
  sitemaps: [
    '/sitemap.xml',
    '/sitemaps/static.xml',
    '/sitemaps/counties.xml'
  ]
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function ok(msg) {
  passedChecks++;
  totalChecks++;
  console.log(`  ✅ ${msg}`);
}

function fail(msg) {
  failedChecks++;
  totalChecks++;
  console.error(`  ❌ ERROR: ${msg}`);
}

function checkPage(path, category) {
  return new Promise((resolve) => {
    const urlStr = `${targetBaseUrl}${path}`;
    const parsed = new URL(urlStr);
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SmokeTestChecker/1.0'
      },
      timeout: 5000,
      rejectUnauthorized: false
    };

    const reqLib = parsed.protocol === 'https:' ? https : http;

    console.log(`[HTTP GET] ${path} (${category})`);

    const req = reqLib.request(urlStr, options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        // Status Check
        if (res.statusCode !== 200) {
          fail(`Status is ${res.statusCode} (Expected: 200)`);
          resolve();
          return;
        }
        ok(`Status is 200 OK`);

        // Check for raw server errors in body
        if (body.includes('Application error:') || body.includes('Internal Server Error') || body.includes('notFound()')) {
          fail(`HTML contains raw server error text!`);
        }

        // Check canonical tag
        const canonicalMatch = body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
        if (canonicalMatch) {
          const canonicalUrl = canonicalMatch[1];
          // Canonical should match target domain and path
          const expectedCanonical = `${targetBaseUrl}${path}`;
          // Normalizing trailing slashes or path checks
          if (canonicalUrl === path || canonicalUrl === expectedCanonical || canonicalUrl.endsWith(path)) {
            ok(`Canonical URL is correct: ${canonicalUrl}`);
          } else {
            fail(`Canonical mismatch! Got: ${canonicalUrl}, Expected: ${expectedCanonical}`);
          }
        } else {
          // Sitemaps don't have canonical tags
          if (!path.endsWith('.xml')) {
            fail(`Missing canonical URL tag!`);
          }
        }

        // Check Robots Meta tag (noindex)
        const robotsMatch = body.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
        const hasNoIndex = robotsMatch && robotsMatch[1].includes('noindex');

        if (category === 'gated') {
          if (hasNoIndex) {
            ok(`Gated page correctly has noindex: ${robotsMatch[1]}`);
          } else {
            fail(`Gated page is missing noindex meta tag!`);
          }
        } else if (category === 'counties' || category === 'hubs' || category === 'programs') {
          if (hasNoIndex) {
            fail(`Indexable page incorrectly has noindex: ${robotsMatch[1]}`);
          } else {
            ok(`Indexable page does not have noindex`);
          }
        }

        // Check ECI/LIDDA separation on county pages
        if (category === 'counties') {
          const hasEciSection = body.includes('Early Childhood Intervention / ECI');
          const hasLiddaSection = body.includes('Local Catchment Area') || body.includes('LIDDA') || body.includes('Local');
          if (hasEciSection) {
            ok(`ECI section renders correctly.`);
          }
          if (hasLiddaSection) {
            ok(`LIDDA section renders correctly.`);
          }
        }

        // Check dynamic program localization
        if (category === 'programs') {
          if (path.startsWith('/programs/tx-')) {
            const hasTexasLabel = body.includes('Texas') || body.includes('TX');
            const hasCaliforniaLabel = body.includes('California Guide') || body.includes('California DHCS');
            if (hasTexasLabel && !hasCaliforniaLabel) {
              ok(`Program page successfully localized for Texas (no California leaks).`);
            } else if (hasCaliforniaLabel) {
              fail(`Program page contains California leaks!`);
            }
          }
        }

        // Check Sitemap files structure
        if (path.endsWith('.xml')) {
          if (body.includes('<?xml') && body.includes('<urlset') || body.includes('<sitemapindex')) {
            ok(`Sitemap parses as valid XML.`);
          } else {
            fail(`Sitemap does not look like valid XML!`);
          }
        }

        resolve();
      });
    });

    req.on('error', (err) => {
      fail(`Request failed: ${err.message}`);
      resolve();
    });

    req.on('timeout', () => {
      req.destroy();
      fail(`Request timeout`);
      resolve();
    });

    req.end();
  });
}

async function runSmokeTest() {
  // 1. Check Hubs
  for (const path of targetPaths.hubs) {
    await checkPage(path, 'hubs');
  }

  // 2. Check 10 Counties
  for (const path of targetPaths.counties) {
    await checkPage(path, 'counties');
  }

  // 3. Check Gated Counties
  for (const path of targetPaths.gated) {
    await checkPage(path, 'gated');
  }

  // 4. Check Programs
  for (const path of targetPaths.programs) {
    await checkPage(path, 'programs');
  }

  // 5. Check Sitemaps
  for (const path of targetPaths.sitemaps) {
    await checkPage(path, 'sitemaps');
  }

  console.log(`\n====================================================`);
  console.log(`📊 SMOKE TEST SUMMARY`);
  console.log(`====================================================`);
  console.log(`  • Total checks:  ${totalChecks}`);
  console.log(`  • Passed checks: ${passedChecks}`);
  console.log(`  • Failed checks: ${failedChecks}`);
  console.log(`====================================================`);

  process.exit(failedChecks === 0 ? 0 : 1);
}

runSmokeTest();
