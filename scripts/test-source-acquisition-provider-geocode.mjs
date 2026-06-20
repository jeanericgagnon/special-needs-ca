import assert from 'node:assert/strict';
import {
  buildFipsCountyIndex,
  parseAddressParts,
  parseCensusBatchResponse,
  mapGeocodeMatches,
} from './source-acquisition-provider-geocode-lib.mjs';

function testParseAddressParts() {
  assert.deepEqual(parseAddressParts('6524 W. Sack Dr., Glendale, AZ 85308'), {
    street: '6524 W. Sack Dr.',
    city: 'Glendale',
    stateCode: 'AZ',
    zipCode: '85308',
  });
  assert.deepEqual(parseAddressParts('2001 West 86th St Indianapolis, IN 46260'), {
    street: '2001 West 86th St',
    city: 'Indianapolis',
    stateCode: 'IN',
    zipCode: '46260',
  });
  assert.equal(parseAddressParts('Bad Address'), null);
}

function testParseCensusBatchResponse() {
  const rows = parseCensusBatchResponse('0,6524 W Sack Dr,Match,6524 W SACK DR,GLENDALE,AZ,85308,,04,013,600100\n');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].rowId, 0);
  assert.equal(rows[0].matchStatus, 'Match');
  assert.equal(rows[0].stateFips, '04');
  assert.equal(rows[0].countyFips, '013');
}

function testParseCensusBatchNoMatchResponse() {
  const rows = parseCensusBatchResponse('"0","6271 St. Augustine Rd.,  Suite 1, Jacksonville, FL","No_Match"\n');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].rowId, 0);
  assert.equal(rows[0].matchStatus, 'No_Match');
}

function testMapGeocodeMatches() {
  const countyIndex = buildFipsCountyIndex([
    { id: 'maricopa-az', name: 'Maricopa County', state_id: 'arizona' },
  ]);
  const records = [
    {
      id: 42,
      source_url: 'https://phoenixchildrens.org/locations',
      extracted_name: 'Locations',
      extracted_address: '6524 W. Sack Dr., Glendale, AZ 85308',
    },
  ];
  const geocodeRows = [
    {
      rowId: 0,
      matchStatus: 'Match',
      stateFips: '04',
      countyFips: '013',
    },
  ];
  const result = mapGeocodeMatches(records, geocodeRows, countyIndex);
  assert.equal(result.updates.length, 1);
  assert.equal(result.updates[0].countyId, 'maricopa-az');
  assert.equal(result.skipped.length, 0);
}

function testMapGeocodeNoMatchAsSkipped() {
  const countyIndex = buildFipsCountyIndex([]);
  const records = [
    {
      id: 99,
      source_url: 'https://example.org/provider',
      extracted_name: 'Example Provider',
      extracted_address: '123 Main St, Orlando, FL 32801',
    },
  ];
  const geocodeRows = [
    {
      rowId: 0,
      matchStatus: 'No_Match',
      stateFips: '',
      countyFips: '',
    },
  ];
  const result = mapGeocodeMatches(records, geocodeRows, countyIndex);
  assert.equal(result.updates.length, 0);
  assert.equal(result.skipped.length, 1);
  assert.equal(result.skipped[0].reason, 'no_census_match');
}

testParseAddressParts();
testParseCensusBatchResponse();
testParseCensusBatchNoMatchResponse();
testMapGeocodeMatches();
testMapGeocodeNoMatchAsSkipped();

console.log('source acquisition provider geocode tests passed');
