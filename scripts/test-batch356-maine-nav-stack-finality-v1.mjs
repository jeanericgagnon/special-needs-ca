import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch356MaineNavStackFinalityV1 } from './run-batch356-maine-nav-stack-finality-v1.mjs';

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

const result = generateBatch356MaineNavStackFinalityV1();
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
const batchSummary = readJson('data/generated/batch356_maine_nav_stack_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch356-maine-nav-stack-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch356_maine_nav_stack_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_public_dhhs_nav_stack_without_county_to_office_or_service_area_assignment_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_dhhs_nav_stack_without_county_to_office_or_service_area_assignment_contract');
assert.match(countyGap.status_reason, /Administrative Office Locations/i);
assert.match(countyGap.status_reason, /sitemap/i);
assert.match(countyGap.status_reason, /zero county-served fields/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhhs_nav_stack_confirms_office_and_admin_surfaces_but_zero_county_assignment_fields');
assert.match(countyFailure.evidence, /offices-divisions/i);
assert.match(countyFailure.evidence, /administrative-offices/i);
assert.match(countyFailure.evidence, /about\/sitemap/i);
assert.match(countyFailure.evidence, /19 Maine Ave, Bangor, ME 04401/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 11);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine DHHS Offices/Divisions page'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine DHHS Administrative Office Locations'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine DHHS Sitemap'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine DHHS contact navigation stack'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_maine_dhhs_or_ofi_surface_exposes_county_to_office_or_service_area_routing');

const queueRow = queueRows.find((row) => row.state === 'maine');
assert.equal(queueRow.primary_gap_reason, 'official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'maine');
assert.equal(auditRow.packetBatch, 'batch356_maine_nav_stack_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract');
assert.equal(auditRow.familyStatuses.county_local_disability_resources, 'blocked_public_dhhs_nav_stack_without_county_to_office_or_service_area_assignment_contract');

assert.match(stateReport, /full public DHHS navigation stack still proves office locations and office labels, not county-to-office or service-area routing/i);
assert.match(allStateReport, /fuller DHHS navigation-stack finality check/i);
assert.match(handoff, /Current Focus State: Maine/);
assert.match(handoff, /Offices\/Divisions and Administrative Office Locations/i);
assert.match(handoff, /Maine DHHS Administrative Office Locations/);
assert.match(handoff, /1\. Idaho/);

assert.equal(batchSummary.offices_divisions_page_live, true);
assert.equal(batchSummary.administrative_offices_page_live, true);
assert.equal(batchSummary.dhhs_sitemap_page_live, true);
assert.equal(batchSummary.county_crosswalk_found, false);
assert.equal(batchSummary.result, 'official_nav_stack_office_addresses_and_labels_without_county_routing_contract');
assert.match(batchReport, /full live DHHS navigation stack/i);

console.log('test-batch356-maine-nav-stack-finality-v1: ok');
