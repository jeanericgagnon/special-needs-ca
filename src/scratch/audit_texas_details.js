import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const db = new Database(dbPath);

console.log('=== Detailed Fallback and Missing Fields Audit for Texas ===');

// 1. Audit remaining fallback records
const fallbackQueries = [
  { table: 'county_offices', query: "SELECT COUNT(*) as count FROM county_offices WHERE county_id LIKE '%-tx' AND (data_origin LIKE '%fallback%' OR id LIKE '%fallback%')" },
  { table: 'state_resource_agencies', query: "SELECT COUNT(*) as count FROM state_resource_agencies WHERE state_id = 'texas' AND (data_origin LIKE '%fallback%' OR id LIKE '%fallback%')" },
  { table: 'regional_education_agencies', query: "SELECT COUNT(*) as count FROM regional_education_agencies WHERE state_id = 'texas' AND (data_origin LIKE '%fallback%' OR id LIKE '%fallback%')" },
  { table: 'school_districts', query: "SELECT COUNT(*) as count FROM school_districts sd JOIN counties c ON sd.county_id = c.id WHERE c.state_id = 'texas' AND (sd.data_origin LIKE '%fallback%' OR sd.id LIKE '%fallback%')" },
  { table: 'resource_providers', query: "SELECT COUNT(*) as count FROM resource_providers WHERE county_id LIKE '%-tx' AND (data_origin LIKE '%fallback%' OR id LIKE '%fallback%')" },
  { table: 'nonprofit_organizations', query: "SELECT COUNT(*) as count FROM nonprofit_organizations WHERE county_id LIKE '%-tx' AND (data_origin LIKE '%fallback%' OR id LIKE '%fallback%')" },
  { table: 'iep_advocates', query: "SELECT COUNT(*) as count FROM iep_advocates ia JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id JOIN counties c ON iac.county_id = c.id WHERE c.state_id = 'texas' AND (ia.data_origin LIKE '%fallback%' OR ia.id LIKE '%fallback%')" }
];

console.log('\n--- Fallback Count by Table ---');
let totalFallbacks = 0;
fallbackQueries.forEach(q => {
  const res = db.prepare(q.query).get();
  console.log(`${q.table.padEnd(30)}: ${res.count}`);
  totalFallbacks += res.count;
});
console.log(`Total remaining fallback records: ${totalFallbacks}`);

// Let's find any county_seat_fallback records
console.log('\n--- County Seat Fallback Records Details ---');
const countySeatFallbacks = [];
const tablesToCheck = ['county_offices', 'state_resource_agencies', 'regional_education_agencies', 'school_districts', 'resource_providers', 'nonprofit_organizations', 'iep_advocates'];
tablesToCheck.forEach(tbl => {
  try {
    let query = `SELECT * FROM ${tbl} WHERE evidence_level = 'county_seat_fallback'`;
    if (tbl === 'school_districts') {
      query = `SELECT sd.* FROM school_districts sd JOIN counties c ON sd.county_id = c.id WHERE c.state_id = 'texas' AND sd.evidence_level = 'county_seat_fallback'`;
    } else if (tbl === 'iep_advocates') {
      query = `SELECT DISTINCT ia.* FROM iep_advocates ia JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id JOIN counties c ON iac.county_id = c.id WHERE c.state_id = 'texas' AND ia.evidence_level = 'county_seat_fallback'`;
    } else if (tbl === 'county_offices' || tbl === 'resource_providers' || tbl === 'nonprofit_organizations') {
      query = `SELECT * FROM ${tbl} WHERE county_id LIKE '%-tx' AND evidence_level = 'county_seat_fallback'`;
    } else {
      query = `SELECT * FROM ${tbl} WHERE state_id = 'texas' AND evidence_level = 'county_seat_fallback'`;
    }
    const rows = db.prepare(query).all();
    rows.forEach(r => {
      console.log(`Table: ${tbl} | ID: ${r.id} | Name: ${r.name} | Data Origin: ${r.data_origin}`);
    });
  } catch (e) {
    console.error(`Error checking ${tbl} for county_seat_fallback: ${e.message}`);
  }
});

// Let's audit NULL evidence_levels by table
console.log('\n--- NULL Evidence Level Counts by Table ---');
tablesToCheck.forEach(tbl => {
  try {
    let query = `SELECT COUNT(*) as count FROM ${tbl} WHERE (evidence_level IS NULL OR evidence_level = 'NULL')`;
    if (tbl === 'school_districts') {
      query = `SELECT COUNT(*) as count FROM school_districts sd JOIN counties c ON sd.county_id = c.id WHERE c.state_id = 'texas' AND (sd.evidence_level IS NULL OR sd.evidence_level = 'NULL')`;
    } else if (tbl === 'iep_advocates') {
      query = `SELECT COUNT(*) as count FROM iep_advocates ia JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id JOIN counties c ON iac.county_id = c.id WHERE c.state_id = 'texas' AND (ia.evidence_level IS NULL OR ia.evidence_level = 'NULL')`;
    } else if (tbl === 'county_offices' || tbl === 'resource_providers' || tbl === 'nonprofit_organizations') {
      query = `SELECT COUNT(*) as count FROM ${tbl} WHERE county_id LIKE '%-tx' AND (evidence_level IS NULL OR evidence_level = 'NULL')`;
    } else {
      query = `SELECT COUNT(*) as count FROM ${tbl} WHERE state_id = 'texas' AND (evidence_level IS NULL OR evidence_level = 'NULL')`;
    }
    const res = db.prepare(query).get();
    console.log(`${tbl.padEnd(30)}: ${res.count}`);
  } catch (e) {
    console.error(`Error checking ${tbl} for NULL evidence_level: ${e.message}`);
  }
});

// Find missing fields details
console.log('\n--- Missing Field Records Details ---');
tablesToCheck.forEach(tbl => {
  try {
    let selectQuery = '';
    if (tbl === 'school_districts') {
      selectQuery = `SELECT sd.* FROM school_districts sd JOIN counties c ON sd.county_id = c.id WHERE c.state_id = 'texas'`;
    } else if (tbl === 'iep_advocates') {
      selectQuery = `SELECT DISTINCT ia.* FROM iep_advocates ia JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id JOIN counties c ON iac.county_id = c.id WHERE c.state_id = 'texas'`;
    } else if (tbl === 'county_offices' || tbl === 'resource_providers' || tbl === 'nonprofit_organizations') {
      selectQuery = `SELECT * FROM ${tbl} WHERE county_id LIKE '%-tx'`;
    } else {
      selectQuery = `SELECT * FROM ${tbl} WHERE state_id = 'texas'`;
    }
    const rows = db.prepare(selectQuery).all();
    rows.forEach(r => {
      const hasSourceUrlCol = 'source_url' in r || 'website' in r;
      const sUrl = r.source_url || r.website || r.url;
      const hasConfidenceScoreCol = 'confidence_score' in r;
      const confidence = r.confidence_score;
      const hasTimestamp = r.last_verified_date || r.last_verified_at || r.last_scraped_at || r.last_checked_at;
      
      const missingUrl = hasSourceUrlCol && !sUrl;
      const missingConfidence = hasConfidenceScoreCol && (confidence === null || confidence === undefined);
      const missingTime = !hasTimestamp;
      
      if (missingUrl || missingConfidence || missingTime) {
        console.log(`Table: ${tbl} | ID: ${r.id} | Name: ${r.name.substring(0, 40)}`);
        if (missingUrl) console.log(`  -> Missing Source URL`);
        if (missingConfidence) console.log(`  -> Missing Confidence Score (Current: ${confidence})`);
        if (missingTime) console.log(`  -> Missing Timestamp (last_verified_date: ${r.last_verified_date}, last_scraped_at: ${r.last_scraped_at})`);
      }
    });
  } catch (e) {
    console.error(`Error detailed audit on ${tbl}: ${e.message}`);
  }
});

db.close();
