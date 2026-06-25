import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch379WisconsinDpiDirectoryCompletionV1 } from './run-batch379-wisconsin-dpi-directory-completion-v1.mjs';

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

const result = generateBatch379WisconsinDpiDirectoryCompletionV1();
assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.deepEqual(result.cleared_families, [
  'developmental_disability_idd_authority',
  'early_intervention_part_c',
  'district_or_county_education_routing',
  'vocational_rehabilitation_pre_ets',
]);

const summary = readJson('data/generated/wisconsin_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch379_wisconsin_dpi_directory_completion_v1');
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

const gapRows = readJsonl('data/generated/wisconsin_gap_matrix_v2.jsonl');
const dd = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(dd.family_status, 'verified_state_grade');
assert.match(dd.status_reason, /local ADRC/i);
assert.match(dd.status_reason, /children with delays or disabilities/i);

const early = gapRows.find((row) => row.family === 'early_intervention_part_c');
assert.equal(early.family_status, 'verified_state_grade');
assert.match(early.status_reason, /Birth to 3 Program/i);
assert.match(early.status_reason, /Part C of IDEA/i);

const education = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.match(education.status_reason, /CESA` and `County` filter buttons/i);
assert.match(education.status_reason, /Abbotsford \(0007\).*CESA 10.*Clark/i);
assert.match(education.status_reason, /1-5 of 488 items/i);

const vr = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vr.family_status, 'verified_state_grade');
assert.match(vr.status_reason, /Education & Transition Services/i);
assert.match(vr.status_reason, /Pre-Employment Transition Services/i);

const failureRows = readJsonl('data/generated/wisconsin_failure_ledger_v2.jsonl');
assert.deepEqual(failureRows, []);

const nextRows = readJsonl('data/generated/wisconsin_next_action_queue_v2.jsonl');
assert.deepEqual(nextRows, []);

const verifiedRows = readJsonl('data/generated/wisconsin_verified_sources_v1.jsonl');
const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.family_status, 'verified_state_grade');
assert.equal(ddVerified.sample_count, 3);
assert.match(ddVerified.samples[0].source_url, /dhs\.wisconsin\.gov\/disabilities\/index\.htm/);
assert.match(ddVerified.samples[2].source_url, /dhs\.wisconsin\.gov\/children\/index\.htm/);

const earlyVerified = verifiedRows.find((row) => row.family === 'early_intervention_part_c');
assert.equal(earlyVerified.family_status, 'verified_state_grade');
assert.equal(earlyVerified.sample_count, 3);
assert.match(earlyVerified.samples[0].source_url, /dhs\.wisconsin\.gov\/birthto3\/index\.htm/);
assert.match(earlyVerified.samples[2].evidence_snippet, /Birth to 3 Program contacts/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'verified_state_grade');
assert.equal(educationVerified.sample_count, 4);
assert.match(educationVerified.samples[1].source_url, /SchDirPublic\/districts/);
assert.match(educationVerified.samples[2].evidence_snippet, /Abbotsford \(0007\).*CESA 10.*Clark/i);
assert.match(educationVerified.samples[3].source_url, /district-profile\?district=0007/);
assert.match(educationVerified.samples[3].evidence_snippet, /Clark County \| CESA 10/i);

const vrVerified = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrVerified.family_status, 'verified_state_grade');
assert.equal(vrVerified.sample_count, 4);
assert.match(vrVerified.samples[0].source_url, /dwd\.wisconsin\.gov\/dvr\/$/);
assert.match(vrVerified.samples[2].evidence_snippet, /Liaisons to Wisconsin Schools/i);
assert.match(vrVerified.samples[3].evidence_snippet, /Pre-Employment Transition Services/i);

const batchSummary = readJson('data/generated/batch379_wisconsin_dpi_directory_completion_summary_v1.json');
assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.deepEqual(batchSummary.cleared_families, [
  'developmental_disability_idd_authority',
  'early_intervention_part_c',
  'district_or_county_education_routing',
  'vocational_rehabilitation_pre_ets',
]);

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'wisconsin-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /Wisconsin is now `COMPLETE` and `index_safe=true`\./);
assert.match(stateReport, /CESA` and `County\/Locale` fields/i);
assert.match(stateReport, /official Wisconsin Birth to 3 page/i);
assert.match(stateReport, /official Wisconsin DWD DVR and Transition Services pages/i);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'batch379-wisconsin-dpi-directory-completion-report-v1.md'), 'utf8');
assert.match(batchReport, /classification: COMPLETE/i);
assert.match(batchReport, /live DPI School Directory contract/i);
assert.match(batchReport, /current official hosts/i);

console.log('test-batch379-wisconsin-dpi-directory-completion-v1: ok');
