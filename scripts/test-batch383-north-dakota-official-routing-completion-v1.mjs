import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch383NorthDakotaOfficialRoutingCompletionV1 } from './run-batch383-north-dakota-official-routing-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch383NorthDakotaOfficialRoutingCompletionV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'north-dakota_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.batch, 'batch383_north_dakota_official_routing_completion_v1');
assert.equal(summary.completeness_pct, 100);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'all_critical_families_verified_with_reviewed_first_party_or_official_evidence'
);
assert.equal(summary.complete_ready, true);
assert.equal(summary.final_blockers, null);
assert.ok(summary.verified_source_families_with_samples.includes('legal_aid'));

const gapRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'north-dakota_gap_matrix_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_state_grade');
assert.match(educationGap.status_reason, /List of Districts with NCES Categories/i);
assert.match(educationGap.status_reason, /Bismarck 1, Fargo 1, Grand Forks 1/i);

const legalAidGap = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAidGap.family_status, 'verified_state_grade');
assert.match(legalAidGap.status_reason, /low income and elderly North Dakotans/i);
assert.match(legalAidGap.status_reason, /three methods to apply for legal assistance/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_state_grade');
assert.match(countyGap.status_reason, /Developmental Disabilities Regional Offices/i);
assert.match(countyGap.status_reason, /Burleigh, Emmons, Grant, Kidder/i);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'north-dakota_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.equal(education.sample_count, 3);
assert.match(education.samples[0].source_url, /list-districts-nces-categories/);
assert.match(education.samples[1].source_url, /NCES%20List%20for%20Website\.pdf/);
assert.match(education.samples[2].evidence_snippet, /Bismarck 1, Fargo 1, Grand Forks 1/i);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.equal(legalAid.sample_count, 2);
assert.match(legalAid.samples[0].source_url, /lsnd\.org\/$/);
assert.match(legalAid.samples[0].evidence_snippet, /free legal assistance/i);
assert.match(legalAid.samples[1].evidence_snippet, /visit an office in person, apply online, or apply over the phone/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.equal(county.sample_count, 4);
assert.match(county.samples[0].source_url, /hhs\.nd\.gov\/dd\/offices/);
assert.match(county.samples[1].evidence_snippet, /Burleigh, Emmons, Grant, Kidder/i);
assert.match(county.samples[3].evidence_snippet, /Divide, McKenzie and Williams counties/i);

const failureText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'north-dakota_failure_ledger_v2.jsonl'), 'utf8');
assert.equal(failureText, '');

const nextText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'north-dakota_next_action_queue_v2.jsonl'), 'utf8');
assert.equal(nextText, '');

const batchSummary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'batch383_north_dakota_official_routing_completion_summary_v1.json'), 'utf8')
);
assert.equal(batchSummary.classification_after, 'COMPLETE');
assert.ok(['BLOCKED', 'COMPLETE'].includes(batchSummary.classification_before));
assert.deepEqual(batchSummary.resolved_families, ['district_or_county_education_routing', 'legal_aid', 'county_local_disability_resources']);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'north-dakota-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /North Dakota is now `COMPLETE` and `index_safe=true`\./);
assert.match(report, /official DPI district-list page and linked public PDF preserve an exact statewide district directory/i);
assert.match(report, /first-party Legal Services of North Dakota site explicitly identifies statewide low-income and elderly legal-assistance scope/i);
assert.match(report, /official HHS Developmental Disabilities Regional Offices page publishes county-to-office service contracts/i);

console.log('North Dakota official routing completion test passed.');
