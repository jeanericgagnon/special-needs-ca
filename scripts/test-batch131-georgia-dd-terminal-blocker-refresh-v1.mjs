import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch131GeorgiaDdTerminalBlockerRefreshV1 } from './run-batch131-georgia-dd-terminal-blocker-refresh-v1.mjs';

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

const result = generateBatch131GeorgiaDdTerminalBlockerRefreshV1();
const summary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch131_georgia_dd_terminal_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_county_page_points_to_unpublished_region_leaves_and_no_public_replacement_contract');

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
const ddFailure = failureRows.find((row) => row.family === 'developmental_disability_idd_authority');
const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
const ddNext = nextRows.find((row) => row.family === 'developmental_disability_idd_authority');

assert.match(ddGap.status_reason, /locations\/regional-offices is now HTTP 404/i);
assert.match(ddGap.status_reason, /Zone Lookup app shell exposes no county\/region\/service contract/i);
assert.match(ddFailure.evidence, /The older DBHDD regional-offices replacement root now returns HTTP 404/i);
assert.match(ddFailure.evidence, /generic "Zone Lookup" shell/i);
assert.match(ddFailure.evidence, /no county names, region names, FeatureServer\/MapServer reference/i);
assert.match(ddVerified.query_basis, /404 replacement root/i);
assert.match(ddNext.evidence, /deterministic 159-county county-to-region map still cannot be verified/i);

assert.equal(batchSummary.replacement_root_status, 404);
assert.equal(batchSummary.arcgis_shell_title, 'Zone Lookup');
assert.equal(batchSummary.arcgis_public_contract_found, false);
assert.ok(report.includes('The old official replacement root is now a hard 404'));
assert.ok(lessons.includes('### Generic ArcGIS Instant-App Shells Do Not Count As County Contracts'));

console.log('test-batch131-georgia-dd-terminal-blocker-refresh-v1: ok');
