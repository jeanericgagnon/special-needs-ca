import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');

console.log("==========================================");
console.log("🔍 WAVE A BATCH VALIDATION AUDIT");
console.log("==========================================");

const states = ['pa', 'il', 'ga', 'nc'];

// 1. Total Reconciliation
console.log("\n📊 1. Total Records Count in DB:");
for (const code of states) {
  const JfsCount = db.prepare("SELECT count(*) as c FROM county_offices WHERE county_id LIKE ?").get(`%-${code}`).c;
  const DDCount = db.prepare("SELECT count(*) as c FROM state_resource_agencies WHERE state_id = ? AND agency_type = 'developmental_services_agency'").get(code === 'pa' ? 'pennsylvania' : code === 'il' ? 'illinois' : code === 'ga' ? 'georgia' : 'north-carolina').c;
  const EICount = db.prepare("SELECT count(*) as c FROM state_resource_agencies WHERE state_id = ? AND agency_type = 'early_intervention'").get(code === 'pa' ? 'pennsylvania' : code === 'il' ? 'illinois' : code === 'ga' ? 'georgia' : 'north-carolina').c;
  const FormsCount = db.prepare("SELECT count(*) as c FROM staging_scraped_forms WHERE county_id LIKE ?").get(`%-${code}`).c;

  console.log(`  • State: ${code.toUpperCase()}`);
  console.log(`    - county_offices (JFS): ${JfsCount}`);
  console.log(`    - state_resource_agencies (DD): ${DDCount}`);
  console.log(`    - state_resource_agencies (EI): ${EICount}`);
  console.log(`    - staging_scraped_forms: ${FormsCount}`);
}

// 2. Fake Coverage/County Mirroring Audit
console.log("\n🏫 2. Fake Coverage / County Mirroring Check:");
for (const code of states) {
  const stateId = code === 'pa' ? 'pennsylvania' : code === 'il' ? 'illinois' : code === 'ga' ? 'georgia' : 'north-carolina';
  
  // DD
  const ddUniqueAddresses = db.prepare("SELECT count(distinct office_locations) as c FROM state_resource_agencies WHERE state_id = ? AND agency_type = 'developmental_services_agency'").get(stateId).c;
  const ddUniquePhones = db.prepare("SELECT count(distinct intake_phone) as c FROM state_resource_agencies WHERE state_id = ? AND agency_type = 'developmental_services_agency'").get(stateId).c;
  
  // EI
  const eiUniqueAddresses = db.prepare("SELECT count(distinct office_locations) as c FROM state_resource_agencies WHERE state_id = ? AND agency_type = 'early_intervention'").get(stateId).c;
  const eiUniquePhones = db.prepare("SELECT count(distinct intake_phone) as c FROM state_resource_agencies WHERE state_id = ? AND agency_type = 'early_intervention'").get(stateId).c;

  console.log(`  • State: ${code.toUpperCase()}`);
  console.log(`    - DD Unique Addresses: ${ddUniqueAddresses}, Unique Phones: ${ddUniquePhones}`);
  console.log(`    - EI Unique Addresses: ${eiUniqueAddresses}, Unique Phones: ${eiUniquePhones}`);
}

// 3. Confidence score check
console.log("\n📊 3. Confidence Score Scale Check:");
const sampleScores = db.prepare("SELECT confidence_score, count(*) as c FROM (SELECT confidence_score FROM county_offices UNION ALL SELECT confidence_score FROM state_resource_agencies UNION ALL SELECT confidence_score FROM school_districts) GROUP BY confidence_score LIMIT 10").all();
console.log("Sample confidence scores in DB:", sampleScores);

// 4. Curated protected records check
console.log("\n🛡️ 4. Curated Seeds Protection Status:");
const protectedCount = db.prepare("SELECT count(*) as c FROM county_offices WHERE data_origin = 'curated_seed'").get().c;
console.log(`  - Total curated_seed records in county_offices: ${protectedCount}`);

// Get a few by state
for (const code of states) {
  const count = db.prepare("SELECT count(*) as c FROM county_offices WHERE county_id LIKE ? AND data_origin = 'curated_seed'").get(`%-${code}`).c;
  console.log(`    - Curated seeds in ${code.toUpperCase()}: ${count}`);
}

db.close();
