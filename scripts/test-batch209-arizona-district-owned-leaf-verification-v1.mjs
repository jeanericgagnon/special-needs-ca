import assert from 'assert/strict';
import { verifyArizonaDistrictOwnedLeaves } from './run-batch209-arizona-district-owned-leaf-verification-v1.mjs';

const inventoryRows = [
  {
    county_id: 'maricopa-az',
    county_name: 'maricopa',
    district_name: 'Maricopa County Regional School District',
    district_website: 'https://www.mcrsd.org/',
  },
  {
    county_id: 'cochise-az',
    county_name: 'cochise',
    district_name: 'Cochise Elementary District',
    district_website: null,
  },
  {
    county_id: 'graham-az',
    county_name: 'graham',
    district_name: 'Pima Unified District',
    district_website: 'https://www.pimaschools.com/',
  },
];

const fetchMap = new Map([
  ['https://www.mcrsd.org/', {
    ok: true,
    status: 200,
    finalUrl: 'https://www.mcrsd.org/',
    contentType: 'text/html',
    text: '<html><head><title>Maricopa County Regional School District</title></head><body><a href="/special-education">Special Education</a></body></html>',
  }],
  ['https://www.mcrsd.org/sitemap.xml', {
    ok: true,
    status: 200,
    finalUrl: 'https://www.mcrsd.org/sitemap.xml',
    contentType: 'application/xml',
    text: '<urlset></urlset>',
  }],
  ['https://www.mcrsd.org/special-education', {
    ok: true,
    status: 200,
    finalUrl: 'https://www.mcrsd.org/special-education',
    contentType: 'text/html',
    text: '<html><head><title>Special Education</title></head><body><h1>Special Education</h1><p>Student services and special education information.</p></body></html>',
  }],
  ['https://www.pimaschools.com/', {
    ok: true,
    status: 200,
    finalUrl: 'https://www.pimaschools.com/',
    contentType: 'text/html',
    text: '<html><head><title>Pima Unified School District</title></head><body><p>Welcome.</p></body></html>',
  }],
  ['https://www.pimaschools.com/sitemap.xml', {
    ok: true,
    status: 200,
    finalUrl: 'https://www.pimaschools.com/sitemap.xml',
    contentType: 'application/xml',
    text: '<urlset><url><loc>https://www.pimaschools.com/departments/exceptional-student-services</loc></url></urlset>',
  }],
  ['https://www.pimaschools.com/departments/exceptional-student-services', {
    ok: true,
    status: 200,
    finalUrl: 'https://www.pimaschools.com/departments/exceptional-student-services',
    contentType: 'text/html',
    text: '<html><head><title>Exceptional Student Services</title></head><body><h1>Exceptional Student Services</h1><p>Special programs and student services.</p></body></html>',
  }],
]);

async function fetchImpl(url) {
  const response = fetchMap.get(url);
  if (!response) {
    throw new Error(`unexpected fetch ${url}`);
  }
  return response;
}

const { resolved, unresolved } = await verifyArizonaDistrictOwnedLeaves({
  inventoryRows,
  fetchImpl,
  fetchedAt: '2026-06-23T00:00:00.000Z',
});

assert.deepEqual(
  resolved.map((row) => row.county_id).sort(),
  ['graham-az', 'maricopa-az'],
);
assert.equal(resolved[0].verification_status, 'verified');
assert.ok(resolved.some((row) => row.source_url.includes('special-education')));
assert.ok(resolved.some((row) => row.source_url.includes('exceptional-student-services')));
assert.deepEqual(
  unresolved.map((row) => row.county_id),
  ['cochise-az'],
);
assert.equal(unresolved[0].unresolved_reason, 'district_root_missing_public_website');

console.log('test-batch209-arizona-district-owned-leaf-verification-v1: ok');
