import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch368WestVirginiaOfficialRoutingRepairV1 } from './run-batch368-west-virginia-official-routing-repair-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch368WestVirginiaOfficialRoutingRepairV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'west-virginia_california_grade_summary_v2.json'), 'utf8')
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

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'west-virginia_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.match(education.samples[1].source_url, /wveis\.k12\.wv\.us\/school-directory\/$/);
assert.match(education.samples[1].evidence_snippet, /Browse schools by county/i);
assert.match(education.samples[2].evidence_snippet, /superintendent Eddie Vincent/i);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.match(legalAid.samples[0].source_url, /legalaidwv\.org\/$/);
assert.match(legalAid.samples[2].evidence_snippet, /free information, advice and representation on civil legal issues/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.match(county.samples[1].source_url, /dohs\.wv\.gov\/field-offices$/);
assert.match(county.samples[1].evidence_snippet, /all 55 counties/i);
assert.match(county.samples[2].evidence_snippet, /49 Mattaliano Drive/i);

const failureText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'west-virginia_failure_ledger_v2.jsonl'), 'utf8');
assert.equal(failureText, '');

const nextText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'west-virginia_next_action_queue_v2.jsonl'), 'utf8');
assert.equal(nextText, '');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'west-virginia-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /West Virginia is now `COMPLETE` and `index_safe=true`\./);
assert.match(report, /WV School Directory publicly browses county school systems/i);
assert.match(report, /DoHS Field Offices directory exposes all 55 counties/i);
assert.match(report, /Legal Aid WV preserves statewide justice, get-help, and free civil legal-services language/i);

console.log('West Virginia official routing repair test passed.');
