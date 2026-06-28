import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { runLaunchFixtureContaminationCleanup } from './run-launch-fixture-contamination-cleanup-v1.mjs';

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'launch-fixture-cleanup-'));
const outputDir = path.join(tempRoot, 'data', 'generated');
fs.mkdirSync(outputDir, { recursive: true });
const dbPath = path.join(tempRoot, 'ca_disability_navigator.db');
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE sources (
    id TEXT PRIMARY KEY,
    url TEXT,
    source_url TEXT
  );
  CREATE TABLE source_verifications (
    id TEXT PRIMARY KEY,
    verified_by TEXT,
    source_url TEXT
  );
`);
db.prepare(`INSERT INTO sources (id, url, source_url) VALUES ('src1', 'https://example.org/source', 'https://example.org/source')`).run();
db.prepare(`INSERT INTO sources (id, url, source_url) VALUES ('src-real', 'https://real.example.gov/source', 'https://real.example.gov/source')`).run();
db.prepare(`INSERT INTO source_verifications (id, verified_by, source_url) VALUES ('sv1', 'manual verifier', 'https://example.org/source')`).run();
db.prepare(`INSERT INTO source_verifications (id, verified_by, source_url) VALUES ('sv-real', 'human reviewer', 'https://real.example.gov/source')`).run();
db.close();

const { summary } = runLaunchFixtureContaminationCleanup({
  targetDbPath: dbPath,
  outputDir,
});

const verifyDb = new Database(dbPath, { readonly: true });
assert.equal(verifyDb.prepare(`SELECT COUNT(*) AS count FROM sources WHERE id = 'src1'`).get().count, 0);
assert.equal(verifyDb.prepare(`SELECT COUNT(*) AS count FROM source_verifications WHERE id = 'sv1'`).get().count, 0);
assert.equal(verifyDb.prepare(`SELECT COUNT(*) AS count FROM sources WHERE id = 'src-real'`).get().count, 1);
assert.equal(verifyDb.prepare(`SELECT COUNT(*) AS count FROM source_verifications WHERE id = 'sv-real'`).get().count, 1);
verifyDb.close();

const writtenSummary = JSON.parse(fs.readFileSync(path.join(outputDir, 'launch-fixture-contamination-cleanup-v1.json'), 'utf8'));
assert.equal(summary.removedCount, 2);
assert.equal(summary.skippedCount, 0);
assert.equal(writtenSummary.removedCount, 2);

fs.rmSync(tempRoot, { recursive: true, force: true });
console.log('launch fixture contamination cleanup v1 tests passed');
