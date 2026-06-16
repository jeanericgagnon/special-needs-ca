import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath, { readonly: true });

const queries = [
  "SELECT id, county_id, office_name, data_origin, verification_status FROM county_offices WHERE county_id = 'city-and-county-of-broomfield-co'",
  "SELECT id, county_id, office_name, data_origin, verification_status FROM county_offices WHERE county_id = 'st-landry-parish-la'",
  "SELECT id, county_id, office_name, data_origin, verification_status FROM county_offices WHERE county_id = 'walla-walla-wa'"
];

for (const q of queries) {
  console.log(`\nQuery: ${q}`);
  console.log(db.prepare(q).all());
}

db.close();
