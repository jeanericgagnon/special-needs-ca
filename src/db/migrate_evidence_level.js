import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const frontendDbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');

const tables = [
  'nonprofit_organizations',
  'state_resource_agencies',
  'regional_education_agencies',
  'iep_advocates',
  'resource_providers',
  'staging_scraped_nonprofit_organizations',
  'staging_scraped_state_resource_agencies',
  'staging_scraped_regional_education_agencies',
  'staging_scraped_iep_advocates',
  'staging_scraped_resource_providers'
];

function migrate(dbFilePath) {
  console.log(`⏳ Migrating database at ${dbFilePath}...`);
  const db = new Database(dbFilePath);
  
  for (const table of tables) {
    try {
      const columns = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
      if (!columns.includes('evidence_level')) {
        db.prepare(`ALTER TABLE ${table} ADD COLUMN evidence_level TEXT`).run();
        console.log(`  ✓ Added 'evidence_level' column to ${table}`);
      } else {
        console.log(`  ✓ Column 'evidence_level' already exists in ${table}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed to migrate ${table}:`, err.message);
    }
  }
  
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.close();
  console.log(`✓ Completed migrations for ${dbFilePath}\n`);
}

migrate(dbPath);
migrate(frontendDbPath);
console.log('🎉 Migrations successfully completed!');
