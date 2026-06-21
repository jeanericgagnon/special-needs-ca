import assert from 'node:assert/strict';
import { parsePennsylvaniaCountyMhIdPage } from './run-batch22-pennsylvania-exact-repair-v1.mjs';

const fixture = `
<main>
  <h3>Adams County</h3>
  <ul>
    <li><b>York/Adams Mental Health/Intellectual and Developmental Disabilities Departments</b>
      <ul>
        <li><b>Address:</b> 100 West Market Street, Suite 301, York, PA 17401</li>
        <li><b>Phone: </b><a href="tel:7177719618">717-771-9618</a></li>
        <li><b>Fax:</b> 717-771-9826</li>
        <li><b>Website:</b> <a href="https://yorkcountypa.gov/">yorkcountypa.gov</a></li>
      </ul>
    </li>
  </ul>
  <h3>Philadelphia County</h3>
  <ul>
    <li><b>City of Philadelphia Department of Behavioral Health and Intellectual disAbility Services</b>
      <ul>
        <li><b>Address: </b>1101 Market Street, Suite 700, Philadelphia, PA 19107</li>
        <li><b>Phone: </b><a href="tel:2156855400">215-685-5400</a></li>
        <li><b>Fax: </b>215-685-5467</li>
        <li><b>Website: </b><a href="https://dbhids.org/">dbhids.org</a></li>
      </ul>
    </li>
  </ul>
  <h3>Lancaster County</h3>
  <ul>
    <li><b>Lancaster County Behavioral Health and Developmental Services</b>
      <ul>
        <li><b>Behavioral Health Office: </b>750 Eden Road, Lancaster, PA 17601</li>
        <li><b>Intellectual and Developmental Disabilities:</b> 150 North Queen Street, Lancaster, PA 17603</li>
        <li><b>Phone:</b> 717-299-8021</li>
        <li><b>Fax</b>: 717-299-7968</li>
        <li><b>Website:</b> <a href="https://www.lancastercountybhds.org/">Lancaster County BHDS, PA</a></li>
      </ul>
    </li>
  </ul>
  <h3>Northumberland County</h3>
  <ul>
    <li><b>Northumberland County Behavioral Health (BH)/Intellectual Developmental Services (IDS)</b>
      <ul>
        <li><b>Address:</b> Human Services Building, 217 North Center Street, Sunbury, PA 17801</li>
        <li><b>BH Phone:</b> <a href="tel:5702756080">570-275-6080</a></li>
        <li><b>BH Fax:</b> 570-988-4444</li>
        <li><b>IDS Phone:</b> <a href="tel:5704952039">570-495-2039</a></li>
        <li><b>IDS Fax:</b> 570-495-2150</li>
        <li><b>Website:</b> <a href="https://northumberland.pa.networkofcare.org/mh/services/agency.aspx?pid=NorthumberlandCountyBehavioralHealthandIntellectualDevelopmentalServices_2_804_1">networkofcare.org</a></li>
      </ul>
    </li>
  </ul>
</main>
`;

const rows = parsePennsylvaniaCountyMhIdPage(fixture, 'https://www.pa.gov/agencies/dhs/contact/county-mh-id-offices', '2026-06-21T00:00:00.000Z');
assert.equal(rows.length, 4, 'Pennsylvania parser should extract all county office rows from the fixture, including alternate field-label variants.');
assert.ok(rows.some((row) => row.counties_served.includes('adams-pa')), 'Parser should map Adams County to an official county slug.');
assert.ok(rows.some((row) => row.counties_served.includes('philadelphia-pa')), 'Parser should map Philadelphia County correctly.');
assert.ok(rows.some((row) => row.counties_served.includes('lancaster-pa')), 'Parser should keep Lancaster County even when the address labels vary.');
assert.ok(rows.some((row) => row.counties_served.includes('northumberland-pa')), 'Parser should keep Northumberland County when phone labels use BH/IDS prefixes.');
assert.ok(rows.every((row) => row.family === 'county_local_disability_resources'), 'Rows must stay inside the county/local disability resources family.');

console.log('test-batch22-pennsylvania-exact-repair-v1: ok');
