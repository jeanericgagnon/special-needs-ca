import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath);

console.log("=== COUNTIES IN IL ===");
const counties = db.prepare("SELECT * FROM counties WHERE state_id = 'illinois'").all();
console.log(`Found ${counties.length} counties in Illinois.`);
if (counties.length > 0) {
  console.log("Sample county:", counties[0]);
}

console.log("\n=== COUNTY OFFICES IN IL ===");
const offices = db.prepare("SELECT * FROM county_offices WHERE county_id LIKE '%-il'").all();
console.log(`Found ${offices.length} county offices.`);
if (offices.length > 0) {
  console.log("Sample office:", offices[0]);
}

console.log("\n=== STATE RESOURCE AGENCIES IN IL ===");
const agencies = db.prepare("SELECT * FROM state_resource_agencies WHERE state_id = 'illinois'").all();
console.log(`Found ${agencies.length} agencies.`);
if (agencies.length > 0) {
  console.log("Sample agency:", agencies[0]);
}

console.log("\n=== SCHOOL DISTRICTS IN IL ===");
const districts = db.prepare("SELECT * FROM school_districts WHERE county_id LIKE '%-il'").all();
console.log(`Found ${districts.length} school districts.`);
if (districts.length > 0) {
  console.log("Sample district:", districts[0]);
}

db.close();
