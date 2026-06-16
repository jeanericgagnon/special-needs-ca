import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const db = new Database(dbPath);

const counties = db.prepare("SELECT * FROM counties WHERE state_id = 'texas'").all();

let passed = 0;
let failed = 0;

const passedIds = [];

counties.forEach(c => {
  const countyId = c.id;
  
  // 1. Check LIDDA
  const hasLidda = db.prepare(`
    SELECT COUNT(*) as count FROM state_resource_agencies sra 
    JOIN regional_center_counties rcc ON sra.id = rcc.regional_center_id 
    WHERE rcc.county_id = ? AND sra.agency_type = 'lidda'
  `).get(countyId).count > 0;
  
  // 2. Check ECI
  const hasEci = db.prepare(`
    SELECT COUNT(*) as count FROM state_resource_agencies sra 
    JOIN regional_center_counties rcc ON sra.id = rcc.regional_center_id 
    WHERE rcc.county_id = ? AND sra.agency_type = 'eci'
  `).get(countyId).count > 0;
  
  // 3. Check Medicaid / HHS Office
  const hasOffice = db.prepare(`
    SELECT COUNT(*) as count FROM county_offices 
    WHERE county_id = ? AND program_id = 'tx-mdcp'
  `).get(countyId).count > 0;
  
  // 4. Check Nonprofit
  const hasNonprofit = db.prepare(`
    SELECT COUNT(*) as count FROM nonprofit_organizations 
    WHERE county_id = ?
  `).get(countyId).count > 0;
  
  // 5. Check School District
  const hasDistrict = db.prepare(`
    SELECT COUNT(*) as count FROM school_districts 
    WHERE county_id = ?
  `).get(countyId).count > 0;
  
  if (hasLidda && hasEci && hasOffice && hasNonprofit && hasDistrict) {
    passed++;
    passedIds.push(countyId);
  } else {
    failed++;
    console.log(`County ${countyId} failed: LIDDA=${hasLidda}, ECI=${hasEci}, MedicaidOffice=${hasOffice}, Nonprofit=${hasNonprofit}, District=${hasDistrict}`);
  }
});

console.log(`Total Texas counties: ${counties.length}`);
console.log(`Passed quality gate:  ${passed}`);
console.log(`Failed quality gate:  ${failed}`);

db.close();
