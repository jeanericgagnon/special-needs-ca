import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch232NebraskaPublicDirectoryClearanceV1 } from './run-batch232-nebraska-public-directory-clearance-v1.mjs';

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

const result = generateBatch232NebraskaPublicDirectoryClearanceV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/nebraska_district_or_county_education_routing_local_contract_packet_v1.json');
const batchSummary = readJson('data/generated/batch232_nebraska_public_directory_clearance_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch232-nebraska-public-directory-clearance-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'official_public_office_app_has_only_two_public_layers_and_no_service_area_relationships');
assert.equal(summary.completeness_pct, 92);
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.ok(summary.final_blockers.every((row) => row.family !== 'district_or_county_education_routing'));

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'verified_county_grade');
assert.match(gap.status_reason, /QuickStaff\.aspx/i);
assert.match(gap.status_reason, /93 county options/i);

assert.ok(failureRows.every((row) => row.family !== 'district_or_county_education_routing'));

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'verified_county_grade');
assert.equal(verified.evidence_strength, 'strong');
assert.equal(verified.sample_count, 5);
assert.ok(verified.samples.some((sample) => /Adams County results/i.test(sample.sample_name)));

assert.ok(nextRows.every((row) => row.family !== 'district_or_county_education_routing'));
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');

assert.equal(packet.current_problem_metrics.localContractReviewed, true);
assert.equal(packet.current_problem_metrics.countySelectorPublic, true);
assert.equal(packet.current_problem_metrics.countyResultsPagePublic, true);
assert.equal(packet.current_problem_metrics.reviewedLocalLeafCount, 93);
assert.equal(packet.packet_complete_when, 'complete');

assert.equal(batchSummary.county_selector_public, true);
assert.equal(batchSummary.county_option_count, 93);
assert.equal(batchSummary.county_results_page_public, true);
assert.ok(report.includes('verified_county_grade'));
assert.ok(batchReport.includes('Adams County'));
assert.ok(lessons.includes('### Public County Selectors On Official ASP.NET Directories Count'));

console.log('test-batch232-nebraska-public-directory-clearance-v1: ok');
