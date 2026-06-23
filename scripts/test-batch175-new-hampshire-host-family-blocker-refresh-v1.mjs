import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch175NewHampshireHostFamilyBlockerRefreshV1 } from './run-batch175-new-hampshire-host-family-blocker-refresh-v1.mjs';

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

const result = generateBatch175NewHampshireHostFamilyBlockerRefreshV1();
const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/new-hampshire_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch175_new_hampshire_host_family_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_nh_host_families_publicly_access_denied_or_unresolvable');
assert.equal(summary.final_blockers.length, 3);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_official_nh_doe_host_family_access_denied');
assert.match(eduGap.status_reason, /my\.doe\.nh\.gov/i);

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrGap.family_status, 'blocked_official_nh_vr_host_family_access_denied_or_unresolvable');
assert.match(vrGap.status_reason, /nheasy/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_official_nh_dhhs_host_family_access_denied');
assert.match(countyGap.status_reason, /DOI-derived county-office rows/i);

assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'official_nh_doe_host_family_returns_access_denied_shell');
assert.equal(failureRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets').failure_code, 'official_nh_vr_host_family_returns_access_denied_or_unresolvable');
assert.equal(failureRows.find((row) => row.family === 'county_local_disability_resources').failure_code, 'official_nh_dhhs_host_family_returns_access_denied_shell');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.sample_count, 4);
assert.match(eduVerified.samples[3].source_url, /my\.doe\.nh\.gov/);

const vrVerified = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrVerified.sample_count, 4);
assert.match(vrVerified.samples[2].source_url, /nhes\.nh\.gov\/services\/disabilities\/bvr\.htm/);
assert.match(vrVerified.samples[3].evidence_snippet, /did not resolve/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 4);
assert.match(countyVerified.samples[3].source_url, /district-offices/);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_blocked_until_public_nh_education_export_or_browser_reviewable_directory_is_preserved');
assert.equal(nextRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets').next_action, 'hold_blocked_until_public_nh_vr_host_or_official_export_is_preserved');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'hold_blocked_until_public_nh_dhhs_district_directory_or_county_export_is_preserved');

assert.ok(batchSummary.host_family_blockers.includes('education.nh.gov'));
assert.ok(batchSummary.host_family_blockers.includes('nheasy.nh.gov'));
assert.ok(report.includes('host-family public-access failures'));
assert.ok(report.includes('alternate `my.doe.nh.gov` host all return the same access-denied shell'));
assert.ok(lessons.includes('### Treat Repeated Access-Denied Shells As A Host-Family Blocker'));

console.log('test-batch175-new-hampshire-host-family-blocker-refresh-v1: ok');
