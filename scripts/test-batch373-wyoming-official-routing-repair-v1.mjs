import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch373WyomingOfficialRoutingRepairV1 } from './run-batch373-wyoming-official-routing-repair-v1.mjs';

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

const result = generateBatch373WyomingOfficialRoutingRepairV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.deepEqual(result.repaired_families, [
  'parent_training_information_center',
  'legal_aid',
]);
assert.equal(result.remaining_blocker_family, 'district_or_county_education_routing');

const summary = readJson('data/generated/wyoming_california_grade_summary_v2.json');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 75);
assert.equal(summary.strong_critical_families, 9);
assert.equal(summary.weak_critical_families, 3);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing', 'county_local_disability_resources']);
assert.deepEqual(summary.major_gap_families, ['special_education_idea_part_b']);
assert.equal(
  summary.primary_gap_reason,
  'official_wde_special_education_hosts_return_cloudflare_403_and_reviewed_wdh_local_surfaces_still_lack_public_county_disability_contracts'
);
assert.equal(summary.final_blockers.length, 3);
assert.equal(summary.final_blockers[0].family, 'special_education_idea_part_b');
assert.equal(summary.final_blockers[1].family, 'district_or_county_education_routing');
assert.equal(summary.final_blockers[2].family, 'county_local_disability_resources');

const gapRows = readJsonl('data/generated/wyoming_gap_matrix_v2.jsonl');
const specialEd = gapRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(specialEd.family_status, 'blocked_official_wde_special_education_hosts_returning_cloudflare_403');
assert.match(specialEd.status_reason, /Cloudflare `Attention Required!` HTTP 403/i);

const district = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(district.family_status, 'blocked_official_wde_hosts_and_unreviewed_local_district_special_education_leaves');
assert.match(district.status_reason, /generic district roots such as Albany County School District #1/i);
assert.match(district.status_reason, /no reviewed public statewide district directory/i);

const pti = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.status_reason, /Parent Training and Information Center \(PTI\) since 1991/i);
assert.match(pti.status_reason, /Office of Special Education Programs/i);

const legalAid = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.match(legalAid.status_reason, /free civil legal help to low-income individuals in Wyoming/i);
assert.match(legalAid.status_reason, /county-filtered `Legal Services Directory by County`/i);

const county = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'blocked_official_wdh_local_resource_hosts_without_public_county_contract');
assert.match(county.status_reason, /Aging and Disability Resource Center path/i);
assert.match(county.status_reason, /Cloudflare `Attention Required!` HTTP 403/i);

const failureRows = readJsonl('data/generated/wyoming_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 3);
assert.equal(failureRows[0].family, 'special_education_idea_part_b');
assert.equal(failureRows[1].family, 'district_or_county_education_routing');
assert.equal(failureRows[2].family, 'county_local_disability_resources');

const verifiedRows = readJsonl('data/generated/wyoming_verified_sources_v1.jsonl');
const specialEdVerified = verifiedRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(specialEdVerified.family_status, 'blocked_official_wde_special_education_hosts_returning_cloudflare_403');
assert.equal(specialEdVerified.sample_count, 2);
assert.match(specialEdVerified.samples[0].source_url, /for-parents-students\/special-programs\/special-education/);

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.match(ptiVerified.samples[0].source_url, /wpic\.org\/about/);
assert.match(ptiVerified.samples[1].evidence_snippet, /Office of Special Education Programs/i);

const legalAidVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAidVerified.family_status, 'verified_state_grade');
assert.match(legalAidVerified.samples[0].source_url, /lawyoming\.org/);
assert.match(legalAidVerified.samples[3].evidence_snippet, /Gillette, Lander, Cheyenne, Casper, and Cody/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_official_wdh_local_resource_hosts_without_public_county_contract');
assert.equal(
  countyVerified.blocker_code,
  'official_wdh_local_resource_hosts_return_cloudflare_403_or_only_locator_surfaces_without_public_county_contract'
);
assert.match(countyVerified.samples[1].evidence_snippet, /Aging and Disability Resource Center path returned a Cloudflare/i);

const nextRows = readJsonl('data/generated/wyoming_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 3);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');
assert.equal(nextRows[1].family, 'special_education_idea_part_b');
assert.equal(nextRows[2].family, 'county_local_disability_resources');

const batchSummary = readJson('data/generated/batch373_wyoming_official_routing_repair_summary_v1.json');
assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.remaining_blocker_family, 'district_or_county_education_routing');
assert.deepEqual(batchSummary.repaired_families, [
  'parent_training_information_center',
  'legal_aid',
]);

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/wyoming-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /Wyoming remains `BLOCKED` and `index_safe=false`\./);
assert.match(stateReport, /`parent_training_information_center` now clears/i);
assert.match(stateReport, /`legal_aid` now clears/i);
assert.match(stateReport, /`special_education_idea_part_b` remains blocked/i);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch373-wyoming-official-routing-repair-report-v1.md'), 'utf8');
assert.match(batchReport, /cleared Wyoming PTI and legal aid/i);
assert.match(batchReport, /returned Cloudflare `Attention Required!` HTTP 403 pages/i);

console.log('test-batch373-wyoming-official-routing-repair-v1: ok');
