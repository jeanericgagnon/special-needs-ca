import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const db = new Database(dbPath);

console.log('--- Texas Data Integrity & Evidence Audit ---');

const tables = [
  { name: 'county_offices', query: "SELECT * FROM county_offices WHERE county_id LIKE '%-tx'" },
  { name: 'state_resource_agencies', query: "SELECT * FROM state_resource_agencies WHERE state_id = 'texas'" },
  { name: 'regional_education_agencies', query: "SELECT * FROM regional_education_agencies WHERE state_id = 'texas'" },
  { name: 'school_districts', query: "SELECT sd.* FROM school_districts sd JOIN counties c ON sd.county_id = c.id WHERE c.state_id = 'texas'" },
  { name: 'resource_providers', query: "SELECT * FROM resource_providers WHERE county_id LIKE '%-tx'" },
  { name: 'nonprofit_organizations', query: "SELECT * FROM nonprofit_organizations WHERE county_id LIKE '%-tx'" },
  { name: 'iep_advocates', query: "SELECT DISTINCT ia.* FROM iep_advocates ia JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id JOIN counties c ON iac.county_id = c.id WHERE c.state_id = 'texas'" },
  { name: 'program_waitlists', query: "SELECT pw.* FROM program_waitlists pw JOIN programs p ON pw.program_id = p.id WHERE p.state_id = 'texas'" },
  { name: 'sources', query: "SELECT s.* FROM sources s JOIN programs p ON s.program_id = p.id WHERE p.state_id = 'texas'" },
  { name: 'programs', query: "SELECT * FROM programs WHERE state_id = 'texas'" }
];

const evidenceLevels = {};
const dataOrigins = {};
const verificationStatuses = {};

let totalRecords = 0;
let missingSourceUrl = 0;
let missingConfidenceScore = 0;
let missingTimestamp = 0;

tables.forEach(t => {
  const rows = db.prepare(t.query).all();
  totalRecords += rows.length;
  console.log(`Table: ${t.name.padEnd(28)} | Count: ${rows.length}`);
  
  rows.forEach(r => {
    // Evidence Level
    const el = r.evidence_level || 'NULL';
    evidenceLevels[el] = (evidenceLevels[el] || 0) + 1;
    
    // Data Origin
    const doVal = r.data_origin || 'NULL';
    dataOrigins[doVal] = (dataOrigins[doVal] || 0) + 1;
    
    // Verification Status
    const vs = r.verification_status || 'NULL';
    verificationStatuses[vs] = (verificationStatuses[vs] || 0) + 1;
    
    // Missing Source URL (exclude tables like school_districts or county_offices where source_url is stored differently or optional, but wait, check if they have it)
    const hasSourceUrlCol = 'source_url' in r || 'website' in r;
    const sUrl = r.source_url || r.website || r.url;
    if (hasSourceUrlCol && !sUrl) {
      missingSourceUrl++;
    }
    
    // Missing Confidence Score
    const hasConfidenceScoreCol = 'confidence_score' in r;
    if (hasConfidenceScoreCol && (r.confidence_score === null || r.confidence_score === undefined)) {
      missingConfidenceScore++;
    }
    
    // Missing Verification Date / Scraped timestamp
    const hasTimestamp = r.last_verified_date || r.last_verified_at || r.last_scraped_at || r.last_checked_at;
    if (!hasTimestamp) {
      missingTimestamp++;
    }
  });
});

console.log('\n--- Evidence Level Distribution ---');
console.log(evidenceLevels);

console.log('\n--- Data Origin Distribution ---');
console.log(dataOrigins);

console.log('\n--- Verification Status Distribution ---');
console.log(verificationStatuses);

console.log('\n--- Missing Fields Audit ---');
console.log(`Total Texas Records Inspected:    ${totalRecords}`);
console.log(`Records Missing Source URL:       ${missingSourceUrl}`);
console.log(`Records Missing Confidence Score: ${missingConfidenceScore}`);
console.log(`Records Missing Verification Date: ${missingTimestamp}`);

db.close();
