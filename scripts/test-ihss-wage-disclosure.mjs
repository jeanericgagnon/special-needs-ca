import assert from 'node:assert/strict';
import {
  CA_IHSS_COUNTY_ESTIMATES,
  DEFAULT_CA_IHSS_ESTIMATE_HOURLY,
  DEFAULT_CA_IHSS_ESTIMATE_COUNTY_ID,
  getDefaultCaIhssWageDisclosure,
  getIhssMonthlyEstimate,
  getIhssWageDisclosure,
} from '../frontend/src/lib/ihssWageDisclosure.ts';

const losAngeles = getIhssWageDisclosure('california', 'los-angeles', 'Los Angeles', null);
assert.ok(losAngeles);
assert.equal(losAngeles.countyId, DEFAULT_CA_IHSS_ESTIMATE_COUNTY_ID);
assert.equal(losAngeles.hourlyRate, 19.64);
assert.equal(losAngeles.isEstimate, true);
assert.equal(losAngeles.fallbackUsed, true);

const countyOverride = getIhssWageDisclosure('california', 'los-angeles', 'Los Angeles', 19.64);
assert.ok(countyOverride);
assert.equal(countyOverride.hourlyRate, 19.64);
assert.equal(countyOverride.fallbackUsed, false);
assert.equal(getIhssMonthlyEstimate(countyOverride, 283), 5558.12);

const unknownCounty = getIhssWageDisclosure('california', 'unknown-county', 'Unknown County', null);
assert.ok(unknownCounty);
assert.equal(unknownCounty.hourlyRate, null);
assert.equal(unknownCounty.fallbackUsed, true);
assert.match(unknownCounty.explanation, /still verifying/i);

const defaultDisclosure = getDefaultCaIhssWageDisclosure();
assert.equal(defaultDisclosure.hourlyRate, DEFAULT_CA_IHSS_ESTIMATE_HOURLY);
assert.equal(defaultDisclosure.countyId, DEFAULT_CA_IHSS_ESTIMATE_COUNTY_ID);
assert.match(defaultDisclosure.explanation, /public California county IHSS wage directory|checked California estimate/i);
assert.equal(CA_IHSS_COUNTY_ESTIMATES.some((row) => row.countyId === 'los-angeles' && row.hourlyRate === 19.64), true);

const nonCalifornia = getIhssWageDisclosure('texas', 'harris-tx', 'Harris', null);
assert.equal(nonCalifornia, null);

console.log('ihss wage disclosure tests passed');
