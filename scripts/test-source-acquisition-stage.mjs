import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { buildPromotionCandidate, mergePreservedStagingFields } from './source-acquisition-stage-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function makeRecord(overrides = {}) {
  return {
    recordId: 'test|family|id',
    parsedAt: '2026-06-17T00:00:00.000Z',
    stateId: 'texas',
    gapFamily: 'nonprofit_support',
    targetTable: 'nonprofit_organizations',
    sourceName: '',
    sourceUrl: 'https://example.org',
    finalUrl: 'https://example.org',
    pageTitle: 'Example Org',
    h1s: ['Example Org'],
    phones: ['(800) 555-1212'],
    emails: ['info@example.org'],
    addressLines: ['123 Main St, Austin, TX 78701'],
    textSample: 'Example sample text',
    familyExtraction: {
      organizationName: 'Example Org',
      publicContactSignalCount: 2,
    },
    ...overrides,
  };
}

function testNonprofitCandidate() {
  const candidate = buildPromotionCandidate(makeRecord());
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_nonprofit_organizations');
  assert.equal(candidate.row.display_status, 'needs_review');
  assert.equal(candidate.row.extracted_name, 'Example Org');
  assert.equal(candidate.row.extracted_phone, '(800) 555-1212');
}

function testDdCandidate() {
  const candidate = buildPromotionCandidate(makeRecord({
    gapFamily: 'dd_routing',
    targetTable: 'state_resource_agencies',
    familyExtraction: {
      officeName: 'County DD Office',
      contactPhone: '(610) 713-2330',
      contactEmail: 'help@example.gov',
      publicContactSignalCount: 2,
    },
    phones: ['(610) 713-2330'],
    emails: ['help@example.gov'],
    finalUrl: 'https://example.gov/dd',
    sourceUrl: 'https://example.gov/dd',
  }));
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_state_resource_agencies');
  assert.equal(candidate.row.display_status, 'needs_review');
  assert.equal(candidate.row.extracted_name, 'County DD Office');
  assert.equal(candidate.row.agency_type, 'dd_routing');
}

function testUnsupportedFamily() {
  const candidate = buildPromotionCandidate(makeRecord({
    gapFamily: 'programs_benefits',
    targetTable: 'programs',
    familyExtraction: {
      programName: 'Program Name',
      contactPhone: '(800) 555-1000',
    },
  }));
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_programs');
  assert.equal(candidate.row.display_status, 'needs_review');
  assert.equal(candidate.row.extracted_name, 'Program Name');
  assert.equal(candidate.row.program_type, 'programs_benefits');
  assert.equal(candidate.row.official_source_url, 'https://example.org');
}

function testFormsCandidate() {
  const candidate = buildPromotionCandidate(makeRecord({
    gapFamily: 'forms_guides',
    targetTable: 'forms_and_guides',
    sourceUrl: 'https://www.hhs.texas.gov/forms',
    finalUrl: 'https://www.hhs.texas.gov/forms',
    familyExtraction: {
      programName: 'Forms and Applications',
      officialDownloadUrl: 'https://www.hhs.texas.gov/forms/apply.pdf',
    },
  }));
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_forms');
  assert.equal(candidate.row.display_status, 'needs_review');
  assert.equal(candidate.row.program, 'Forms and Applications');
  assert.equal(candidate.row.official_download_url, 'https://www.hhs.texas.gov/forms/apply.pdf');
}

function testWaitlistCandidate() {
  const candidate = buildPromotionCandidate(makeRecord({
    gapFamily: 'program_waitlists',
    targetTable: 'program_waitlists',
    sourceUrl: 'https://www.hhs.texas.gov/doing-business-hhs/provider-portals/resources/interest-list-milestones',
    finalUrl: 'https://www.hhs.texas.gov/doing-business-hhs/provider-portals/resources/interest-list-milestones',
    familyExtraction: {
      programName: 'Texas HCBS Waiver Interest List',
      serviceSummary: 'Official waitlist milestone page for waiver interest lists.',
    },
  }));
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_waitlists');
  assert.equal(candidate.row.display_status, 'needs_review');
  assert.equal(candidate.row.name, 'Texas HCBS Waiver Interest List');
  assert.equal(candidate.row.program_id, '');
  assert.equal(candidate.row.estimate_source_type, 'official_state');
}

function testHelpResourceCandidate() {
  const candidate = buildPromotionCandidate(makeRecord({
    gapFamily: 'housing',
    targetTable: 'help_resources',
    familyExtraction: {
      organizationName: 'Example Housing Network',
      actionLinks: [{ href: 'https://example.org/apply', text: 'Apply now' }],
      serviceSummary: 'Housing navigation and rental support.',
    },
  }));
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_help_resources');
  assert.equal(candidate.row.display_status, 'needs_review');
  assert.equal(candidate.row.help_type, 'housing');
  assert.equal(candidate.row.action_url, 'https://example.org/apply');
}

function testKnowledgeCandidate() {
  const candidate = buildPromotionCandidate(makeRecord({
    gapFamily: 'knowledge_content',
    targetTable: 'knowledge_content',
    familyExtraction: {
      articleTitle: 'Understanding Regional Center Appeals',
      canonicalKnowledgeUrl: 'https://www.dds.ca.gov/appeals',
      contentCategory: 'knowledge_content',
      summaryText: 'An explainer for families about appeals and next steps.',
    },
  }));
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_knowledge_content');
  assert.equal(candidate.row.display_status, 'needs_review');
  assert.equal(candidate.row.title, 'Understanding Regional Center Appeals');
}

function testCountyOfficeCandidateCarriesIhssProgramId() {
  const candidate = buildPromotionCandidate(makeRecord({
    gapFamily: 'medicaid_hhs_offices',
    targetTable: 'county_offices',
    sourceRole: 'county_ihss_entry_from_cdss_directory',
    sourceUrl: 'https://socialservices.example.ca.gov/ihss',
    finalUrl: 'https://socialservices.example.ca.gov/ihss',
    familyExtraction: {
      officeName: 'County Social Services Agency',
      contactPhone: '(510) 263-2420',
      contactAddress: '8477 Enterprise Way, Oakland, CA 94621',
      publicContactSignalCount: 2,
    },
    phones: ['(510) 263-2420'],
    addressLines: ['8477 Enterprise Way, Oakland, CA 94621'],
  }));
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_county_offices');
  assert.equal(candidate.row.program_id, 'ihss-for-children');
}

function testEducationRegionalCandidate() {
  const candidate = buildPromotionCandidate(makeRecord({
    gapFamily: 'education_routing',
    targetTable: 'regional_education_agencies',
    sourceUrl: 'https://www.cde.ca.gov/sp/se/as/caselpas.asp',
    finalUrl: 'https://www.cde.ca.gov/sp/se/as/caselpas.asp',
    familyExtraction: {
      officeName: 'California Special Education Local Plan Areas',
      contactPhone: '(916) 445-4613',
      publicContactSignalCount: 2,
    },
    phones: ['(916) 445-4613'],
  }));
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_regional_education_agencies');
  assert.equal(candidate.row.display_status, 'needs_review');
  assert.equal(candidate.row.extracted_name, 'California Special Education Local Plan Areas');
  assert.equal(candidate.row.agency_type, 'education_routing');
}

function testEducationDistrictCandidate() {
  const candidate = buildPromotionCandidate(makeRecord({
    gapFamily: 'education_routing',
    targetTable: 'school_districts',
    countyId: 'travis-tx',
    familyExtraction: {
      officeName: 'Austin ISD Special Education',
      contactPhone: '(512) 414-1700',
      contactEmail: 'specialeducation@austinisd.org',
      countyId: 'travis-tx',
      publicContactSignalCount: 2,
    },
    phones: ['(512) 414-1700'],
    emails: ['specialeducation@austinisd.org'],
    finalUrl: 'https://www.austinisd.org/special-education',
    sourceUrl: 'https://www.austinisd.org/special-education',
  }));
  assert.equal(candidate.supported, true);
  assert.equal(candidate.stagingTable, 'staging_scraped_school_districts');
  assert.equal(candidate.row.display_status, 'needs_review');
  assert.equal(candidate.row.county_id, 'travis-tx');
  assert.equal(candidate.row.spec_ed_contact_phone, '(512) 414-1700');
}

function testPreserveExistingCountyFields() {
  const merged = mergePreservedStagingFields(
    'staging_scraped_resource_providers',
    {
      source_url: 'https://example.org',
      state_id: 'texas',
      county_id: null,
      evidence_level: null,
      extracted_name: 'Example Provider',
    },
    {
      county_id: 'travis-tx',
      evidence_level: 'census_batch_geocode',
    },
  );

  assert.equal(merged.county_id, 'travis-tx');
  assert.equal(merged.evidence_level, 'census_batch_geocode');
}

function testStageScriptFailsClosedWhenRequestedFamilyHasNoAcceptedRows() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'stage-fail-closed-'));
  fs.mkdirSync(path.join(fixtureRoot, 'data', 'source-acquisition-runs', 'run-1', 'validated'), { recursive: true });
  fs.writeFileSync(
    path.join(fixtureRoot, 'ca_disability_navigator.db'),
    '',
  );

  const result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'run-source-acquisition-stage.mjs'), '--run-id=run-1', '--family=providers_care', '--mode=apply'], {
    cwd: fixtureRoot,
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /No accepted validated rows found for family "providers_care"/);
}

function testStageScriptDryRunNoOpsWhenRequestedFamilyHasNoAcceptedRows() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'stage-dry-run-empty-'));
  fs.mkdirSync(path.join(fixtureRoot, 'data', 'source-acquisition-runs', 'run-1', 'validated'), { recursive: true });

  const result = spawnSync(
    process.execPath,
    [path.join(repoRoot, 'scripts', 'run-source-acquisition-stage.mjs'), '--run-id=run-1', '--family=knowledge_content', '--mode=dry-run'],
    {
      cwd: fixtureRoot,
      encoding: 'utf8',
    }
  );

  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout.trim());
  assert.equal(payload.family, 'knowledge_content');
  assert.equal(payload.noAcceptedRows, true);

  const summaryPath = path.join(
    fixtureRoot,
    'data',
    'source-acquisition-runs',
    'run-1',
    'staged',
    'knowledge_content',
    'promotion-summary.json'
  );
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  assert.equal(summary.noAcceptedRows, true);
  assert.equal(summary.acceptedInputCount, 0);
}

async function testStageScriptWaitsForRequestedFamilyAcceptedRows() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'stage-race-'));
  const runId = 'run-1';
  const validatedRoot = path.join(fixtureRoot, 'data', 'source-acquisition-runs', runId, 'validated');
  fs.mkdirSync(path.join(fixtureRoot, 'data', 'source-acquisition-runs', runId), { recursive: true });

  const db = new Database(path.join(fixtureRoot, 'ca_disability_navigator.db'));
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
  db.close();

  const proc = spawn(
    process.execPath,
    [path.join(repoRoot, 'scripts', 'run-source-acquisition-stage.mjs'), `--run-id=${runId}`, '--family=providers_care', '--mode=apply'],
    { cwd: fixtureRoot, stdio: ['ignore', 'pipe', 'pipe'] },
  );

  let stdout = '';
  let stderr = '';
  proc.stdout.on('data', (chunk) => {
    stdout += chunk;
  });
  proc.stderr.on('data', (chunk) => {
    stderr += chunk;
  });

  await new Promise((resolve) => setTimeout(resolve, 250));

  const familyDir = path.join(validatedRoot, 'providers_care');
  fs.mkdirSync(familyDir, { recursive: true });
  fs.writeFileSync(
    path.join(familyDir, 'accepted.ndjson'),
    `${JSON.stringify({
      recordId: 'provider-1',
      parsedAt: '2026-06-18T00:00:00.000Z',
      stateId: 'texas',
      gapFamily: 'providers_care',
      sourceName: 'Example Provider',
      sourceUrl: 'https://example.org/provider',
      finalUrl: 'https://example.org/provider',
      pageTitle: 'Example Provider',
      h1s: ['Example Provider'],
      phones: ['(512) 555-0100'],
      emails: [],
      addressLines: ['100 Main St, Austin, TX 78701'],
      textSample: 'Example provider text',
      familyExtraction: {
        organizationName: 'Example Provider',
        contactPhone: '(512) 555-0100',
        contactAddress: '100 Main St, Austin, TX 78701',
      },
      validationStatus: 'accepted',
      validationReasons: [],
    })}\n`,
  );

  const exitCode = await new Promise((resolve) => proc.on('close', resolve));
  assert.equal(exitCode, 0, stderr);
  const jsonStart = stdout.indexOf('{');
  const output = JSON.parse(stdout.slice(jsonStart));
  assert.equal(output.familyCount, 1);
  assert.equal(output.families[0].family, 'providers_care');
  assert.equal(output.families[0].supportedCount, 1);
}

function testStageScriptPreservesDistinctProviderRowsFromSameSource() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'stage-provider-keys-'));
  const validatedDir = path.join(fixtureRoot, 'data', 'source-acquisition-runs', 'run-1', 'validated', 'providers_care');
  fs.mkdirSync(validatedDir, { recursive: true });

  const acceptedRows = [
    {
      recordId: 'provider-1',
      parsedAt: '2026-06-18T00:00:00.000Z',
      stateId: 'texas',
      gapFamily: 'providers_care',
      sourceName: 'Example Children Hospital',
      sourceUrl: 'https://example.org/providers',
      finalUrl: 'https://example.org/providers',
      pageTitle: 'Example Provider Directory',
      h1s: ['Example Provider Directory'],
      phones: ['(512) 111-1111'],
      emails: ['alpha@example.org'],
      addressLines: ['100 Main St, Austin, TX 78701'],
      textSample: 'Alpha clinic text',
      familyExtraction: {
        organizationName: 'Alpha Clinic',
        contactPhone: '(512) 111-1111',
        contactEmail: 'alpha@example.org',
        contactAddress: '100 Main St, Austin, TX 78701',
      },
      validationStatus: 'accepted',
      validationReasons: [],
    },
    {
      recordId: 'provider-2',
      parsedAt: '2026-06-18T00:00:00.000Z',
      stateId: 'texas',
      gapFamily: 'providers_care',
      sourceName: 'Example Children Hospital',
      sourceUrl: 'https://example.org/providers',
      finalUrl: 'https://example.org/providers',
      pageTitle: 'Example Provider Directory',
      h1s: ['Example Provider Directory'],
      phones: ['(512) 222-2222'],
      emails: ['beta@example.org'],
      addressLines: ['200 Main St, Austin, TX 78701'],
      textSample: 'Beta clinic text',
      familyExtraction: {
        organizationName: 'Beta Clinic',
        contactPhone: '(512) 222-2222',
        contactEmail: 'beta@example.org',
        contactAddress: '200 Main St, Austin, TX 78701',
      },
      validationStatus: 'accepted',
      validationReasons: [],
    },
  ];

  fs.writeFileSync(
    path.join(validatedDir, 'accepted.ndjson'),
    `${acceptedRows.map((row) => JSON.stringify(row)).join('\n')}\n`,
  );

  const db = new Database(path.join(fixtureRoot, 'ca_disability_navigator.db'));
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
  db.close();

  const result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'run-source-acquisition-stage.mjs'), '--run-id=run-1', '--family=providers_care', '--mode=apply'], {
    cwd: fixtureRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  const jsonStart = result.stdout.indexOf('{');
  const output = JSON.parse(result.stdout.slice(jsonStart));
  assert.equal(output.familyCount, 1);
  assert.equal(output.dbStats.inserted, 2);

  const verifyDb = new Database(path.join(fixtureRoot, 'ca_disability_navigator.db'), { readonly: true });
  const stagedCount = verifyDb.prepare('SELECT COUNT(*) AS count FROM staging_scraped_resource_providers').get().count;
  const names = verifyDb.prepare('SELECT extracted_name FROM staging_scraped_resource_providers ORDER BY extracted_name').all().map((row) => row.extracted_name);
  verifyDb.close();

  assert.equal(stagedCount, 2);
  assert.deepEqual(names, ['Alpha Clinic', 'Beta Clinic']);
}

function testStageScriptAppliesWaitlistWithProgramInference() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'stage-waitlist-apply-'));
  const validatedDir = path.join(fixtureRoot, 'data', 'source-acquisition-runs', 'run-1', 'validated', 'program_waitlists');
  fs.mkdirSync(validatedDir, { recursive: true });

  const acceptedRow = {
    recordId: 'waitlist-1',
    parsedAt: '2026-06-19T00:00:00.000Z',
    stateId: 'texas',
    gapFamily: 'program_waitlists',
    targetTable: 'program_waitlists',
    sourceName: 'Texas HHS Waitlist',
    sourceUrl: 'https://www.hhs.texas.gov/interest-list',
    finalUrl: 'https://www.hhs.texas.gov/interest-list',
    pageTitle: 'Interest List Milestones',
    h1s: ['Interest List Milestones'],
    phones: ['(800) 458-9858'],
    emails: [],
    addressLines: [],
    textSample: 'Official Texas waiver interest list page.',
    familyExtraction: {
      programName: 'HCS Waiver',
      serviceSummary: 'Official waitlist page for HCS Waiver.',
    },
    validationStatus: 'accepted',
    validationReasons: [],
  };

  fs.writeFileSync(
    path.join(validatedDir, 'accepted.ndjson'),
    `${JSON.stringify(acceptedRow)}\n`,
  );

  const db = new Database(path.join(fixtureRoot, 'ca_disability_navigator.db'));
  db.exec(`
    CREATE TABLE programs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      state_id TEXT NOT NULL,
      official_source_url TEXT,
      source_url TEXT
    );
    CREATE TABLE program_waitlists (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL,
      name TEXT NOT NULL,
      duration_label TEXT NOT NULL,
      duration_months REAL NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      reserve_capacity_notice TEXT,
      legal_deadline TEXT,
      last_scraped_at TEXT NOT NULL,
      estimate_source_url TEXT,
      estimate_source_type TEXT,
      last_checked_at TEXT
    );
    CREATE TABLE staging_scraped_waitlists (
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
      program_id TEXT NOT NULL,
      name TEXT NOT NULL,
      duration_label TEXT NOT NULL,
      duration_months REAL NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      estimate_source_url TEXT,
      estimate_source_type TEXT,
      last_checked_at TEXT
    );
  `);
  db.prepare(`
    INSERT INTO programs (id, name, state_id, official_source_url, source_url)
    VALUES (?, ?, ?, ?, ?)
  `).run('tx-hcs-waiver', 'HCS Waiver', 'texas', 'https://www.hhs.texas.gov/interest-list', 'https://www.hhs.texas.gov/interest-list');
  db.close();

  const result = spawnSync(
    process.execPath,
    [path.join(repoRoot, 'scripts', 'run-source-acquisition-stage.mjs'), '--run-id=run-1', '--family=program_waitlists', '--mode=apply'],
    {
      cwd: fixtureRoot,
      encoding: 'utf8',
    }
  );

  assert.equal(result.status, 0, result.stderr);
  const verifyDb = new Database(path.join(fixtureRoot, 'ca_disability_navigator.db'), { readonly: true });
  const staged = verifyDb.prepare(`
    SELECT program_id, name, estimate_source_url, estimate_source_type
    FROM staging_scraped_waitlists
  `).get();
  verifyDb.close();

  assert.equal(staged.program_id, 'tx-hcs-waiver');
  assert.equal(staged.name, 'HCS Waiver');
  assert.equal(staged.estimate_source_url, 'https://www.hhs.texas.gov/interest-list');
  assert.equal(staged.estimate_source_type, 'official_state');
}

testNonprofitCandidate();
testDdCandidate();
testUnsupportedFamily();
testFormsCandidate();
testWaitlistCandidate();
testHelpResourceCandidate();
testKnowledgeCandidate();
testCountyOfficeCandidateCarriesIhssProgramId();
testEducationRegionalCandidate();
testEducationDistrictCandidate();
testPreserveExistingCountyFields();
testStageScriptFailsClosedWhenRequestedFamilyHasNoAcceptedRows();
testStageScriptDryRunNoOpsWhenRequestedFamilyHasNoAcceptedRows();
await testStageScriptWaitsForRequestedFamilyAcceptedRows();
testStageScriptPreservesDistinctProviderRowsFromSameSource();
testStageScriptAppliesWaitlistWithProgramInference();

console.log('source acquisition staging tests passed');
