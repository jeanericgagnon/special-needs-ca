import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch385WyomingOfficialRoutingCompletionV1 } from './run-batch385-wyoming-official-routing-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch385WyomingOfficialRoutingCompletionV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'wyoming_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(summary.complete_ready, true);
assert.equal(summary.final_blockers, null);

const gapRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'wyoming_gap_matrix_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const partBGap = gapRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(partBGap.family_status, 'verified_state_grade');
assert.match(partBGap.status_reason, /special education programs provide students with disabilities/i);
assert.match(partBGap.status_reason, /IDEA application and federal-funds administration lane/i);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_state_grade');
assert.match(educationGap.status_reason, /Shelley Hamel/i);
assert.match(educationGap.status_reason, /307-686-1912/i);
assert.match(educationGap.status_reason, /page\/special-services/i);

const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiGap.family_status, 'verified_state_grade');
assert.match(ptiGap.status_reason, /Parent Information Center\/Parent Education Network/i);

const legalAidGap = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAidGap.family_status, 'verified_state_grade');
assert.match(legalAidGap.status_reason, /Legal Aid of Wyoming, Inc\./i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_state_grade');
assert.match(countyGap.status_reason, /HCBS Specialists by County/i);
assert.match(countyGap.status_reason, /Region 1 through Region 14/i);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'wyoming_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const partB = verifiedRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(partB.family_status, 'verified_state_grade');
assert.equal(partB.sample_count, 3);
assert.match(partB.samples[0].source_url, /edu\.wyoming\.gov\/parents\/special-education\/$/);
assert.match(partB.samples[1].source_url, /edu\.wyoming\.gov\/parents\/special-education\/idea\/$/);

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.equal(education.sample_count, 4);
assert.match(education.samples[0].evidence_snippet, /Shelley Hamel/i);
assert.match(education.samples[2].evidence_snippet, /nearly 400 staff members dedicated to serving students with IEPs/i);
assert.match(education.samples[3].source_url, /bighorn1\.com\/sitemap\.xml/);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.equal(pti.sample_count, 3);
assert.match(pti.samples[0].evidence_snippet, /Parent Information Center\/Parent Education Network/i);
assert.match(pti.samples[1].evidence_snippet, /www\.wpic\.org/i);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.equal(legalAid.sample_count, 2);
assert.match(legalAid.samples[0].source_url, /lsc\.gov\/grants\/our-grantees$/);
assert.match(legalAid.samples[1].source_url, /legal-aid-wyoming-inc-program-profile/);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.equal(county.sample_count, 4);
assert.match(county.samples[0].evidence_snippet, /HCBS Specialists by County/i);
assert.match(county.samples[1].source_url, /BES-Caseloads-Effective-10\.2025\.pdf/);
assert.match(county.samples[3].evidence_snippet, /Region 1 through Region 14/i);

const failureText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'wyoming_failure_ledger_v2.jsonl'), 'utf8');
assert.equal(failureText, '');

const nextText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'wyoming_next_action_queue_v2.jsonl'), 'utf8');
assert.equal(nextText, '');

const batchSummary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'batch385_wyoming_official_routing_completion_summary_v1.json'), 'utf8')
);
assert.equal(batchSummary.classification_after, 'COMPLETE');
assert.ok(['BLOCKED', 'COMPLETE'].includes(batchSummary.classification_before));
assert.deepEqual(batchSummary.resolved_families, [
  'special_education_idea_part_b',
  'district_or_county_education_routing',
  'parent_training_information_center',
  'legal_aid',
  'county_local_disability_resources',
]);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'wyoming-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Wyoming is now `COMPLETE` and `index_safe=true`\./);
assert.match(report, /successor WDE Special Education and IDEA pages/i);
assert.match(report, /Parent Information Center\/Parent Education Network/i);
assert.match(report, /official LSC grantee directory and program profile/i);
assert.match(report, /HCBS contacts page publishes `HCBS Specialists by County`/i);

console.log('Wyoming official routing completion test passed.');
