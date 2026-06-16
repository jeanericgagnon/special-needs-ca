import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const routePath = path.resolve(__dirname, '../../frontend/src/app/sitemaps/counties.xml/route.ts');
const staticRoutePath = path.resolve(__dirname, '../../frontend/src/app/sitemaps/static.xml/route.ts');

const db = new Database(dbPath);

console.log('=== Sitemap Output Verification ===');

// 1. Read and parse counties.xml route.ts for NON_CA_VERIFIED_COUNTIES
const routeContent = fs.readFileSync(routePath, 'utf8');
const match = routeContent.match(/NON_CA_VERIFIED_COUNTIES\s*=\s*\[([\s\S]*?)\]/);
const NON_CA_VERIFIED_COUNTIES = match 
  ? match[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean)
  : [];

// 2. Read and parse static.xml route.ts for staticUrls
const staticRouteContent = fs.readFileSync(staticRoutePath, 'utf8');
// Extract URLs inside staticUrls array
const staticUrlsMatch = staticRouteContent.match(/const staticUrls = \[\s*([\s\S]*?)\s*\];/);
const staticUrlsText = staticUrlsMatch ? staticUrlsMatch[1] : '';

// 3. Confirm Hub pages in static sitemap
const hasBenefitsHub = staticUrlsText.includes('/benefits/texas');
const hasCountiesHub = staticUrlsText.includes('/counties/texas');

console.log('\n--- Hub Pages Verification ---');
if (hasBenefitsHub) {
  console.log('  ✅ /benefits/texas is included in static sitemap.');
} else {
  console.error('  ❌ Error: /benefits/texas is missing from static sitemap!');
}
if (hasCountiesHub) {
  console.log('  ✅ /counties/texas is included in static sitemap.');
} else {
  console.error('  ❌ Error: /counties/texas is missing from static sitemap!');
}

// 4. Confirm exactly 248 verified county pages are included
console.log('\n--- County Sitemap Verification ---');
const allTxCounties = db.prepare("SELECT * FROM counties WHERE state_id = 'texas'").all();
const includedTxCounties = allTxCounties.filter(c => NON_CA_VERIFIED_COUNTIES.includes(c.id));
console.log(`  - Total Texas counties: ${allTxCounties.length}`);
console.log(`  - Counties included in sitemap allowlist: ${includedTxCounties.length}`);

if (includedTxCounties.length === 248) {
  console.log('  ✅ Exactly 248 verified county pages are included.');
} else {
  console.error(`  ❌ Error: Expected 248 counties, but got ${includedTxCounties.length}!`);
}

// 5. Confirm 6 gated counties are excluded
const gatedCounties = ['brazos-tx', 'lavaca-tx', 'mclennan-tx', 'tyler-tx', 'victoria-tx', 'wichita-tx'];
const gatedIncluded = gatedCounties.filter(id => NON_CA_VERIFIED_COUNTIES.includes(id));
console.log('\n--- Gated Counties Exclusion Verification ---');
if (gatedIncluded.length === 0) {
  console.log('  ✅ All 6 gated counties are successfully excluded.');
} else {
  console.error(`  ❌ Error: Gated counties found in sitemap: ${gatedIncluded.join(', ')}`);
}

// 6. Confirm 12 Texas program pages are included in static sitemap
console.log('\n--- Program Pages Verification ---');
const txPrograms = [
  'tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp', 'tx-eci', 'tx-tea-sped',
  'tx-able', 'tx-medicaid', 'tx-yes', 'tx-dbmd', 'tx-starplus-hcbs', 'tx-twc-vr'
];
let missingProgs = 0;
txPrograms.forEach(p => {
  const path = `/programs/${p}`;
  const included = staticUrlsText.includes(path);
  if (included) {
    console.log(`  ✅ ${path} is included in static sitemap.`);
  } else {
    console.error(`  ❌ Error: ${path} is missing from static sitemap!`);
    missingProgs++;
  }
});

if (missingProgs === 0) {
  console.log('  ✅ All 12 Texas program pages are successfully included.');
}

// 7. Confirm 1,860 county x diagnosis leaves are excluded
// In route.ts, it loops over counties and diagnosesSlugs.
// Texas has 254 counties. 6 core diagnoses.
// 254 * 6 = 1524 county x diagnosis leaves.
// Wait, is it 1,860 leaves?
// If we check the sitemap batch: it returns early if stateId !== 'california'
// So Texas leaves are 100% excluded.
console.log('\n--- County x Diagnosis Leaf Pages Exclusion Verification ---');
const hasTxLeafGate = routeContent.includes("if (stateId !== 'california') return;");
if (hasTxLeafGate) {
  console.log('  ✅ Gating condition (stateId !== \'california\') is present in counties.xml.');
  console.log('  ✅ All Texas county x diagnosis leaves are successfully excluded.');
} else {
  console.error('  ❌ Error: Sitemap is missing the non-California leaf gating condition!');
}

db.close();
