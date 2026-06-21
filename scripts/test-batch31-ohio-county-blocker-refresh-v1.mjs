import assert from 'node:assert/strict';
import { classifyOhioCountyDirectoryBlocker } from './run-batch31-ohio-county-blocker-refresh-v1.mjs';

const blocker = classifyOhioCountyDirectoryBlocker([
  { url: 'https://jfs.ohio.gov/county/county_directory.pdf', status: 404 },
  { url: 'https://jfs.ohio.gov/county/', status: 404 },
  { url: 'https://jobandfamilyservices.ohio.gov/', status: null, error: 'nodename nor servname provided, or not known' },
]);

assert.equal(
  blocker.blocker_code,
  'official_county_directory_targets_unresolved_after_bounded_live_check',
  'Ohio county-local blocker should stay closed when the official targets only produce 404 or DNS/network failures.',
);

console.log('test-batch31-ohio-county-blocker-refresh-v1: ok');
