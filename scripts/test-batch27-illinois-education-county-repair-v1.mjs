import assert from 'node:assert/strict';
import { classifyIllinoisCountyLocator, verifyIllinoisDistrictLeaf } from './run-batch27-illinois-education-county-repair-v1.mjs';

const districtFixture = `
<html>
  <head><title>Educational Services | Regional Office of Education #1</title></head>
  <body>
    <p>The Regional Office of Education provides school services and contact information for districts.</p>
  </body>
</html>
`;

const districtRow = verifyIllinoisDistrictLeaf(
  'https://www.roe1.net/services/',
  districtFixture,
  'https://www.roe1.net/services/',
  '2026-06-21T00:00:00.000Z',
  'Regional Office of Education #1',
);
assert.ok(districtRow, 'Illinois district verifier should accept ROE-owned service/contact pages.');
assert.equal(districtRow.family, 'district_or_county_education_routing');
assert.ok(districtRow.evidence_terms_found.includes('services'));

const badDistrictRow = verifyIllinoisDistrictLeaf(
  'https://www.roe1.net/',
  '<html><head><title>Home</title></head><body><h1>Welcome</h1></body></html>',
  'https://www.roe1.net/',
  '2026-06-21T00:00:00.000Z',
  'Regional Office of Education #1',
);
assert.equal(badDistrictRow, null, 'Illinois district verifier must reject generic homepages.');

const countyOutcome = classifyIllinoisCountyLocator(
  {
    ok: true,
    status: 200,
    finalUrl: 'https://www.dhs.state.il.us/page.aspx?module=-1&type=1&item=27893&URL=page.aspx%3fitem%3d27893',
    body: '<html><head><title>IDHS: Page Not Found</title></head><body>Page Not Found</body></html>',
  },
  {
    ok: true,
    status: 200,
    finalUrl: 'https://www.dhs.state.il.us/page.aspx?module=12',
    body: '<html><head><title>IDHS: Office Locator</title></head><body><h1>Office Locator</h1></body></html>',
  },
);
assert.equal(countyOutcome.blocker_code, null, 'Illinois county locator classification should accept the live Office Locator replacement.');

console.log('test-batch27-illinois-education-county-repair-v1: ok');
