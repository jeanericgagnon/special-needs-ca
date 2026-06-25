import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch364MaineSearchFinalityV1 } from './run-batch364-maine-search-finality-v1.mjs';

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

const result = generateBatch364MaineSearchFinalityV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const batchSummary = readJson('data/generated/batch364_maine_search_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch364-maine-search-finality-report-v1.md'), 'utf8');
const evidenceArtifact = readJson('data/generated/maine_county_local_routing_evidence_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch364_maine_search_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_dhhs_nav_stack_and_official_maine_search_still_expose_office_addresses_and_labels_but_no_county_or_service_area_contract');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_public_dhhs_nav_stack_and_state_search_without_county_to_office_or_service_area_assignment_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_dhhs_nav_stack_and_state_search_without_county_to_office_or_service_area_assignment_contract');
assert.match(countyGap.status_reason, /official Maine search host/i);
assert.match(countyGap.status_reason, /generic Google CSE shell titled `Maine\.gov: Search IFW`/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhhs_nav_stack_and_maine_search_confirm_office_and_admin_surfaces_but_zero_county_assignment_fields');
assert.match(countyFailure.evidence, /maine\.gov\/search\/\?search=/i);
assert.match(countyFailure.evidence, /generic Google CSE shell titled `Maine\.gov: Search IFW`/i);
assert.match(countyFailure.evidence, /COUNTY`, `TOWN`, and count columns/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 13);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Official Maine Search: Aroostook district office dhhs'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Official Maine Search: county district office ofi'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine DHHS contact navigation stack'));
assert.ok(countyVerified.samples.some((row) => row.source_url.includes('/search/?search=')));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_maine_dhhs_ofi_or_maine_search_surface_exposes_county_to_office_or_service_area_routing');

assert.match(stateReport, /official Maine search host still prove office locations and office labels, not county-to-office or service-area routing/i);
assert.equal(evidenceArtifact.state, 'maine');
assert.match(evidenceArtifact.county_local.reviewed_sources[0].evidence_excerpt, /no county-served or service-area fields/i);
assert.match(evidenceArtifact.county_local.reviewed_sources[1].evidence_excerpt, /1 \(855\) 797-4357/i);
assert.match(evidenceArtifact.county_local.reviewed_sources[2].evidence_excerpt, /Maine\.gov: Search IFW/i);
assert.match(evidenceArtifact.county_local.reviewed_sources[3].evidence_excerpt, /`COUNTY` and count columns only/i);
assert.match(evidenceArtifact.county_local.reviewed_sources[4].evidence_excerpt, /`COUNTY`, `TOWN`, and count columns only/i);
assert.match(evidenceArtifact.county_local.blocker_summary, /county-to-office or service-area assignment contract/i);

assert.equal(batchSummary.official_maine_search_live, true);
assert.equal(batchSummary.official_maine_search_county_queries_with_role_results, 0);
assert.equal(batchSummary.official_maine_search_title, 'Maine.gov: Search IFW');
assert.equal(batchSummary.county_workbook_live, true);
assert.equal(batchSummary.county_workbook_header_starts_with_county_only, true);
assert.equal(batchSummary.county_and_town_workbook_live, true);
assert.equal(batchSummary.county_and_town_workbook_header_starts_with_county_and_town_only, true);
assert.equal(batchSummary.county_crosswalk_found, false);
assert.equal(batchSummary.result, 'official_nav_stack_and_state_search_office_addresses_and_labels_without_county_routing_contract');
assert.match(batchReport, /real official Maine search parameter/i);

console.log('test-batch364-maine-search-finality-v1: ok');
