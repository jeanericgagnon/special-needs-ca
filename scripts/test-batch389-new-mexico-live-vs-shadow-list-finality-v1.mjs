import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const summary = readJson(path.join(repoRoot, 'data', 'generated', 'new-mexico_california_grade_summary_v2.json'));
const gapRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'new-mexico_gap_matrix_v2.jsonl'));
const failureRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'new-mexico_failure_ledger_v2.jsonl'));
const verifiedRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'new-mexico_verified_sources_v1.jsonl'));
const batchSummary = readJson(path.join(repoRoot, 'data', 'generated', 'batch389_new_mexico_live_vs_shadow_list_finality_summary_v1.json'));
const handoff = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'), 'utf8');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'new-mexico-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch389_new_mexico_live_vs_shadow_list_finality_v1');
assert.match(
  summary.final_blockers.find((row) => row.family === 'vocational_rehabilitation_pre_ets').evidence,
  /Reviewed 2026-06-25 the New Mexico VR blocker artifacts/
);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationGap);
assert.match(educationGap.status_reason, /zero-item shadow `NM Schools` schema/i);
assert.match(educationGap.status_reason, /Executive Director Name/i);
assert.match(educationGap.status_reason, /explicitly groups district names under `REC 1` through `REC 10`/i);
assert.match(educationGap.status_reason, /partial district universe rather than a complete statewide district crosswalk/i);
assert.match(educationGap.status_reason, /REC Executive Directors Directory/i);
assert.match(educationGap.status_reason, /timed out after 15 seconds/i);
assert.match(educationGap.status_reason, /aborted before rendering body text/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationFailure);
assert.match(educationFailure.evidence, /zero-item shadow `NM Schools` schema/i);
assert.match(educationFailure.evidence, /ItemCount=0/i);
assert.match(educationFailure.evidence, /Email address/i);
assert.match(educationFailure.evidence, /partial district universe rather than a statewide-complete district crosswalk/i);
assert.match(educationFailure.evidence, /rec-executive-directors-directory/i);
assert.match(educationFailure.evidence, /timed out after 15 seconds/i);
assert.match(educationFailure.evidence, /Playwright navigation/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationVerified);
assert.equal(educationVerified.sample_count, 13);
assert.ok(educationVerified.samples.some((sample) => sample.sample_name === '2017 NM Schools GUID and item count'));
assert.ok(educationVerified.samples.some((sample) => sample.sample_name === '2017 NM Schools row payload keys'));
assert.ok(educationVerified.samples.some((sample) => sample.sample_name === 'Zero-item shadow NM Schools schema'));
assert.ok(educationVerified.samples.some((sample) => sample.sample_name === 'REC executive-directors leaf timeout'));
assert.ok(educationVerified.samples.some((sample) => /Column2/.test(sample.evidence_snippet)));

const vrVerified = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.ok(vrVerified);
assert.match(vrVerified.query_basis, /2026-06-25/);
assert.equal(vrVerified.sample_count, 2);
assert.ok(vrVerified.samples.some((sample) => sample.sample_name === 'New Mexico DVR root'));
assert.ok(vrVerified.samples.some((sample) => sample.sample_name === 'Likely workforce successor probe'));
assert.match(vrVerified.samples[0].evidence_snippet, /\/home`, `\/about-us`, `\/services`, `\/contact-us`, `\/sitemap\.xml`, and `\/robots\.txt`/i);
assert.match(vrVerified.samples[1].evidence_snippet, /Jobs4Joes, Vocational Rehabilitation, Individuals with Disabilities, and Business Services/i);
assert.match(vrVerified.samples[1].evidence_snippet, /Request Rejected/i);
assert.match(stateReport, /- vocational_rehabilitation_pre_ets: blocked_official_dvr_root_unauthorized_without_reviewed_alternate \(Reviewed 2026-06-25/i);
assert.match(stateReport, /- vocational_rehabilitation_pre_ets: official_dvr_root_returns_401_without_reviewed_public_alternate :: Reviewed 2026-06-25/i);
assert.doesNotMatch(stateReport, /- vocational_rehabilitation_pre_ets:[^\n]*2026-06-23/i);

assert.equal(batchSummary.batch, 'batch389_new_mexico_live_vs_shadow_list_finality_v1');
assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.index_safe, false);
assert.equal(batchSummary.live_list_item_count, 935);
assert.equal(batchSummary.shadow_schema_has_county_name, true);
assert.equal(batchSummary.shadow_schema_item_count, 0);
assert.equal(batchSummary.rec_leaf_fetch_timeout, true);
assert.equal(batchSummary.rec_leaf_browser_abort, true);
assert.equal(batchSummary.blocker_changed, false);

assert.match(handoff, /- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`/);
assert.match(lessons, /Shadow SharePoint Schemas Do Not Count If The Live List Rows Still Omit The Field/);
assert.match(lessons, /Timed-Out Official Leaves Still Do Not Count As Service-Area Contracts/);
