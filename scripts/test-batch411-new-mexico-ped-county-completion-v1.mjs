import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch411NewMexicoPedCountyCompletionV1 } from './run-batch411-new-mexico-ped-county-completion-v1.mjs';

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

const result = generateBatch411NewMexicoPedCountyCompletionV1();
assert.equal(result.classification, 'COMPLETE');
assert.equal(result.countyRows, 33);

const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch411_new_mexico_ped_county_completion_v1');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, []);
assert.equal(summary.complete_ready, true);
assert.equal(summary.final_blockers, null);
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'verified_county_grade');

const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'verified_county_grade');
assert.match(districtGap.status_reason, /PED Superintendent directory items API/i);
assert.match(districtGap.status_reason, /official Census .*onelineaddress.* resolved/i);
assert.match(districtGap.status_reason, /Catron County stayed unmatched/i);
assert.match(districtGap.status_reason, /Reserve Independent Schools page preserves the district office address/i);

const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 0);

const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 0);

const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtVerified.family_status, 'verified_county_grade');
assert.equal(districtVerified.evidence_strength, 'strong');
assert.equal(districtVerified.sample_count, 33);
assert.equal(districtVerified.blocker_code, null);
assert.match(districtVerified.query_basis, /all 33 counties/i);
assert.match(districtVerified.samples[0].source_url, /geographies\/onelineaddress/);
assert.match(districtVerified.samples[0].evidence_snippet, /official PED Superintendent directory preserves district office address/i);
assert.ok(districtVerified.samples.some((sample) => /Catron County/.test(sample.sample_name)));
assert.ok(districtVerified.samples.some((sample) => /geographies\/coordinates/.test(sample.source_url)));

const matrixRows = readJsonl('data/generated/batch411_new_mexico_ped_county_geocode_matrix_v1.jsonl');
assert.equal(matrixRows.length, 33);
const countyNames = new Set(matrixRows.map((row) => row.county_name));
assert.equal(countyNames.size, 33);
assert.ok(countyNames.has('Catron County'));
assert.ok(countyNames.has('Bernalillo County'));
assert.ok(countyNames.has('Doña Ana County'));
const catron = matrixRows.find((row) => row.county_name === 'Catron County');
assert.equal(catron.district_code, '002');
assert.equal(catron.geography_method, 'official_census_reverse_geocoder_from_first_party_district_coordinates');
assert.match(catron.source_url, /reserveschools\.com/);
assert.match(catron.county_geography_url, /geographies\/coordinates/);
assert.match(catron.evidence_snippet, /Catron County/);

const batchSummary = readJson('data/generated/batch411_new_mexico_ped_county_completion_summary_v1.json');
assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.county_matrix_rows, 33);
assert.equal(batchSummary.counties_closed_from_ped_addresses, 32);
assert.equal(batchSummary.catron_closed_from_first_party_coordinates, true);
assert.deepEqual(batchSummary.counts, { complete: 44, blocked: 6, indexSafe: 44 });

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'new-mexico');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.completeness_pct, 100);
assert.equal(queueRow.weak_critical_families, 0);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /New Mexico is now `COMPLETE` and `index_safe=true`/);
assert.match(report, /Catron County.*first-party Reserve.*coordinates/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
assert.equal(allStateAudit.classifications.COMPLETE, 44);
assert.equal(allStateAudit.classifications.BLOCKED, 6);
assert.equal(allStateAudit.indexSafeCount, 44);
assert.deepEqual(allStateAudit.incorrectlyIndexSafeStates, []);
const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-mexico');
assert.equal(auditRow.classification, 'COMPLETE');
assert.equal(auditRow.indexSafe, true);
assert.equal(auditRow.completenessPct, 100);
assert.equal(auditRow.strongCriticalFamilies, 12);
assert.equal(auditRow.weakCriticalFamilies, 0);
assert.equal(auditRow.packetBatch, 'batch411_new_mexico_ped_county_completion_v1');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /- COMPLETE: 44/);
assert.match(allStateReport, /- BLOCKED: 6/);
assert.match(allStateReport, /New Mexico is now COMPLETE\/index-safe/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.ok(!/New Mexico: `/.test(handoff));
assert.match(handoff, /## Current Focus State: Arizona/);
assert.match(handoff, /sole Arizona blocker/i);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /First-Party District Coordinates Can Close The Last County When State Directory Addresses Fail The Geocoder/);

console.log('test-batch411-new-mexico-ped-county-completion-v1: ok');
