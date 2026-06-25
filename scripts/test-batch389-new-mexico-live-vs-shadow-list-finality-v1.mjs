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

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch389_new_mexico_live_vs_shadow_list_finality_v1');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationGap);
assert.match(educationGap.status_reason, /zero-item shadow `NM Schools` schema/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationFailure);
assert.match(educationFailure.evidence, /zero-item shadow `NM Schools` schema/i);
assert.match(educationFailure.evidence, /ItemCount=0/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationVerified);
assert.equal(educationVerified.sample_count, 12);
assert.ok(educationVerified.samples.some((sample) => sample.sample_name === '2017 NM Schools GUID and item count'));
assert.ok(educationVerified.samples.some((sample) => sample.sample_name === '2017 NM Schools row payload keys'));
assert.ok(educationVerified.samples.some((sample) => sample.sample_name === 'Zero-item shadow NM Schools schema'));
assert.ok(educationVerified.samples.some((sample) => /Column2/.test(sample.evidence_snippet)));

assert.equal(batchSummary.batch, 'batch389_new_mexico_live_vs_shadow_list_finality_v1');
assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.index_safe, false);
assert.equal(batchSummary.live_list_item_count, 935);
assert.equal(batchSummary.shadow_schema_has_county_name, true);
assert.equal(batchSummary.shadow_schema_item_count, 0);
assert.equal(batchSummary.blocker_changed, false);

assert.match(handoff, /- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`/);
assert.match(lessons, /Shadow SharePoint Schemas Do Not Count If The Live List Rows Still Omit The Field/);
