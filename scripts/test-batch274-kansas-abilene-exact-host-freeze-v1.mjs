import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch274KansasAbileneExactHostFreezeV1 } from './run-batch274-kansas-abilene-exact-host-freeze-v1.mjs';

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

const result = generateBatch274KansasAbileneExactHostFreezeV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch274_kansas_abilene_exact_host_freeze_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch274-kansas-abilene-exact-host-freeze-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const gapRow = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gapRow.family_status, 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade');
assert.match(gapRow.status_reason, /Abilene USD 435/i);
assert.match(gapRow.status_reason, /Wichita USD 259/i);

assert.equal(failureRows.length, 1);
assert.match(failureRows[0].evidence, /abileneschools\.org/);
assert.match(failureRows[0].evidence, /sitemap\.xml/);
assert.match(failureRows[0].evidence, /no role-exact special-education/i);

const verifiedRow = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(verifiedRow.query_basis, /exact same-domain non-match freezes/i);
assert.ok(verifiedRow.samples.some((sample) => sample.sample_name === 'dickinson district non-match homepage-and-sitemap'));

assert.equal(nextRows.length, 1);
assert.match(nextRows[0].evidence, /Dickinson is now frozen more tightly/i);

assert.equal(batchSummary.new_exact_non_match_county, 'dickinson-ks');
assert.equal(batchSummary.exact_non_match_root, 'https://www.abileneschools.org/');

assert.ok(report.includes('Abilene Public Schools'));
assert.ok(report.includes('sitemap.xml'));
assert.ok(handoff.includes('https://www.abileneschools.org/sitemap.xml'));
assert.ok(handoff.includes('## Current Focus State: Kansas'));
assert.ok(batchReport.includes('Batch 274 Kansas Abilene Exact Host Freeze v1'));

console.log('test-batch274-kansas-abilene-exact-host-freeze-v1: ok');
