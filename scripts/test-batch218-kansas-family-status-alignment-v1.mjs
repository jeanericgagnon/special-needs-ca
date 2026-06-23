import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch218KansasFamilyStatusAlignmentV1 } from './run-batch218-kansas-family-status-alignment-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const batchSummary = generateBatch218KansasFamilyStatusAlignmentV1();
assert.equal(batchSummary.aligned_status, 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade');

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data/generated/kansas_california_grade_summary_v2.json'), 'utf8'),
);
assert.equal(
  summary.familyStatuses.district_or_county_education_routing,
  'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade',
);

const report = fs.readFileSync(
  path.join(repoRoot, 'docs/generated/batch218-kansas-family-status-alignment-report-v1.md'),
  'utf8',
);
assert.ok(report.includes('past a root-only education blocker'));

console.log('test-batch218-kansas-family-status-alignment-v1: ok');
