import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch224NevadaProgramOfficesPartialCountyAuditV1 } from './run-batch224-nevada-program-offices-partial-county-audit-v1.mjs';

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

const result = generateBatch224NevadaProgramOfficesPartialCountyAuditV1();
const summary = readJson('data/generated/nevada_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nevada_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nevada_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nevada_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nevada_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/nevada_county_local_disability_resources_welfare_office_packet_v1.json');
const batchSummary = readJson('data/generated/batch224_nevada_program_offices_partial_county_audit_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nevada-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_partial_county_bearing_program_offices_page_without_full_contract');
assert.match(gap.status_reason, /Program Offices` page/i);
assert.match(gap.status_reason, /complete 17-county/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_program_offices_page_adds_partial_county_partners_but_no_full_county_to_welfare_contract');
assert.match(failure.evidence, /program-offices/i);
assert.match(failure.evidence, /Clark, Esmeralda, Humboldt, Lander, Storey, and Washoe/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_partial_county_bearing_program_offices_page_without_full_contract');
assert.equal(verified.sample_count, 5);
assert.ok(verified.samples.some((sample) => /Program Offices page/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /11 of Nevada’s 17/i.test(sample.evidence_snippet)));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_official_full_17_county_contract_or_county_to_welfare_office_mapping_is_reviewed');

assert.equal(packet.current_metrics.siblingProgramOfficesReviewed, true);
assert.equal(packet.current_metrics.partialCountyNamedCoverageCount, 11);
assert.equal(packet.current_metrics.missingCountyContractCount, 6);
assert.ok(packet.representative_sources.some((src) => src.url === 'https://www.dss.nv.gov/contact/program-offices/'));

assert.equal(batchSummary.partial_county_named_coverage_count, 11);
assert.equal(batchSummary.missing_county_contract_count, 6);
assert.ok(report.includes('partial county-bearing local partners'));
assert.ok(lessons.includes('### Partial County Mentions On A Sibling Page Still Need A Full Coverage Audit'));
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

console.log('test-batch224-nevada-program-offices-partial-county-audit-v1: ok');
