import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const frontendDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');

const db = new Database(dbPath);

function getColumns(tableName) {
  return new Set(db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name));
}

function ensureColumn(tableName, columnName, columnDef) {
  const columns = getColumns(tableName);
  if (!columns.has(columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`);
    return 1;
  }
  return 0;
}

function deriveSourceName(value) {
  if (!value || !String(value).trim()) return null;
  try {
    const url = new URL(String(value).trim());
    return url.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

const tx = db.transaction(() => {
  let addedColumns = 0;
  let sourceNamesBackfilled = 0;
  let providerVerifiedAtBackfilled = 0;
  let nonprofitVerifiedAtBackfilled = 0;
  let advocateVerifiedAtBackfilled = 0;

  addedColumns += ensureColumn('resource_providers', 'last_verified_at', 'TEXT');
  addedColumns += ensureColumn('nonprofit_organizations', 'last_verified_at', 'TEXT');

  const providerRows = db.prepare(`
    SELECT id, source_url, source_name, last_verified_at, last_verified_date
    FROM resource_providers
  `).all();
  const nonprofitRows = db.prepare(`
    SELECT id, source_url, source_name, last_verified_at, last_verified_date
    FROM nonprofit_organizations
  `).all();
  const advocateRows = db.prepare(`
    SELECT id, source_url, source_name, last_verified_at, last_verified_date
    FROM iep_advocates
  `).all();

  const updateProviderSourceName = db.prepare(`UPDATE resource_providers SET source_name = ? WHERE id = ?`);
  const updateNonprofitSourceName = db.prepare(`UPDATE nonprofit_organizations SET source_name = ? WHERE id = ?`);
  const updateAdvocateSourceName = db.prepare(`UPDATE iep_advocates SET source_name = ? WHERE id = ?`);
  const updateProviderVerifiedAt = db.prepare(`UPDATE resource_providers SET last_verified_at = ? WHERE id = ?`);
  const updateNonprofitVerifiedAt = db.prepare(`UPDATE nonprofit_organizations SET last_verified_at = ? WHERE id = ?`);
  const updateAdvocateVerifiedAt = db.prepare(`UPDATE iep_advocates SET last_verified_at = ? WHERE id = ?`);

  for (const row of providerRows) {
    if ((!row.source_name || !String(row.source_name).trim()) && row.source_url) {
      const sourceName = deriveSourceName(row.source_url);
      if (sourceName) {
        updateProviderSourceName.run(sourceName, row.id);
        sourceNamesBackfilled += 1;
      }
    }
    if ((!row.last_verified_at || !String(row.last_verified_at).trim()) && row.last_verified_date) {
      updateProviderVerifiedAt.run(`${row.last_verified_date}T00:00:00.000Z`, row.id);
      providerVerifiedAtBackfilled += 1;
    }
  }

  for (const row of nonprofitRows) {
    if ((!row.source_name || !String(row.source_name).trim()) && row.source_url) {
      const sourceName = deriveSourceName(row.source_url);
      if (sourceName) {
        updateNonprofitSourceName.run(sourceName, row.id);
        sourceNamesBackfilled += 1;
      }
    }
    if ((!row.last_verified_at || !String(row.last_verified_at).trim()) && row.last_verified_date) {
      updateNonprofitVerifiedAt.run(`${row.last_verified_date}T00:00:00.000Z`, row.id);
      nonprofitVerifiedAtBackfilled += 1;
    }
  }

  for (const row of advocateRows) {
    if ((!row.source_name || !String(row.source_name).trim()) && row.source_url) {
      const sourceName = deriveSourceName(row.source_url);
      if (sourceName) {
        updateAdvocateSourceName.run(sourceName, row.id);
        sourceNamesBackfilled += 1;
      }
    }
    if ((!row.last_verified_at || !String(row.last_verified_at).trim()) && row.last_verified_date) {
      updateAdvocateVerifiedAt.run(`${row.last_verified_date}T00:00:00.000Z`, row.id);
      advocateVerifiedAtBackfilled += 1;
    }
  }

  return {
    addedColumns,
    sourceNamesBackfilled,
    providerVerifiedAtBackfilled,
    nonprofitVerifiedAtBackfilled,
    advocateVerifiedAtBackfilled,
  };
});

const result = tx();
db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify({
  message: 'Backfilled directory trust metadata',
  ...result,
}, null, 2));
