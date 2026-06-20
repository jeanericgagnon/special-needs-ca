import assert from 'node:assert/strict';
import {
  buildCountyIndex,
  inferCountyAssignment,
  buildCountyUpdate,
} from './source-acquisition-county-inference-lib.mjs';

const countyIndex = buildCountyIndex([
  { id: 'palm-beach', name: 'Palm Beach County', state_id: 'florida' },
  { id: 'broward', name: 'Broward County', state_id: 'florida' },
  { id: 'fort-bend', name: 'Fort Bend County', state_id: 'texas' },
]);

function testSingleCountyInference() {
  const inference = inferCountyAssignment({
    state_id: 'texas',
    extracted_name: 'The Arc of Fort Bend County',
    raw_text_excerpt: 'Support for people with disabilities in Fort Bend County.',
  }, countyIndex.get('texas'));
  assert.equal(inference.action, 'assign_single_county');
  assert.equal(inference.countyId, 'fort-bend');

  const update = buildCountyUpdate('staging_scraped_nonprofit_organizations', inference);
  assert.deepEqual(update, {
    county_id: 'fort-bend',
    evidence_level: 'county_name_match',
  });
}

function testMultipleCountyCoverageInference() {
  const inference = inferCountyAssignment({
    state_id: 'florida',
    extracted_name: 'Regional DD Office',
    counties_served: 'Palm Beach County, Broward County',
  }, countyIndex.get('florida'));
  assert.equal(inference.action, 'assign_precise_coverage');
  assert.deepEqual(inference.countyIds, ['broward', 'palm-beach']);

  const update = buildCountyUpdate('staging_scraped_state_resource_agencies', inference);
  assert.deepEqual(update, {
    counties_served: 'broward,palm-beach',
    catchment_boundaries: 'broward,palm-beach',
    evidence_level: 'county_coverage_match',
  });
}

function testAmbiguousOrMissingCountyStaysUnassigned() {
  const inference = inferCountyAssignment({
    state_id: 'florida',
    extracted_name: 'Florida Disability Alliance',
    raw_text_excerpt: 'Supporting families statewide.',
  }, countyIndex.get('florida'));
  assert.equal(inference.action, 'skip');
  assert.equal(buildCountyUpdate('staging_scraped_nonprofit_organizations', inference), null);
}

testSingleCountyInference();
testMultipleCountyCoverageInference();
testAmbiguousOrMissingCountyStaysUnassigned();

console.log('source acquisition county inference tests passed');
