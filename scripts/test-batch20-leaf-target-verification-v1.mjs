import assert from 'assert/strict';
import {
  generateBatch20LeafTargetVerificationV1,
  verifyCandidate,
} from './run-batch20-leaf-target-verification-v1.mjs';

async function main() {
  assert.equal(typeof generateBatch20LeafTargetVerificationV1, 'function', 'Batch 20 generator must export a function');
  assert.equal(typeof verifyCandidate, 'function', 'Batch 20 verifier must export the candidate verifier');

  const genericCountyVerdict = verifyCandidate(
    'https://www.pa.gov/agencies/dhs',
    {
      ok: true,
      status: 200,
      finalUrl: 'https://www.pa.gov/agencies/dhs',
      contentType: 'text/html',
      body: '<html><head><title>Department of Human Services</title></head><body><h1>Department of Human Services</h1></body></html>',
    },
    {
      family: 'county_local_disability_resources',
      exact_target_terms: ['office', 'contact', 'directory', 'location'],
      exact_target_goals: ['county office contact page'],
      root_domains_to_review: [{ source_domain: 'pa.gov' }],
    },
    'homepage_link',
    ['office'],
  );
  assert.equal(genericCountyVerdict.verified, false, 'Generic statewide agency landing must not verify as a county-local resource');

  const localCountyVerdict = verifyCandidate(
    'https://dfcs.georgia.gov/locations',
    {
      ok: true,
      status: 200,
      finalUrl: 'https://dfcs.georgia.gov/locations',
      contentType: 'text/html',
      body: '<html><head><title>Find a Location</title></head><body><h1>County Offices</h1><h2>Find a Location</h2></body></html>',
    },
    {
      family: 'county_local_disability_resources',
      exact_target_terms: ['office', 'contact', 'directory', 'location'],
      exact_target_goals: ['county office contact page'],
      root_domains_to_review: [{ source_domain: 'dfcs.georgia.gov' }],
    },
    'homepage_link',
    ['location'],
  );
  assert.equal(localCountyVerdict.verified, true, 'County office locator page should verify as a county-local resource');

  console.log(JSON.stringify({
    ok: true,
    exported: ['generateBatch20LeafTargetVerificationV1', 'verifyCandidate'],
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
