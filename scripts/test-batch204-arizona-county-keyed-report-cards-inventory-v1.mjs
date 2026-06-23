import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildArizonaCountyKeyedDistrictInventory,
} from './run-batch204-arizona-county-keyed-report-cards-inventory-v1.mjs';

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

const syntheticInventory = [
  { educationOrganizationId: 101, entityType: 'LEA', schoolTypes: 'School District', nameOfInstitution: 'Apache Test District' },
  { educationOrganizationId: 102, entityType: 'LEA', schoolTypes: 'School District', nameOfInstitution: 'Pima Test District' },
  { educationOrganizationId: 103, entityType: 'LEA', schoolTypes: 'School District', nameOfInstitution: 'No County District' },
];

const syntheticDetails = {
  101: {
    nameOfInstitution: 'Apache Test District',
    webSite: 'https://apache.example.edu',
    telephone: '111-111-1111',
    address: '123 Main St, St Johns, AZ 85936',
  },
  102: {
    nameOfInstitution: 'Pima Test District',
    webSite: 'https://pima.example.edu',
    telephone: '222-222-2222',
    address: '456 Central Ave, Tucson, AZ 85701',
  },
  103: {
    nameOfInstitution: 'No County District',
    webSite: 'https://none.example.edu',
    telephone: '333-333-3333',
    address: 'Unknown',
  },
};

const syntheticGeocodes = {
  '123 Main St, St Johns, AZ 85936': 'apache-az',
  '456 Central Ave, Tucson, AZ 85701': 'pima-az',
  Unknown: null,
};

const syntheticResult = await buildArizonaCountyKeyedDistrictInventory({
  inventoryRows: syntheticInventory,
  fetchDetail: async (educationOrganizationId) => syntheticDetails[educationOrganizationId],
  geocodeCounty: async (address) => syntheticGeocodes[address] || null,
  targetCounties: ['apache-az', 'pima-az', 'yuma-az'],
});

assert.equal(syntheticResult.countyRows.length, 2);
assert.deepEqual(syntheticResult.countyRows.map((row) => row.county_id), ['apache-az', 'pima-az']);
assert.deepEqual(syntheticResult.missingCountyIds, ['yuma-az']);
assert.equal(syntheticResult.detailFetches, 2);
assert.equal(syntheticResult.geocodeAttempts, 2);
assert.match(syntheticResult.countyRows[0].detail_url, /districts\/Detail\/101$/);

const batchSummary = readJson('data/generated/batch204_arizona_county_keyed_report_cards_inventory_summary_v1.json');
const inventoryRows = readJsonl('data/generated/arizona_report_cards_county_keyed_district_inventory_v1.jsonl');
const stateSummary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const packet = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.index_safe, false);
assert.equal(batchSummary.county_keyed_district_roots, 15);
assert.equal(batchSummary.remaining_unmapped_counties, 0);

assert.equal(inventoryRows.length, 15);
assert.ok(inventoryRows.every((row) => row.county_id.endsWith('-az')));
assert.ok(inventoryRows.every((row) => row.telephone));
assert.ok(inventoryRows.every((row) => row.detail_url && row.api_url));
assert.ok(inventoryRows.some((row) => row.district_website));

assert.equal(stateSummary.primary_gap_reason, 'des_host_challenge_plus_county_keyed_report_cards_roots_without_district_owned_special_education_leaves');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_county_keyed_report_cards_roots_without_district_owned_special_education_leaves');
assert.match(educationGap.status_reason, /county-keyed Arizona district-root inventory/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'official_report_cards_district_roots_county_keyed_but_no_district_owned_special_education_leaves_verified');
assert.match(educationFailure.evidence, /one reviewed district root for all 15 Arizona counties/i);
assert.match(educationFailure.evidence, /apache-az/i);
assert.match(educationFailure.evidence, /yuma-az/i);

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'author_district_owned_special_education_leaves_from_county_keyed_report_cards_roots');

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'blocked_county_keyed_report_cards_roots_without_district_owned_special_education_leaves');
assert.ok(educationVerified.samples.some((sample) => /county-keyed district root/i.test(sample.sample_name)));
assert.ok(educationVerified.samples.some((sample) => /district-owned leaves rather than the challenged AZED host/i.test(sample.evidence_snippet)));

assert.equal(packet.current_problem_metrics.countyKeyedDistrictRootCount, 15);
assert.equal(packet.current_problem_metrics.remainingUnmappedCounties, 0);
assert.equal(packet.reviewed_root_samples.length, 15);
assert.equal(packet.repair_lane, 'county_keyed_report_cards_roots_then_district_owned_leaf_authoring');

const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'des_host_challenge_plus_county_keyed_report_cards_roots_without_district_owned_special_education_leaves');

assert.ok(report.includes('one county-keyed district root for all 15 Arizona counties'));
assert.ok(lessons.includes('Official District Detail Addresses Can Be County-Keyed Without Reopening A Challenged DOE Host'));

console.log('test-batch204-arizona-county-keyed-report-cards-inventory-v1: ok');
