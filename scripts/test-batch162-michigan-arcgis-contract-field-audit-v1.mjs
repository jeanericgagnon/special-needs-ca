import fs from 'fs';
import path from 'path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch162MichiganArcgisContractFieldAuditV1 } from './run-batch162-michigan-arcgis-contract-field-audit-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch162MichiganArcgisContractFieldAuditV1();

const summary = readJson('data/generated/michigan_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/michigan_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/michigan_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/michigan_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/michigan_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch162_michigan_arcgis_contract_field_audit_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/michigan-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_mde_arcgis_district_and_isd_layers_expose_geometry_and_ids_without_local_routing_contract');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationGap.status_reason, /district and ISD layers expose geometry and identifier fields only/i);
assert.match(educationGap.status_reason, /school layer carries address-like fields/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationFailure.evidence, /FIPSCODE, FIPSNUM, NAME, LABEL, TYPE, DCODE, and ISD/i);
assert.match(educationFailure.evidence, /ISDCode/i);
assert.match(educationFailure.evidence, /STREET and CITY/i);
assert.match(educationFailure.evidence, /no district routing contacts/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationVerified.query_basis, /district, ISD, and school layer metadata/i);
assert.match(educationVerified.blocker_evidence, /identifier geometry fields/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_blocked_until_official_district_or_isd_routing_contract_exists');
assert.equal(batchSummary.education_blocker_sharpened, true);
assert.equal(batchSummary.blocker_basis, 'arcgis_layer_metadata_contract_audit');
assert.match(report, /boundaries and identifiers only/i);
assert.match(lessons, /ArcGIS Layer Metadata Can Close The Routing Question Without Feature Scraping/);

console.log('test-batch162-michigan-arcgis-contract-field-audit-v1: ok');
