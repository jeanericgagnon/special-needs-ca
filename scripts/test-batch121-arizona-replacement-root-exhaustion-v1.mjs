import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch121ArizonaReplacementRootExhaustionV1 } from './run-batch121-arizona-replacement-root-exhaustion-v1.mjs';

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

const result = generateBatch121ArizonaReplacementRootExhaustionV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch121_arizona_replacement_root_exhaustion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduGap.status_reason, /school-district-web-sites/i);
assert.match(eduGap.status_reason, /exceptionalstudentservices/i);
assert.match(countyGap.status_reason, /office-locator/i);
assert.match(countyGap.status_reason, /Page\/Document not found/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduFailure.evidence, /cf-mitigated: challenge/i);
assert.match(eduFailure.evidence, /https:\/\/www\.azed\.gov\/ess/i);
assert.match(countyFailure.evidence, /https:\/\/des\.az\.gov\/office-locator/i);
assert.match(countyFailure.evidence, /https:\/\/www\.azahcccs\.gov\/Members\/GetCovered\/Categories\/where\.html/i);
assert.match(countyFailure.evidence, /Page\/Document not found/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduVerified.query_basis, /exact AZED replacement roots/i);
assert.match(countyVerified.query_basis, /exact DES\/AHCCCS replacement roots/i);

assert.match(nextRows.find((row) => row.family === 'district_or_county_education_routing').evidence, /school-district-web-sites/i);
assert.match(nextRows.find((row) => row.family === 'county_local_disability_resources').evidence, /AHCCCS\/Downloads\/FFA\.pdf/i);

assert.ok(educationPacket.root_domains_to_review.includes('https://www.azed.gov/school-district-web-sites/'));
assert.ok(educationPacket.root_domains_to_review.includes('https://www.azed.gov/ess'));
assert.ok(countyPacket.root_domains_to_review.includes('https://des.az.gov/office-locator'));
assert.ok(countyPacket.root_domains_to_review.includes('https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf'));

assert.deepEqual(batchSummary.refined_families, ['district_or_county_education_routing', 'county_local_disability_resources']);
assert.ok(report.includes('obvious AZED replacement roots now also prove out as challenge shells'));
assert.ok(lessons.includes('### Exhausted Replacement Roots Should Be Written Into The Packet Before Another Challenged-Host Retry'));

console.log('test-batch121-arizona-replacement-root-exhaustion-v1: ok');
