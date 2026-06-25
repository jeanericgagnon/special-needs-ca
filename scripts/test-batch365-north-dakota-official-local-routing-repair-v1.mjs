import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch365NorthDakotaOfficialLocalRoutingRepairV1 } from './run-batch365-north-dakota-official-local-routing-repair-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch365NorthDakotaOfficialLocalRoutingRepairV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'north-dakota_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'public_dpi_surfaces_expose_statewide_special_education_and_district_inventory_but_zero_public_county_or_district_special_education_routing_contract'
);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'north-dakota_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(
  education.family_status,
  'blocked_public_dpi_without_public_county_or_district_special_education_routing_contract'
);
assert.match(education.samples[0].source_url, /nd\.gov\/dpi\/education-programs\/special-education/);
assert.match(education.samples[1].evidence_snippet, /no county field or special-education routing contract/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.match(county.samples[0].evidence_snippet, /local offices in each county/i);
assert.match(county.samples[3].source_url, /hhs\.nd\.gov\/service-locations\/human-service\/zones\/buffalo-bridges/);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.match(legalAid.samples[0].source_url, /lsnd\.org/);
assert.match(legalAid.samples[1].evidence_snippet, /Legal Services Corporation/i);

const failureRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'north-dakota_failure_ledger_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'district_or_county_education_routing');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'north-dakota-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /county_local_disability_resources` is now cleared with official HHS Human Service Zone county routing/i);
assert.match(report, /legal_aid` is now cleared with current first-party Legal Services of North Dakota/i);
assert.match(report, /sole remaining critical blocker/i);

console.log('North Dakota official local routing repair test passed.');
