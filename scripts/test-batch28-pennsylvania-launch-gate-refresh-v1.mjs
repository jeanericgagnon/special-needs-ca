import assert from 'node:assert/strict';
import { verifyPennsylvaniaDistrictLeaf } from './run-batch28-pennsylvania-launch-gate-refresh-v1.mjs';

const pittsburghFixture = `
<html>
  <head><title>PSE (Special Education)</title></head>
  <body>
    <main>
      <p>Pittsburgh Public Schools special education resources and parent rights contact information.</p>
    </main>
  </body>
</html>
`;

const pittsburghRow = verifyPennsylvaniaDistrictLeaf(
  'https://www.pghschools.org/departments/pse-special-education',
  pittsburghFixture,
  'https://www.pghschools.org/academics/pse-special-education/pse-special-education',
  '2026-06-21T00:00:00.000Z',
  'Pittsburgh Public Schools',
);
assert.ok(pittsburghRow, 'Pennsylvania verifier should accept current Pittsburgh special-education leaf pages.');
assert.equal(pittsburghRow.family, 'district_or_county_education_routing');
assert.ok(pittsburghRow.evidence_terms_found.includes('special education'));

const readingFixture = `
<html>
  <head><title>Student Services Overview | Reading</title></head>
  <body>
    <p>Student Services and special education routing for Reading School District families.</p>
  </body>
</html>
`;

const readingRow = verifyPennsylvaniaDistrictLeaf(
  'https://readingsdpa.sites.thrillshare.com/o/rsd/page/student-services',
  readingFixture,
  'https://readingsdpa.sites.thrillshare.com/o/rsd/page/student-services',
  '2026-06-21T00:00:00.000Z',
  'Reading School District',
);
assert.ok(readingRow, 'Pennsylvania verifier should accept Reading district student-services exact leaves.');
assert.ok(readingRow.evidence_terms_found.includes('student services'));

const genericHome = verifyPennsylvaniaDistrictLeaf(
  'https://www.pghschools.org/',
  '<html><head><title>Home</title></head><body><h1>Welcome</h1></body></html>',
  'https://www.pghschools.org/',
  '2026-06-21T00:00:00.000Z',
  'Pittsburgh Public Schools',
);
assert.equal(genericHome, null, 'Pennsylvania verifier must reject generic district homepages.');

console.log('test-batch28-pennsylvania-launch-gate-refresh-v1: ok');
