import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDate = '2026-06-18';
const runId = '2026-06-18T03-12-43-955Z';

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
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'advocate-manual-review-'));
  fs.mkdirSync(path.join(tempRoot, 'docs', 'generated'), { recursive: true });
  fs.mkdirSync(path.join(tempRoot, 'data', 'source-acquisition-state'), { recursive: true });
  fs.mkdirSync(path.join(tempRoot, 'data', 'source-acquisition-runs', runId, 'staged', 'advocates-legal'), { recursive: true });
  return tempRoot;
}

function seedDb(dbPath) {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE staging_scraped_iep_advocates (
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
      credentials TEXT NOT NULL,
      experience_years INTEGER,
      price_rate TEXT,
      counties_served TEXT,
      languages_spoken TEXT,
      extracted_phone TEXT NOT NULL,
      extracted_email TEXT NOT NULL,
      extracted_website TEXT NOT NULL,
      specialties TEXT,
      description TEXT
    );
  `);

  const insert = db.prepare(`
    INSERT INTO staging_scraped_iep_advocates (
      id, source_url, source_name, source_type, scraped_at, state_id, county_id, confidence_score,
      extraction_notes, raw_text_excerpt, suggested_target_table, suggested_target_id, duplicate_candidate_id,
      review_status, extracted_name, credentials, experience_years, price_rate, counties_served, languages_spoken,
      extracted_phone, extracted_email, extracted_website, specialties, description
    ) VALUES (
      @id, @source_url, @source_name, @source_type, @scraped_at, @state_id, @county_id, @confidence_score,
      @extraction_notes, @raw_text_excerpt, @suggested_target_table, @suggested_target_id, @duplicate_candidate_id,
      @review_status, @extracted_name, @credentials, @experience_years, @price_rate, @counties_served, @languages_spoken,
      @extracted_phone, @extracted_email, @extracted_website, @specialties, @description
    )
  `);

  const common = {
    source_type: 'lightweight_source_acquisition',
    scraped_at: '2026-06-18T03:13:46.449Z',
    confidence_score: 0.82,
    extraction_notes: '',
    raw_text_excerpt: '',
    suggested_target_table: 'iep_advocates',
    suggested_target_id: '',
    duplicate_candidate_id: '',
    review_status: 'pending_review',
    credentials: '',
    experience_years: null,
    price_rate: '',
    counties_served: '',
    languages_spoken: '',
    specialties: '',
    description: '',
  };

  insert.run({
    ...common,
    id: 1,
    source_url: 'https://sites.ed.gov/idea/idea-files/osep-memo-and-qa-on-dispute-resolution/',
    source_name: 'Individuals with Disabilities Education Act',
    state_id: 'national',
    county_id: '',
    extracted_name: 'Individuals with Disabilities Education Act',
    extracted_phone: '(202) 245-7309',
    extracted_email: 'osersguidancecomments@ed.gov',
    extracted_website: 'https://sites.ed.gov/idea/idea-files/osep-memo-and-qa-on-dispute-resolution/',
  });

  insert.run({
    ...common,
    id: 2,
    source_url: 'https://www.parentcenterhub.org/find-your-center/',
    source_name: 'Find Your Parent Center',
    state_id: 'national',
    county_id: '',
    extracted_name: 'Find Your Parent Center',
    extracted_phone: '(973) 642-8100',
    extracted_email: '',
    extracted_website: 'https://www.parentcenterhub.org/find-your-center/',
  });

  insert.run({
    ...common,
    id: 3,
    source_url: 'https://special-ed-advocate-frisco.com/',
    source_name: 'Special Education Advocate Frisco Texas',
    state_id: 'texas',
    county_id: '',
    extracted_name: 'Special Education Advocate Frisco Texas',
    extracted_phone: '',
    extracted_email: '',
    extracted_website: 'https://special-ed-advocate-frisco.com/',
  });

  db.close();
}

function writeCandidates(tempRoot) {
  const candidatesPath = path.join(tempRoot, 'data', 'source-acquisition-runs', runId, 'staged', 'advocates-legal', 'promotion-candidates.ndjson');
  const rows = [
    { id: 1, source_url: 'https://sites.ed.gov/idea/idea-files/osep-memo-and-qa-on-dispute-resolution/', state_id: 'national', extracted_name: 'Individuals with Disabilities Education Act' },
    { id: 2, source_url: 'https://www.parentcenterhub.org/find-your-center/', state_id: 'national', extracted_name: 'Find Your Parent Center' },
    { id: 3, source_url: 'https://special-ed-advocate-frisco.com/', state_id: 'texas', extracted_name: 'Special Education Advocate Frisco Texas' },
  ];
  const ndjson = rows.map((row) => JSON.stringify({ candidate: { row } })).join('\n');
  fs.writeFileSync(candidatesPath, `${ndjson}\n`);
}

function testWorkflow() {
  const tempRoot = makeTempRepo();
  const dbPath = path.join(tempRoot, 'ca_disability_navigator.db');
  seedDb(dbPath);
  writeCandidates(tempRoot);

  const env = {
    ABLEFULL_REPO_ROOT: tempRoot,
    ABLEFULL_DB_PATH: dbPath,
    GENERATED_DATE: generatedDate,
  };

  runNode(['src/db/generate_advocate_manual_review_queue.js', `--run-id=${runId}`], env);
  const queuePath = path.join(tempRoot, 'docs', 'generated', `advocate-manual-review-queue-${generatedDate}.json`);
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  assert.equal(queue.summary.totalRows, 3);
  assert.equal(queue.summary.byBlockerKey.national_guidance_not_local_advocate, 1);
  assert.equal(queue.summary.byBlockerKey.national_directory_requires_state_slice, 1);
  assert.equal(queue.summary.byBlockerKey.missing_advocate_county_resolution, 1);

  runNode(['scripts/apply-advocate-manual-review-decisions.mjs', '--apply'], env);

  const db = new Database(dbPath, { readonly: true });
  const rows = db.prepare('SELECT id, review_status, extraction_notes FROM staging_scraped_iep_advocates ORDER BY id').all();
  db.close();

  assert.equal(rows[0].review_status, 'blocked_national_advocate_guidance');
  assert.match(rows[0].extraction_notes, /national_guidance_not_local_advocate/);
  assert.equal(rows[1].review_status, 'blocked_national_directory_state_slice_required');
  assert.equal(rows[2].review_status, 'blocked_missing_advocate_county_resolution');

  const ledgerPath = path.join(tempRoot, 'data', 'source-acquisition-state', 'advocate-manual-review-ledger.json');
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  assert.equal(ledger.rows.length, 3);

  const decisionFilePath = path.join(tempRoot, 'data', 'advocate-manual-review-decisions.json');
  const decisionFile = JSON.parse(fs.readFileSync(decisionFilePath, 'utf8'));
  assert.equal(decisionFile.rows.length, 3);
}

testWorkflow();

console.log('advocate manual review workflow tests passed');
