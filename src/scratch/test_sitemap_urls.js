import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const db = new Database(dbPath);

console.log('=== Sitemap Generation Verification ===');

// 1. Replicate static sitemap logic
console.log('\n--- Verifying static.xml sitemap content ---');
const today = '2026-05-31';
const staticUrls = [
  { loc: '/', changefreq: 'monthly', priority: '1.0', lastmod: today },
  { loc: '/benefits', changefreq: 'weekly', priority: '0.9', lastmod: today },
  { loc: '/advocates', changefreq: 'weekly', priority: '0.7', lastmod: today },
  { loc: '/forms', changefreq: 'weekly', priority: '0.8', lastmod: today },
  { loc: '/benefits/california', changefreq: 'weekly', priority: '0.9', lastmod: today },
  { loc: '/counties/california', changefreq: 'weekly', priority: '0.85', lastmod: today },
  { loc: '/benefits/texas', changefreq: 'weekly', priority: '0.9', lastmod: today },
  { loc: '/counties/texas', changefreq: 'weekly', priority: '0.85', lastmod: today }
];

const txPrograms = [
  'tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp', 'tx-eci', 'tx-tea-sped',
  'tx-able', 'tx-medicaid', 'tx-yes', 'tx-dbmd', 'tx-starplus-hcbs', 'tx-twc-vr'
];

txPrograms.forEach(p => {
  staticUrls.push({ loc: `/programs/${p}`, changefreq: 'weekly', priority: '0.8', lastmod: today });
});

console.log(`Total URLs in static sitemap: ${staticUrls.length}`);
console.log('Sample dynamic Texas program paths:');
staticUrls.filter(u => u.loc.includes('/programs/')).forEach(u => console.log(`  - ${u.loc}`));

// 2. Replicate counties.xml sitemap logic
console.log('\n--- Verifying counties.xml sitemap content ---');

// Read and parse route.ts to get NON_CA_VERIFIED_COUNTIES
import fs from 'fs';
const routeContent = fs.readFileSync(path.resolve(__dirname, '../../frontend/src/app/sitemaps/counties.xml/route.ts'), 'utf8');
const match = routeContent.match(/NON_CA_VERIFIED_COUNTIES\s*=\s*\[([\s\S]*?)\]/);
const NON_CA_VERIFIED_COUNTIES = match 
  ? match[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean)
  : [];
console.log(`NON_CA_VERIFIED_COUNTIES array length: ${NON_CA_VERIFIED_COUNTIES.length}`);

const allCounties = db.prepare("SELECT * FROM counties").all();
const counties = allCounties.filter(c => {
  const isCa = c.state_id === 'california';
  if (!isCa) {
    return NON_CA_VERIFIED_COUNTIES.includes(c.id);
  }
  // Simplified CA filter
  return isCa; 
});

console.log(`Counties matching sitemap filter: ${counties.length}`);
const txCountiesInSitemap = counties.filter(c => c.state_id === 'texas');
console.log(`Texas counties in sitemap: ${txCountiesInSitemap.length} / 254`);

// Check some specific Texas counties
const checkCounties = ['harris-tx', 'travis-tx', 'dallas-tx', 'brazos-tx', 'lavaca-tx', 'mclennan-tx'];
checkCounties.forEach(c => {
  const included = NON_CA_VERIFIED_COUNTIES.includes(c);
  console.log(`  - ${c.padEnd(15)}: ${included ? 'INCLUDED (Indexable)' : 'EXCLUDED (noindex)'}`);
});

// Check diagnosis leaf pages gating logic
console.log('\n--- Verifying Diagnosis Leaf Page Gating ---');
let leafUrlsGenerated = 0;
let txLeafUrlsGenerated = 0;
const coreDiagnoses = ['autism-spectrum-disorder', 'adhd', 'down-syndrome', 'speech-or-language-delay', 'cerebral-palsy', 'epilepsy'];

counties.forEach(county => {
  const stateId = county.state_id || 'california';
  coreDiagnoses.forEach(diag => {
    // If stateId !== 'california' return;
    if (stateId !== 'california') {
      txLeafUrlsGenerated++; // Count how many we WOULD have generated if not gated
      return;
    }
    leafUrlsGenerated++;
  });
});

console.log(`California county x diagnosis leaves generated: ${leafUrlsGenerated}`);
console.log(`Texas county x diagnosis leaves gated/blocked:    ${txLeafUrlsGenerated}`);

db.close();
