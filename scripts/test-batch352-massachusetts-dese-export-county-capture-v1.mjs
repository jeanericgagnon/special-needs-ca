import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch352MassachusettsDeseExportCountyCaptureV1 } from './run-batch352-massachusetts-dese-export-county-capture-v1.mjs';

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

const result = generateBatch352MassachusettsDeseExportCountyCaptureV1();
const summary = readJson('data/generated/massachusetts_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const countyCapture = readJson('data/generated/massachusetts_dese_export_county_capture_v1.json');
const educationPacket = readJson('data/generated/massachusetts_district_or_county_education_routing_postback_packet_v1.json');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.primary_gap_reason, 'official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved');
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'verified_county_grade');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_county_grade');
assert.match(educationGap.status_reason, /DESE district export/i);
assert.match(educationGap.status_reason, /covered all 14 Massachusetts counties/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_dds_locality_capture_covers_13_of_14_counties_but_suffolk_unresolved');
assert.match(countyGap.status_reason, /Suffolk County is still unresolved/i);
assert.match(countyGap.status_reason, /HTTP 403 `Not allowed` shell/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'verified_county_grade');
assert.equal(educationVerified.evidence_strength, 'strong');
assert.equal(educationVerified.blocker_code, null);
assert.equal(educationVerified.sample_count, 4);
assert.match(educationVerified.query_basis, /official DESE district export/i);
assert.match(educationVerified.samples[1].evidence_snippet, /search\.xls/i);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].priority_rank, 1);

const queueRow = queueRows.find((row) => row.state === 'massachusetts');
assert.equal(queueRow.completeness_pct, 92);
assert.equal(queueRow.weak_critical_families, 1);
assert.equal(queueRow.primary_gap_reason, 'official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved');

assert.equal(countyCapture.export_rows, 515);
assert.equal(countyCapture.exact_basename_matches, 406);
assert.equal(countyCapture.covered_counties.length, 14);
assert.equal(countyCapture.county_coverage_counts['suffolk-ma'], 7);

assert.equal(educationPacket.repair_lane, 'verified_export_and_county_crosswalk_capture');
assert.equal(educationPacket.current_problem_metrics.coveredCountyCount, 14);

const allStateMass = allStateAudit.states.find((row) => row.stateId === 'massachusetts');
assert.equal(allStateMass.strongCriticalFamilies, 11);
assert.equal(allStateMass.weakCriticalFamilies, 1);
assert.equal(allStateMass.completenessPct, 92);
assert.equal(allStateMass.familyStatuses.district_or_county_education_routing, 'verified_county_grade');

assert.match(stateReport, /Education is no longer a blocker/i);
assert.match(allStateReport, /Massachusetts remains BLOCKED\/index-safe=false, but the DDS county-local blocker is now narrowed to a Suffolk-only remainder/i);
assert.match(handoff, /## Current Focus State: Massachusetts/);
assert.match(handoff, /county_local_disability_resources` is the only Massachusetts blocker left/i);
assert.match(handoff, /13 of 14 counties/i);
assert.match(lessons, /### Official Exports Plus Official Geography Crosswalks Can Clear County Routing/);

console.log('test-batch352-massachusetts-dese-export-county-capture-v1: ok');
