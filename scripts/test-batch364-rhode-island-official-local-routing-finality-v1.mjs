import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch364RhodeIslandOfficialLocalRoutingFinalityV1 } from './run-batch364-rhode-island-official-local-routing-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch364RhodeIslandOfficialLocalRoutingFinalityV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(
  summary.primary_gap_reason,
  'public_ride_local_special_education_routing_is_partial_and_public_bhddh_dhs_county_service_area_contracts_are_still_missing'
);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(
  education.family_status,
  'blocked_partial_public_ride_local_routing_with_unresolved_nowell_special_education_gap'
);
assert.equal(education.sample_count, 5);
assert.match(education.samples[0].source_url, /datacenter\.ride\.ri\.gov\/Directory\/LEADetail\?orgid=43/);
assert.match(education.samples[0].evidence_snippet, /Director of Special Education/i);
assert.match(education.samples[1].evidence_snippet, /66 public Local Education Agencies/i);
assert.match(education.samples[3].source_url, /internationalcharterschool\.org\/special-education/);
assert.match(education.samples[3].evidence_snippet, /Katie Nerstheimer/i);
assert.match(education.samples[4].source_url, /nowellacademy\.org\/faculty-staff-/);
assert.match(education.samples[4].evidence_snippet, /no direct special-education intake email or phone/i);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  county.family_status,
  'blocked_public_dhs_office_stack_without_county_or_service_area_contract'
);
assert.equal(county.sample_count, 4);
assert.match(county.samples[0].source_url, /bhddh\.ri\.gov\/dd-service-provider-list/);
assert.match(county.samples[0].evidence_snippet, /provider contact information and the services they offer/i);
assert.match(county.samples[1].source_url, /dhs\.ri\.gov\/office-locator-tool/);
assert.match(county.samples[1].evidence_snippet, /Select any filter and click on Apply to see results/i);
assert.match(county.samples[2].evidence_snippet, /licensed DD service provider document \(PDF\)/i);
assert.match(county.samples[3].evidence_snippet, /regional offices serving Rhode Islanders throughout our State/i);

const evidence = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_local_routing_evidence_v1.json'), 'utf8')
);
assert.equal(evidence.education.expected_public_lea_count, 66);
assert.match(evidence.education.reviewed_entities[0].evidence_excerpt, /Kristen Matthes/i);
assert.match(evidence.education.reviewed_entities[2].evidence_excerpt, /Katie Nerstheimer/i);
assert.match(evidence.education.reviewed_entities[4].evidence_excerpt, /Abigail McClain/i);
assert.match(evidence.education.blocker_summary, /Nowell/i);
assert.match(evidence.county_local.reviewed_sources[0].evidence_excerpt, /City\/Town/i);
assert.match(evidence.county_local.blocker_summary, /county-to-office, county-to-provider, municipality-to-office, or service-area routing contract/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'rhode-island-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Rhode Island remains BLOCKED and not index-safe\./);
assert.match(report, /Sheila Skip Nowell Leadership Academy/i);
assert.match(report, /city-town picker/i);

console.log('Rhode Island official local routing finality test passed.');
