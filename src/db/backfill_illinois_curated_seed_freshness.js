import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const frontendDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');

const PHASE_RECORDS = [
  {
    table: 'resource_providers',
    label: 'clinics',
    phasePath: path.join(repoRoot, 'data', 'state-upgrades', 'illinois', 'phase_records', 'clinics.json'),
    diffPath: path.join(repoRoot, 'docs', 'state-upgrades', 'illinois', 'diffs', 'clinics-before-after-1781542427643.md'),
  },
  {
    table: 'nonprofit_organizations',
    label: 'trusted_nonprofits',
    phasePath: path.join(repoRoot, 'data', 'state-upgrades', 'illinois', 'phase_records', 'trusted_nonprofits.json'),
    diffPath: path.join(repoRoot, 'docs', 'state-upgrades', 'illinois', 'diffs', 'trusted_nonprofits-before-after-1781542428230.md'),
  },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readGeneratedAt(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^Generated At:\s+(.+)$/m);
  if (!match) {
    throw new Error(`Missing Generated At timestamp in ${filePath}`);
  }
  const stamp = match[1].trim();
  const time = new Date(stamp).getTime();
  if (Number.isNaN(time)) {
    throw new Error(`Invalid Generated At timestamp "${stamp}" in ${filePath}`);
  }
  return stamp;
}

const db = new Database(dbPath);

const tx = db.transaction(() => {
  const results = [];

  for (const config of PHASE_RECORDS) {
    const records = readJson(config.phasePath);
    const checkedAt = readGeneratedAt(config.diffPath);
    const ids = records.map((record) => record.id).filter(Boolean);

    const update = db.prepare(`
      UPDATE ${config.table}
      SET checked_at = ?
      WHERE id = ?
        AND data_origin = 'curated_seed'
        AND verification_status = 'official_verified'
        AND (checked_at IS NULL OR TRIM(checked_at) = '')
        AND (
          (last_verified_at IS NULL OR TRIM(last_verified_at) = '')
          AND (last_verified_date IS NULL OR TRIM(last_verified_date) = '')
          AND (last_scraped_at IS NULL OR TRIM(last_scraped_at) = '')
        )
    `);

    let updated = 0;
    for (const id of ids) {
      updated += update.run(checkedAt, id).changes;
    }

    results.push({
      table: config.table,
      label: config.label,
      checkedAt,
      candidateCount: ids.length,
      updated,
    });
  }

  return results;
});

const results = tx();
db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify({
  message: 'Backfilled Illinois curated-seed directory freshness from checked-in promotion artifacts',
  results,
}, null, 2));
