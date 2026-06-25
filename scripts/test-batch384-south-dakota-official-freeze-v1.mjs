import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch384SouthDakotaOfficialFreezeV1 } from './run-batch384-south-dakota-official-freeze-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch384SouthDakotaOfficialFreezeV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'official_doe_special_education_directory_and_first_party_legal_aid_are_verified_but_no_public_dhs_county_or_region_disability_office_contract_exists'
);
assert.ok(summary.verified_source_families_with_samples.includes('legal_aid'));
assert.equal(summary.complete_ready, false);
assert.equal(summary.final_blockers.length, 1);

const gapRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_gap_matrix_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_state_grade');
assert.match(educationGap.status_reason, /Special Education Director/i);
assert.match(educationGap.status_reason, /Nicole Olson/i);
assert.match(educationGap.status_reason, /Denise Kennedy/i);

const legalAidGap = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAidGap.family_status, 'verified_state_grade');
assert.match(legalAidGap.status_reason, /Dakota Plains Legal Services/i);
assert.match(legalAidGap.status_reason, /eight offices/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_no_public_county_or_region_disability_office_contract');
assert.match(countyGap.status_reason, /Page Not Found/i);
assert.match(countyGap.status_reason, /county-to-office or region-to-county/i);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.equal(education.sample_count, 4);
assert.match(education.samples[0].source_url, /edudir\.aspx/);
assert.match(education.samples[1].evidence_snippet, /Nicole Olson/i);
assert.match(education.samples[2].evidence_snippet, /Stacy Allen/i);
assert.match(education.samples[3].evidence_snippet, /Denise Kennedy/i);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.equal(legalAid.sample_count, 2);
assert.match(legalAid.samples[0].source_url, /dpls\.org/);
assert.match(legalAid.samples[0].evidence_snippet, /free legal assistance/i);
assert.match(legalAid.samples[1].evidence_snippet, /eight offices/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'blocked_no_public_county_or_region_disability_office_contract');
assert.equal(county.sample_count, 4);
assert.match(county.samples[0].evidence_snippet, /unresolvable/i);
assert.match(county.samples[1].evidence_snippet, /Page Not Found/i);
assert.match(county.samples[2].source_url, /contact-us/);
assert.match(county.samples[3].source_url, /staff-directory/);

const failureRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_failure_ledger_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.match(failureRows[0].evidence, /Page Not Found/i);

const nextRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_next_action_queue_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');

const batchSummary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'batch384_south_dakota_official_freeze_summary_v1.json'), 'utf8')
);
assert.equal(batchSummary.classification_before, 'BLOCKED');
assert.equal(batchSummary.classification_after, 'BLOCKED');
assert.deepEqual(batchSummary.resolved_families, ['district_or_county_education_routing', 'legal_aid']);
assert.deepEqual(batchSummary.remaining_blockers, ['county_local_disability_resources']);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'south-dakota-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /South Dakota remains `BLOCKED` and `index_safe=false`\./);
assert.match(report, /official DOE directory exposes district-specific pages with named special-education directors/i);
assert.match(report, /Dakota Plains Legal Services/i);
assert.match(report, /reviewed official DHS successor lanes still do not publish a county-to-office or region-to-county/i);

console.log('South Dakota official freeze test passed.');
