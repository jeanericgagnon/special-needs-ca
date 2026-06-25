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
assert.equal(summary.primary_gap_reason, 'live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s');

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked');
assert.match(districtGap.status_reason, /Schools and Districts.*loading publicly|route all loading publicly/i);
assert.match(districtGap.status_reason, /county route, contact search route, contact-type route, and analytics export route still collapse into Radware/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_mn_dhs_saved_county_tribal_replacements_are_official_404s');
assert.match(countyGap.status_reason, /returned official DHS 404 pages/i);

const districtFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtFailure.failure_code, 'official_mdeorg_root_and_district_page_are_live_but_county_contact_and_analytics_contracts_remain_radware_blocked');
assert.match(districtFailure.evidence, /MDE Organization Reference Glossary/i);
assert.match(districtFailure.evidence, /Schools and Districts/i);
assert.match(districtFailure.evidence, /validate\.perfdrive\.com/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_mn_dhs_saved_county_tribal_replacements_now_resolve_to_404_without_public_county_contract');
assert.match(countyFailure.evidence, /returned HTTP 404/i);
assert.match(countyFailure.evidence, /404 \/ Minnesota Department of Human Services/i);

const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtVerified.family_status, 'blocked_live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked');
assert.equal(districtVerified.sample_count, 5);
assert.ok(districtVerified.samples.some((sample) => sample.source_url === 'https://pub.education.mn.gov/MdeOrgView/districts/index' && sample.verification_status === 'verified'));
assert.ok(districtVerified.samples.some((sample) => sample.source_url === 'https://pub.education.mn.gov/MdeOrgView/reference/county' && sample.verification_status === 'blocked'));

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_mn_dhs_saved_county_tribal_replacements_are_official_404s');
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_replacement_404'));

const nextDistrict = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(nextDistrict.next_action, 'hold_blocked_until_reviewed_first_party_mdeorg_county_or_contact_export_contract_exists');
const nextCounty = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(nextCounty.next_action, 'hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_successor_exists');

const queueRow = queueRows.find((row) => row.state === 'minnesota');
assert.equal(queueRow.primary_gap_reason, 'live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s');

const allStateRow = allStateAudit.states.find((row) => row.stateId === 'minnesota');
assert.equal(allStateRow.packetBatch, 'batch333_minnesota_live_route_and_dhs_404_refresh_v1');
assert.equal(allStateRow.packetPrimaryGapReason, 'live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s');
assert.equal(allStateRow.familyStatuses.county_local_disability_resources, 'blocked_mn_dhs_saved_county_tribal_replacements_are_official_404s');

assert.equal(batchSummary.live_mde_root, true);
assert.equal(batchSummary.live_mde_district_route, true);
assert.equal(batchSummary.blocked_mde_county_contact_analytics_routes, 4);
assert.equal(batchSummary.dhs_saved_replacement_404_count, 2);

assert.match(stateReport, /district page are live, but the county, contact, and analytics routes are still Radware-blocked/i);
assert.match(allStateReport, /Minnesota remains blocked, but the blocker is now narrower and more accurate/i);
assert.ok(handoff.includes('## Current Focus State: Minnesota'));
assert.ok(handoff.includes('live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s'));
assert.ok(lessons.includes('### Live Navigation Chrome Still Fails If County And Contact Contracts Stay Bot-Gated'));
assert.ok(lessons.includes('### Replatformed Official Replacements Should Be Downgraded To 404 Truth When The Gate Disappears'));

console.log('test-batch333-minnesota-live-route-and-dhs-404-refresh-v1: ok');
