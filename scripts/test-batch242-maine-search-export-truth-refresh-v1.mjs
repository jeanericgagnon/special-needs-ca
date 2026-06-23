import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch242MaineSearchExportTruthRefreshV1 } from './run-batch242-maine-search-export-truth-refresh-v1.mjs';

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

const result = generateBatch242MaineSearchExportTruthRefreshV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/maine_district_or_county_education_routing_manual_export_packet_v1.json');
const batchSummary = readJson('data/generated/batch242_maine_search_export_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch242-maine-search-export-truth-refresh-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'public_maine_sau_selectors_and_workbook_are_live_but_search_and_export_replays_still_500_and_dhhs_office_html_has_no_county_contract');
assert.equal(queueRows.find((row) => row.state === 'maine').primary_gap_reason, 'public_maine_sau_selectors_and_workbook_are_live_but_search_and_export_replays_still_500_and_dhhs_office_html_has_no_county_contract');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_live_public_sau_selectors_and_workbook_but_search_and_export_replays_still_500');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_live_public_sau_selectors_and_workbook_but_search_and_export_replays_still_500');
assert.match(gap.status_reason, /action:CSearchBySAU/i);
assert.match(gap.status_reason, /action:SAUExport/i);
assert.match(gap.status_reason, /HTTP 500/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'live_public_sau_selectors_and_workbook_exist_but_search_and_export_replays_still_500');
assert.match(failure.evidence, /OrgId=42/i);
assert.match(failure.evidence, /action:CSearchBySAU/i);
assert.match(failure.evidence, /action:SAUExport/i);
assert.match(failure.evidence, /HTTP 500/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_live_public_sau_selectors_and_workbook_but_search_and_export_replays_still_500');
assert.equal(verified.sample_count, 6);
assert.ok(verified.samples.some((sample) => sample.source_type === 'official_raw_search_500_shell'));
assert.ok(verified.samples.some((sample) => sample.source_type === 'official_raw_export_500_shell'));
assert.ok(verified.samples.some((sample) => /Sorry, an error occurred/.test(sample.evidence_snippet)));
assert.ok(!verified.samples.some((sample) => sample.source_type === 'official_first_party_sau_export'));
assert.ok(!verified.samples.some((sample) => sample.source_type === 'official_first_party_sau_search_results'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'preserve_manual_export_or_browser_capture_lane_and_do_not_treat_search_or_export_replays_as_recovered');

assert.equal(packet.current_problem_metrics.publicSearchMaterializedInRawLane, false);
assert.equal(packet.current_problem_metrics.publicExportMaterializedInRawLane, false);
assert.equal(packet.current_problem_metrics.sessionedSearch500Confirmed, true);
assert.equal(packet.current_problem_metrics.sessionedExport500Confirmed, true);
assert.equal(packet.current_problem_metrics.sessionedOrgIdTested, 42);
assert.match(packet.packet_complete_when, /both named raw search\/export replays/i);

assert.equal(batchSummary.raw_search_recovered, false);
assert.equal(batchSummary.raw_export_recovered, false);
assert.equal(batchSummary.sample_orgid, 42);
assert.ok(report.includes('both current named raw replays return the same HTTP 500 error shell'));
assert.ok(batchReport.includes('both named search and export submits fail with the same app-side HTTP 500 error shell'));
assert.ok(lessons.includes('### Freeze Selector Lanes When Both Named Submits Hit The Same Error Shell'));

console.log('test-batch242-maine-search-export-truth-refresh-v1: ok');
