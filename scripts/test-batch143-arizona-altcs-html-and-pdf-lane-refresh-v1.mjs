import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch143ArizonaAltcsHtmlAndPdfLaneRefreshV1 } from './run-batch143-arizona-altcs-html-and-pdf-lane-refresh-v1.mjs';

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

const result = generateBatch143ArizonaAltcsHtmlAndPdfLaneRefreshV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch143_arizona_altcs_html_and_pdf_lane_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'azed_host_challenged_and_ahcccs_county_mapping_still_requires_pdf_extraction_or_reviewed_county_admin_leaves');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_html_offices_verified_but_county_pdf_contract_unparsed');
assert.match(countyGap.status_reason, /seven named ALTCS offices/i);
assert.match(countyGap.status_reason, /image-heavy PDFs/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'ahcccs_html_office_lane_is_live_but_county_mapping_remains_trapped_in_image_pdfs');
assert.match(countyFailure.evidence, /seven named official offices/i);
assert.match(countyFailure.evidence, /County Map PDF/i);
assert.match(countyFailure.evidence, /CountyAdminOffice\.pdf and PimaCountyAdmin\.pdf/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'ahcccs_html_office_lane_is_live_but_county_mapping_remains_trapped_in_image_pdfs');
assert.equal(countyVerified.sample_count, 8);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://www.azahcccs.gov/members/ALTCSlocations.html'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_pdf_candidate_image_only'));
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'ahcccs_html_office_lane_is_live_but_county_mapping_remains_trapped_in_image_pdfs');
assert.match(countyNext.next_action, /parse_or_manually_review_ahcccs_county_map_and_county_admin_pdfs/i);

assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.altcs_html_office_count, 7);
assert.equal(batchSummary.county_pdf_text_extractable, false);
assert.ok(report.includes('the accessible AHCCCS HTML lane already proves seven named ALTCS offices'));
assert.ok(lessons.includes('Image-Heavy Official PDFs Are Not County Contracts Until The County Text Is Reviewable'));

console.log('test-batch143-arizona-altcs-html-and-pdf-lane-refresh-v1: ok');
