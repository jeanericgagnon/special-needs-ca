import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');

console.log("==========================================");
console.log("🔍 RUNNING OHIO SOURCE COMPLETENESS AUDIT");
console.log("==========================================");

// Helper for distribution counts
function getDistribution(query, params = []) {
  const rows = db.prepare(query).all(...params);
  return rows.reduce((acc, r) => {
    const val = Object.values(r)[0] || 'NULL';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

// 1. Categories and counts
const counts = {
  county_offices: db.prepare("SELECT count(*) as c FROM county_offices WHERE county_id LIKE '%-oh'").get().c,
  cbdd: db.prepare("SELECT count(*) as c FROM state_resource_agencies WHERE state_id = 'ohio' AND agency_type = 'cbdd'").get().c,
  ei: db.prepare("SELECT count(*) as c FROM state_resource_agencies WHERE state_id = 'ohio' AND agency_type = 'early_intervention'").get().c,
  esc: db.prepare("SELECT count(*) as c FROM regional_education_agencies WHERE state_id = 'ohio'").get().c,
  districts: db.prepare("SELECT count(*) as c FROM school_districts WHERE county_id LIKE '%-oh'").get().c,
  providers: db.prepare("SELECT count(*) as c FROM resource_providers WHERE county_id LIKE '%-oh'").get().c,
  nonprofits: db.prepare("SELECT count(*) as c FROM nonprofit_organizations WHERE county_id LIKE '%-oh'").get().c,
  forms: db.prepare("SELECT count(*) as c FROM staging_scraped_forms WHERE county_id LIKE '%-oh'").get().c
};

console.log("📊 Record Counts by Category:", counts);

// 2. School district scope check
console.log("\n🏫 School District Scope Check:");
const totalDistrictsInDb = db.prepare("SELECT count(*) as c FROM school_districts WHERE county_id LIKE '%-oh'").get().c;
const fallbackDistricts = db.prepare("SELECT count(*) as c FROM school_districts WHERE county_id LIKE '%-oh' AND verification_status = 'generated_county_fallback'").get().c;
const sourceListedDistricts = db.prepare("SELECT count(*) as c FROM school_districts WHERE county_id LIKE '%-oh' AND verification_status = 'pending_review'").get().c;
console.log(`  - Total in DB: ${totalDistrictsInDb}`);
console.log(`  - Fallbacks: ${fallbackDistricts}`);
console.log(`  - Source-Listed / Upgraded: ${sourceListedDistricts}`);

// Let's print a few district names and see if they are county-level or local school-level
const sampleDistricts = db.prepare("SELECT id, name, verification_status FROM school_districts WHERE county_id LIKE '%-oh' LIMIT 5").all();
console.log("  - Sample districts in DB:", sampleDistricts);

// 3. Provider/advocate boundary audit
console.log("\n🛡️ Provider / Advocate Boundary Audit:");
const ohioProviders = db.prepare("SELECT id, name, categories, county_id, verification_status, data_origin FROM resource_providers WHERE county_id LIKE '%-oh'").all();
console.log(`  - Total providers in DB for Ohio: ${ohioProviders.length}`);
console.log(ohioProviders);

// 4. Evidence audit
console.log("\n📊 Evidence, Origin, Verification, and Confidence Distributions:");
console.log("  - evidence_level count:", getDistribution("SELECT evidence_level FROM (SELECT evidence_level FROM county_offices WHERE county_id LIKE '%-oh' UNION ALL SELECT evidence_level FROM state_resource_agencies WHERE state_id = 'ohio' UNION ALL SELECT evidence_level FROM school_districts WHERE county_id LIKE '%-oh' UNION ALL SELECT evidence_level FROM regional_education_agencies WHERE state_id = 'ohio')"));
console.log("  - data_origin count:", getDistribution("SELECT data_origin FROM (SELECT data_origin FROM county_offices WHERE county_id LIKE '%-oh' UNION ALL SELECT data_origin FROM state_resource_agencies WHERE state_id = 'ohio' UNION ALL SELECT data_origin FROM school_districts WHERE county_id LIKE '%-oh' UNION ALL SELECT data_origin FROM regional_education_agencies WHERE state_id = 'ohio')"));
console.log("  - verification_status count:", getDistribution("SELECT verification_status FROM (SELECT verification_status FROM county_offices WHERE county_id LIKE '%-oh' UNION ALL SELECT verification_status FROM state_resource_agencies WHERE state_id = 'ohio' UNION ALL SELECT verification_status FROM school_districts WHERE county_id LIKE '%-oh' UNION ALL SELECT verification_status FROM regional_education_agencies WHERE state_id = 'ohio')"));
console.log("  - confidence_score count:", getDistribution("SELECT confidence_score FROM (SELECT confidence_score FROM county_offices WHERE county_id LIKE '%-oh' UNION ALL SELECT confidence_score FROM state_resource_agencies WHERE state_id = 'ohio' UNION ALL SELECT confidence_score FROM school_districts WHERE county_id LIKE '%-oh' UNION ALL SELECT confidence_score FROM regional_education_agencies WHERE state_id = 'ohio')"));

// Gaps
const missingSourceUrl = db.prepare("SELECT count(*) as c FROM (SELECT source_url FROM county_offices WHERE county_id LIKE '%-oh' UNION ALL SELECT source_url FROM state_resource_agencies WHERE state_id = 'ohio' UNION ALL SELECT source_url FROM school_districts WHERE county_id LIKE '%-oh' UNION ALL SELECT source_url FROM regional_education_agencies WHERE state_id = 'ohio') WHERE source_url IS NULL OR source_url = ''").get().c;
const missingEvidenceLevel = db.prepare("SELECT count(*) as c FROM (SELECT evidence_level FROM county_offices WHERE county_id LIKE '%-oh' UNION ALL SELECT evidence_level FROM state_resource_agencies WHERE state_id = 'ohio' UNION ALL SELECT evidence_level FROM school_districts WHERE county_id LIKE '%-oh' UNION ALL SELECT evidence_level FROM regional_education_agencies WHERE state_id = 'ohio') WHERE evidence_level IS NULL").get().c;
const placeholderPhone = db.prepare("SELECT count(*) as c FROM county_offices WHERE county_id LIKE '%-oh' AND phone = '(800) 555-0155'").get().c;

console.log(`  - Records missing source_url: ${missingSourceUrl}`);
console.log(`  - Records missing evidence_level: ${missingEvidenceLevel}`);
console.log(`  - JFS offices with placeholder phone: ${placeholderPhone}`);

db.close();
