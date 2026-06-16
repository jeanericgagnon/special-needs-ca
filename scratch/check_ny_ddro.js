import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath);

const agencies = db.prepare("SELECT id, name, agency_type, counties_served FROM state_resource_agencies WHERE state_id = 'new-york'").all();
console.log("Existing NY Agencies in DB:");
console.log(agencies);

const count = db.prepare("SELECT count(*) as cnt FROM regional_center_counties WHERE regional_center_id LIKE 'ny-%'").get().cnt;
console.log(`Total regional_center_counties links for NY: ${count}`);

db.close();
