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
  'public_ride_directory_and_public_dhs_office_stack_expose_local_entities_but_zero_public_county_or_special_education_service_area_contracts'
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

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  county.family_status,
  'blocked_public_dhs_office_stack_without_county_or_service_area_contract'
);
assert.match(county.samples[1].source_url, /dhs\.ri\.gov\/sitemap\.xml/);
assert.match(county.samples[2].evidence_snippet, /no county-served or service-area field/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'rhode-island-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Rhode Island remains BLOCKED and not index-safe\./);
assert.match(report, /public RIDE directory surfaces inventory districts and special-education school types/i);
assert.match(report, /public DHS office surfaces inventory office leaves and addresses/i);

console.log('Rhode Island official local routing finality test passed.');
