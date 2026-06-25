import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch377VermontAccessibleOfficialRefreshV1 } from './run-batch377-vermont-accessible-official-refresh-v1.mjs';

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

const result = generateBatch377VermontAccessibleOfficialRefreshV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.remaining_blocker_family, 'vocational_rehabilitation_pre_ets');

const summary = readJson('data/generated/vermont_california_grade_summary_v2.json');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['vocational_rehabilitation_pre_ets']);
assert.equal(
  summary.primary_gap_reason,
  'official_vermont_vr_and_pre_ets_host_family_returns_403_without_reviewable_public_alternate'
);

const gapRows = readJsonl('data/generated/vermont_gap_matrix_v2.jsonl');
const medicaidGap = gapRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.equal(medicaidGap.family_status, 'verified_state_grade');
assert.match(medicaidGap.status_reason, /Dr\. Dynasaur- Medicaid/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_county_grade');
assert.match(countyGap.status_reason, /Find Your Local Health Office/i);
assert.match(countyGap.status_reason, /Children Integrated \(CIS\) Team/i);

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrGap.family_status, 'blocked_official_vr_hosts_return_403_without_reviewed_public_alternate');
assert.match(vrGap.status_reason, /HTTP 403/i);

const failureRows = readJsonl('data/generated/vermont_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'vocational_rehabilitation_pre_ets');
assert.equal(
  failureRows[0].failure_code,
  'official_vr_and_pre_ets_hosts_return_403_without_reviewed_public_alternate'
);
assert.match(failureRows[0].evidence, /dbvi\.vermont\.gov\/pre-employment-transition-services/i);

const verifiedRows = readJsonl('data/generated/vermont_verified_sources_v1.jsonl');
const medicaidVerified = verifiedRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.equal(medicaidVerified.sample_count, 2);
assert.match(medicaidVerified.samples[0].source_url, /find-health-insurance/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_county_grade');
assert.equal(countyVerified.sample_count, 6);
assert.ok(countyVerified.samples.some((sample) => /Washington County/.test(sample.evidence_snippet)));
assert.ok(countyVerified.samples.some((sample) => /Lamoille Family Center/.test(sample.evidence_snippet)));

const vrVerified = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrVerified.family_status, 'blocked_official_vr_hosts_return_403_without_reviewed_public_alternate');
assert.equal(vrVerified.sample_count, 3);
assert.equal(
  vrVerified.blocker_code,
  'official_vr_and_pre_ets_hosts_return_403_without_reviewed_public_alternate'
);
assert.ok(vrVerified.samples.every((sample) => /403/.test(sample.evidence_snippet)));

const nextRows = readJsonl('data/generated/vermont_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'vocational_rehabilitation_pre_ets');

const batchSummary = readJson('data/generated/batch377_vermont_accessible_official_refresh_summary_v1.json');
assert.deepEqual(batchSummary.repaired_families.sort(), ['county_local_disability_resources', 'medicaid_state_health_coverage'].sort());
assert.deepEqual(batchSummary.sharpened_families, ['vocational_rehabilitation_pre_ets']);

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/vermont-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /county_local_disability_resources` now clears/i);
assert.match(stateReport, /official Vermont VR and DBVI host family returned only 403 shells/i);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch377-vermont-accessible-official-refresh-report-v1.md'), 'utf8');
assert.match(batchReport, /cleared Vermont county-local disability routing/i);
assert.match(batchReport, /Find Your Local Health Office/i);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /Local Health District Finders Can Clear County-Grade Disability Routing/i);

console.log('test-batch377-vermont-accessible-official-refresh-v1: ok');
