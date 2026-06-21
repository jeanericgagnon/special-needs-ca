import assert from 'node:assert/strict';
import { classifyNewYorkCountyDirectoryAttempt, verifyNewYorkDistrictLeaf } from './run-batch26-new-york-education-county-repair-v1.mjs';

const districtFixture = `
<html>
  <head><title>Special Education - Capital Region BOCES</title></head>
  <body>
    <h1>Special Education</h1>
    <h2>Special Education Links</h2>
    <p>Parents can contact Capital Region BOCES for special education services and support.</p>
  </body>
</html>
`;

const districtRow = verifyNewYorkDistrictLeaf(
  'https://www.capitalregionboces.org/special-education-2/',
  districtFixture,
  'https://www.capitalregionboces.org/special-education-2/',
  '2026-06-21T00:00:00.000Z',
  'Capital Region BOCES',
);
assert.ok(districtRow, 'New York district verifier should accept BOCES-owned special-education pages.');
assert.equal(districtRow.family, 'district_or_county_education_routing');
assert.ok(districtRow.evidence_terms_found.includes('special education'));

const badDistrictRow = verifyNewYorkDistrictLeaf(
  'https://www.capitalregionboces.org/about-us/',
  '<html><head><title>About Us - Capital Region BOCES</title></head><body><h1>About Us</h1></body></html>',
  'https://www.capitalregionboces.org/about-us/',
  '2026-06-21T00:00:00.000Z',
  'Capital Region BOCES',
);
assert.equal(badDistrictRow, null, 'New York district verifier must reject generic BOCES pages.');

const countyBlocker = classifyNewYorkCountyDirectoryAttempt({
  ok: false,
  status: 403,
  finalUrl: 'https://www.health.ny.gov/health_care/medicaid/ldss.htm',
});
assert.equal(
  countyBlocker.blocker_code,
  'official_county_directory_returns_http_403',
  'New York county blocker should preserve a truthful 403 blocker for the live official LDSS page.',
);

console.log('test-batch26-new-york-education-county-repair-v1: ok');
