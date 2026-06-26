import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const summary = readJson(path.join(repoRoot, 'data', 'generated', 'arizona_california_grade_summary_v2.json'));
const gapRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'arizona_gap_matrix_v2.jsonl'));
const failureRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'arizona_failure_ledger_v2.jsonl'));
const verifiedRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'arizona_verified_sources_v1.jsonl'));
const nextRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'arizona_next_action_queue_v2.jsonl'));
const inventoryRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'arizona_report_cards_county_keyed_district_inventory_v1.jsonl'));
const audit = readJson(path.join(repoRoot, 'data', 'generated', 'all_state_california_grade_audit_v3.json'));
const queueRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'all_state_priority_queue_v3.jsonl'));
const batchSummary = readJson(path.join(repoRoot, 'data', 'generated', 'batch390_arizona_education_clears_county_local_sole_blocker_summary_v1.json'));
const handoff = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.primary_gap_reason, 'des_public_office_page_only_links_nonreviewable_salesforce_locator_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract');
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'verified_county_grade');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_des_salesforce_locator_plus_altcs_html_and_county_map_without_county_contract');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(eduGap);
assert.equal(eduGap.family_status, 'verified_county_grade');
assert.match(eduGap.status_reason, /Mohave County now also clears/i);
assert.match(eduGap.status_reason, /Yavapai County also clears through a better official LEA/i);

assert.equal(failureRows.some((row) => row.family === 'district_or_county_education_routing'), false);
assert.deepEqual(nextRows.map((row) => row.family), ['county_local_disability_resources']);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(eduVerified);
assert.equal(eduVerified.family_status, 'verified_county_grade');
assert.equal(eduVerified.sample_count, 7);
assert.equal(eduVerified.blocker_code, null);
assert.ok(eduVerified.samples.some((sample) => sample.sample_name === 'Mohave Valley detail root with reverse-geocoded county'));
assert.ok(eduVerified.samples.some((sample) => sample.sample_name === 'Yavapai Prescott Unified detail root with reverse-geocoded county'));
assert.ok(eduVerified.samples.some((sample) => sample.sample_name === 'Prescott Unified Exceptional Student Services leaf'));

const countyLocalVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyLocalVerified);
assert.equal(countyLocalVerified.sample_count, 5);
assert.ok(countyLocalVerified.samples.some((sample) => sample.sample_name === 'AHCCCS ALTCS Offices page'));
assert.ok(countyLocalVerified.samples.some((sample) => sample.sample_name === 'AHCCCS ALTCS County Map PDF'));
assert.ok(countyLocalVerified.samples.some((sample) => sample.sample_name === 'Stale ALTCS member-resource path'));
assert.ok(countyLocalVerified.samples.some((sample) => sample.sample_name === 'DES office page and linked Salesforce locator'));
assert.match(countyLocalVerified.blocker_evidence, /PlansProviders\/Downloads\/ALTCS_CountyMap\.pdf/);
assert.match(countyLocalVerified.blocker_evidence, /Salesforce-hosted office locator/i);

const mohaveInventory = inventoryRows.find((row) => row.county_id === 'mohave-az');
assert.equal(mohaveInventory.educationOrganizationId, 4379);
assert.equal(mohaveInventory.geocode_source, 'official_census_reverse_geocoder_coordinates');

const yavapaiInventory = inventoryRows.find((row) => row.county_id === 'yavapai-az');
assert.equal(yavapaiInventory.educationOrganizationId, 4466);
assert.equal(yavapaiInventory.geocode_source, 'official_census_reverse_geocoder_coordinates');

const auditRow = audit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.strongCriticalFamilies, 11);
assert.equal(auditRow.weakCriticalFamilies, 1);
assert.equal(auditRow.completenessPct, 92);
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'verified_county_grade');
assert.equal(auditRow.packetPrimaryGapReason, 'des_public_office_page_only_links_nonreviewable_salesforce_locator_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract');

const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.completeness_pct, 92);
assert.equal(queueRow.weak_critical_families, 1);
assert.equal(queueRow.primary_gap_reason, 'des_public_office_page_only_links_nonreviewable_salesforce_locator_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract');

assert.equal(batchSummary.sole_blocker, 'county_local_disability_resources');
assert.equal(batchSummary.mohave_reverse_geocode_county, 'Mohave County');
assert.equal(batchSummary.yavapai_reverse_geocode_county, 'Yavapai County');

assert.match(handoff, /- Arizona: `des_public_office_page_only_links_nonreviewable_salesforce_locator_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract`/);
assert.match(lessons, /Reverse-Geocode Official Coordinates When The One-Line Address Lane Fails/);
