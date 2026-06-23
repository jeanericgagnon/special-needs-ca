import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch258NevadaCountyRemainderRefinementV1 } from './run-batch258-nevada-county-remainder-refinement-v1.mjs';

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

const result = generateBatch258NevadaCountyRemainderRefinementV1();
const summary = readJson('data/generated/nevada_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nevada_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nevada_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nevada_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nevada_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/nevada_county_local_disability_resources_welfare_office_packet_v1.json');
const batchSummary = readJson('data/generated/batch258_nevada_county_remainder_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nevada-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_county_local_pages_now_cover_13_of_17_counties_but_four_counties_lack_reviewed_local_route');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_reviewed_county_local_proof_expanded_to_13_of_17_counties_but_four_counties_unresolved');
assert.match(gap.status_reason, /Clark County/i);
assert.match(gap.status_reason, /Washoe County/i);
assert.match(gap.status_reason, /Esmeralda, Humboldt, Lander, and Storey/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_county_local_pages_expand_proof_to_13_of_17_counties_but_four_counties_remain_unresolved');
assert.match(failure.evidence, /13 of 17 county-equivalents/i);
assert.match(failure.evidence, /Esmeralda, Humboldt, Lander, and Storey/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_reviewed_county_local_proof_expanded_to_13_of_17_counties_but_four_counties_unresolved');
assert.equal(verified.sample_count, 7);
assert.ok(verified.samples.some((sample) => /Clark County Social Service Senior Services/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /Washoe County Human Services Agency/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /Esmeralda, Humboldt, Lander, and Storey/i.test(sample.evidence_snippet)));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_official_county_local_pages_or_dss_county_contract_cover_esmeralda_humboldt_lander_and_storey');

assert.equal(packet.current_metrics.partialCountyNamedCoverageCount, 13);
assert.equal(packet.current_metrics.missingCountyContractCount, 4);
assert.equal(packet.current_metrics.countyLocalPagesReviewed, 2);
assert.deepEqual(packet.current_metrics.unresolvedCountyRemainder, ['Esmeralda', 'Humboldt', 'Lander', 'Storey']);
assert.ok(packet.representative_sources.some((src) => src.url === 'https://www.clarkcountynv.gov/residents/assistance_programs/senior-services'));
assert.ok(packet.representative_sources.some((src) => src.url === 'https://www.washoecounty.gov/hsa/index.php'));

assert.equal(batchSummary.reviewed_county_local_coverage_count, 13);
assert.deepEqual(batchSummary.unresolved_county_remainder, ['Esmeralda', 'Humboldt', 'Lander', 'Storey']);
assert.ok(report.includes('Clark County and Washoe County'));
assert.ok(report.includes('Esmeralda, Humboldt, Lander, and Storey'));
assert.ok(lessons.includes('### Exact County Social-Service Pages Can Shrink A Statewide Office Blocker Without Clearing It'));

console.log('test-batch258-nevada-county-remainder-refinement-v1: ok');
