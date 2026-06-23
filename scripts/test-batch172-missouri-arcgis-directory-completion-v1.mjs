import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch172MissouriArcgisDirectoryCompletionV1 } from './run-batch172-missouri-arcgis-directory-completion-v1.mjs';

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

const result = generateBatch172MissouriArcgisDirectoryCompletionV1();
const summary = readJson('data/generated/missouri_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/missouri_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/missouri_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/missouri_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/missouri_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch172_missouri_arcgis_directory_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/missouri-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'none');
assert.deepEqual(summary.critical_gap_families, []);
assert.equal(summary.final_blockers.length, 0);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'verified_county_grade');
assert.match(eduGap.status_reason, /public ArcGIS district layer/i);
assert.match(eduGap.status_reason, /115 Missouri counties/i);

assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].failure_code, 'complete_maintain_truth_only');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_county_grade');
assert.equal(eduVerified.evidence_strength, 'strong');
assert.equal(eduVerified.blocker_code, null);
assert.equal(eduVerified.sample_count, 5);
assert.match(eduVerified.samples[0].source_url, /dese\.mo\.gov\/data-system-management\/directory$/);
assert.match(eduVerified.samples[1].source_url, /mogov\.maps\.arcgis\.com\/apps\/webappviewer/);
assert.match(eduVerified.samples[2].evidence_snippet, /DIST_NAME, DIST_CODE/);
assert.match(eduVerified.samples[3].evidence_snippet, /115 Missouri counties/);
assert.match(eduVerified.samples[4].evidence_snippet, /Adair Co\. R-II/);

assert.equal(batchSummary.cleared_family, 'district_or_county_education_routing');
assert.equal(batchSummary.covered_counties, 115);

assert.ok(report.includes('Missouri now reaches California-grade and is index-safe.'));
assert.ok(report.includes('public ArcGIS district layer'));
assert.ok(lessons.includes('### ArcGIS App Configs Can Expose Official District Layers Even When Older Directory Bridges Rot'));

console.log('test-batch172-missouri-arcgis-directory-completion-v1: ok');
