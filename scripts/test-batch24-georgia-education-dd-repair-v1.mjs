import assert from 'node:assert/strict';
import { inspectGeorgiaDbhddCountyPage, verifyGeorgiaDistrictLeaf } from './run-batch24-georgia-education-dd-repair-v1.mjs';

const ddFixture = `
<html>
  <body>
    <table>
      <tr><th>Link</th><th>Description</th></tr>
      <tr><td></td><td><a href="https://dbhdd.georgia.gov/region-3-field-office">Region 3</a></td></tr>
      <tr><td></td><td><a href="https://dbhdd.georgia.gov/region-1-field-office">Region 1</a></td></tr>
      <tr><td></td><td><a href="https://dbhdd.georgia.gov/region-2-field-office">Region 2</a></td></tr>
    </table>
  </body>
</html>
`;

const ddInspection = inspectGeorgiaDbhddCountyPage(
  ddFixture,
  'https://dbhdd.georgia.gov/regional-field-office-county',
  '2026-06-21T00:00:00.000Z',
);
assert.equal(ddInspection.rowCount, 3, 'DBHDD inspector should count region rows.');
assert.equal(ddInspection.emptyCountyCount, 3, 'DBHDD inspector should detect blank county cells.');
assert.equal(ddInspection.blocker_code, 'official_county_lookup_table_has_empty_county_cells', 'DBHDD inspector must fail closed when county cells are blank.');

const districtFixture = `
<html>
  <head><title>Special Education - Clayton County Public Schools</title></head>
  <body>
    <h1>Special Education</h1>
    <p>Clayton County Public Schools student services and parent rights information.</p>
  </body>
</html>
`;

const districtRow = verifyGeorgiaDistrictLeaf(
  'https://www.clayton.k12.ga.us/departments/special-education',
  districtFixture,
  'https://www.clayton.k12.ga.us/departments/special-education',
  '2026-06-21T00:00:00.000Z',
  'Clayton County Public Schools',
);
assert.ok(districtRow, 'Georgia district verifier should accept district-owned special-education pages.');
assert.equal(districtRow.family, 'district_or_county_education_routing');
assert.ok(districtRow.evidence_terms_found.includes('special education'), 'Georgia district verifier should preserve matched routing evidence terms.');

const badDistrictRow = verifyGeorgiaDistrictLeaf(
  'https://www.clayton.k12.ga.us/',
  '<html><head><title>Home - Clayton County Public Schools</title></head><body><h1>Home</h1></body></html>',
  'https://www.clayton.k12.ga.us/',
  '2026-06-21T00:00:00.000Z',
  'Clayton County Public Schools',
);
assert.equal(badDistrictRow, null, 'Georgia district verifier must reject generic district homepages.');

console.log('test-batch24-georgia-education-dd-repair-v1: ok');
