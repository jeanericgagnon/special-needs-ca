import assert from 'node:assert/strict';
import { parseFamilyRecord, validateFamilyRecord } from './source-acquisition-lightweight-lib.mjs';

const advisoryHtml = `
  <html>
    <head><title>IHSS Advisory Committee</title></head>
    <body>
      <h2>IHSS Advisory Committee</h2>
      <p>Agendas and Minutes</p>
      <p>Meetings are held at 3500 Coffee Road Suite 19, Modesto, CA 95355</p>
      <p>Phone: (209) 558-2500</p>
    </body>
  </html>
`;

const officeHtml = `
  <html>
    <head><title>CSA Adult Services</title></head>
    <body>
      <h2>Adult Services</h2>
      <p>In-Home Supportive Services provides assistance to eligible persons.</p>
      <p>To apply for In-Home Supportive Services call (209) 558-2637.</p>
      <p>Address: 3525 Coffee Road, Modesto, CA 95355</p>
      <p>Phone: (209) 558-2500</p>
    </body>
  </html>
`;

const baseRow = {
  stateId: 'california',
  gapFamily: 'medicaid_hhs_offices',
  targetTable: 'county_offices',
  sourceQueue: 'unit_test',
  sourceName: 'Stanislaus County Community Services Agency',
  sourceRole: 'county_ihss_leaf_candidate',
  authority: 'official_county',
  agency: 'Stanislaus County Community Services Agency',
  savedPath: '/tmp/fake.html',
  artifactPath: 'data/source-acquisition-runs/fake/raw/fake.html',
  sha256: 'abc123',
  fetchedAt: '2026-06-27T00:00:00.000Z',
  byteCount: 1000,
  contentType: 'text/html',
};

const advisoryRecord = parseFamilyRecord({
  ...baseRow,
  sourceUrl: 'https://www.csa-stanislaus.com/ihss-advisory-committee/index.html',
  finalUrl: 'https://www.csa-stanislaus.com/ihss-advisory-committee/index.html',
  provenanceUrl: 'https://www.csa-stanislaus.com/ihss-advisory-committee/index.html',
}, advisoryHtml);

const advisoryValidation = validateFamilyRecord(advisoryRecord);
assert.equal(advisoryValidation.isAccepted, false);
assert.ok(advisoryValidation.reasons.includes('bad_county_office_topic_signal'));

const officeRecord = parseFamilyRecord({
  ...baseRow,
  sourceUrl: 'https://www.csa-stanislaus.com/adult-services/index.html#_ihss',
  finalUrl: 'https://www.csa-stanislaus.com/adult-services/index.html',
  provenanceUrl: 'https://www.csa-stanislaus.com/adult-services/index.html#_ihss',
}, officeHtml);

const officeValidation = validateFamilyRecord(officeRecord);
assert.equal(officeValidation.isAccepted, true, officeValidation.reasons.join(','));

console.log('test-county-office-validator-v1: ok');
