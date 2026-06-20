import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import Database from 'better-sqlite3';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'frontend'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs', 'generated'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-runs', '2026-06-18T00-00-00-000Z', 'followups'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-runs', '2026-06-18T00-00-00-001Z', 'followups'), { recursive: true });
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function runNode(scriptRelativePath, cwd, env = {}) {
  const scriptPath = path.join(repoRoot, scriptRelativePath);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  return JSON.parse(result.stdout.trim());
}

function createFixtureDb(dbPath) {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE programs (id INTEGER PRIMARY KEY, state_id TEXT, name TEXT, category TEXT, verification_status TEXT, source_url TEXT, official_source_url TEXT);
    CREATE TABLE counties (id INTEGER PRIMARY KEY, state_id TEXT);
    CREATE TABLE county_offices (id INTEGER PRIMARY KEY, county_id INTEGER, office_name TEXT, verification_status TEXT, source_url TEXT);
    CREATE TABLE state_resource_agencies (id INTEGER PRIMARY KEY, state_id TEXT, name TEXT, verification_status TEXT, source_url TEXT, source_urls TEXT);
    CREATE TABLE resource_providers (id INTEGER PRIMARY KEY, county_id INTEGER, name TEXT, verification_status TEXT, source_url TEXT);
    CREATE TABLE nonprofit_organizations (id INTEGER PRIMARY KEY, county_id INTEGER, name TEXT, verification_status TEXT, source_url TEXT);
    CREATE TABLE iep_advocates (id INTEGER PRIMARY KEY, name TEXT, verification_status TEXT, source_url TEXT);
    CREATE TABLE forms_and_guides (id INTEGER PRIMARY KEY, state_id TEXT, title TEXT, verification_status TEXT, pdf_url TEXT, source_url TEXT);
    CREATE TABLE program_waitlists (id INTEGER PRIMARY KEY, program_id INTEGER, name TEXT, estimate_source_url TEXT);
    CREATE TABLE sources (id INTEGER PRIMARY KEY, program_id INTEGER, verification_status TEXT, source_url TEXT, url TEXT);
  `);

  db.prepare(`
    INSERT INTO forms_and_guides (state_id, title, verification_status, pdf_url, source_url)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'hawaii',
    'Hawaii Dd Intake Request Guide',
    'verified',
    'https://health.hawaii.gov/ddd/hcbs/eligibility',
    'https://health.hawaii.gov/ddd/hcbs/eligibility',
  );

  db.close();
}

function testRepeatedStale404RowsAreSuppressed() {
  const fixtureRoot = makeTempRepo('db-discovered-source-targets');
  createFixtureDb(path.join(fixtureRoot, 'frontend', 'ca_disability_navigator.db'));

  writeJson(path.join(fixtureRoot, 'docs', 'generated', `master-source-target-ledger-${generatedDate}.json`), {
    ledger: [],
  });
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-runs', '2026-06-18T00-00-00-000Z', 'followups', 'source-repair.json'), [
    {
      sourceUrl: 'https://health.hawaii.gov/ddd/hcbs/eligibility',
      followupReason: 'stale_or_invalid_404',
    },
  ]);
  writeJson(path.join(fixtureRoot, 'data', 'source-acquisition-runs', '2026-06-18T00-00-00-001Z', 'followups', 'source-repair.json'), [
    {
      sourceUrl: 'https://health.hawaii.gov/ddd/hcbs/eligibility',
      followupReason: 'stale_or_invalid_404',
    },
  ]);

  runNode('src/db/generate_db_discovered_source_targets.js', fixtureRoot, {
    ABLEFULL_REPO_ROOT: fixtureRoot,
  });

  const output = JSON.parse(
    fs.readFileSync(path.join(fixtureRoot, 'docs', 'generated', `db-discovered-source-targets-${generatedDate}.json`), 'utf8'),
  );

  assert.equal(output.summary.suppressedRepeatedSourceRepairTargets, 1);
  assert.equal(output.actionableNewTargets.length, 0);
  assert.equal(output.suppressedRepeatedSourceRepairTargets.length, 1);
  assert.equal(output.suppressedRepeatedSourceRepairTargets[0].sourceUrl, 'https://health.hawaii.gov/ddd/hcbs/eligibility');
  assert.equal(output.suppressedRepeatedSourceRepairTargets[0].repeatCount, 2);
}

testRepeatedStale404RowsAreSuppressed();
console.log('db discovered source target suppression tests passed');
