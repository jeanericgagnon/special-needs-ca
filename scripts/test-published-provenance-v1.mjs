import assert from 'node:assert/strict';
import { getPublishedProvenanceIssues, hasMinimumPublishedProvenance, hasStrongPublishedProvenance } from '../frontend/src/lib/publishedProvenance.ts';

const full = {
  source_url: 'https://example.org/source',
  source_type: 'official',
  data_origin: 'scrape',
  verification_status: 'verified',
  last_verified_date: '2026-06-26',
  last_scraped_at: '2026-06-26',
  confidence_score: 0.9,
};

assert.deepEqual(getPublishedProvenanceIssues(full), []);
assert.equal(hasMinimumPublishedProvenance(full), true);
assert.equal(hasStrongPublishedProvenance(full), true);

const minimumFail = {
  source_url: '',
  verification_status: null,
};
assert.equal(hasMinimumPublishedProvenance(minimumFail), false);

const strongFail = {
  source_url: 'https://example.org/source',
  verification_status: 'verified',
  source_type: '',
  data_origin: '',
  last_verified_date: '',
  last_scraped_at: '',
  confidence_score: null,
};
assert.deepEqual(getPublishedProvenanceIssues(strongFail), [
  'missing_source_type',
  'missing_data_origin',
  'missing_last_verified_date',
  'missing_last_scraped_at',
  'missing_confidence_score',
]);
assert.equal(hasStrongPublishedProvenance(strongFail), false);

console.log('published provenance v1 tests passed');
