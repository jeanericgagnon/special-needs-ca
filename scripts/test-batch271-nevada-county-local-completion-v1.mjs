import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch271NevadaCountyLocalCompletionV1 } from './run-batch271-nevada-county-local-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch271NevadaCountyLocalCompletionV1();
const summary = readJson('data/generated/nevada_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nevada_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nevada_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nevada_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nevada_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/nevada_county_local_disability_resources_welfare_office_packet_v1.json');
const batchSummary = readJson('data/generated/batch271_nevada_county_local_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nevada-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'verified_state_grade');
assert.match(gap.status_reason, /all 17 county-equivalents/i);
assert.match(gap.status_reason, /Humboldt/i);
assert.match(gap.status_reason, /Storey/i);

assert.equal(failureRows.length, 0);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'verified_state_grade');
assert.equal(verified.sample_count, 17);
assert.equal(verified.blocker_code, null);
assert.ok(verified.samples.some((sample) => /Humboldt County Public Transportation Services/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /Storey County Health & Community Services/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /Esmeralda County Senior Transportation/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /Lander County Senior Center/i.test(sample.sample_name)));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].failure_code, 'complete_maintain_truth_only');

assert.equal(packet.current_metrics.partialCountyNamedCoverageCount, 17);
assert.equal(packet.current_metrics.missingCountyContractCount, 0);
assert.deepEqual(packet.current_metrics.unresolvedCountyRemainder, []);

assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.reviewed_county_local_coverage_count, 17);
assert.deepEqual(batchSummary.newly_cleared_counties, ['Esmeralda', 'Humboldt', 'Lander', 'Storey']);

assert.ok(report.includes('Nevada is therefore California-grade COMPLETE and index-safe'));
assert.ok(report.includes('Humboldt now clears'));
assert.ok(report.includes('Storey now clears'));
assert.ok(lessons.includes('### Official Site Search Can Recover A Live County Service Leaf After A Stale Nav Link'));

console.log('test-batch271-nevada-county-local-completion-v1: ok');
