import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch333MinnesotaLiveRouteAndDhs404RefreshV1 } from './run-batch333-minnesota-live-route-and-dhs-404-refresh-v1.mjs';

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

const result = generateBatch333MinnesotaLiveRouteAndDhs404RefreshV1();
const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch333_minnesota_live_route_and_dhs_404_refresh_summary_v1.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'mde_description_page_is_live_mdeorg_root_flaps_between_live_glossary_and_radware_child_routes_stay_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated');

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_mde_description_page_live_root_flaps_and_child_routes_are_radware_blocked');
assert.match(districtGap.status_reason, /description page still loading publicly/i);
assert.match(districtGap.status_reason, /root is unstable/i);
assert.match(districtGap.status_reason, /district, county, contact-search, contact-type, and analytics routes stayed bot-gated/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_mn_dhs_successor_county_tribal_state_directory_is_bot_gated');
assert.match(countyGap.status_reason, /saved disability-services replacement URLs still return official DHS 404 pages/i);
assert.match(countyGap.status_reason, /county, Tribal and state directory/i);

const districtFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtFailure.failure_code, 'official_mde_description_page_is_live_mdeorg_root_flaps_and_district_county_contact_and_analytics_routes_are_radware_blocked');
assert.match(districtFailure.evidence, /Schools and Organizations \(MDE-ORG\)/i);
assert.match(districtFailure.evidence, /MDE Organization Reference Glossary/i);
assert.match(districtFailure.evidence, /MdeOrgView\/districts\/index/i);
assert.match(districtFailure.evidence, /validate\.perfdrive\.com/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_mn_dhs_404_shell_points_to_successor_county_tribal_state_directory_but_that_route_is_radware_blocked');
assert.match(countyFailure.evidence, /county-tribal-state-offices\.jsp/i);
assert.match(countyFailure.evidence, /Radware Bot Manager Captcha/i);

const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtVerified.family_status, 'blocked_mde_description_page_live_root_flaps_and_child_routes_are_radware_blocked');
assert.equal(districtVerified.sample_count, 6);
assert.ok(districtVerified.samples.some((sample) => sample.source_url === 'https://education.mn.gov/MDE/about/SchOrg/' && sample.verification_status === 'verified'));
assert.ok(districtVerified.samples.some((sample) => sample.sample_name === 'Minnesota MDE-ORG glossary root live render' && sample.verification_status === 'reviewed'));
assert.ok(districtVerified.samples.some((sample) => sample.sample_name === 'Minnesota MDE-ORG glossary root exact rerun' && sample.verification_status === 'blocked'));
assert.ok(districtVerified.samples.some((sample) => sample.source_url === 'https://pub.education.mn.gov/MdeOrgView/districts/index' && sample.verification_status === 'blocked'));

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_mn_dhs_successor_county_tribal_state_directory_is_bot_gated');
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_successor_route_radware'));

const nextDistrict = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(nextDistrict.next_action, 'hold_blocked_until_reviewed_first_party_mdeorg_root_or_export_contract_stays_public');
const nextCounty = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(nextCounty.next_action, 'hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_state_directory_stays_public');

const queueRow = queueRows.find((row) => row.state === 'minnesota');
assert.equal(queueRow.primary_gap_reason, 'mde_description_page_is_live_mdeorg_root_flaps_between_live_glossary_and_radware_child_routes_stay_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated');

const allStateRow = allStateAudit.states.find((row) => row.stateId === 'minnesota');
assert.equal(allStateRow.packetBatch, 'batch333_minnesota_live_route_and_dhs_404_refresh_v1');
assert.equal(allStateRow.packetPrimaryGapReason, 'mde_description_page_is_live_mdeorg_root_flaps_between_live_glossary_and_radware_child_routes_stay_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated');
assert.equal(allStateRow.familyStatuses.county_local_disability_resources, 'blocked_mn_dhs_successor_county_tribal_state_directory_is_bot_gated');

assert.equal(batchSummary.live_mde_root, false);
assert.equal(batchSummary.mde_root_flapping, true);
assert.equal(batchSummary.live_mde_district_route, false);
assert.equal(batchSummary.blocked_mde_root_and_child_routes, 5);
assert.equal(batchSummary.dhs_saved_replacement_404_count, 1);
assert.equal(batchSummary.dhs_successor_route_bot_gated, true);

assert.match(stateReport, /MDE-ORG glossary root is unstable/i);
assert.match(allStateReport, /MDE-ORG root flaps between a live glossary page and Radware/i);
assert.ok(handoff.includes('## Current Focus State: Minnesota'));
assert.ok(handoff.includes('mde_description_page_is_live_mdeorg_root_flaps_between_live_glossary_and_radware_child_routes_stay_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated'));
assert.ok(lessons.includes('### Live Description Pages Do Not Rescue A Bot-Gated Directory Family'));
assert.ok(lessons.includes('### Official 404 Shells Can Still Expose The Real Successor Lane'));

console.log('test-batch333-minnesota-live-route-and-dhs-404-refresh-v1: ok');
