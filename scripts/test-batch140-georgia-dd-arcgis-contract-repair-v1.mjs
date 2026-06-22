import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch140GeorgiaDdArcgisContractRepairV1 } from './run-batch140-georgia-dd-arcgis-contract-repair-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const target = path.join(repoRoot, relativePath);
  if (!fs.existsSync(target)) return [];
  return fs.readFileSync(target, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch140GeorgiaDdArcgisContractRepairV1();
const summary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch140_georgia_dd_arcgis_contract_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(summary.final_blockers, null);

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');

assert.equal(ddGap.family_status, 'verified_state_grade');
assert.match(ddGap.status_reason, /FeatureServer layer/i);
assert.equal(failureRows.length, 0);
assert.equal(ddVerified.family_status, 'verified_state_grade');
assert.equal(ddVerified.sample_count, 159);
assert.equal(ddVerified.blocker_code, null);
assert.equal(ddVerified.samples.length, 3);
assert.match(ddVerified.query_basis, /159 Georgia counties/i);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].severity, 'info');

assert.equal(batchSummary.arcgis_county_features, 159);
assert.equal(batchSummary.arcgis_region_values, 6);
assert.ok(report.includes('Georgia is now COMPLETE and index-safe.'));
assert.ok(report.includes('public item-data and FeatureServer query preserve a deterministic 159-county county-to-region map'));
assert.ok(lessons.includes('### ArcGIS Item Data Can Rescue A Generic Instant-App Shell'));

console.log('test-batch140-georgia-dd-arcgis-contract-repair-v1: ok');
