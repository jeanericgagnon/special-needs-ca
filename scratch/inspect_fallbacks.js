import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath, { readonly: true });

const wave1States = [
  'delaware', 'hawaii', 'rhode-island', 'connecticut', 'new-hampshire',
  'vermont', 'massachusetts', 'arizona', 'maine', 'nevada', 'alaska'
];

for (const stateId of wave1States) {
  const stateRecord = db.prepare("SELECT * FROM states WHERE id = ?").get(stateId);
  const suffix = `-${stateRecord.code.toLowerCase()}`;
  
  const offices = db.prepare("SELECT COUNT(*) as count FROM county_offices WHERE county_id LIKE ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").get(`%${suffix}`).count;
  const districts = db.prepare("SELECT COUNT(*) as count FROM school_districts WHERE county_id LIKE ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").get(`%${suffix}`).count;
  const nonprofits = db.prepare("SELECT COUNT(*) as count FROM nonprofit_organizations WHERE county_id LIKE ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").get(`%${suffix}`).count;
  
  const agencies = db.prepare("SELECT COUNT(*) as count FROM state_resource_agencies WHERE state_id = ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").get(stateId).count;
  const regEd = db.prepare("SELECT COUNT(*) as count FROM regional_education_agencies WHERE state_id = ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").get(stateId).count;
  
  console.log(`${stateId.toUpperCase()}: offices fallback = ${offices}, districts fallback = ${districts}, nonprofits fallback = ${nonprofits}, agencies fallback = ${agencies}, regional education fallback = ${regEd}`);
}

db.close();
