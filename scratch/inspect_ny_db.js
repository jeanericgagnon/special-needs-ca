import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath);

console.log("Counties in NY:");
const counties = db.prepare("SELECT id, name FROM counties WHERE id LIKE '%-ny'").all();
console.log(`Total NY Counties: ${counties.length}`);
console.log("Sample:", counties.slice(0, 5));

console.log("\nCounty offices in NY:");
const offices = db.prepare("SELECT id, county_id, office_name, verification_status FROM county_offices WHERE county_id LIKE '%-ny'").all();
console.log(`Total NY Offices: ${offices.length}`);
const officeStatuses = {};
offices.forEach(o => {
  officeStatuses[o.verification_status] = (officeStatuses[o.verification_status] || 0) + 1;
});
console.log("Office Statuses:", officeStatuses);
console.log("Sample Offices:", offices.slice(0, 5));

console.log("\nSchool districts in NY:");
const districts = db.prepare("SELECT id, county_id, name, verification_status FROM school_districts WHERE county_id LIKE '%-ny'").all();
console.log(`Total NY Districts: ${districts.length}`);
const districtStatuses = {};
districts.forEach(d => {
  districtStatuses[d.verification_status] = (districtStatuses[d.verification_status] || 0) + 1;
});
console.log("District Statuses:", districtStatuses);
console.log("Sample Districts:", districts.slice(0, 5));

console.log("\nPrograms in NY:");
const programs = db.prepare("SELECT id, name, url FROM programs WHERE id LIKE 'ny-%'").all();
console.log(`Total NY Programs: ${programs.length}`);
console.log("Programs:", programs);

console.log("\nState Resource Agencies in NY:");
const agencies = db.prepare("SELECT id, state_id, agency_name, agency_type FROM state_resource_agencies WHERE state_id = 'new-york'").all();
console.log(`Total NY Agencies: ${agencies.length}`);
console.log("Agencies:", agencies);

db.close();
