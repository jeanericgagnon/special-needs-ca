import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDate = '2026-06-18';

function runNode(args, env) {
  const result = spawnSync('node', args, {
    cwd: repoRoot,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: node ${args.join(' ')}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return result.stdout;
}

function makeTempRepo() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'provider-manual-review-'));
  fs.mkdirSync(path.join(tempRoot, 'docs', 'generated'), { recursive: true });
  fs.mkdirSync(path.join(tempRoot, 'data', 'source-acquisition-state'), { recursive: true });
  fs.mkdirSync(path.join(tempRoot, 'data', 'source-acquisition-runs', '2026-06-18T02-30-42-579Z', 'provider-county-geocode'), { recursive: true });
  return tempRoot;
}

function seedDb(dbPath) {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE staging_scraped_resource_providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_url TEXT NOT NULL,
      source_name TEXT,
      source_type TEXT,
      scraped_at TEXT NOT NULL,
      state_id TEXT NOT NULL,
      county_id TEXT,
      confidence_score REAL,
      extraction_notes TEXT,
      raw_text_excerpt TEXT,
      suggested_target_table TEXT,
      suggested_target_id TEXT,
      duplicate_candidate_id TEXT,
      review_status TEXT DEFAULT 'pending_review',
      extracted_name TEXT NOT NULL,
      categories TEXT NOT NULL,
      extracted_phone TEXT NOT NULL,
      extracted_email TEXT,
      extracted_address TEXT NOT NULL,
      accepts_medi_cal INTEGER,
      evidence_level TEXT
    );
  `);

  const insert = db.prepare(`
    INSERT INTO staging_scraped_resource_providers (
      id, source_url, source_name, source_type, scraped_at, state_id, county_id, confidence_score,
      extraction_notes, raw_text_excerpt, suggested_target_table, suggested_target_id, duplicate_candidate_id,
      review_status, extracted_name, categories, extracted_phone, extracted_email, extracted_address,
      accepts_medi_cal, evidence_level
    ) VALUES (
      @id, @source_url, @source_name, @source_type, @scraped_at, @state_id, @county_id, @confidence_score,
      @extraction_notes, @raw_text_excerpt, @suggested_target_table, @suggested_target_id, @duplicate_candidate_id,
      @review_status, @extracted_name, @categories, @extracted_phone, @extracted_email, @extracted_address,
      @accepts_medi_cal, @evidence_level
    )
  `);

  const common = {
    source_name: '',
    source_type: 'lightweight_source_acquisition',
    scraped_at: '2026-06-18T02:30:42.579Z',
    confidence_score: 0.86,
    extraction_notes: '',
    raw_text_excerpt: '',
    suggested_target_table: '',
    suggested_target_id: '',
    duplicate_candidate_id: '',
    review_status: 'needs_manual_review',
    categories: 'providers_care',
    accepts_medi_cal: null,
    evidence_level: '',
  };

  insert.run({
    ...common,
    id: 1,
    state_id: 'florida',
    county_id: '',
    source_url: 'https://example.org/card',
    extracted_name: 'Center for Autism and Related Disabilities (CARD)',
    extracted_phone: '(904) 555-1212',
    extracted_email: '',
    extracted_address: '6271 St. Augustine Rd., Suite 1, Jacksonville, FL 32217',
  });

  insert.run({
    ...common,
    id: 2,
    state_id: 'tennessee',
    county_id: 'shelby-tn',
    source_url: 'https://example.org/kids',
    extracted_name: 'Best Place For Kids',
    extracted_phone: '(901) 555-1212',
    extracted_email: '',
    extracted_address: '848 Adams Avenue, Memphis, TN 38103',
  });

  insert.run({
    ...common,
    id: 3,
    state_id: 'illinois',
    county_id: 'washtenaw-mi',
    source_url: 'https://example.org/hope',
    extracted_name: 'Hope makes it easy to help.',
    extracted_phone: '(734) 555-1212',
    extracted_email: 'info@example.org',
    extracted_address: '518 Harriet St, Ypsilanti, MI 48197',
  });

  insert.run({
    ...common,
    id: 4,
    state_id: 'virginia',
    county_id: '',
    source_url: 'https://example.org/norfolk',
    extracted_name: 'Programs, Clinics, and Centers',
    extracted_phone: '(757) 555-1212',
    extracted_email: '',
    extracted_address: '601 Children’s Lane, Norfolk, VA 23507',
  });

  db.close();
}

function writeGeocodeArtifacts(tempRoot) {
  const geocodeDir = path.join(tempRoot, 'data', 'source-acquisition-runs', '2026-06-18T02-30-42-579Z', 'provider-county-geocode');
  fs.writeFileSync(path.join(geocodeDir, 'skipped.json'), `${JSON.stringify([
    {
      rowId: 1,
      sourceUrl: 'https://example.org/card',
      extractedName: 'Center for Autism and Related Disabilities (CARD)',
      reason: 'no_census_match',
      geoid: '',
    },
    {
      rowId: 4,
      sourceUrl: 'https://example.org/norfolk',
      extractedName: 'Programs, Clinics, and Centers',
      reason: 'county_equivalent_missing_from_repo',
      geoid: '51710',
    },
  ], null, 2)}\n`);
}

function testWorkflow() {
  const tempRoot = makeTempRepo();
  const dbPath = path.join(tempRoot, 'ca_disability_navigator.db');
  seedDb(dbPath);
  writeGeocodeArtifacts(tempRoot);

  const env = {
    ABLEFULL_REPO_ROOT: tempRoot,
    ABLEFULL_DB_PATH: dbPath,
    GENERATED_DATE: generatedDate,
  };

  runNode(['src/db/generate_provider_manual_review_queue.js'], env);
  const queuePath = path.join(tempRoot, 'docs', 'generated', `provider-manual-review-queue-${generatedDate}.json`);
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  assert.equal(queue.summary.totalRows, 4);
  assert.equal(queue.summary.byBlockerKey.county_geocode_no_match, 1);
  assert.equal(queue.summary.byBlockerKey.county_equivalent_missing_from_repo, 1);
  assert.equal(queue.summary.byBlockerKey.generic_name_with_county, 1);
  assert.equal(queue.summary.byBlockerKey.state_county_mismatch, 1);

  runNode(['scripts/apply-provider-manual-review-decisions.mjs', '--apply'], env);

  const db = new Database(dbPath, { readonly: true });
  const rows = db.prepare('SELECT id, review_status, extraction_notes, evidence_level FROM staging_scraped_resource_providers ORDER BY id').all();
  db.close();

  assert.equal(rows[0].review_status, 'blocked_county_geocode_no_match');
  assert.match(rows[0].extraction_notes, /county_geocode_no_match/);
  assert.equal(rows[0].evidence_level, 'deterministic_manual_review_blocker');

  assert.equal(rows[1].review_status, 'blocked_generic_provider_name');
  assert.equal(rows[2].review_status, 'blocked_state_county_mismatch');
  assert.equal(rows[3].review_status, 'blocked_county_equivalent_missing_from_repo');
  assert.match(rows[3].extraction_notes, /county_equivalent_missing_from_repo/);

  const ledgerPath = path.join(tempRoot, 'data', 'source-acquisition-state', 'provider-manual-review-ledger.json');
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  assert.equal(ledger.rows.length, 4);

  const decisionFilePath = path.join(tempRoot, 'data', 'provider-manual-review-decisions.json');
  const decisionFile = JSON.parse(fs.readFileSync(decisionFilePath, 'utf8'));
  assert.equal(decisionFile.rows.length, 4);
}

testWorkflow();

console.log('provider manual review workflow tests passed');
