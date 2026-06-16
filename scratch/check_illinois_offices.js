import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath, { readonly: true });

const offices = db.prepare("SELECT id, county_id, office_name, data_origin, verification_status, program_id FROM county_offices WHERE county_id LIKE '%-il' LIMIT 10").all();
console.log(JSON.stringify(offices, null, 2));

const totalOffices = db.prepare("SELECT COUNT(*) as count FROM county_offices WHERE county_id LIKE '%-il'").get().count;
console.log("Total offices for Illinois:", totalOffices);

db.close();
