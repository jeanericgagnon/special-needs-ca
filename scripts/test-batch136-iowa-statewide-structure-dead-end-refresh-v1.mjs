import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch136IowaStatewideStructureDeadEndRefreshV1 } from './run-batch136-iowa-statewide-structure-dead-end-refresh-v1.mjs';

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

const result = generateBatch136IowaStatewideStructureDeadEndRefreshV1();
const summary = readJson('data/generated/iowa_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/iowa_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/iowa_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/iowa_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/iowa_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch136_iowa_statewide_structure_dead_end_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/iowa-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch136-iowa-statewide-structure-dead-end-refresh-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'official_iowa_education_pages_loop_only_to_statewide_structure_and_geodata');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_statewide_structure_dead_end');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /No reviewed external AEA domain or district-owned special-education page is exposed/i);

assert.equal(failures.length, 1);
assert.equal(failures[0].failure_code, 'official_iowa_education_pages_loop_only_to_statewide_structure_and_geodata');
assert.match(failures[0].evidence, /no reviewed external AEA domains/i);
assert.match(failures[0].evidence, /no district-owned special-education leaves/i);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('district_or_county_education_routing').blocker_code, 'official_iowa_education_pages_loop_only_to_statewide_structure_and_geodata');
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 4);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].next_action, 'hold_blocked_until_reviewed_district_owned_or_aea_owned_special_education_leaves_are_authored_outside_statewide_structure_pages');

assert.equal(batchSummary.refined_family, 'district_or_county_education_routing');
assert.equal(batchSummary.official_outbound_local_links_found, 0);
assert.match(report, /statewide structural dead ends for local routing|statewide structural dead ends that never link out to concrete AEA or district-owned routing leaves/i);
assert.ok(batchReport.includes('official_outbound_local_links_found: 0'));
assert.ok(lessons.includes('### Statewide Map And Governance Pages Are Dead Ends When They Never Link Out To Local Education Operators'));

console.log('test-batch136-iowa-statewide-structure-dead-end-refresh-v1: ok');
