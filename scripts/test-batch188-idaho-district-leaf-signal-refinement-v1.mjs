import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch188IdahoDistrictLeafSignalRefinementV1 } from './run-batch188-idaho-district-leaf-signal-refinement-v1.mjs';

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

const result = generateBatch188IdahoDistrictLeafSignalRefinementV1();
const batchSummary = readJson('data/generated/batch188_idaho_district_leaf_signal_refinement_summary_v1.json');
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch188-idaho-district-leaf-signal-refinement-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.positive_local_leaf_signals, 3);
assert.equal(summary.primary_gap_reason, 'district_owned_roots_now_show_live_special_services_leaf_signals_but_county_mapping_and_office_contracts_still_incomplete');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(eduGap.status_reason, /Cassia District sitemap exposes .*special-services/i);
assert.match(eduGap.status_reason, /Payette Joint District navigation exposes .*special-education/i);
assert.match(eduGap.status_reason, /Pocatello-Chubbuck SD25 exposes .*special-services/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'official_district_roots_now_show_live_special_services_leaf_signals_but_not_reviewed_county_grade_leaves');
assert.match(eduFailure.evidence, /cassiaschools\.org\/sitemap\.xml exposes .*special-services/i);
assert.match(eduFailure.evidence, /payetteschools\.org.*special-education/i);
assert.match(eduFailure.evidence, /sd25\.us.*special-services/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.sample_count, 5);
assert.ok(eduVerified.samples.some((sample) => sample.sample_name === 'Cassia Joint District sitemap special-services signal'));
assert.ok(eduVerified.samples.some((sample) => sample.sample_name === 'Payette Joint District special-education nav signal'));
assert.ok(eduVerified.samples.some((sample) => sample.sample_name === 'Pocatello-Chubbuck SD25 special-services signal'));

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.next_action, 'author_reviewed_special_education_or_special_services_leaves_from_official_district_roots_and_local_sitemap_navigation_signals');

assert.ok(
  report.includes('sampled district-owned roots already expose likely special-education or special-services leaves on local sites') ||
  report.includes('some district-owned special-education or special-services pages are already verified')
);
assert.ok(batchReport.includes('sampled district-owned roots now prove the next honest lane is exact local leaf authoring'));
assert.ok(lessons.includes('### Sample District-Owned Roots Before Reopening A Statewide Education Blocker'));

console.log('test-batch188-idaho-district-leaf-signal-refinement-v1: ok');
