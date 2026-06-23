import fs from 'fs';
import path from 'path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch186MinnesotaBrowserContractRefinementV1 } from './run-batch186-minnesota-browser-contract-refinement-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch186MinnesotaBrowserContractRefinementV1();

const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch186_minnesota_browser_contract_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'official_mdeorg_directory_root_is_live_but_linked_child_is_miswired_or_challenged_and_mn_dhs_county_tribal_replatform_lands_on_live_radware_captcha');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_live_mdeorg_root_with_miswired_or_challenged_child_contracts');
assert.match(educationGap.status_reason, /slide-style course shell/i);
assert.match(educationGap.status_reason, /Radware captcha/i);
assert.match(educationGap.status_reason, /MDEAnalytics\/Data\.jsp/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_replatformed_mn_dhs_family_on_live_radware_captcha');
assert.match(countyGap.status_reason, /validate\.perfdrive\.com/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'official_mdeorg_root_live_but_child_contract_is_miswired_or_challenged');
assert.match(educationFailure.evidence, /searchable database/i);
assert.match(educationFailure.evidence, /slide-style course shell/i);
assert.match(educationFailure.evidence, /MdeOrgView/i);
assert.match(educationFailure.evidence, /DataSecure\.jsp/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha');
assert.match(countyFailure.evidence, /Please validate your request/i);
assert.match(countyFailure.evidence, /Radware Bot Manager Captcha/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.blocker_code, 'official_mdeorg_root_live_but_child_contract_is_miswired_or_challenged');
assert.ok(educationVerified.samples.find((row) => row.source_url === 'https://education.mn.gov/mdeprod/groups/communications/documents/unzip/048426/index.html'));
assert.match(educationVerified.samples[0].evidence_snippet, /Data\.jsp/i);
assert.match(educationVerified.samples[2].evidence_snippet, /Sleds\.jsp/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha');
assert.ok(countyVerified.samples.find((row) => row.source_url === 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/'));

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_blocked_until_reviewed_first_party_mdeorg_query_or_export_contract_exists');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_contract_exists');

assert.equal(batchSummary.mdeorg_root_live, true);
assert.equal(batchSummary.embedded_child_miswired_course_shell, true);
assert.equal(batchSummary.mdeanalytics_radware_captcha, true);
assert.equal(batchSummary.mndhs_replatform_radware_captcha, true);
assert.match(report, /exact child surfaces that are either miswired into unrelated course content or challenge-protected/i);
assert.match(lessons, /Embedded Official Front-Ends Can Resolve To The Wrong Product Entirely/);
assert.match(lessons, /Official Directory Roots Can Leak Exact Child Endpoints Even When Public Access Stays Blocked/);

console.log('test-batch186-minnesota-browser-contract-refinement-v1: ok');
