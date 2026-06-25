import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch367VirginiaOfficialRoutingRepairV1 } from './run-batch367-virginia-official-routing-repair-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch367VirginiaOfficialRoutingRepairV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'virginia_california_grade_summary_v2.json'), 'utf8')
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

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'virginia_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.match(education.samples[0].source_url, /schoolquality\.virginia\.gov\/divisions$/);
assert.match(education.samples[0].evidence_snippet, /133 results/i);
assert.match(education.samples[2].evidence_snippet, /superintendent, region, and division website/i);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].source_url, /peatc\.org\/about/);
assert.match(pti.samples[0].evidence_snippet, /parent information and training center/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.match(county.samples[0].source_url, /dss\.virginia\.gov\/localagency\/index\.php/);
assert.match(county.samples[1].evidence_snippet, /Search by county or use the filters/i);
assert.match(county.samples[3].evidence_snippet, /Albemarle County Department of Social Services/i);

const failureText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'virginia_failure_ledger_v2.jsonl'), 'utf8');
assert.equal(failureText, '');

const nextText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'virginia_next_action_queue_v2.jsonl'), 'utf8');
assert.equal(nextText, '');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'virginia-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Virginia is now `COMPLETE` and `index_safe=true`\./);
assert.match(report, /School Quality Profiles host publicly enumerates all 133 divisions/i);
assert.match(report, /DSS local-department directory is explicitly county-searchable/i);
assert.match(report, /PEATC About page explicitly identifies PEATC as Virginia.?s parent information and training center/i);

console.log('Virginia official routing repair test passed.');
