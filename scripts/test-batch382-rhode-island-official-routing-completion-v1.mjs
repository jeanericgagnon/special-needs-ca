import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch382RhodeIslandOfficialRoutingCompletionV1 } from './run-batch382-rhode-island-official-routing-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch382RhodeIslandOfficialRoutingCompletionV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.batch, 'batch382_rhode_island_official_routing_completion_v1');
assert.equal(summary.completeness_pct, 100);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'all_critical_families_verified_with_reviewed_first_party_or_official_evidence'
);
assert.equal(summary.complete_ready, true);
assert.equal(summary.final_blockers, null);

const gapRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_gap_matrix_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_state_grade');
assert.match(educationGap.status_reason, /66 public Local Education Agencies/i);
assert.match(educationGap.status_reason, /Visit Your School District.?s Website/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_state_grade');
assert.match(countyGap.status_reason, /licensed DD service providers/i);
assert.match(countyGap.status_reason, /Cranston, Woonsocket, Warwick, Providence/i);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.equal(education.sample_count, 4);
assert.match(education.samples[0].source_url, /ride\.ri\.gov\/students-families\/ri-public-schools\/school-districts/);
assert.match(education.samples[0].evidence_snippet, /66 public Local Education Agencies/i);
assert.match(education.samples[2].evidence_snippet, /Barrington, Bristol Warren, East Providence, Providence, and Woonsocket/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.equal(county.sample_count, 4);
assert.match(county.samples[0].source_url, /bhddh\.ri\.gov\/developmental-disabilities\/services-adults\/licensed-provider-lists/);
assert.match(county.samples[2].source_url, /Agency%20Provider%20List%205\.5\.25\.pdf/);
assert.match(county.samples[2].evidence_snippet, /Cranston, Action Based Enterprises in Woonsocket, Avatar Residential in Warwick, and Goodwill Industries in Providence/i);
assert.match(county.samples[3].evidence_snippet, /Pawtucket, Bristol, Barrington, Coventry, Middletown, and Westerly/i);

const failureText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_failure_ledger_v2.jsonl'), 'utf8');
assert.equal(failureText, '');

const nextText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_next_action_queue_v2.jsonl'), 'utf8');
assert.equal(nextText, '');

const batchSummary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'batch382_rhode_island_official_routing_completion_summary_v1.json'), 'utf8')
);
assert.equal(batchSummary.classification_after, 'COMPLETE');
assert.ok(['BLOCKED', 'COMPLETE'].includes(batchSummary.classification_before));
assert.deepEqual(batchSummary.resolved_families, ['district_or_county_education_routing', 'county_local_disability_resources']);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'rhode-island-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Rhode Island California-Grade Batch 382 Report v1/);
assert.match(report, /Rhode Island is now `COMPLETE` and `index_safe=true`\./);
assert.match(report, /official RIDE school-districts page publicly enumerates 66 LEAs or districts/i);
assert.match(report, /official BHDDH DD provider page and linked 2025 provider PDFs preserve named developmental-disability organizations/i);

console.log('Rhode Island official routing completion test passed.');
