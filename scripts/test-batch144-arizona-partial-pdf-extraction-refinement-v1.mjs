import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch144ArizonaPartialPdfExtractionRefinementV1 } from './run-batch144-arizona-partial-pdf-extraction-refinement-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readJsonl(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch144ArizonaPartialPdfExtractionRefinementV1();

const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch144_arizona_partial_pdf_extraction_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch144-arizona-partial-pdf-extraction-refinement-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'azed_host_challenged_and_ahcccs_county_mapping_now_narrows_to_admin_pdf_ocr_or_reviewed_admin_leaves');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_altcs_county_text_partial_admin_mapping_unresolved');
assert.match(countyGap.status_reason, /official ALTCS county map PDF yields machine-readable county enrollment text/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'ahcccs_county_map_pdf_yields_county_text_but_admin_office_mapping_still_requires_ocr_or_reviewed_leaves');
assert.match(countyFailure.evidence, /bundled workspace Python runtime/i);
assert.match(countyFailure.evidence, /Yuma, Mohave, La Paz/i);
assert.match(countyFailure.evidence, /CountyAdminOffice\.pdf and PimaCountyAdmin\.pdf/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'ocr_or_review_ahcccs_county_admin_pdfs_or_equivalent_admin_leaves_before_rewriting_arizona_county_rows');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_altcs_county_text_partial_admin_mapping_unresolved');
assert.equal(countyVerified.sample_count, 8);
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_pdf_partial_text_extract'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_county_admin_pdf_ocr_required'));

assert.equal(batchSummary.altcs_county_map_text_extractable, true);
assert.equal(batchSummary.county_admin_pdf_text_extractable, false);

assert.match(report, /official ALTCS county map is partially text-extractable/i);
assert.match(batchReport, /partially parseable/i);

console.log('test-batch144-arizona-partial-pdf-extraction-refinement-v1: ok');
