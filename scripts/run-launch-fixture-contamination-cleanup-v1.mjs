import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const FIXTURE_ROWS = [
  {
    table: 'sources',
    id: 'src1',
    match: {
      url: 'https://example.org/source',
      source_url: 'https://example.org/source',
    },
  },
  {
    table: 'source_verifications',
    id: 'sv1',
    match: {
      source_url: 'https://example.org/source',
      verified_by: 'manual verifier',
    },
  },
];

function normalize(value) {
  if (value === null || value === undefined) return null;
  return String(value).trim();
}

function rowMatches(row, match) {
  return Object.entries(match).every(([key, expected]) => normalize(row[key]) === expected);
}

export function runLaunchFixtureContaminationCleanup({
  targetDbPath = path.join(repoRoot, 'ca_disability_navigator.db'),
  outputDir = path.join(repoRoot, 'data', 'generated'),
} = {}) {
  const jsonPath = path.join(outputDir, 'launch-fixture-contamination-cleanup-v1.json');
  const mdPath = path.join(outputDir, 'launch-fixture-contamination-cleanup-v1.md');
  const db = new Database(targetDbPath);
  const removed = [];
  const skipped = [];

  const tx = db.transaction(() => {
    for (const fixture of FIXTURE_ROWS) {
      const row = db.prepare(`SELECT * FROM ${fixture.table} WHERE id = ?`).get(fixture.id);
      if (!row) {
        skipped.push({ table: fixture.table, id: fixture.id, reason: 'missing_row' });
        continue;
      }

      if (!rowMatches(row, fixture.match)) {
        skipped.push({ table: fixture.table, id: fixture.id, reason: 'signature_mismatch' });
        continue;
      }

      db.prepare(`DELETE FROM ${fixture.table} WHERE id = ?`).run(fixture.id);
      removed.push({
        table: fixture.table,
        id: fixture.id,
        sourceUrl: normalize(row.source_url || row.url),
      });
    }
  });

  tx();
  db.close();

  fs.mkdirSync(outputDir, { recursive: true });
  const summary = {
    generatedAt: new Date().toISOString(),
    dbPath: path.relative(repoRoot, targetDbPath),
    removedCount: removed.length,
    skippedCount: skipped.length,
    removed,
    skipped,
  };
  fs.writeFileSync(jsonPath, `${JSON.stringify(summary, null, 2)}\n`);
  const md = [
    '# Launch Fixture Contamination Cleanup v1',
    '',
    `Generated: ${summary.generatedAt}`,
    '',
    `Removed: ${summary.removedCount}`,
    `Skipped: ${summary.skippedCount}`,
    '',
    '## Removed',
    '',
    ...(removed.length
      ? removed.map((row) => `- ${row.table}/${row.id}: ${row.sourceUrl}`)
      : ['- None']),
    '',
    '## Skipped',
    '',
    ...(skipped.length
      ? skipped.map((row) => `- ${row.table}/${row.id}: ${row.reason}`)
      : ['- None']),
  ].join('\n');
  fs.writeFileSync(mdPath, `${md}\n`);
  return { summary, jsonPath, mdPath };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { summary } = runLaunchFixtureContaminationCleanup();
  console.log(JSON.stringify(summary, null, 2));
}
