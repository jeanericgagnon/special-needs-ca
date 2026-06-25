import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch378WashingtonDdcsDvrCompletionV1 } from './run-batch378-washington-ddcs-dvr-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch378WashingtonDdcsDvrCompletionV1();
assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.deepEqual(result.cleared_families, [
  'developmental_disability_idd_authority',
  'early_intervention_part_c',
  'vocational_rehabilitation_pre_ets',
  'county_local_disability_resources',
]);

const summary = readJson('data/generated/washington_california_grade_summary_v2.json');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'all_critical_families_verified_with_reviewed_first_party_or_official_evidence'
);
assert.equal(summary.complete_ready, true);
assert.equal(summary.final_blockers, null);

const gapRows = readJsonl('data/generated/washington_gap_matrix_v2.jsonl');
const dd = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(dd.family_status, 'verified_state_grade');
assert.match(dd.status_reason, /Find a DDCS Office/i);
assert.match(dd.status_reason, /every Washington county to DDCS Region 1, Region 2, or Region 3/i);

const early = gapRows.find((row) => row.family === 'early_intervention_part_c');
assert.equal(early.family_status, 'verified_state_grade');
assert.match(early.status_reason, /Early Support for Infants and Toddlers \(ESIT\)/i);
assert.match(early.status_reason, /ESIT Statewide Directory/i);

const vr = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vr.family_status, 'verified_state_grade');
assert.match(vr.status_reason, /Regional Transition Consultant/i);
assert.match(vr.status_reason, /local DVR office/i);

const county = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.match(county.status_reason, /county-to-region DDCS routing crosswalk/i);
assert.match(county.status_reason, /without forbidden city, distance, or nearest-office inference/i);

const failureRows = readJsonl('data/generated/washington_failure_ledger_v2.jsonl');
assert.deepEqual(failureRows, []);

const nextRows = readJsonl('data/generated/washington_next_action_queue_v2.jsonl');
assert.deepEqual(nextRows, []);

const verifiedRows = readJsonl('data/generated/washington_verified_sources_v1.jsonl');
const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.family_status, 'verified_state_grade');
assert.equal(ddVerified.sample_count, 3);
assert.match(ddVerified.samples[0].source_url, /dshs\.wa\.gov\/dda\/find-ddcs-office/);
assert.match(ddVerified.samples[2].source_url, /25-1017-DDCS-Contact-page\.pdf/);

const earlyVerified = verifiedRows.find((row) => row.family === 'early_intervention_part_c');
assert.equal(earlyVerified.family_status, 'verified_state_grade');
assert.equal(earlyVerified.sample_count, 3);
assert.match(earlyVerified.samples[0].source_url, /dcyf\.wa\.gov\/services\/child-development-supports\/esit/);
assert.match(earlyVerified.samples[2].evidence_snippet, /ESIT Statewide Directory/i);

const vrVerified = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrVerified.family_status, 'verified_state_grade');
assert.equal(vrVerified.sample_count, 4);
assert.match(vrVerified.samples[1].source_url, /pre-employment-transition-services-pre-ets/);
assert.match(vrVerified.samples[2].evidence_snippet, /Regional Transition Consultant/i);
assert.match(vrVerified.samples[3].evidence_snippet, /Aberdeen, Bellevue, Bellingham, Spokane, Tacoma, Vancouver, Wenatchee, and Yakima/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_state_grade');
assert.equal(countyVerified.sample_count, 4);
assert.equal(countyVerified.blocker_code, null);
assert.match(countyVerified.samples[1].source_url, /25-1017-DDCS-Contact-page\.pdf/);
assert.match(countyVerified.samples[1].evidence_snippet, /every Washington county into DDCS Region 1, Region 2, or Region 3/i);
assert.match(countyVerified.samples[3].evidence_snippet, /Whitman County DDA Field Office/i);

const batchSummary = readJson('data/generated/batch378_washington_ddcs_dvr_completion_summary_v1.json');
assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.deepEqual(batchSummary.cleared_families, [
  'developmental_disability_idd_authority',
  'early_intervention_part_c',
  'vocational_rehabilitation_pre_ets',
  'county_local_disability_resources',
]);

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'washington-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /Washington is now `COMPLETE` and `index_safe=true`\./);
assert.match(stateReport, /DDCS county-to-region routing crosswalk/i);
assert.match(stateReport, /official DCYF ESIT page/i);
assert.match(stateReport, /current official DVR, Pre-ETS, transition-services, and local DVR office-locator evidence/i);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'batch378-washington-ddcs-dvr-completion-report-v1.md'), 'utf8');
assert.match(batchReport, /classification: COMPLETE/i);
assert.match(batchReport, /official DDCS county-region map/i);
assert.match(batchReport, /current official DVR and Pre-ETS routing evidence/i);

console.log('test-batch378-washington-ddcs-dvr-completion-v1: ok');
