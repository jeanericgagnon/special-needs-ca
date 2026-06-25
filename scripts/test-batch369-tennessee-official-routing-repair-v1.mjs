import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch369TennesseeOfficialRoutingRepairV1 } from './run-batch369-tennessee-official-routing-repair-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch369TennesseeOfficialRoutingRepairV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'tennessee_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'all_critical_families_verified_with_reviewed_first_party_or_official_evidence'
);
assert.equal(summary.complete_ready, true);
assert.equal(summary.final_blockers, null);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'tennessee_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.match(education.samples[0].source_url, /k-12\.education\.tn\.gov\/sde\/$/);
assert.match(education.samples[2].evidence_snippet, /Excel file of Tennessee Schools, Districts, and Regions/i);
assert.match(education.samples[3].evidence_snippet, /149 unique school districts/i);

const vr = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vr.family_status, 'verified_state_grade');
assert.match(vr.samples[0].source_url, /office-locator-trc-ttap/);
assert.match(vr.samples[1].evidence_snippet, /Bedford County, Benton County, Maury County, Sumner County, and Williamson County/i);
assert.match(vr.samples[3].evidence_snippet, /five required Pre-ETS services/i);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.match(legalAid.samples[0].source_url, /help4tn\.org\/$/);
assert.match(legalAid.samples[1].evidence_snippet, /Tennessee Free Legal Answers/i);
assert.match(legalAid.samples[2].evidence_snippet, /844-HELP4TN/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.match(county.samples[0].source_url, /tdhs-find-our-offices/);
assert.match(county.samples[1].evidence_snippet, /Family Assistance District\/County Office Hours/i);
assert.match(county.samples[3].evidence_snippet, /Davidson County Office and Shelby County Family Assistance Office/i);

const failureText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'tennessee_failure_ledger_v2.jsonl'), 'utf8');
assert.equal(failureText, '');

const nextText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'tennessee_next_action_queue_v2.jsonl'), 'utf8');
assert.equal(nextText, '');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'tennessee-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Tennessee is now `COMPLETE` and `index_safe=true`\./);
assert.match(report, /Tennessee School Directory publicly supports district search/i);
assert.match(report, /TDHS publishes a county-based Family Assistance office locator/i);
assert.match(report, /official VR office locator, employment-services page, and Pre-Employment Transition Services page/i);
assert.match(report, /Help4TN preserves current first-party Tennessee Alliance for Legal Services routing/i);

console.log('Tennessee official routing repair test passed.');
