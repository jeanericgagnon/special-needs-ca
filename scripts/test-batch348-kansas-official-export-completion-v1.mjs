import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch348KansasOfficialExportCompletionV1 } from './run-batch348-kansas-official-export-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  const body = fs.readFileSync(path.join(repoRoot, filePath), 'utf8').trim();
  if (!body) return [];
  return body.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch348KansasOfficialExportCompletionV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch348_kansas_official_export_completion_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch348-kansas-official-export-completion-report-v1.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);
assert.equal(summary.batch, 'batch348_kansas_official_export_completion_v1');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(gap);
assert.equal(gap.family_status, 'verified_county_grade');
assert.match(gap.status_reason, /Directory\.xls` workbook/i);
assert.match(gap.status_reason, /matched all 105 Kansas counties/i);

assert.equal(failureRows.some((row) => row.family === 'district_or_county_education_routing'), false);
assert.equal(nextRows.some((row) => row.family === 'district_or_county_education_routing'), false);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(verified);
assert.equal(verified.family_status, 'verified_county_grade');
assert.equal(verified.blocker_code, null);
assert.equal(verified.sample_count, 5);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Exact public Directory.xls export'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'County coverage audit on official workbook'));

assert.equal(packet.repair_lane, 'retired_complete_from_official_state_export');
assert.equal(packet.current_problem_metrics.officialCountyGradeExportVerified, true);
assert.equal(packet.current_problem_metrics.workbookCountyCoverage, 105);
assert.deepEqual(packet.unresolved_local_leaf_counties, []);

const kansasQueue = queueRows.find((row) => row.state === 'kansas');
assert.ok(kansasQueue);
assert.equal(kansasQueue.classification, 'COMPLETE');
assert.equal(kansasQueue.index_safe, true);
assert.equal(kansasQueue.completeness_pct, 100);
assert.equal(kansasQueue.weak_critical_families, 0);
assert.equal(kansasQueue.recommended_batch, 'complete_maintain');
assert.equal(kansasQueue.repair_lane, 'maintain_truth_only');

assert.equal(allStateAudit.classifications.COMPLETE, 28);
assert.equal(allStateAudit.classifications.BLOCKED, 22);
assert.equal(allStateAudit.indexSafeCount, 28);

const kansasAudit = allStateAudit.states.find((row) => row.stateId === 'kansas');
assert.ok(kansasAudit);
assert.equal(kansasAudit.classification, 'COMPLETE');
assert.equal(kansasAudit.indexSafe, true);
assert.equal(kansasAudit.packetBatch, 'batch348_kansas_official_export_completion_v1');
assert.equal(kansasAudit.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(kansasAudit.familyStatuses.district_or_county_education_routing, 'verified_county_grade');

assert.match(stateReport, /Kansas is now COMPLETE and index-safe/i);
assert.match(stateReport, /bounded county-name coverage audit matched all 105 Kansas counties/i);
assert.match(handoff, /## Current Focus State: Nebraska/);
assert.match(handoff, /Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas,/);
assert.doesNotMatch(handoff, /- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_30_counties`/);
assert.match(lessons, /### County-Named Official District Exports Can Clear County-Grade Education Routing/);
assert.match(allStateReport, /COMPLETE: 28/);
assert.match(allStateReport, /Kansas is now COMPLETE\/index-safe/i);
assert.match(batchReport, /Promoted Kansas from BLOCKED to COMPLETE\/index-safe/i);

assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.export_county_coverage, 105);
assert.equal(batchSummary.district_directory_cleared, true);

console.log('test-batch348-kansas-official-export-completion-v1: ok');
