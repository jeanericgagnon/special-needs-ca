import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-publish-decision-'));

const generatedDir = path.join(tmp, 'data', 'generated');
const runsDir = path.join(tmp, 'data', 'source-acquisition-runs', 'ca-v3', 'staged', 'dd_routing');
fs.mkdirSync(generatedDir, { recursive: true });
fs.mkdirSync(runsDir, { recursive: true });

const publishable = {
  runId: 'ca-v3',
  recordId: 'publishable',
  family: 'dd_routing',
  stateId: 'california',
  authority: 'official_regional_center',
  agency: 'Alta California Regional Center',
  provenanceUrl: 'https://www.dds.ca.gov/rc/listings/',
  sourceRole: 'regional_center_root_from_dds_directory',
  sourceUrl: 'https://www.altaregional.org',
  finalUrl: 'https://www.altaregional.org/',
  artifactPath: 'data/source-acquisition-runs/ca-v3/raw/x.html',
  sha256: 'abc123',
  fetchedAt: '2026-06-20T20:20:19.705Z',
  pageTitle: 'Alta California Regional Center',
  entityType: 'agency',
  destinationTable: 'state_resource_agencies',
  semanticStatus: 'stage_ready',
  classificationReason: 'regional_center_root_page',
  confidenceScore: 1,
  reasons: [],
  requiredFieldCount: 6,
  requiredFieldCoveredCount: 6,
  requiredFieldCompleteness: 1,
  unsupportedDefaultedFieldCount: 0,
  fieldEvidenceCoverage: 0.67,
  stageDecision: 'stage_ready',
  fieldEntries: [],
};

const needsReview = {
  ...publishable,
  recordId: 'needs-review',
  fieldEvidenceCoverage: 0.2,
};

const unsafeCountyOffice = {
  ...publishable,
  recordId: 'unsafe-county-office',
  family: 'medicaid_hhs_offices',
  authority: 'official_county',
  agency: 'San Joaquin County',
  sourceRole: 'county_ihss_entry_from_cdss_directory',
  sourceUrl: 'https://www.sjchsa.org/Aging-Services',
  finalUrl: 'https://www.sjchsa.org/Aging-Services',
  pageTitle: 'Aging Services',
  entityType: 'office',
  destinationTable: 'county_offices',
  classificationReason: 'local_office_contact_signals_present',
  fieldEvidenceCoverage: 1,
  fieldEntries: [
    { field: 'office_name', value: 'Aging Services' },
    { field: 'phone', value: '(209) 468-1104' },
    { field: 'address', value: '333 E Washington Street, Stockton, CA 95202-3200' },
    { field: 'website', value: 'https://www.sjchsa.org/Aging-Services' },
  ],
};

fs.writeFileSync(
  path.join(generatedDir, 'ca_v4_stage_ready.jsonl'),
  [publishable, needsReview, unsafeCountyOffice].map((row) => JSON.stringify(row)).join('\n') + '\n',
);

fs.writeFileSync(
  path.join(runsDir, 'promotion-candidates.ndjson'),
  [
    { recordId: 'publishable', candidate: { row: { display_status: 'needs_review' } } },
    { recordId: 'needs-review', candidate: { row: { display_status: 'needs_review' } } },
    { recordId: 'unsafe-county-office', candidate: { row: { display_status: 'published' } } },
  ].map((row) => JSON.stringify(row)).join('\n') + '\n',
);

let result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'run-ca-source-pack-publish-decision-v1.mjs'), '--input-dir=' + generatedDir, '--prefix=ca_v4'], {
  cwd: repoRoot,
  encoding: 'utf8',
});
assert.equal(result.status, 0, result.stderr);

const decisions = fs.readFileSync(path.join(generatedDir, 'ca_publish_decisions_v1.jsonl'), 'utf8')
  .split('\n').filter(Boolean).map((line) => JSON.parse(line));
assert.equal(decisions.find((row) => row.recordId === 'publishable').displayStatusDecision, 'published');
assert.equal(decisions.find((row) => row.recordId === 'needs-review').displayStatusDecision, 'needs_review');
assert.equal(decisions.find((row) => row.recordId === 'unsafe-county-office').displayStatusDecision, 'needs_review');
assert.equal(decisions.find((row) => row.recordId === 'unsafe-county-office').reasons.includes('county_office_not_public_safe'), true);

result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'apply-ca-source-pack-publish-decisions-v1.mjs'), '--input-dir=' + generatedDir, '--runs-dir=' + path.join(tmp, 'data', 'source-acquisition-runs'), '--run-id=ca-v3'], {
  cwd: repoRoot,
  encoding: 'utf8',
});
assert.equal(result.status, 0, result.stderr);

const staged = fs.readFileSync(path.join(runsDir, 'promotion-candidates.ndjson'), 'utf8')
  .split('\n').filter(Boolean).map((line) => JSON.parse(line));
assert.equal(staged.find((row) => row.recordId === 'publishable').candidate.row.display_status, 'published');
assert.equal(staged.find((row) => row.recordId === 'needs-review').candidate.row.display_status, 'needs_review');
assert.equal(staged.find((row) => row.recordId === 'unsafe-county-office').candidate.row.display_status, 'needs_review');

console.log('ca source pack publish decision tests passed');
