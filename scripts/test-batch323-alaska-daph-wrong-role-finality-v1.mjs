import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch323_alaska_daph_wrong_role_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch323-alaska-daph-wrong-role-finality-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch323_alaska_daph_wrong_role_finality_v1');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(gap.status_reason, /Alaska Pioneer Homes Payment Assistance Program/);
assert.match(gap.status_reason, /OCS Regional Offices/);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(failure.evidence, /Alaska Pioneer Homes Payment Assistance Program/);
assert.match(failure.evidence, /wrong-service `\/ocs\/Pages\/offices\/default\.aspx`/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(verified.query_basis, /Pioneer Homes payment-assistance content/);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska Pioneer Homes Payment Assistance Program'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DAPH publications'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(next.evidence, /Payment Assistance Program/);

const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.equal(alaskaAudit.packetBatch, 'batch323_alaska_daph_wrong_role_finality_v1');

const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
assert.equal(alaskaQueue.primary_gap_reason, 'live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host');

assert.ok(stateReport.includes('Alaska Pioneer Homes payment-assistance leaves'));
assert.ok(allStateReport.includes('Alaska Pioneer Homes payment-assistance leaves'));
assert.ok(!allStateReport.includes('Oregon remains blocked'));
assert.ok(handoff.includes('## Current Focus State: Alaska'));
assert.ok(handoff.includes('Alaska Pioneer Homes Payment Assistance Program'));
assert.ok(handoff.includes('## Next State Order After Alaska'));
assert.ok(handoff.includes('1. Oklahoma'));
assert.ok(!handoff.includes('1. New York'));
assert.ok(!handoff.includes('3. Oregon'));

assert.equal(batchSummary.daph_payment_status, 200);
assert.match(batchSummary.daph_payment_title, /Payment Assistance Program/i);
assert.equal(batchSummary.daph_publications_status, 200);
assert.equal(batchSummary.ocs_offices_status, 200);
assert.match(batchSummary.ocs_offices_title, /OCS Regional Offices/i);
assert.ok(batchReport.includes('wrong-program content'));

console.log('test-batch323-alaska-daph-wrong-role-finality-v1: ok');
