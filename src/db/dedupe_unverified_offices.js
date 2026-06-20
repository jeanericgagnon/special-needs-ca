import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const duplicateGroups = db.prepare(`
  SELECT
    county_id,
    program_id,
    COALESCE(office_name, '') AS office_name,
    COALESCE(phone, '') AS phone,
    COALESCE(email, '') AS email,
    COALESCE(website, '') AS website,
    COALESCE(source_url, '') AS source_url,
    COUNT(*) AS copies
  FROM county_offices
  WHERE verification_status = 'unverified'
  GROUP BY county_id, program_id, office_name, phone, email, website, source_url
  HAVING COUNT(*) > 1
`).all();

const findDuplicateRowIds = db.prepare(`
  SELECT rowid, id
  FROM county_offices
  WHERE verification_status = 'unverified'
    AND county_id = ?
    AND program_id = ?
    AND COALESCE(office_name, '') = ?
    AND COALESCE(phone, '') = ?
    AND COALESCE(email, '') = ?
    AND COALESCE(website, '') = ?
    AND COALESCE(source_url, '') = ?
  ORDER BY rowid ASC
`);

const getStateForCounty = db.prepare(`
  SELECT state_id
  FROM counties
  WHERE id = ?
`);

const deleteByRowId = db.prepare(`
  DELETE FROM county_offices
  WHERE rowid = ?
`);

const removedByState = {};
let removed = 0;

const tx = db.transaction(() => {
  for (const group of duplicateGroups) {
    const rows = findDuplicateRowIds.all(
      group.county_id,
      group.program_id,
      group.office_name,
      group.phone,
      group.email,
      group.website,
      group.source_url
    );

    const stateId = getStateForCounty.get(group.county_id)?.state_id || 'unknown';
    for (const row of rows.slice(1)) {
      deleteByRowId.run(row.rowid);
      removed += 1;
      removedByState[stateId] = (removedByState[stateId] || 0) + 1;
    }
  }
});

tx();

console.log(`Removed ${removed} exact duplicate unverified office rows.`);
console.log(JSON.stringify({ removedByState }, null, 2));

db.close();
