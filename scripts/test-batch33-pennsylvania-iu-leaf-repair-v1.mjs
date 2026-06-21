import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyEducationLeaf } from './run-batch33-pennsylvania-iu-leaf-repair-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const ciu10Fixture = `
<html>
  <head><title>Special Education - Central Intermediate Unit 10</title></head>
  <body>
    <h1>Special Education</h1>
    <nav>403(b) plan & SRA</nav>
    <main>Special Education Home Assistive Technology Autism Support Inclusive Practices School-Age Services.</main>
  </body>
</html>
`;

const ciu10Verified = verifyEducationLeaf({
  iuName: 'Central Intermediate Unit 10',
  sourceUrl: 'https://www.ciu10.org/departments/special-education',
  finalUrl: 'https://www.ciu10.org/departments/special-education',
  fetchedAt: '2026-06-21T00:00:00.000Z',
  html: ciu10Fixture,
});
assert.ok(ciu10Verified, 'A valid IU special-education page must not be rejected just because the nav contains 403(b).');

const gapRows = fs.readFileSync(path.join(repoRoot, 'data/generated/pennsylvania_gap_matrix_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const failureRows = fs.readFileSync(path.join(repoRoot, 'data/generated/pennsylvania_failure_ledger_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationGap, 'Pennsylvania packet must include the district/county education routing family.');
assert.equal(educationGap.family_status, 'exact_leaf_targets_verified_partial', 'Pennsylvania education routing should stay in exact-leaf partial until the last NEIU19 counties are resolved.');
assert.ok(
  educationGap.status_reason.includes('64/67 Pennsylvania counties'),
  'Pennsylvania education routing packet should preserve the repaired 64/67 county coverage.',
);
assert.ok(
  educationGap.status_reason.includes('Lackawanna County, Susquehanna County, Wayne County'),
  'Pennsylvania education routing packet should preserve the remaining three unresolved counties.',
);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationFailure, 'Pennsylvania packet must retain a concrete education failure row for the remaining uncovered counties.');
assert.equal(
  educationFailure.failure_code,
  'remaining_counties_lack_exact_iu_or_district_education_leaf_after_bounded_official_repair',
  'Pennsylvania education failure code should reflect the narrowed residual county blocker.',
);

console.log('test-batch33-pennsylvania-iu-leaf-repair-v1: ok');
