import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch304OregonOfficeFinderComponentFinalityV1 } from './run-batch304-oregon-office-finder-component-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}
function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n').map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line));
}

const result = generateBatch304OregonOfficeFinderComponentFinalityV1();
const summary = readJson('data/generated/oregon_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oregon_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oregon_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oregon_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oregon_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/oregon-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch304_oregon_office_finder_component_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch304-oregon-office-finder-component-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.liveSuccessorOfficeFinderVerified, true);
assert.equal(result.customComponentShellVerified, true);
assert.equal(result.countyQueryProbeChangedSurface, false);
assert.equal(result.cityQueryProbeChangedSurface, false);
assert.equal(result.serviceQueryProbeChangedSurface, false);
assert.equal(result.apiLikeProbeChangedSurface, false);
assert.equal(result.jsonLikeProbeChangedSurface, false);

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_odhs_office_finder_is_only_a_custom_component_shell_with_no_public_county_extract_query_contract_or_api_surface');
assert.equal(summary.final_blockers[0].failure_code, 'live_office_finder_custom_component_stays_html_shell_under_query_and_api_like_probes');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_office_finder_shell_without_public_county_contract');
assert.match(countyGap.status_reason, /custom component shell/i);
assert.match(countyGap.status_reason, /api surface/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_office_finder_custom_component_stays_html_shell_under_query_and_api_like_probes');
assert.match(countyFailure.evidence, /<odhs-office-finder \/>/i);
assert.match(countyFailure.evidence, /\?service=SNAP/);
assert.match(countyFailure.evidence, /_api/);
assert.match(countyFailure.evidence, /\?format=json/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 6);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Live ODHS Office Finder successor root'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'API-like probe returns same shell'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'JSON-like probe returns same shell'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_live_odhs_office_finder_exposes_public_office_rows_or_county_owned_odhs_leaves_cover_all_36_counties');

const queueRow = queueRows.find((row) => row.state === 'oregon');
assert.equal(queueRow.primary_gap_reason, 'live_odhs_office_finder_is_only_a_custom_component_shell_with_no_public_county_extract_query_contract_or_api_surface');

const auditOregon = allStateAudit.states.find((row) => row.stateId === 'oregon');
assert.equal(auditOregon.packetBatch, 'batch_304_oregon_office_finder_component_finality_v1');
assert.equal(auditOregon.packetPrimaryGapReason, 'live_odhs_office_finder_is_only_a_custom_component_shell_with_no_public_county_extract_query_contract_or_api_surface');

assert.match(stateReport, /custom `<odhs-office-finder \/>` component/i);
assert.match(stateReport, /na[iï]ve public-contract probes.*same HTML shell instead of a data surface/i);
assert.match(allStateReport, /real custom office-finder component shell/i);

assert.match(handoff, /## Current Focus State: Oregon/);
assert.match(handoff, /custom `<odhs-office-finder \/>` component/);
assert.match(handoff, /1\. Ohio/);

assert.equal(batchSummary.customComponentShellVerified, true);
assert.equal(batchSummary.apiLikeProbeChangedSurface, false);
assert.match(batchReport, /real custom-component shell that still exposes no public data contract/i);

console.log('test-batch304-oregon-office-finder-component-finality-v1: ok');
