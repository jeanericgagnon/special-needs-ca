import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch296OregonOfficeFinderShellFinalityV1 } from './run-batch296-oregon-office-finder-shell-finality-v1.mjs';

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

const result = generateBatch296OregonOfficeFinderShellFinalityV1();
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
const batchSummary = readJson('data/generated/batch296_oregon_office_finder_shell_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch296-oregon-office-finder-shell-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.liveSuccessorOfficeFinderVerified, true);
assert.equal(result.countyQueryProbeChangedSurface, false);
assert.equal(result.cityQueryProbeChangedSurface, false);
assert.equal(result.publicCountyListInHtml, false);
assert.equal(result.publicSearchSurfaceFound, false);
assert.equal(result.publicSitemapSurfaceFound, false);

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_odhs_office_finder_is_only_a_sharepoint_leaflet_shell_with_no_public_county_extract_or_query_contract');
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].failure_code, 'live_office_finder_shell_has_no_public_office_rows_county_list_or_search_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_office_finder_shell_without_public_county_contract');
assert.match(countyGap.status_reason, /no office rows, county list, or public result contract/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_office_finder_shell_has_no_public_office_rows_county_list_or_search_contract');
assert.match(countyFailure.evidence, /leaflet/i);
assert.match(countyFailure.evidence, /generic help text/i);
assert.match(countyFailure.evidence, /\?county=Baker/);
assert.match(countyFailure.evidence, /search surfaces return 404/i);
assert.match(countyFailure.evidence, /61 DOI-backed planning rows/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_live_office_finder_shell_without_public_county_contract');
assert.equal(countyVerified.sample_count, 4);
assert.equal(countyVerified.samples.some((row) => row.sample_name === 'Live ODHS Office Finder successor root'), true);
assert.equal(countyVerified.samples.some((row) => row.sample_name === 'Bounded county query returns same generic shell'), true);
assert.equal(countyVerified.samples.some((row) => row.sample_name === 'Bounded city query returns same generic shell'), true);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_live_odhs_office_finder_exposes_public_office_rows_or_county_owned_odhs_leaves_cover_all_36_counties');

const queueRow = queueRows.find((row) => row.state === 'oregon');
assert.equal(queueRow.primary_gap_reason, 'live_odhs_office_finder_is_only_a_sharepoint_leaflet_shell_with_no_public_county_extract_or_query_contract');

const auditOregon = allStateAudit.states.find((row) => row.stateId === 'oregon');
assert.equal(auditOregon.packetPrimaryGapReason, 'live_odhs_office_finder_is_only_a_sharepoint_leaflet_shell_with_no_public_county_extract_or_query_contract');
assert.equal(auditOregon.familyStatuses.county_local_disability_resources, 'blocked_live_office_finder_shell_without_public_county_contract');

assert.match(stateReport, /sharepoint\/leaflet app shell/i);
assert.match(stateReport, /\?county=Baker/);
assert.match(allStateReport, /Oregon remains blocked, but the blocker is now narrowed to a live official ODHS office-finder app shell/i);

assert.match(handoff, /## Current Focus State: Oregon/);
assert.match(handoff, /Office Finder county query probe/);
assert.match(handoff, /1\. Ohio/);

assert.equal(batchSummary.liveSuccessorOfficeFinderVerified, true);
assert.equal(batchSummary.publicCountyListInHtml, false);
assert.match(batchReport, /replaced the generic Oregon office-finder blocker with the live app-shell reality/i);

console.log('test-batch296-oregon-office-finder-shell-finality-v1: ok');
