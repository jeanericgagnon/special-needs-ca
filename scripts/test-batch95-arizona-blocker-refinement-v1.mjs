import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch95ArizonaBlockerRefinementV1 } from './run-batch95-arizona-blocker-refinement-v1.mjs';

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

const result = generateBatch95ArizonaBlockerRefinementV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch95_arizona_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.primary_gap_reason, 'full_domain_challenge_plus_missing_authored_local_leaf_packets');
assert.deepEqual(summary.major_gap_families, []);
assert.deepEqual(summary.final_blockers.map((row) => row.family), ['district_or_county_education_routing', 'county_local_disability_resources']);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.match(byFamily.get('parent_training_information_center').status_reason, /acknowledgements page/i);
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_official_report_cards_inventory_not_yet_converted_to_county_keyed_district_roots');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /official AZ School Report Cards host/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /api\/Entity\/GetEntityList/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Just a moment/i);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /14 Arizona rows/i);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /no authored Arizona county-office leaf packet/i);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /Just a moment/i);

assert.equal(failureRows.some((row) => row.family === 'parent_training_information_center'), false);
assert.equal(nextRows.some((row) => row.family === 'parent_training_information_center'), false);
assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'extract_county_keyed_district_inventory_from_official_report_cards_api_then_author_exact_special_education_leaves');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'author_reviewed_county_specific_office_leaves_before_reopening_browser_lane');

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.equal(ptiVerified.sample_count, 1);
assert.equal(ptiVerified.blocker_code, null);
assert.match(ptiVerified.samples[0].source_url, /about-us\/acknowledgements/);
assert.match(ptiVerified.samples[0].evidence_snippet, /Arizona’s Parent Training and Information \(PTI\) Center/i);

assert.equal(batchSummary.completeness_pct, 83);
assert.deepEqual(batchSummary.repaired_families, ['parent_training_information_center']);
assert.deepEqual(batchSummary.remaining_blockers, ['district_or_county_education_routing', 'county_local_disability_resources']);
assert.equal(batchSummary.official_report_cards_inventory_live, true);
const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'full_domain_challenge_plus_missing_authored_local_leaf_packets');
assert.ok(report.includes('acknowledgements page'));
assert.ok(report.includes('Arizona’s Parent Training and Information (PTI) Center'));
assert.ok(report.includes('official AZ School Report Cards app now proves a public district inventory exists'));
assert.ok(report.includes('no reviewed county-office leaf packet'));
assert.ok(lessons.includes('Full-Domain 403 Plus Fallback-Only Rows Means Packet Gap, Not Just Browser Gap'));
assert.ok(lessons.includes('Challenged DOE Roots Can Still Have Accessible Official Inventory Apps'));

console.log('test-batch95-arizona-blocker-refinement-v1: ok');
