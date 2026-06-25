import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch353MaineOfiContactMapFinalityV1 } from './run-batch353-maine-ofi-contact-map-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch353MaineOfiContactMapFinalityV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch353_maine_ofi_contact_map_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch353-maine-ofi-contact-map-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch353_maine_ofi_contact_map_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_dhhs_office_stack_ofi_contact_page_and_show_map_shortlinks_still_expose_no_county_or_service_area_contract');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_public_dhhs_office_stack_ofi_contact_and_map_shortlinks_without_office_assignment_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_dhhs_office_stack_ofi_contact_and_map_shortlinks_without_office_assignment_contract');
assert.match(countyGap.status_reason, /OFI contact page.*only repeats the same `District Office locations` link/i);
assert.match(countyGap.status_reason, /Google Maps address geocodes/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhhs_office_stack_ofi_contact_and_map_shortlinks_expose_office_addresses_but_zero_county_assignment_fields');
assert.match(countyFailure.evidence, /ofi\/about-us\/contact/i);
assert.match(countyFailure.evidence, /35 Anthony Ave, Augusta, ME 04330/i);
assert.match(countyFailure.evidence, /19 Maine Ave, Bangor, ME 04401/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 9);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine OFI Contact page'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Augusta Show Map shortlink'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Bangor Show Map shortlink'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_maine_dhhs_or_ofi_surface_exposes_county_to_office_or_service_area_routing');

const queueRow = queueRows.find((row) => row.state === 'maine');
assert.equal(queueRow.primary_gap_reason, 'official_dhhs_office_stack_ofi_contact_page_and_show_map_shortlinks_still_expose_no_county_or_service_area_contract');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'maine');
assert.equal(auditRow.packetBatch, 'batch353_maine_ofi_contact_map_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_dhhs_office_stack_ofi_contact_page_and_show_map_shortlinks_still_expose_no_county_or_service_area_contract');
assert.equal(auditRow.familyStatuses.county_local_disability_resources, 'blocked_public_dhhs_office_stack_ofi_contact_and_map_shortlinks_without_office_assignment_contract');

assert.match(stateReport, /OFI contact page, OFI programs-and-services page, and sampled `Show Map` shortlinks still expose office-grade address proof without county routing/i);
assert.match(allStateReport, /OFI contact page, and sampled `Show Map` links still only expose office addresses and generic eligibility routing/i);
assert.match(handoff, /Current Focus State: Maine/);
assert.match(handoff, /Sample Show Map: Augusta office/);
assert.match(handoff, /Sample Show Map: Bangor office/);
assert.match(lessons, /Address Map Shortlinks Still Do Not Prove County Service Areas/);

assert.equal(batchSummary.ofi_contact_page_live, true);
assert.equal(batchSummary.ofi_programs_services_page_live, true);
assert.equal(batchSummary.sampled_show_map_shortlinks_live, 2);
assert.equal(batchSummary.sampled_show_map_shortlinks_are_address_geocodes_only, true);
assert.equal(batchSummary.sampled_show_map_shortlinks_have_county_metadata, false);
assert.equal(batchSummary.county_crosswalk_found, false);
assert.equal(batchSummary.result, 'office_addresses_and_map_geocodes_without_county_routing_contract');
assert.match(batchReport, /OFI contact\/help lane and sampled `Show Map` shortlinks/i);

console.log('test-batch353-maine-ofi-contact-map-finality-v1: ok');
