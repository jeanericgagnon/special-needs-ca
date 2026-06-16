import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath, { readonly: true });

const targetStates = ['colorado', 'louisiana', 'washington'];

for (const stateId of targetStates) {
  const stateRecord = db.prepare("SELECT code FROM states WHERE id = ?").get(stateId);
  const suffix = `-${stateRecord.code.toLowerCase()}`;
  
  const offices = db.prepare("SELECT id, county_id, office_name, data_origin, verification_status FROM county_offices WHERE county_id LIKE ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").all(`%${suffix}`);
  const districts = db.prepare("SELECT id, county_id, name, data_origin, verification_status FROM school_districts WHERE county_id LIKE ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").all(`%${suffix}`);
  const nonprofits = db.prepare("SELECT id, county_id, name, data_origin, verification_status FROM nonprofit_organizations WHERE county_id LIKE ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").all(`%${suffix}`);
  
  console.log(`\n=== State: ${stateId.toUpperCase()} ===`);
  if (offices.length > 0) console.log("county_offices:", offices);
  if (districts.length > 0) console.log("school_districts:", districts);
  if (nonprofits.length > 0) console.log("nonprofit_organizations:", nonprofits);
}

db.close();
