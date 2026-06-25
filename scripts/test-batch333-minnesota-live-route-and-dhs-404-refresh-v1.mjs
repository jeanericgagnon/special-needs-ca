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

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.primary_gap_reason, 'browser_reviewed_mdeorg_and_mn_dhs_successor_routes_now_clear_minnesota_to_complete');
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.index_safe, true);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'verified_browser_reviewed_official_mdeorg_county_directory_and_special_education_contacts');
assert.match(districtGap.status_reason, /public `Schools and Districts` route exposes district listings/i);
assert.match(districtGap.status_reason, /public `Counties` route lists all 87 Minnesota counties/i);
assert.match(districtGap.status_reason, /district detail leaves preserve superintendent name, email, phone, website, physical address, and county/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_browser_reviewed_official_mn_dhs_county_tribal_state_directory');
assert.match(countyGap.status_reason, /named successor `Minnesota Health Care Program county, Tribal and state directory` is browser-readable/i);
assert.match(countyGap.status_reason, /Aitkin County/i);
assert.match(countyGap.status_reason, /White Earth Financial Services/i);
assert.match(countyGap.status_reason, /Yellow Medicine County/i);

const districtFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtFailure, undefined);
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure, undefined);

const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtVerified.family_status, 'verified_browser_reviewed_official_mdeorg_county_directory_and_special_education_contacts');
assert.equal(districtVerified.sample_count, 7);
assert.ok(districtVerified.samples.some((sample) => sample.source_url === 'https://education.mn.gov/MDE/about/SchOrg/' && sample.verification_status === 'verified'));
assert.ok(districtVerified.samples.some((sample) => sample.source_url === 'https://pub.education.mn.gov/MdeOrgView/districts/index' && sample.verification_status === 'reviewed'));
assert.ok(districtVerified.samples.some((sample) => sample.source_url === 'https://pub.education.mn.gov/MdeOrgView/reference/county' && sample.verification_status === 'reviewed'));
assert.ok(districtVerified.samples.some((sample) => sample.source_url === 'https://pub.education.mn.gov/MdeOrgView/organization/show/262' && sample.verification_status === 'reviewed'));
assert.ok(districtVerified.samples.some((sample) => sample.source_url === 'https://pub.education.mn.gov/MdeOrgView/contact/contactsByContactType?contactRoleTypeCode=SPEC_ED_DIR_Contact' && sample.verification_status === 'reviewed'));
assert.equal(districtVerified.blocker_code, null);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_browser_reviewed_official_mn_dhs_county_tribal_state_directory');
assert.equal(countyVerified.sample_count, 5);
assert.equal(countyVerified.blocker_code, null);
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_successor_directory_route' && sample.verification_status === 'reviewed'));
assert.ok(countyVerified.samples.some((sample) => /Aitkin County/.test(sample.evidence_snippet)));
assert.ok(countyVerified.samples.some((sample) => /White Earth Financial Services/.test(sample.evidence_snippet)));
assert.ok(countyVerified.samples.some((sample) => /Yellow Medicine County/.test(sample.evidence_snippet)));

const nextDistrict = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(nextDistrict, undefined);
const nextCounty = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(nextCounty, undefined);

const queueRow = queueRows.find((row) => row.state === 'minnesota');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.completeness_pct, 100);
assert.equal(queueRow.weak_critical_families, 0);
assert.equal(queueRow.primary_gap_reason, 'browser_reviewed_mdeorg_and_mn_dhs_successor_routes_now_clear_minnesota_to_complete');
assert.equal(queueRow.recommended_batch, 'maintain_truth_only');
assert.equal(queueRow.status, 'COMPLETE');

const allStateRow = allStateAudit.states.find((row) => row.stateId === 'minnesota');
assert.equal(allStateAudit.classifications.COMPLETE, 32);
assert.equal(allStateAudit.classifications.BLOCKED, 18);
assert.equal(allStateAudit.indexSafeCount, 32);
assert.equal(allStateRow.classification, 'COMPLETE');
assert.equal(allStateRow.indexSafe, true);
assert.equal(allStateRow.strongCriticalFamilies, 12);
assert.equal(allStateRow.weakCriticalFamilies, 0);
assert.equal(allStateRow.completenessPct, 100);
assert.equal(allStateRow.packetBatch, 'batch333_minnesota_live_route_and_dhs_404_refresh_v1');
assert.equal(allStateRow.packetPrimaryGapReason, 'browser_reviewed_mdeorg_and_mn_dhs_successor_routes_now_clear_minnesota_to_complete');
assert.equal(allStateRow.familyStatuses.district_or_county_education_routing, 'verified_browser_reviewed_official_mdeorg_county_directory_and_special_education_contacts');
assert.equal(allStateRow.familyStatuses.county_local_disability_resources, 'verified_browser_reviewed_official_mn_dhs_county_tribal_state_directory');

assert.equal(batchSummary.browser_reviewed_mde_district_route, true);
assert.equal(batchSummary.browser_reviewed_mde_county_route, true);
assert.equal(batchSummary.browser_reviewed_mde_county_member_page, true);
assert.equal(batchSummary.browser_reviewed_mde_district_detail_page, true);
assert.equal(batchSummary.browser_reviewed_special_education_contacts, true);
assert.equal(batchSummary.raw_mde_root_still_flapping, true);
assert.equal(batchSummary.dhs_saved_replacement_404_count, 1);
assert.equal(batchSummary.browser_reviewed_dhs_successor_directory, true);
assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);

assert.match(stateReport, /Minnesota is now COMPLETE and index_safe=true/i);
assert.match(stateReport, /county_local_disability_resources is verified from the browser-reviewed official DHS county\/Tribal\/state successor directory/i);
assert.match(allStateReport, /Minnesota is now COMPLETE and index-safe/i);
assert.ok(handoff.includes('## Current Focus State: Maine'));
assert.ok(!handoff.includes('- Minnesota: `'));
assert.ok(handoff.includes('Michigan, Minnesota, Mississippi'));
assert.ok(lessons.includes('### Browser-Readable Child Routes Can Clear A Flapping Raw-Fetch Directory'));
assert.ok(lessons.includes('### Official 404 Shells Can Still Expose The Real Successor Lane'));
assert.ok(lessons.includes('### Browser-Reviewed Successor Directories Can Retire A Raw-Fetch Blocker'));

console.log('test-batch333-minnesota-live-route-and-dhs-404-refresh-v1: ok');
