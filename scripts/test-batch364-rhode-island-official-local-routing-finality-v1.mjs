import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch364RhodeIslandOfficialLocalRoutingFinalityV1 } from './run-batch364-rhode-island-official-local-routing-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch364RhodeIslandOfficialLocalRoutingFinalityV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(
  summary.primary_gap_reason,
  'public_ride_directory_exposes_district_inventory_but_zero_public_county_or_special_education_routing_contract'
);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(
  education.family_status,
  'blocked_public_ride_directory_without_public_county_or_special_education_routing_contract'
);
assert.match(education.samples[0].source_url, /ride\.ri\.gov\/students-families\/ri-public-schools\/school-directory/);
assert.match(education.samples[1].evidence_snippet, /authenticated users/i);
assert.match(education.samples[3].source_url, /www2\.ride\.ri\.gov\/Applications\/MasterDirectory\/Organization_Default\.aspx/);
assert.match(education.samples[3].evidence_snippet, /HTTP 503/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.match(county.samples[0].source_url, /dhs\.ri\.gov\/office-locator-tool/);
assert.match(county.samples[0].evidence_snippet, /city\/town/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'rhode-island-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Rhode Island remains BLOCKED and not index-safe\./);
assert.match(report, /`district_or_county_education_routing` remains the sole critical blocker/i);
assert.match(report, /`county_local_disability_resources` now stays cleared/i);

console.log('Rhode Island official local routing finality test passed.');
