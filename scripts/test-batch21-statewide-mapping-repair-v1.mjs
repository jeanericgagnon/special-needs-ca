import assert from 'node:assert/strict';
import {
  parseFloridaApdRegionPage,
  parseGeorgiaDfcsLocationsPage,
} from './run-batch21-statewide-mapping-repair-v1.mjs';

const floridaFixture = `
<ul>
  <li><strong><a href="/region/northwest">Northwest Region</a></strong><br> Counties Served: Bay, Calhoun, Escambia, Franklin, Gadsden, Gulf, Holmes, Jackson, Jefferson, Leon, Liberty, Okaloosa, Santa Rosa, Wakulla, Walton, and Washington</li>
  <li><strong><a href="/region/northeast">Northeast Region</a></strong><br> Counties Served: Alachua, Baker, Bradford, Clay, Columbia, Dixie, Duval, Flagler, Gilchrist, Hamilton, Lafayette, Levy, Madison, Nassau, Putnam, St. Johns, Suwannee, Taylor, Union, and Volusia</li>
  <li><strong><a href="/region/central">Central Region</a></strong><br> Counties Served: Brevard, Citrus, Hardee, Hernando, Highlands, Lake, Marion, Orange, Osceola, Polk, Seminole, and Sumter</li>
  <li><strong><a href="/region/suncoast">Suncoast Region</a></strong><br> Counties Served: Charlotte, DeSoto, Hillsborough, Manatee, Pasco, Pinellas, and Sarasota</li>
  <li><strong><a href="/region/southeast">Southeast Region</a></strong><br> Counties Served: Indian River, Martin, Okeechobee, Palm Beach, and St. Lucie</li>
  <li><strong><a href="/region/southern">Southern Region</a></strong><br> Counties Served: Broward, Dade, Monroe</li>
</ul>
`;

const georgiaFixture = `
<table>
  <tbody>
    <tr><td><a href="/locations/appling-county">Appling County</a></td><td>Appling</td></tr>
    <tr><td><a href="/locations/fulton-nw-county">Fulton NW County</a></td><td>Fulton</td></tr>
    <tr><td><a href="/locations/fulton-south-county">Fulton South County</a></td><td>Fulton</td></tr>
    <tr><td><a href="/locations/whitfield-county">Whitfield County</a></td><td>Murray, Whitfield</td></tr>
  </tbody>
</table>
`;

const floridaRows = parseFloridaApdRegionPage(floridaFixture, 'https://apd.myflorida.com/region/', '2026-06-21T00:00:00.000Z');
assert.equal(floridaRows.length, 6, 'Florida APD parser should extract six regional rows.');
assert.ok(floridaRows.some((row) => row.counties_served.includes('baker-fl')), 'Florida APD parser should preserve county coverage.');
assert.ok(floridaRows.some((row) => row.counties_served.includes('miami-dade-fl')), 'Florida APD parser should canonicalize Dade to Miami-Dade.');
assert.ok(floridaRows.every((row) => row.family === 'developmental_disability_idd_authority'), 'Florida APD rows must stay in the DD family.');

const georgiaRows = parseGeorgiaDfcsLocationsPage(georgiaFixture, 'https://dfcs.georgia.gov/locations', '2026-06-21T00:00:00.000Z');
assert.equal(georgiaRows.length, 4, 'Georgia DFCS parser should extract every office row.');
assert.ok(georgiaRows.some((row) => row.counties_served.includes('murray-ga')), 'Georgia DFCS parser should preserve multi-county office coverage.');
assert.equal(georgiaRows.filter((row) => row.counties_served.includes('fulton-ga')).length, 2, 'Georgia DFCS parser should preserve duplicate Fulton office rows while keeping shared county coverage.');
assert.ok(georgiaRows.every((row) => row.family === 'county_local_disability_resources'), 'Georgia DFCS rows must stay in the county/local family.');

console.log('test-batch21-statewide-mapping-repair-v1: ok');
