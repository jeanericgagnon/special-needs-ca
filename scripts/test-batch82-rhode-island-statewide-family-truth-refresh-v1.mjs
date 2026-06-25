import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch82RhodeIslandStatewideFamilyTruthRefreshV1 } from './run-batch82-rhode-island-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch82RhodeIslandStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(batchSummary.resolved_families, ['protection_and_advocacy', 'parent_training_information_center', 'legal_aid', 'county_local_disability_resources']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'verified_state_grade');
assert.match(panda.samples[0].evidence_snippet, /federally mandated Protection and Advocacy \(P&A\) System/i);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /Rhode Island PTI Rhode Island Parent Info Network \(RIPIN\)/i);

const legal = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legal.family_status, 'verified_state_grade');
assert.match(legal.samples[0].evidence_snippet, /Legal help and representation for low-income individuals in Rhode Island/i);

const educationRouting = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(
  educationRouting.family_status,
  'blocked_public_ride_directory_without_public_county_or_special_education_routing_contract'
);
assert.match(educationRouting.samples[0].evidence_snippet, /Search tool|Directory Reports/i);
assert.match(educationRouting.samples[1].evidence_snippet, /Additional directory information is available to authenticated users/i);
assert.match(educationRouting.samples[2].evidence_snippet, /66 public Local Education Agencies \(LEAs\) or districts/i);

const countyRouting = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  countyRouting.family_status,
  'verified_state_grade'
);
assert.equal(countyRouting.sample_count, 5);
assert.match(countyRouting.samples[0].evidence_snippet, /select a city\/town to find their home office/i);
assert.match(countyRouting.samples[1].source_url, /tid%5B%5D=36/);
assert.match(countyRouting.samples[2].source_url, /tid%5B%5D=131/);
assert.match(countyRouting.samples[3].evidence_snippet, /Providence Office/i);
assert.match(countyRouting.samples[4].evidence_snippet, /Woonsocket Office/i);

const failureRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_failure_ledger_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationFailure.failure_code, /public_ride_directory_exposes_district_inventory/i);
assert.match(educationFailure.evidence, /no county field and no public district special-education routing contract/i);

assert.equal(failureRows.find((row) => row.family === 'county_local_disability_resources'), undefined);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'rhode-island-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /federally mandated Protection and Advocacy \(P&A\) System/i);
assert.match(report, /district or county education routing still depends on statewide or structural evidence instead of reviewed county- or district-owned leaves/i);
assert.match(report, /official local-office routing lane because the live DHS Office Locator exposes a city\/town lookup/i);
assert.ok(!report.includes('statewide legal aid is still missing on disk'));

console.log(JSON.stringify({
  ok: true,
  state: 'rhode-island',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
