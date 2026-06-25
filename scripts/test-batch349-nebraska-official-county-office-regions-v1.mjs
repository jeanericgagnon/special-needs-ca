import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch349NebraskaOfficialCountyOfficeRegionsV1 } from './run-batch349-nebraska-official-county-office-regions-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  const body = fs.readFileSync(path.join(repoRoot, filePath), 'utf8').trim();
  if (!body) return [];
  return body.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch349NebraskaOfficialCountyOfficeRegionsV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/nebraska_county_local_disability_resources_service_area_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch349_nebraska_official_county_office_regions_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch349-nebraska-official-county-office-regions-report-v1.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);
assert.equal(summary.batch, 'batch349_nebraska_official_county_office_regions_v1');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'verified_county_grade');
assert.match(gap.status_reason, /official Nebraska DHHS N-FOCUS TANF page/i);
assert.match(gap.status_reason, /93 county rows/i);
assert.match(gap.status_reason, /Douglas and Cherry/i);

assert.equal(failureRows.some((row) => row.family === 'county_local_disability_resources'), false);
assert.equal(nextRows.some((row) => row.family === 'county_local_disability_resources'), false);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.family_status, 'verified_county_grade');
assert.equal(verified.blocker_code, null);
assert.equal(verified.evidence_strength, 'strong');
assert.equal(verified.sample_count, 6);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Official county-office region layer'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'County-specific Nebraska office assignments'));

assert.equal(packet.repair_lane, 'retired_complete_from_official_county_office_regions');
assert.equal(packet.county_office_region_contract_verified, true);
assert.equal(packet.county_office_region_count, 93);
assert.equal(packet.office_row_count, 22);

const neQueue = queueRows.find((row) => row.state === 'nebraska');
assert.ok(neQueue);
assert.equal(neQueue.classification, 'COMPLETE');
assert.equal(neQueue.index_safe, true);
assert.equal(neQueue.completeness_pct, 100);
assert.equal(neQueue.weak_critical_families, 0);
assert.equal(neQueue.recommended_batch, 'complete_maintain');
assert.equal(neQueue.repair_lane, 'maintain_truth_only');

assert.equal(allStateAudit.classifications.COMPLETE, 29);
assert.equal(allStateAudit.classifications.BLOCKED, 21);
assert.equal(allStateAudit.indexSafeCount, 29);

const neAudit = allStateAudit.states.find((row) => row.stateId === 'nebraska');
assert.ok(neAudit);
assert.equal(neAudit.classification, 'COMPLETE');
assert.equal(neAudit.indexSafe, true);
assert.equal(neAudit.packetBatch, 'batch349_nebraska_official_county_office_regions_v1');
assert.equal(neAudit.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(neAudit.familyStatuses.county_local_disability_resources, 'verified_county_grade');

assert.match(stateReport, /Nebraska is now COMPLETE and index-safe/i);
assert.match(stateReport, /official `EQUUS_Office` feature layer/i);
assert.match(handoff, /## Current Focus State: Florida/);
assert.doesNotMatch(handoff, /- Nebraska: `official_nebraska_dhhs_site_has_no_public_sitemap_or_search_recovery_and_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf`/);
assert.match(lessons, /### A County Polygon Office-Region Layer Can Clear Local Office Routing Even When The Generic Wrapper Is Weak/);
assert.match(allStateReport, /COMPLETE: 29/);
assert.match(allStateReport, /Nebraska is now COMPLETE\/index-safe/i);
assert.match(batchReport, /Promoted Nebraska from BLOCKED to COMPLETE\/index-safe/i);

assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.county_region_count, 93);
assert.equal(batchSummary.equus_office_count, 22);
assert.equal(batchSummary.county_local_cleared, true);

console.log('test-batch349-nebraska-official-county-office-regions-v1: ok');
