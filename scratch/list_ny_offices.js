import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath);
const offices = db.prepare("SELECT id, county_id, office_name FROM county_offices WHERE county_id LIKE '%-ny'").all();
console.log("NY county office IDs and names:");
offices.forEach(o => console.log(` - ${o.id}: ${o.office_name} (county: ${o.county_id})`));
db.close();
