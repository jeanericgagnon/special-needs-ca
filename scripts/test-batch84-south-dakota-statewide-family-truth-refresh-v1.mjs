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
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
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

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'verified_state_grade');
assert.match(panda.samples[0].source_url, /drsdlaw\.org/);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /South Dakota PTI South Dakota Parent Connection/i);

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.equal(education.sample_count, 5);
assert.match(education.samples[0].evidence_snippet, /district-specific pages/i);
assert.match(education.samples[1].source_url, /districtnumber=03001/);
assert.match(education.samples[2].source_url, /districtnumber=49005/);
assert.match(education.samples[3].evidence_snippet, /county listings/i);
assert.match(education.samples[4].source_url, /districtnumber=06001/);
assert.match(education.samples[4].evidence_snippet, /Special Education Director/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'blocked_current_dhs_host_without_public_county_or_local_office_contract');
assert.match(county.samples[0].evidence_snippet, /Page Not Found/i);
assert.match(county.samples[1].evidence_snippet, /statewide phone, email, and Pierre mailing contacts/i);
assert.match(county.samples[2].evidence_snippet, /no county field, no local-office list, and no county-to-office contract/i);

const failureRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_failure_ledger_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.match(failureRows[0].failure_code, /page_not_found_localoffices_route/i);

const nextRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_next_action_queue_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'south-dakota-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /district_or_county_education_routing` is now cleared with official DOE district-directory pages/i);
assert.match(report, /legal_aid` is now cleared with the official South Dakota UJS `Get Legal Help` page/i);
assert.match(report, /sole remaining critical blocker/i);

console.log(JSON.stringify({
  ok: true,
  state: 'south-dakota',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
