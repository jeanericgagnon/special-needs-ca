import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const args = process.argv.slice(2);
const stateArg = args[0] || 'california';
const stateId = stateArg.toLowerCase();

const db = new Database(dbPath, { readonly: true });

// Check state in DB
const stateRecord = db.prepare('SELECT * FROM states WHERE id = ?').get(stateId);
if (!stateRecord) {
  console.error(`❌ Error: State '${stateId}' is not registered in the database.`);
  db.close();
  process.exit(1);
}

const stateCode = stateRecord.code.toLowerCase();

// Gather all records for the state
// We need to look in:
// 1. state_resource_agencies (state_id = stateId)
// 2. regional_education_agencies (state_id = stateId)
// 3. school_districts (join counties on county_id where state_id = stateId)
// 4. county_offices (join counties on county_id where state_id = stateId)
// 5. nonprofit_organizations (join counties on county_id where state_id = stateId)
// 6. iep_advocates (join iep_advocate_counties join counties on state_id = stateId)

const queryAgencies = db.prepare('SELECT data_origin, verification_status, last_verified_date, source_url FROM state_resource_agencies WHERE state_id = ?').all(stateId);
const queryEdAgencies = db.prepare('SELECT data_origin, verification_status, last_verified_date, source_url FROM regional_education_agencies WHERE state_id = ?').all(stateId);

const queryDistricts = db.prepare(`
  SELECT sd.data_origin, sd.verification_status, sd.last_verified_date, sd.source_url 
  FROM school_districts sd
  JOIN counties c ON sd.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const queryOffices = db.prepare(`
  SELECT co.data_origin, co.verification_status, co.last_verified_date, co.source_url 
  FROM county_offices co
  JOIN counties c ON co.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const queryNonprofits = db.prepare(`
  SELECT no.data_origin, no.verification_status, no.last_verified_date, no.source_url 
  FROM nonprofit_organizations no
  JOIN counties c ON no.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const queryAdvocates = db.prepare(`
  SELECT DISTINCT ia.data_origin, ia.verification_status, ia.last_verified_date, ia.source_url 
  FROM iep_advocates ia
  JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id
  JOIN counties c ON iac.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const allRecords = [
  ...queryAgencies,
  ...queryEdAgencies,
  ...queryDistricts,
  ...queryOffices,
  ...queryNonprofits,
  ...queryAdvocates
];

let scrapedLive = 0;
let crawlerDerived = 0;
let curatedSeed = 0;
let sourceListed = 0;
let programmaticFallback = 0;
let humanVerified = 0;
let unverifiedCount = 0;
let staleCount = 0;

const sourceUrls = new Set();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

for (const r of allRecords) {
  // Provenance (data_origin)
  if (r.data_origin === 'scraped_live') {
    scrapedLive++;
  } else if (r.data_origin === 'crawler_derived') {
    crawlerDerived++;
  } else if (r.data_origin === 'curated_seed' || r.data_origin === 'national_seed' || r.data_origin === 'official') {
    curatedSeed++;
  } else if (r.data_origin === 'programmatic_fallback' || r.data_origin === 'generated_county_fallback') {
    programmaticFallback++;
  } else {
    curatedSeed++; // default baseline seed
  }

  // Verification Status (verification_status)
  if (r.verification_status === 'official_verified' || r.verification_status === 'verified' || r.verification_status === 'human_verified') {
    humanVerified++;
  } else if (r.verification_status === 'source_listed') {
    sourceListed++;
  } else {
    unverifiedCount++;
  }

  // Source URLs
  if (r.source_url) {
    sourceUrls.add(r.source_url);
  }

  // Freshness
  const dateStr = r.last_verified_date || r.last_verified_at;
  if (dateStr) {
    try {
      const d = new Date(dateStr);
      if (d < oneYearAgo) {
        staleCount++;
      }
    } catch (e) {}
  } else {
    // If it has no verification date and it's not a fallback, it might be stale
    if (r.data_origin !== 'programmatic_fallback' && r.data_origin !== 'generated_county_fallback') {
      staleCount++;
    }
  }
}

const totalRecords = allRecords.length;
const fallbackShare = totalRecords > 0 ? (programmaticFallback / totalRecords) * 100 : 0;
const humanVerifiedShare = totalRecords > 0 ? (humanVerified / totalRecords) * 100 : 0;

console.log('====================================================');
console.log(`📊 SCRAPING VS SEEDING REPORT: ${stateRecord.name.toUpperCase()} (${stateRecord.code})`);
console.log('====================================================\n');

console.log(`Total Records Mapped:               ${totalRecords}`);
console.log(`Unique Source URLs Checked:         ${sourceUrls.size}`);
console.log(`Programmatic Fallback Share:        ${fallbackShare.toFixed(1)}%`);
console.log(`Human Verification Share:           ${humanVerifiedShare.toFixed(1)}%\n`);

console.log('Record Provenance Breakdown (data_origin):');
console.log(`  - Scraped Live:                    ${scrapedLive}  (${(totalRecords > 0 ? (scrapedLive / totalRecords) * 100 : 0).toFixed(1)}%)`);
console.log(`  - Crawler Derived:                 ${crawlerDerived}  (${(totalRecords > 0 ? (crawlerDerived / totalRecords) * 100 : 0).toFixed(1)}%)`);
console.log(`  - Curated Seed:                    ${curatedSeed}  (${(totalRecords > 0 ? (curatedSeed / totalRecords) * 100 : 0).toFixed(1)}%)`);
console.log(`  - Programmatic Fallbacks:          ${programmaticFallback}  (${(totalRecords > 0 ? (programmaticFallback / totalRecords) * 100 : 0).toFixed(1)}%)\n`);

console.log('Verification Breakdown (verification_status):');
console.log(`  - Human / Official Verified:       ${humanVerified}  (${(totalRecords > 0 ? (humanVerified / totalRecords) * 100 : 0).toFixed(1)}%)`);
console.log(`  - Source-Listed:                   ${sourceListed}  (${(totalRecords > 0 ? (sourceListed / totalRecords) * 100 : 0).toFixed(1)}%)`);
console.log(`  - Unverified Placeholders:         ${unverifiedCount}  (${(totalRecords > 0 ? (unverifiedCount / totalRecords) * 100 : 0).toFixed(1)}%)\n`);

console.log('Freshness & Review Queues:');
console.log(`  - Stale Records (>1 year old):     ${staleCount}`);
console.log(`  - Records Needing Audit Review:    ${programmaticFallback + unverifiedCount + staleCount}\n`);

console.log('Quality Note:');
console.log('  * Scraped data must never be marked as "Curated Seed"');
console.log('  * Fallback placeholders must never claim "Human Verified" status');
console.log('  * Every explicit record should have a valid source_url');
console.log('');

db.close();
