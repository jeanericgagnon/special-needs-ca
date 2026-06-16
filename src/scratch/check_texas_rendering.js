import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const db = new Database(dbPath);

console.log('=== Programmatic Rendering Audit for Texas ===');

// Helper to check county details as they would be queried by the county page
function checkCountyDetails(countyId) {
  console.log(`\nAuditing County: ${countyId}`);
  
  // 1. Query LIDDAs and ECI
  const regionalAgencies = db.prepare(`
    SELECT sra.*, rcc.county_id 
    FROM state_resource_agencies sra 
    JOIN regional_center_counties rcc ON sra.id = rcc.regional_center_id 
    WHERE rcc.county_id = ?
  `).all(countyId);
  
  const liddas = regionalAgencies.filter(a => a.agency_type === 'lidda');
  const ecis = regionalAgencies.filter(a => a.agency_type === 'eci');
  
  console.log(`  - Mapped LIDDAs: ${liddas.length}`);
  liddas.forEach(l => console.log(`    * LIDDA ID: ${l.id} | Name: ${l.name}`));
  
  console.log(`  - Mapped ECIs:  ${ecis.length}`);
  ecis.forEach(e => console.log(`    * ECI ID: ${e.id} | Name: ${e.name}`));
  
  // Check: LIDDAs render separately from ECI
  if (liddas.some(l => l.agency_type === 'eci') || ecis.some(e => e.agency_type === 'lidda')) {
    console.error(`  ❌ ERROR: ECI/LIDDA agency type mix-up!`);
  } else {
    console.log(`  ✅ Check: LIDDAs and ECIs are classified correctly by agency_type`);
  }

  // 2. Query clinics/resource providers mapped to this county
  // For clinics, we only check physical location or explicitly supported counties
  const providers = db.prepare(`
    SELECT rp.* FROM resource_providers rp
    WHERE rp.county_id = ?
  `).all(countyId);
  
  console.log(`  - Mapped Clinics/Providers: ${providers.length}`);
  providers.forEach(p => {
    console.log(`    * Provider ID: ${p.id} | Name: ${p.name} | Service Area: ${p.service_area_type}`);
    // Check: Clinics do not claim fake county service coverage
    if (p.service_area_type === 'physical_location_only' && p.county_id !== countyId) {
       console.error(`  ❌ ERROR: Clinic ${p.id} serving county ${countyId} but is physical_location_only!`);
    }
  });
  
  // 3. Query county offices (Medicaid benefit offices)
  const offices = db.prepare(`
    SELECT * FROM county_offices WHERE county_id = ?
  `).all(countyId);
  
  console.log(`  - Mapped Medicaid/HHS Offices: ${offices.length}`);
  offices.forEach(o => {
    console.log(`    * Office: ${o.office_name} | Address: ${o.address} | Phone: ${o.phone} | Trust: ${o.verification_status}`);
    if (!o.phone || o.phone.includes('placeholder') || o.phone === '(855) 937-2372') {
      console.error(`  ❌ ERROR: Office has placeholder contact info!`);
    }
  });
}

// Inspect specific counties
const countiesToAudit = [
  'harris-tx',
  'dallas-tx',
  'travis-tx',
  'bexar-tx',
  'tarrant-tx',
  'loving-tx', // rural
  'brazos-tx'  // mid-size
];

countiesToAudit.forEach(c => checkCountyDetails(c));

// Inspect program waitlists
console.log('\n--- Auditing Texas Program Waitlists ---');
const waitlists = db.prepare(`
  SELECT pw.*, p.name as program_name, p.id as program_id
  FROM program_waitlists pw
  JOIN programs p ON pw.program_id = p.id
  WHERE p.state_id = 'texas'
`).all();

waitlists.forEach(w => {
  console.log(`Program: ${w.program_name} (${w.program_id})`);
  console.log(`  - Duration Label: ${w.duration_label}`);
  console.log(`  - Source Type:    ${w.estimate_source_type}`);
  console.log(`  - Source URL:     ${w.estimate_source_url}`);
  console.log(`  - Description:    ${w.description.substring(0, 100)}...`);
  
  // Check: Waitlist language does not imply official duration estimates unless supported
  if (w.duration_label && w.duration_label !== 'Not officially stated') {
    if (w.estimate_source_type !== 'official_state') {
       console.warn(`  ⚠️ Warning: Non-official source for waitlist duration!`);
    }
  }
});

// Check if any forms are present in production programs or sources
console.log('\n--- Checking Forms In Staging vs Production ---');
const prodFormsCount = db.prepare(`
  SELECT COUNT(*) as count FROM sources WHERE source_type = 'form'
`).get().count;
console.log(`Production Forms Count: ${prodFormsCount}`);

const stagedForms = db.prepare(`
  SELECT COUNT(*) as count FROM staging_scraped_forms
`).get().count;
console.log(`Staged Forms Count:     ${stagedForms}`);

db.close();
