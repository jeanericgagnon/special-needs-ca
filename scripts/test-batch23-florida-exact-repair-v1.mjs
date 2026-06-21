import assert from 'node:assert/strict';
import { parseFloridaFdlrsDirectory, verifyFloridaDistrictLeaf } from './run-batch23-florida-exact-repair-v1.mjs';

const fdlrsFixture = `
<html>
  <head><title>Contact Us - FDLRS</title></head>
  <body>
    <h1>Contact Us</h1>
    <a href="https://action.fdlrs.org/">FDLRS Action</a>
    <a href="https://www.fdlrsalpha.org/">FDLRS Alpha</a>
    <a href="https://www.fdlrscrown.org/">FDLRS Crown</a>
    <a href="https://www.fdlrseast.org/">FDLRS East</a>
    <a href="https://www.fdlrsemeraldcoast.org/">FDLRS Emerald Coast</a>
    <a href="https://www.fdlrsgalaxy.org/">FDLRS Galaxy</a>
    <a href="https://www.fdlrsgulfcoast.org/">FDLRS Gulf Coast</a>
    <a href="https://www.fdlrsheartland.org/">FDLRS Heartland</a>
    <a href="https://www.hillsboroughschools.org/fdlrs">FDLRS Hillsborough</a>
    <a href="https://www.fdlrsmicco.org/">FDLRS Miccosukee</a>
    <a href="https://www.fdlrsnefec.org/">FDLRS NEFEC</a>
    <a href="https://paec.fdlrs.org/">FDLRS PAEC</a>
  </body>
</html>
`;

const fdlrsRow = parseFloridaFdlrsDirectory(
  'https://www.fdlrs.org/find-a-center',
  fdlrsFixture,
  'https://www.fdlrs.org/contact-us',
  '2026-06-21T00:00:00.000Z',
);
assert.ok(fdlrsRow, 'FDLRS parser should accept a live official directory page with enough reviewed center links.');
assert.equal(fdlrsRow.family, 'special_education_idea_part_b');
assert.ok(fdlrsRow.center_count >= 10, 'FDLRS parser should count enough statewide centers to justify state-grade routing.');

const districtFixture = `
<html>
  <head><title>Exceptional Student Education | Clay County District Schools</title></head>
  <body>
    <h1>Exceptional Student Education</h1>
    <h2>Procedural Safeguards</h2>
    <p>Clay County District Schools Exceptional Student Education parent services and student services resources.</p>
  </body>
</html>
`;

const districtRow = verifyFloridaDistrictLeaf(
  'https://www.oneclay.net/page/exceptional-student-education/',
  districtFixture,
  'https://www.oneclay.net/page/exceptional-student-education/',
  '2026-06-21T00:00:00.000Z',
  'Clay County District Schools',
);
assert.ok(districtRow, 'District verifier should accept district-owned ESE pages with strong role terms.');
assert.equal(districtRow.family, 'district_or_county_education_routing');
assert.ok(districtRow.evidence_terms_found.includes('procedural safeguards'), 'District verifier should preserve matched education-routing evidence terms.');

const badDistrictRow = verifyFloridaDistrictLeaf(
  'https://www.oneclay.net/',
  '<html><head><title>Home | Clay County District Schools</title></head><body><h1>Home</h1></body></html>',
  'https://www.oneclay.net/',
  '2026-06-21T00:00:00.000Z',
  'Clay County District Schools',
);
assert.equal(badDistrictRow, null, 'District verifier must reject generic district homepages without direct routing evidence.');

console.log('test-batch23-florida-exact-repair-v1: ok');
