import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath);
const offices = db.prepare("SELECT * FROM county_offices WHERE county_id IN ('bronx-ny', 'kings-ny', 'new-york-ny', 'queens-ny', 'richmond-ny')").all();
console.log(JSON.stringify(offices, null, 2));
db.close();
