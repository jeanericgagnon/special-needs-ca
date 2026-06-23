import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch173NebraskaOpenConfigBlockerRefreshV1 } from './run-batch173-nebraska-open-config-blocker-refresh-v1.mjs';

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

const result = generateBatch173NebraskaOpenConfigBlockerRefreshV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch173_nebraska_open_config_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_nde_host_without_county_or_esu_contract_and_public_office_layer_only_37_counties');
assert.equal(summary.final_blockers.length, 2);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_live_nde_host_without_county_or_esu_contract');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /SPED Staff Directory/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Service Agencies\/Providers/i);
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_public_office_layer_only_37_counties');
assert.match(byFamily.get('county_local_disability_resources').status_reason, /42 office rows and 37 distinct USER_County values/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'live_nde_host_accessible_but_no_county_or_esu_routing_contract_reviewed');
assert.match(eduFailure.evidence, /single ESU 9 Deaf or Hard of Hearing program page/i);
assert.match(eduFailure.evidence, /provider application workflow/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_public_office_experiencebuilder_config_opens_but_public_layer_only_covers_37_counties');
assert.match(countyFailure.evidence, /county-boundary layer carries only county geometry fields/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'blocked_live_nde_host_without_county_or_esu_contract');
assert.equal(eduVerified.sample_count, 4);
assert.match(eduVerified.samples[1].source_url, /education\.ne\.gov\/sped\/contact-us/);
assert.match(eduVerified.samples[2].source_url, /education\.ne\.gov\/sped\/service-agencies/);
assert.match(eduVerified.samples[2].evidence_snippet, /Service Agency\/Provider Application/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_public_office_layer_only_37_counties');
assert.equal(countyVerified.sample_count, 4);
assert.match(countyVerified.samples[2].evidence_snippet, /37 distinct office counties/i);
assert.match(countyVerified.samples[3].evidence_snippet, /county boundary fields/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_blocked_until_live_official_county_to_esu_or_district_contract_is_reviewed');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'hold_blocked_until_official_service_area_or_full_county_office_contract_is_reviewed');

assert.equal(batchSummary.office_layer_rows, 42);
assert.equal(batchSummary.office_layer_distinct_counties, 37);
assert.equal(batchSummary.county_total, 93);

assert.ok(report.includes('Education remains blocked because the live NDE SPED host is reachable'));
assert.ok(report.includes('Service Agencies/Providers leaf is application-oriented'));
assert.ok(report.includes('open official DHHS office app config proves the public office layer only names 37 counties'));
assert.ok(lessons.includes('### Open ExperienceBuilder Configs Can Prove A County Layer Is Still Incomplete'));
assert.ok(lessons.includes('### Service-Agency Application Pages Do Not Count As ESU Or County Routing'));

console.log('test-batch173-nebraska-open-config-blocker-refresh-v1: ok');
