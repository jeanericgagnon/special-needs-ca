import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch408NewMexicoLivePedDvrCompletionV1 } from './run-batch408-new-mexico-live-ped-dvr-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

const result = generateBatch408NewMexicoLivePedDvrCompletionV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch408_new_mexico_live_ped_dvr_refresh_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.complete_ready, false);
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_live_ped_superintendent_directory_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe');
assert.equal(summary.familyStatuses.vocational_rehabilitation_pre_ets, 'verified_current_official_nmdvr_vr_and_pre_ets_host');

const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const statePartBGap = gapRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(statePartBGap.family_status, 'verified_state_grade');
assert.match(statePartBGap.status_reason, /IDEA-by-State page for New Mexico/i);
assert.match(statePartBGap.status_reason, /2025 SPP\/APR and State Determination Letters, Part B/i);

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_live_ped_superintendent_directory_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe');
assert.equal(districtGap.county_grade_required, true);
assert.equal(districtGap.statewide_enough, false);
assert.match(districtGap.status_reason, /155 live rows and 145 unique district codes/i);
assert.match(districtGap.status_reason, /935 current public school rows/i);
assert.match(
  districtGap.status_reason,
  /still does not preserve an explicit county-to-district or county-to-REC geography contract/i,
);

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrGap.family_status, 'verified_current_official_nmdvr_vr_and_pre_ets_host');
assert.equal(vrGap.statewide_enough, true);
assert.match(vrGap.status_reason, /dvr\.state\.nm\.us/i);
assert.match(vrGap.status_reason, /Pre-Employment Transition Services through NMDVR/i);

const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'district_or_county_education_routing');
assert.match(failureRows[0].failure_code, /official_ped_directory_stack_materializes_district_rows/i);

const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');

const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const statePartBVerified = verifiedRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(statePartBVerified.family_status, 'verified_state_grade');
assert.equal(statePartBVerified.evidence_strength, 'strong');
assert.equal(statePartBVerified.sample_count, 2);
assert.match(statePartBVerified.samples[0].source_url, /sites\.ed\.gov\/idea\/state\/new-mexico/);
assert.match(statePartBVerified.samples[1].source_url, /2025-spp-apr-and-state-determination-letters-part-b-new-mexico/);

const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtVerified.family_status, 'blocked_live_ped_superintendent_directory_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe');
assert.equal(districtVerified.evidence_strength, 'weak');
assert.equal(districtVerified.sample_count, 4);
assert.match(districtVerified.samples[1].evidence_snippet, /155 official Superintendent rows and 145 unique district codes/i);
assert.match(districtVerified.samples[2].evidence_snippet, /935 official school rows/i);

const vrVerified = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrVerified.family_status, 'verified_current_official_nmdvr_vr_and_pre_ets_host');
assert.equal(vrVerified.evidence_strength, 'strong');
assert.equal(vrVerified.sample_count, 4);
assert.match(vrVerified.samples[1].source_url, /about-nmdvr/);
assert.match(vrVerified.samples[2].source_url, /pre-ets/);
assert.match(vrVerified.samples[3].evidence_snippet, /Albuquerque, Alamogordo, Carlsbad/i);

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'new-mexico');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.recommended_batch, 'hold_for_official_ped_geography_contract_or_tls_clean_leaf');
assert.equal(queueRow.repair_lane, 'official_geography_contract_only');

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /New Mexico remains BLOCKED and not index-safe/i);
assert.match(report, /live official NMDVR host on `dvr.state.nm.us`/i);
assert.match(report, /IDEA-by-State New Mexico page/i);

const batchSummary = readJson('data/generated/batch408_new_mexico_live_ped_dvr_completion_summary_v1.json');
assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.index_safe, false);
assert.equal(batchSummary.superintendent_rows, 155);
assert.equal(batchSummary.superintendent_unique_district_codes, 145);
assert.equal(batchSummary.school_directory_rows, 935);
assert.equal(batchSummary.dvr_successor_root_live, true);
assert.equal(batchSummary.dvr_pre_ets_leaf_live, true);
assert.equal(batchSummary.dvr_locations_live, true);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
assert.equal(allStateAudit.classifications.COMPLETE, 43);
assert.equal(allStateAudit.classifications.BLOCKED, 7);
assert.equal(allStateAudit.indexSafeCount, 43);
assert.deepEqual(allStateAudit.incorrectlyIndexSafeStates, []);
const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-mexico');
assert.equal(auditRow.classification, 'BLOCKED');
assert.equal(auditRow.indexSafe, false);
assert.equal(auditRow.completenessPct, 92);
assert.equal(auditRow.strongCriticalFamilies, 11);
assert.equal(auditRow.weakCriticalFamilies, 1);
assert.equal(auditRow.packetBatch, 'batch408_new_mexico_live_ped_dvr_refresh_v1');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /- COMPLETE: 43/);
assert.match(allStateReport, /- BLOCKED: 7/);
assert.match(allStateReport, /New Mexico remains blocked after the latest refresh/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /Current Focus State: New Mexico/);
assert.match(handoff, /`district_or_county_education_routing` is still the sole New Mexico blocker/i);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /Public SharePoint Data Streams Can Be Stronger Than Workbook Or Items-API Reads/i);
assert.match(lessons, /Dead Legacy Official Roots Do Not End A Family If A Reviewed State-Owned Successor Host Is Live/i);

const stateCertification = readJson('data/generated/state-certification/new-mexico.json');
assert.equal(stateCertification.pass, false);
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');
assert.equal(stateCertification.summary.classification, 'BLOCKED');
assert.equal(stateCertification.failures.length, 1);

console.log('test-batch408-new-mexico-live-ped-dvr-completion-v1: ok');
