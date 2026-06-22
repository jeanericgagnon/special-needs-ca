import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch122GeorgiaResaCountyMapRepairV1 } from './run-batch122-georgia-resa-county-map-repair-v1.mjs';

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

const result = generateBatch122GeorgiaResaCountyMapRepairV1();
const summary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch122_georgia_resa_county_map_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['developmental_disability_idd_authority']);
assert.equal(summary.final_blockers.length, 1);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'verified_state_grade');
assert.match(eduGap.status_reason, /159 unique Georgia county IDs/i);

assert.ok(!failureRows.some((row) => row.family === 'district_or_county_education_routing'));
assert.ok(!nextRows.some((row) => row.family === 'district_or_county_education_routing'));

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_state_grade');
assert.equal(eduVerified.evidence_strength, 'strong');
assert.equal(eduVerified.sample_count, 4);
assert.ok(eduVerified.samples.some((sample) => sample.source_url === 'https://gadoe.org/contact/georgia-resa/'));
assert.ok(eduVerified.samples.some((sample) => sample.source_url === 'https://www.mresa.org/'));

const queueGeorgia = queueRows.find((row) => row.state === 'georgia');
assert.equal(queueGeorgia.completeness_pct, 91);
assert.equal(queueGeorgia.weak_critical_families, 1);
assert.equal(queueGeorgia.primary_gap_reason, 'official_county_page_points_to_unpublished_region_leaves');

assert.equal(batchSummary.countyMapMetrics.uniqueCountyIds, 159);
assert.equal(batchSummary.countyMapMetrics.duplicateIds, 4);
assert.equal(batchSummary.countyMapMetrics.duplicateIdsSameRegionOnly, true);
assert.deepEqual(batchSummary.remaining_blockers, ['developmental_disability_idd_authority']);

assert.ok(report.includes('official GaDOE RESA county map'));
assert.ok(lessons.includes('### Embedded Official County Maps Can Close A Regional Routing Family Without Reopening District Discovery'));

console.log('test-batch122-georgia-resa-county-map-repair-v1: ok');
