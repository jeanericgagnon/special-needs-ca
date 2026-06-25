import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch366SouthDakotaOfficialRoutingRepairV1 } from './run-batch366-south-dakota-official-routing-repair-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch366SouthDakotaOfficialRoutingRepairV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'current_dhs_host_exposes_no_public_county_or_local_office_contract_for_south_dakota_county_local_disability_routing'
);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.match(education.samples[1].source_url, /districtnumber=03001/);
assert.match(education.samples[1].evidence_snippet, /Special Education Director/i);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.match(legalAid.samples[0].source_url, /ujs\.sd\.gov\/self-help\/get-legal-help/);
assert.match(legalAid.samples[2].evidence_snippet, /East River Legal Services and Dakota Plains Legal Services/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'blocked_current_dhs_host_without_public_county_or_local_office_contract');
assert.match(county.samples[0].evidence_snippet, /Page Not Found/i);
assert.match(county.samples[1].evidence_snippet, /DHSInfo@state\.sd\.us/i);
assert.match(county.samples[2].source_url, /dhs\.sd\.gov\/en\/staff-directory/);
assert.match(county.samples[2].evidence_snippet, /Intake Team assists the public with referrals/i);

const evidence = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_dhs_public_local_routing_evidence_v1.json'), 'utf8')
);
assert.match(evidence.county_local.reviewed_sources[0].evidence_excerpt, /We have updated our website and this page does not exist/i);
assert.match(evidence.county_local.reviewed_sources[1].evidence_excerpt, /605-773-5990/);
assert.match(evidence.county_local.reviewed_sources[1].evidence_excerpt, /Pierre, SD 57501/);
assert.match(evidence.county_local.reviewed_sources[2].evidence_excerpt, /application process for services provided by the Division/i);
assert.match(evidence.county_local.blocker_summary, /no public county-to-office, county-to-service, or local-office routing contract/i);

const failureRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_failure_ledger_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'south-dakota-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /district_or_county_education_routing` is now cleared with official DOE district-directory pages/i);
assert.match(report, /legal_aid` is now cleared with the official South Dakota UJS `Get Legal Help` page/i);
assert.match(report, /sole remaining critical blocker/i);

console.log('South Dakota official routing repair test passed.');
