import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch231MichiganCepiSessionExportRecoveryV1 } from './run-batch231-michigan-cepi-session-export-recovery-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch231MichiganCepiSessionExportRecoveryV1();
const summary = readJson('data/generated/michigan_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/michigan_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/michigan_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/michigan_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/michigan_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/michigan_district_or_county_education_routing_arcgis_contract_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch231_michigan_cepi_session_export_recovery_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/michigan-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch231-michigan-cepi-session-export-recovery-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.complete_ready, true);
assert.equal(summary.final_blockers, null);
assert.ok(summary.verified_source_families_with_samples.includes('legal_aid'));

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'verified_county_grade');
assert.match(gap.status_reason, /session-backed ASP\.NET replay/i);
assert.match(gap.status_reason, /all 83 Michigan counties/i);

assert.equal(failureRows.length, 0);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'verified_county_grade');
assert.equal(verified.sample_count, 83);
assert.equal(verified.blocker_code, null);
assert.ok(verified.samples.some((sample) => /LEA District export/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /all 83 Michigan counties/i.test(sample.evidence_snippet)));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].severity, 'info');

assert.equal(packet.current_problem_metrics.cepiExactDatasetPostbackStable, true);
assert.equal(packet.public_dataset_contract.stable_public_export, true);
assert.equal(packet.public_dataset_contract.lea_unique_counties, 83);
assert.equal(packet.public_dataset_contract.lea_counties_with_email_and_phone, 83);

const queueRow = queueRows.find((row) => row.state === 'michigan');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.weak_critical_families, 0);
assert.equal(queueRow.repair_lane, 'maintain_truth_only');

assert.equal(batchSummary.exact_session_backed_export_stable, true);
assert.equal(batchSummary.lea_export_unique_counties, 83);
assert.equal(batchSummary.lea_counties_with_email_and_phone, 83);

assert.match(report, /Michigan is therefore California-grade COMPLETE and index-safe/i);
assert.match(report, /83\/83 Michigan counties/i);
assert.match(batchReport, /LEA export unique counties: 83/i);
assert.ok(lessons.includes('### Public ASP.NET Dataset Exports Need Session-Backed Replay Before Declaring Them Broken'));
assert.ok(!lessons.includes('### Public ASP.NET Dataset Forms Can Be Real But Still Export-Blocked'));

console.log('test-batch231-michigan-cepi-session-export-recovery-v1: ok');
