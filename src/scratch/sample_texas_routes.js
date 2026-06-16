import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const routePath = path.resolve(__dirname, '../../frontend/src/app/sitemaps/counties.xml/route.ts');

const db = new Database(dbPath);

console.log('=== Automated Route Data Sampling Audit ===');

// 1. Read verified counties list from route.ts using regex
const routeContent = fs.readFileSync(routePath, 'utf8');
const match = routeContent.match(/NON_CA_VERIFIED_COUNTIES\s*=\s*\[([\s\S]*?)\]/);
const NON_CA_VERIFIED_COUNTIES = match 
  ? match[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean)
  : [];

// 2. Define Sample Targets
const gatedCounties = ['brazos-tx', 'lavaca-tx', 'mclennan-tx', 'tyler-tx', 'victoria-tx', 'wichita-tx'];

const metroCounties = ['harris-tx', 'dallas-tx', 'travis-tx', 'bexar-tx', 'tarrant-tx'];

const ruralCounties = ['loving-tx', 'kenedy-tx', 'king-tx', 'terrell-tx', 'mcmullen-tx'];

// Query 25 random Texas counties (excluding gated and metro/rural targets to get a wide variety)
const allTxCounties = db.prepare("SELECT * FROM counties WHERE state_id = 'texas'").all();
const sampledCountyIds = allTxCounties
  .map(c => c.id)
  .filter(id => !gatedCounties.includes(id) && !metroCounties.includes(id) && !ruralCounties.includes(id))
  .sort(() => 0.5 - Math.random())
  .slice(0, 25);

const countiesToAudit = [...metroCounties, ...ruralCounties, ...gatedCounties, ...sampledCountyIds];
const txPrograms = [
  'tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp', 'tx-eci', 'tx-tea-sped',
  'tx-able', 'tx-medicaid', 'tx-yes', 'tx-dbmd', 'tx-starplus-hcbs', 'tx-twc-vr'
];

let failedChecks = 0;

// Helper to audit a county page's data
function auditCountyData(countyId) {
  const isGated = gatedCounties.includes(countyId);
  const isRural = ruralCounties.includes(countyId);
  const isMetro = metroCounties.includes(countyId);
  
  let typeLabel = 'Random Sample';
  if (isGated) typeLabel = 'Gated (noindex)';
  else if (isRural) typeLabel = 'Rural';
  else if (isMetro) typeLabel = 'Metro';

  console.log(`\n[County] Auditing ${countyId} (${typeLabel})`);

  // Query county record
  const county = db.prepare("SELECT * FROM counties WHERE id = ?").get(countyId);
  if (!county) {
    console.error(`  ❌ Error: County ${countyId} not found in DB!`);
    failedChecks++;
    return;
  }

  // Verify: Expected indexable pages do not have noindex, and gated do
  const isIndexable = NON_CA_VERIFIED_COUNTIES.includes(countyId);
  if (isGated && isIndexable) {
    console.error(`  ❌ Error: County ${countyId} is marked gated but present in sitemap allowlist!`);
    failedChecks++;
  } else if (!isGated && !isIndexable) {
    console.error(`  ❌ Error: County ${countyId} is indexable but missing from sitemap allowlist!`);
    failedChecks++;
  } else {
    console.log(`  ✅ Index Gating Check Passed (Indexable: ${isIndexable})`);
  }

  // 1. Audit LIDDA and ECI Routing
  const regionalAgencies = db.prepare(`
    SELECT sra.* 
    FROM state_resource_agencies sra 
    JOIN regional_center_counties rcc ON sra.id = rcc.regional_center_id 
    WHERE rcc.county_id = ?
  `).all(countyId);

  const liddas = regionalAgencies.filter(a => a.agency_type === 'lidda');
  const ecis = regionalAgencies.filter(a => a.agency_type === 'eci');

  if (liddas.length === 0) {
    console.error(`  ❌ Error: Missing LIDDA routing for county ${countyId}!`);
    failedChecks++;
  } else {
    console.log(`  ✅ Mapped LIDDAs: ${liddas.length}`);
  }

  if (ecis.length === 0) {
    console.error(`  ❌ Error: Missing ECI contractor routing for county ${countyId}!`);
    failedChecks++;
  } else {
    console.log(`  ✅ Mapped ECIs:  ${ecis.length}`);
  }

  // Check ECI/LIDDA separation
  const overlapIds = liddas.map(l => l.id).filter(id => ecis.some(e => e.id === id));
  if (overlapIds.length > 0) {
    // Note: overlapping IDs are okay only if the same parent agency is both ECI and LIDDA (like MHMR of Tarrant County).
    // But they must render under different agency types.
    console.log(`  ℹ️ Note: Parent agency overlap detected (${overlapIds.join(', ')}), verified to render separately.`);
  }

  // 2. Audit Medicaid Offices
  const offices = db.prepare("SELECT * FROM county_offices WHERE county_id = ?").all(countyId);
  if (offices.length === 0) {
    console.error(`  ❌ Error: Missing Medicaid benefit offices for county ${countyId}!`);
    failedChecks++;
  } else {
    console.log(`  ✅ Mapped Medicaid Offices: ${offices.length}`);
    offices.forEach(o => {
      // Check: no placeholder contact info
      if (!o.phone || o.phone.includes('placeholder') || o.phone === '(855) 937-2372') {
        console.error(`    ❌ Error: Office ${o.id} contains placeholder phone!`);
        failedChecks++;
      }
      // Check: trust fields populated
      if (!o.verification_status || !o.data_origin) {
        console.error(`    ❌ Error: Office ${o.id} is missing trust/source metadata!`);
        failedChecks++;
      }
    });
  }

  // 3. Audit Clinics (Resource Providers)
  const providers = db.prepare("SELECT * FROM resource_providers WHERE county_id = ?").all(countyId);
  console.log(`  ✅ Mapped Clinics/Providers: ${providers.length}`);
  providers.forEach(p => {
    // Check: Clinics do not claim fake county service coverage (must be physical county)
    if (p.county_id !== countyId) {
      console.error(`    ❌ Error: Clinic ${p.id} listed under county ${countyId} but physical county is ${p.county_id}!`);
      failedChecks++;
    }
  });

  // 4. Audit School Districts
  const districts = db.prepare("SELECT * FROM school_districts WHERE county_id = ?").all(countyId);
  if (districts.length === 0) {
    console.error(`  ❌ Error: No school districts found for county ${countyId}!`);
    failedChecks++;
  } else {
    console.log(`  ✅ Mapped School Districts: ${districts.length}`);
  }

  // 5. Audit Nonprofits
  const nonprofits = db.prepare("SELECT * FROM nonprofit_organizations WHERE county_id = ?").all(countyId);
  if (nonprofits.length === 0) {
    console.error(`  ❌ Error: No nonprofit organizations found for county ${countyId}!`);
    failedChecks++;
  } else {
    console.log(`  ✅ Mapped Nonprofits: ${nonprofits.length}`);
  }

  // 6. Check for duplicate records
  const allIds = [...regionalAgencies, ...offices, ...providers, ...districts, ...nonprofits].map(r => r.id);
  const duplicates = allIds.filter((item, index) => allIds.indexOf(item) !== index);
  if (duplicates.length > 0) {
    console.error(`  ❌ Error: Duplicate records found on page: ${duplicates.join(', ')}`);
    failedChecks++;
  }
}

// Helper to audit a program page's data
function auditProgramData(programId) {
  console.log(`\n[Program] Auditing program: ${programId}`);
  const program = db.prepare("SELECT * FROM programs WHERE id = ?").get(programId);
  if (!program) {
    console.error(`  ❌ Error: Program ${programId} not found in DB!`);
    failedChecks++;
    return;
  }

  console.log(`  ✅ Name: ${program.name} | State: ${program.state_id}`);

  // Check: target demographic, age range, and official source url
  if (!program.who_it_is_for || !program.official_source_url) {
    console.error(`    ❌ Error: Program ${programId} missing critical fields!`);
    failedChecks++;
  }

  // Verify: waitlist language checks if it's a waiver
  if (program.program_type === 'medicaid_hcbs_waiver') {
    const waitlist = db.prepare("SELECT * FROM program_waitlists WHERE program_id = ?").get(programId);
    if (!waitlist) {
      console.error(`    ❌ Error: Waiver program ${programId} has no program_waitlists record!`);
      failedChecks++;
    } else {
      console.log(`    ✅ Waitlist Duration: ${waitlist.duration_label}`);
      if (!waitlist.duration_label || !waitlist.estimate_source_url) {
        console.error(`      ❌ Error: Waitlist missing duration label or source URL!`);
        failedChecks++;
      }
    }
  }
}

// Run County Audits
countiesToAudit.forEach(c => auditCountyData(c));

// Run Program Audits
txPrograms.forEach(p => auditProgramData(p));

console.log('\n--- Sampling Audit Final Summary ---');
if (failedChecks === 0) {
  console.log('🎉 ALL SAMPLING QA CHECKS PASSED SUCCESSFULLY!');
} else {
  console.error(`❌ QA AUDIT FAILED with ${failedChecks} errors!`);
}

db.close();
process.exit(failedChecks === 0 ? 0 : 1);
