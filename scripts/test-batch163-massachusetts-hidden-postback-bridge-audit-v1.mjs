import fs from 'fs';
import path from 'path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch163MassachusettsHiddenPostbackBridgeAuditV1 } from './run-batch163-massachusetts-hidden-postback-bridge-audit-v1.mjs';

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

generateBatch163MassachusettsHiddenPostbackBridgeAuditV1();

const summary = readJson('data/generated/massachusetts_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch163_massachusetts_hidden_postback_bridge_audit_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_dese_hidden_postback_bridge_renders_real_district_rows_but_no_county_contract_and_mass_gov_dds_lane_is_host_wide_403');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationGap.status_reason, /hidden-field auto-post bridge/i);
assert.match(educationGap.status_reason, /real rendered `search\.aspx` result page/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationFailure.evidence, /hidden-field passForm/i);
assert.match(educationFailure.evidence, /__VIEWSTATE/i);
assert.match(educationFailure.evidence, /Bristol County Agricultural/i);
assert.match(educationFailure.evidence, /no county column, county filter, or county export contract/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationVerified.query_basis, /auto-post bridge plus the final rendered search\.aspx district results page/i);
assert.match(educationVerified.blocker_evidence, /official DESE postback bridge is real/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'use_massachusetts_dese_postback_packet_and_hold_blocked_until_official_county_to_district_contract_exists');
assert.equal(batchSummary.education_blocker_sharpened, true);
assert.equal(batchSummary.blocker_basis, 'hidden_postback_bridge_audit');
assert.match(report, /hidden-field handoff/i);
assert.match(lessons, /Auto-Post Directory Bridges Must Be Audited At The Final Rendered Page/);

console.log('test-batch163-massachusetts-hidden-postback-bridge-audit-v1: ok');
