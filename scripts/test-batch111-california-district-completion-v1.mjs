import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch111CaliforniaDistrictCompletionV1 } from './run-batch111-california-district-completion-v1.mjs';

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

const result = generateBatch111CaliforniaDistrictCompletionV1();
const summary = readJson('data/generated/california_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/california_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/california_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/california_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/california_verified_sources_v1.jsonl');
const packet = readJson('data/generated/california_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch111_california_district_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/california-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.deepEqual(summary.final_blockers, []);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_state_grade');
assert.match(educationGap.status_reason, /Alpine now resolves on alpinecoe\.k12\.ca\.us/i);
assert.match(educationGap.status_reason, /Fremont now resolves on fremontunified\.org/i);
assert.match(educationGap.status_reason, /Calaveras now resolves on ccoe\.k12\.ca\.us plus calaverasusd\.com/i);

assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 0);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'verified_state_grade');
assert.equal(educationVerified.sample_count, 23);
assert.equal(educationVerified.blocker_code, null);
assert.ok(educationVerified.samples.some((sample) => /alpinecoe\.k12\.ca\.us/.test(sample.source_url)));
assert.ok(educationVerified.samples.some((sample) => /bcoe\.org/.test(sample.source_url)));
assert.ok(educationVerified.samples.some((sample) => /ccoe\.net/.test(sample.source_url)));
assert.ok(educationVerified.samples.some((sample) => /fremontunified\.org/.test(sample.source_url)));
assert.ok(educationVerified.samples.some((sample) => /ccoe\.k12\.ca\.us/.test(sample.source_url)));
assert.ok(educationVerified.samples.some((sample) => /calaverasusd\.com/.test(sample.source_url)));

assert.ok(packet.root_domains_to_review.some((row) => row.source_domain === 'alpinecoe.k12.ca.us'));
assert.ok(packet.root_domains_to_review.some((row) => row.source_domain === 'bcoe.org'));
assert.ok(packet.root_domains_to_review.some((row) => row.source_domain === 'ccoe.net'));
assert.ok(packet.root_domains_to_review.some((row) => row.source_domain === 'fremontunified.org'));
assert.ok(packet.root_domains_to_review.some((row) => row.source_domain === 'ccoe.k12.ca.us'));
assert.ok(packet.root_domains_to_review.some((row) => row.source_domain === 'calaverasusd.com'));
assert.equal(packet.current_problem_metrics.resolvedExactLeafCount, 23);

assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.education_sample_count, 23);
assert.ok(report.includes('California is now COMPLETE and index-safe.'));
assert.ok(lessons.includes('Dead California COE `.org` Roots Can Move To `k12.ca.us` Or District-Owned Replacements'));

console.log('test-batch111-california-district-completion-v1: ok');
