import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch415SouthDakotaDssLocalOfficeLaneTruthRefreshV1 } from './run-batch415-south-dakota-dss-local-office-lane-truth-refresh-v1.mjs';

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

const result = generateBatch415SouthDakotaDssLocalOfficeLaneTruthRefreshV1();
assert.equal(result.classification, 'COMPLETE');

const summary = readJson('data/generated/south-dakota_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch415_south-dakota_dss_local_office_lane_truth_refresh_v1');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_official_or_first_party_geography_contracts');
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.final_blockers, null);

const countyGap = readJsonl('data/generated/south-dakota_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_current_official_dss_behavioral_health_services_county_map_and_rows');
assert.match(countyGap.status_reason, /Behavioral Health Services County Map/i);
assert.match(countyGap.status_reason, /66 named county anchors and 66 matching county-area links/i);
assert.match(countyGap.status_reason, /Harding .*605\.343\.7262/i);
assert.match(countyGap.status_reason, /multiple `Minnehaha` county rows such as `Avera Addiction Care Center — 605\.504\.2222`/i);

const failureRows = readJsonl('data/generated/south-dakota_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 0);

const verifiedRows = readJsonl('data/generated/south-dakota_verified_sources_v1.jsonl');
const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.blocker_code, null);
assert.equal(verified.sample_count, 5);
assert.match(verified.query_basis, /66 county anchors/i);
assert.equal(verified.samples[0].source_url, 'https://dss.sd.gov/behavioralhealth/agencycounty.aspx');
assert.match(verified.samples[1].evidence_snippet, /66 named county anchors and 66 matching county-area links/i);
assert.match(verified.samples[4].evidence_snippet, /Avera Addiction Care Center/i);

const nextRows = readJsonl('data/generated/south-dakota_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 0);

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'south-dakota');
assert.equal(queueRow.primary_gap_reason, 'all_critical_families_verified_with_reviewed_official_or_first_party_geography_contracts');
assert.equal(queueRow.recommended_batch, 'complete_maintain');

const batchSummary = readJson('data/generated/batch415_south-dakota_dss_local_office_lane_truth_refresh_summary_v1.json');
assert.equal(batchSummary.behavior_health_county_map_live, true);
assert.equal(batchSummary.county_anchor_count, 66);
assert.equal(batchSummary.county_area_link_count, 66);
assert.equal(batchSummary.county_local_contract_present, true);
assert.equal(batchSummary.completeness_pct, 100);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/south-dakota-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /South Dakota is COMPLETE and index-safe/i);
assert.match(report, /county-specific provider rows and phone numbers/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'south-dakota');
assert.equal(auditRow.packetBatch, 'batch415_south-dakota_dss_local_office_lane_truth_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_official_or_first_party_geography_contracts');
assert.equal(auditRow.classification, 'COMPLETE');
assert.equal(auditRow.indexSafe, true);

assert.equal(allStateAudit.classifications.COMPLETE, 45);
assert.equal(allStateAudit.classifications.BLOCKED, 5);
assert.equal(allStateAudit.indexSafeCount, 45);

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /COMPLETE: 45/i);
assert.match(allStateReport, /BLOCKED: 5/i);
assert.match(allStateReport, /South Dakota is now COMPLETE\/index-safe/i);
assert.doesNotMatch(allStateReport, /blocked states: .*South Dakota/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /Current Focus State: Alaska/);
assert.doesNotMatch(handoff, /- South Dakota:/);

const stateCertification = readJson('data/generated/state-certification/south-dakota.json');
assert.equal(stateCertification.summary.batch, 'batch415_south-dakota_dss_local_office_lane_truth_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');
assert.equal(stateCertification.pass, true);
assert.equal(stateCertification.failures.length, 0);

const stateCertificationReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/state-certification-south-dakota.md'), 'utf8');
assert.match(stateCertificationReport, /pass: true/i);
assert.match(stateCertificationReport, /Candidate passed all certification checks/i);

console.log('test-batch415-south-dakota-dss-local-office-lane-truth-refresh-v1: ok');
