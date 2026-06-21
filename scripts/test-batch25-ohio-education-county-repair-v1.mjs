import assert from 'node:assert/strict';
import { classifyOhioCountyDirectoryAttempts, verifyOhioDistrictLeaf } from './run-batch25-ohio-education-county-repair-v1.mjs';

const districtFixture = `
<html>
  <head><title>Special Education | Athens-Meigs ESC</title></head>
  <body>
    <h1>Special Education</h1>
    <h2>Student Services</h2>
    <p>Our special education and student services teams support districts and families.</p>
  </body>
</html>
`;

const districtRow = verifyOhioDistrictLeaf(
  'https://www.athensmeigs.com/departments/special-education',
  districtFixture,
  'https://www.athensmeigs.com/departments/special-education',
  '2026-06-21T00:00:00.000Z',
  'Athens-Meigs ESC',
);
assert.ok(districtRow, 'Ohio district verifier should accept ESC-owned special-education pages.');
assert.equal(districtRow.family, 'district_or_county_education_routing');
assert.ok(districtRow.evidence_terms_found.includes('special education'));

const badDistrictRow = verifyOhioDistrictLeaf(
  'https://www.athensmeigs.com/',
  '<html><head><title>Athens-Meigs ESC</title></head><body><h1>Home</h1></body></html>',
  'https://www.athensmeigs.com/',
  '2026-06-21T00:00:00.000Z',
  'Athens-Meigs ESC',
);
assert.equal(badDistrictRow, null, 'Ohio district verifier must reject generic ESC homepages.');

const countyBlocker = classifyOhioCountyDirectoryAttempts([
  { url: 'https://jfs.ohio.gov/county/county_directory.pdf', status: 404, error: null, ok: false },
  { url: 'https://jfs.ohio.gov/county/', status: 404, error: null, ok: false },
  { url: 'https://odjfs.ohio.gov/', status: null, error: 'dns failed', ok: false },
]);
assert.equal(
  countyBlocker.blocker_code,
  'official_county_directory_targets_unresolved_after_bounded_live_check',
  'Ohio county blocker should fail closed when the official directory target and bounded replacements are dead.',
);

console.log('test-batch25-ohio-education-county-repair-v1: ok');
