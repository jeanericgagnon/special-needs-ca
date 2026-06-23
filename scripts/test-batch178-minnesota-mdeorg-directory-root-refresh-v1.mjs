import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch178MinnesotaMdeorgDirectoryRootRefreshV1 } from './run-batch178-minnesota-mdeorg-directory-root-refresh-v1.mjs';

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

generateBatch178MinnesotaMdeorgDirectoryRootRefreshV1();

const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch178_minnesota_mdeorg_directory_root_refresh_summary_v1.json');
const educationPacket = readJson('data/generated/minnesota_district_or_county_education_routing_directory_contract_packet_v1.json');
const countyPacket = readJson('data/generated/minnesota_county_local_disability_resources_radware_packet_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(
  summary.primary_gap_reason,
  'official_mdeorg_directory_root_is_live_but_public_directory_contract_is_embedded_or_challenged_and_mn_dhs_local_office_family_is_stale_or_radware_challenged'
);

const educationBlocker = summary.final_blockers.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationBlocker);
assert.equal(
  educationBlocker.failure_code,
  'official_mdeorg_directory_root_is_live_but_query_or_export_contract_is_embedded_or_challenged'
);
assert.equal(educationBlocker.next_action, 'browser_assisted_or_cached_capture_only_for_live_mdeorg_directory_contract');
assert.match(educationBlocker.evidence, /MDE-ORG/i);
assert.match(educationBlocker.evidence, /searchable database/i);
assert.match(educationBlocker.evidence, /048426\/index\.html/i);
assert.match(educationBlocker.evidence, /findsch/i);
assert.match(educationBlocker.evidence, /Radware/i);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationGap);
assert.equal(educationGap.family_status, 'blocked_live_mdeorg_directory_root_without_static_county_contract');
assert.match(educationGap.status_reason, /MDE-ORG/i);
assert.match(educationGap.status_reason, /searchable database/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationFailure);
assert.equal(educationFailure.failure_code, 'official_mdeorg_directory_root_is_live_but_query_or_export_contract_is_embedded_or_challenged');
assert.match(educationFailure.evidence, /MDE-ORG/i);
assert.match(educationFailure.evidence, /searchable database/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationVerified);
assert.equal(educationVerified.family_status, 'blocked_live_mdeorg_directory_root_without_static_county_contract');
assert.equal(educationVerified.blocker_code, 'official_mdeorg_directory_root_is_live_but_query_or_export_contract_is_embedded_or_challenged');
assert.match(educationVerified.query_basis, /embedded directory bundle/i);

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationNext);
assert.equal(educationNext.next_action, 'browser_assisted_or_cached_capture_only_for_live_mdeorg_directory_contract');
assert.match(educationNext.evidence, /MDE-ORG/i);

assert.equal(batchSummary.state, 'minnesota');
assert.equal(batchSummary.education_blocker_sharpened, true);
assert.equal(batchSummary.education_packet_created, true);
assert.equal(batchSummary.county_packet_created, true);
assert.equal(batchSummary.blocker_basis, 'live_mdeorg_root_plus_embedded_bundle_and_public_search_shell_audit');

assert.equal(educationPacket.repair_lane, 'browser_or_cached_capture_only');
assert.equal(educationPacket.current_problem_metrics.countyRowCount, 87);
assert.equal(educationPacket.current_problem_metrics.liveDirectoryRootAccessible, true);
assert.equal(educationPacket.current_problem_metrics.embeddedBundleMiswired, true);
assert.equal(educationPacket.current_problem_metrics.publicSearchChallengeProtected, true);
assert.ok(educationPacket.representative_sources.includes('https://pub.education.mn.gov/MDEAnalytics/Data.jsp'));

assert.equal(countyPacket.repair_lane, 'browser_or_cached_capture_only');
assert.equal(countyPacket.current_problem_metrics.countyRowCount, 87);
assert.equal(countyPacket.current_problem_metrics.legacyJspStale, true);
assert.equal(countyPacket.current_problem_metrics.replacementFamilyLiveButCaptchaProtected, true);
assert.ok(countyPacket.representative_sources.includes('https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/'));

assert.match(report, /MDE-ORG/i);
assert.match(report, /embedded/i);
assert.match(report, /challenge-protected/i);
assert.match(lessons, /Live Directory Glossaries Can Hide The Real Query Contract In An Embedded Bundle/);

console.log('test-batch178-minnesota-mdeorg-directory-root-refresh-v1: ok');
