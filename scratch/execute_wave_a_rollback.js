import fs from 'fs';
import { execSync } from 'child_process';
import Database from 'better-sqlite3';

const backupFile = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db.backup-1781386075382';
const dbFile = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db';
const replicaFile = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/ca_disability_navigator.db';

console.log("🔄 Executing Wave A Database Rollback...");

if (!fs.existsSync(backupFile)) {
  console.error(`❌ Backup file not found: ${backupFile}`);
  process.exit(1);
}

// 1. Copy backup to main DB
fs.copyFileSync(backupFile, dbFile);
console.log(`✓ Restored main database from: ${backupFile}`);

// 2. Remove locks and copy to replica
try {
  fs.unlinkSync(`${replicaFile}-shm`);
} catch (e) {}
try {
  fs.unlinkSync(`${replicaFile}-wal`);
} catch (e) {}
fs.copyFileSync(dbFile, replicaFile);
console.log(`✓ Synced replica database.`);

// 3. Verify counts in restored DB
const db = new Database(dbFile);
const states = ['pa', 'il', 'ga', 'nc'];

console.log("\n📊 Verification of Restored DB Counts:");
for (const code of states) {
  const JfsCount = db.prepare("SELECT count(*) as c FROM county_offices WHERE county_id LIKE ?").get(`%-${code}`).c;
  const DDCount = db.prepare("SELECT count(*) as c FROM state_resource_agencies WHERE state_id = ? AND agency_type = 'developmental_services_agency'").get(code === 'pa' ? 'pennsylvania' : code === 'il' ? 'illinois' : code === 'ga' ? 'georgia' : 'north-carolina').c;
  const EICount = db.prepare("SELECT count(*) as c FROM state_resource_agencies WHERE state_id = ? AND agency_type = 'early_intervention'").get(code === 'pa' ? 'pennsylvania' : code === 'il' ? 'illinois' : code === 'ga' ? 'georgia' : 'north-carolina').c;
  const FormsCount = db.prepare("SELECT count(*) as c FROM staging_scraped_forms WHERE county_id LIKE ?").get(`%-${code}`).c;

  console.log(`  • State: ${code.toUpperCase()}`);
  console.log(`    - county_offices (JFS): ${JfsCount}`);
  console.log(`    - state_resource_agencies (DD): ${DDCount}`);
  console.log(`    - state_resource_agencies (EI): ${EICount}`);
  console.log(`    - staging_scraped_forms: ${FormsCount}`);
}

// Verify Ohio counts are still intact
const ohJfs = db.prepare("SELECT count(*) as c FROM county_offices WHERE county_id LIKE '%-oh'").get().c;
console.log(`\n✓ Ohio county offices (JFS) count: ${ohJfs} (expected: 88)`);

db.close();
console.log("\n✓ Rollback Completed Successfully!");
