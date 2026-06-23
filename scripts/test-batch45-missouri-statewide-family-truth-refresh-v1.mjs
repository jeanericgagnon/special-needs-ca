import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch45MissouriStatewideFamilyTruthRefreshV1 } from './run-batch45-missouri-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch45MissouriStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/missouri_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/missouri_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/missouri_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/missouri_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/missouri_verified_sources_v1.jsonl');
const priorityRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch45_missouri_statewide_family_truth_refresh_summary_v1.json');
const probes = readJson('data/generated/batch45_missouri_official_probe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/missouri-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Missouri must remain blocked.');
assert.equal(summary.classification, 'BLOCKED', 'Missouri packet summary must remain blocked.');
assert.equal(summary.index_safe, false, 'Missouri must remain not index-safe.');
assert.equal(summary.completeness_pct, 91, 'Missouri completeness must rise once PTI and legal aid are both cleared.');
assert.equal(summary.strong_critical_families, 11, 'Missouri should retain eleven strong critical families.');
assert.equal(summary.weak_critical_families, 1, 'Missouri should retain one weak critical family.');
assert.equal(summary.missing_critical_families, 0, 'Missouri should no longer have any missing critical family.');
assert.deepEqual(summary.major_gap_families, [], 'Missouri should no longer carry stale major blockers.');
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing'], 'Missouri should retain only the education routing blocker.');
assert.equal(summary.primary_gap_reason, 'official_dese_public_directory_postback_reaches_ssrs_shell_but_report_server_returns_404');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_official_dese_public_report_shell_returns_report_server_404');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /public School Directory bridge/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /report-server HTTP 404/i);

assert.equal(failureRows.length, 1, 'Missouri failure ledger should collapse to one exact blocker.');
assert.equal(failureRows[0].family, 'district_or_county_education_routing');
assert.equal(failureRows[0].failure_code, 'official_dese_public_directory_postback_reaches_ssrs_shell_but_report_server_returns_404');
assert.match(failureRows[0].evidence, /HTTP status 404: Not Found/i);

assert.deepEqual(
  nextRows.map((row) => row.family),
  ['district_or_county_education_routing'],
  'Missouri next actions must collapse to the lone remaining blocker.',
);
assert.equal(
  nextRows[0].next_action,
  'author_missouri_district_owned_special_education_or_student_services_leaves_from_local_district_sites',
  'Missouri next action must move off the broken DESE shell and onto district-owned leaf authoring.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 2, 'Missouri PTI must preserve two reviewed first-party samples.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].source_url, 'https://www.missouriparentsact.org/');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[1].source_url, 'https://www.missouriparentsact.org/about-us/');
assert.match(verifiedByFamily.get('parent_training_information_center').samples[1].evidence_snippet, /federally-funded Parent Training and Information Center since 1988/i);
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1, 'Missouri legal aid must preserve the Missouri Legal Services sample.');
assert.equal(verifiedByFamily.get('legal_aid').samples[0].source_url, 'https://www.lsmo.org/');
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 4, 'Missouri education blocker should preserve the sharper DESE probe chain.');
assert.equal(
  verifiedByFamily.get('district_or_county_education_routing').blocker_code,
  'official_dese_public_directory_postback_reaches_ssrs_shell_but_report_server_returns_404',
);

assert.equal(probes.ptiLowTokenBlocked.status, 403, 'Missouri should preserve the low-token PTI challenge evidence.');
assert.equal(probes.ptiBrowserHome.status, 200, 'Missouri should preserve the browser-assisted PTI homepage evidence.');
assert.equal(probes.ptiBrowserAbout.status, 200, 'Missouri should preserve the browser-assisted PTI About page evidence.');
assert.equal(probes.legalAidHome.status, 200, 'Missouri should preserve the legal-aid evidence.');
assert.equal(probes.desePublicReportShell.status, 200, 'Missouri should preserve the public DESE report-shell probe.');
assert.match(probes.desePublicReportShell.evidence, /The request failed with HTTP status 404: Not Found/i);

assert.ok(report.includes('PTI is now repaired through exact first-party MPACT browser evidence'), 'Missouri report must explain the PTI repair.');
assert.ok(report.includes('Legal aid remains repaired through Missouri Legal Services'), 'Missouri report must explain that legal aid is no longer a blocker.');
assert.ok(report.includes('The request failed with HTTP status 404: Not Found.'), 'Missouri report must preserve the sharper DESE 404 evidence.');
assert.ok(report.includes('district-owned local leaf authoring, not more DESE root probing'), 'Missouri report must push the next lane to local district leaves.');

assert.equal(batchSummary.classification, 'BLOCKED', 'Missouri batch summary must still report blocked.');
assert.equal(batchSummary.strong_critical_families, 11, 'Missouri batch summary must carry the stronger statewide count.');
assert.equal(batchSummary.weak_critical_families, 1, 'Missouri batch summary must carry the lone remaining blocker.');

const priorityRow = priorityRows.find((row) => row.state === 'missouri');
assert.equal(priorityRow.classification, 'BLOCKED');
assert.equal(priorityRow.index_safe, false);
assert.equal(priorityRow.completeness_pct, 91);
assert.equal(priorityRow.missing_critical_families, 0);
assert.equal(priorityRow.weak_critical_families, 1);
assert.equal(priorityRow.primary_gap_reason, 'official_dese_public_directory_postback_reaches_ssrs_shell_but_report_server_returns_404');

console.log('test-batch45-missouri-statewide-family-truth-refresh-v1: ok');
