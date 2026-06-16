import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath);
const programs = db.prepare("SELECT id, name, program_type FROM programs WHERE state_id = 'new-york' OR id LIKE 'ny-%'").all();
console.log("NY Programs in DB:");
console.log(programs);
db.close();
