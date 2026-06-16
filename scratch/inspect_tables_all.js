import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath);

const tables = [
  'county_offices',
  'state_resource_agencies',
  'school_districts',
  'regional_education_agencies',
  'resource_providers',
  'forms_and_guides',
  'staging_scraped_forms',
  'programs',
  'program_waitlists',
  'program_appeal_info',
  'nonprofit_organizations',
  'staging_promotion_audit'
];

tables.forEach(table => {
  try {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all();
    if (columns.length > 0) {
      console.log(`\nTable: ${table}`);
      columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
      });
    } else {
      console.log(`\nTable: ${table} (exists but no columns? or does not exist)`);
    }
  } catch (err) {
    console.error(`Error table ${table}: ${err.message}`);
  }
});

db.close();
