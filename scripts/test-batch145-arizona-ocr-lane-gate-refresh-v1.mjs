import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch145ArizonaOcrLaneGateRefreshV1 } from './run-batch145-arizona-ocr-lane-gate-refresh-v1.mjs';

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

generateBatch145ArizonaOcrLaneGateRefreshV1();

const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch145_arizona_ocr_lane_gate_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch145-arizona-ocr-lane-gate-refresh-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'azed_host_challenged_and_ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_admin_mapping_artifact_missing');
assert.match(countyGap.status_reason, /current repo\/runtime cannot OCR or rasterize/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact');
assert.match(countyFailure.evidence, /tesseract, pdftotext, and pdftoppm are absent on PATH/i);
assert.match(countyFailure.evidence, /pytesseract, pdf2image, and PIL are not importable/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'attach_reviewed_ahcccs_admin_html_leaves_or_committed_ocr_artifact_before_rewriting_arizona_county_rows');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_admin_mapping_artifact_missing');
assert.equal(countyVerified.sample_count, countyVerified.samples.length);
assert.match(countyVerified.blocker_evidence, /no installed OCR or PDF raster tools/i);

assert.equal(batchSummary.ocr_tools_on_path.tesseract, false);
assert.equal(batchSummary.ocr_tools_on_path.pdftotext, false);
assert.equal(batchSummary.ocr_tools_on_path.pdftoppm, false);
assert.equal(batchSummary.python_imports_available.pytesseract, false);
assert.equal(batchSummary.python_imports_available.pdf2image, false);
assert.equal(batchSummary.python_imports_available.PIL, false);
assert.equal(batchSummary.altcs_county_map_partially_extractable, true);
assert.equal(batchSummary.reviewed_admin_html_leaves_present, false);

assert.match(report, /current repo\/runtime cannot OCR or rasterize/i);
assert.match(batchReport, /no deterministic low-token OCR lane available/i);

console.log('test-batch145-arizona-ocr-lane-gate-refresh-v1: ok');
