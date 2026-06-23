import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch286NorthCarolinaOfficialCountyContractCompletionV1 } from './run-batch286-north-carolina-official-county-contract-completion-v1.mjs';

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

const result = generateBatch286NorthCarolinaOfficialCountyContractCompletionV1();
const summary = readJson('data/generated/north-carolina_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/north-carolina_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/north-carolina_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/north-carolina_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/north-carolina_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/north-carolina-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch286_north_carolina_official_county_contract_completion_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch286-north-carolina-official-county-contract-completion-report-v1.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'none');
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_county_grade');
assert.match(educationGap.status_reason, /115 2024 `LEA` rows/i);
assert.match(educationGap.status_reason, /all 100 North Carolina counties/i);
assert.match(educationGap.status_reason, /Eleven counties explicitly preserve multi-district routing/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_county_grade');
assert.match(countyGap.status_reason, /all 100 North Carolina counties/i);
assert.match(countyGap.status_reason, /richmond-county-division-social-services/i);

assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].failure_code, 'complete_maintain_truth_only');
assert.match(nextRows[0].evidence, /115 2024 LEA rows/i);
assert.match(nextRows[0].evidence, /100 counties/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'verified_county_grade');
assert.equal(educationVerified.blocker_code, null);
assert.equal(educationVerified.sample_count, 5);
assert.ok(educationVerified.samples.some((sample) => sample.source_url.includes('/demographics-and-finances/eddie')));
assert.ok(educationVerified.samples.some((sample) => sample.source_url.includes('/school-report-card-resources-researchers')));
assert.ok(educationVerified.samples.some((sample) => sample.source_url.includes('/src-data-set-2023-2024/open')));

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_county_grade');
assert.equal(countyVerified.blocker_code, null);
assert.equal(countyVerified.sample_count, 4);
assert.ok(countyVerified.samples.some((sample) => sample.source_url.includes('/local-dss-directory')));
assert.ok(countyVerified.samples.some((sample) => sample.source_url.includes('richmond-county-division-social-services')));

const queueRow = queueRows.find((row) => row.state === 'north-carolina');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.status, 'COMPLETE');
assert.equal(queueRow.repair_lane, 'maintain_truth_only');

const auditNc = allStateAudit.states.find((row) => row.stateId === 'north-carolina');
assert.equal(auditNc.classification, 'COMPLETE');
assert.equal(auditNc.indexSafe, true);
assert.equal(auditNc.completenessPct, 100);
assert.equal(auditNc.weakCriticalFamilies, 0);
assert.equal(auditNc.familyStatuses.district_or_county_education_routing, 'verified_county_grade');
assert.equal(auditNc.familyStatuses.county_local_disability_resources, 'verified_county_grade');

assert.equal(allStateAudit.classifications.COMPLETE, 24);
assert.equal(allStateAudit.classifications.BLOCKED, 26);
assert.equal(allStateAudit.indexSafeCount, 24);

assert.ok(stateReport.includes('North Carolina now reaches California-grade and is index-safe.'));
assert.ok(stateReport.includes('official NC DPI School Report Card location dataset'));
assert.ok(stateReport.includes('official NCDHHS Local DSS Directory plus county-leaf sitemap contract'));

assert.ok(allStateReport.includes('COMPLETE: 24'));
assert.ok(allStateReport.includes('BLOCKED: 26'));
assert.ok(allStateReport.includes('North Carolina'));

assert.ok(handoff.includes('Current Focus State: New York'));
assert.ok(!handoff.includes('- North Carolina: `generic_or_statewide_evidence_used_where_local_required`'));
assert.ok(handoff.includes('https://www.p12.nysed.gov/ds/jmt.html'));
assert.ok(handoff.includes('## Next State Order After North Carolina'));

assert.ok(lessons.includes('### Official County-Keyed Datasets And County-Leaf Sitemaps Can Clear Local Families Without One-Off Leaf Authoring'));

assert.equal(batchSummary.education_lea_rows_2024, 115);
assert.equal(batchSummary.education_unique_counties, 100);
assert.equal(batchSummary.education_multi_district_counties, 11);
assert.equal(batchSummary.county_dss_leaf_count, 100);
assert.deepEqual(batchSummary.county_dss_missing_counties, []);

assert.ok(batchReport.includes('North Carolina Official County Contract Completion Report v1'));
assert.ok(batchReport.includes('North Carolina is now COMPLETE/index_safe.'));

console.log('test-batch286-north-carolina-official-county-contract-completion-v1: ok');
