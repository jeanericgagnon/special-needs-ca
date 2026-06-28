import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CA_IHSS_COUNTY_ESTIMATES,
  DEFAULT_CA_IHSS_ESTIMATE_HOURLY,
  DEFAULT_CA_IHSS_ESTIMATE_COUNTY_ID,
  CA_IHSS_WAGE_SOURCE_LABEL,
  formatIhssHourlyEstimateValue,
  formatIhssMonthlyEstimateValue,
  getDefaultCaIhssWageDisclosure,
  getIhssMonthlyEstimate,
  getIhssWageDisclosure,
} from '../frontend/src/lib/ihssWageDisclosure.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const losAngeles = getIhssWageDisclosure('california', 'los-angeles', 'Los Angeles', null);
assert.ok(losAngeles);
assert.equal(losAngeles.countyId, DEFAULT_CA_IHSS_ESTIMATE_COUNTY_ID);
assert.equal(losAngeles.hourlyRate, 19.64);
assert.equal(losAngeles.isEstimate, true);
assert.equal(losAngeles.fallbackUsed, false);
assert.equal(losAngeles.sourceLabel, CA_IHSS_WAGE_SOURCE_LABEL);
assert.equal(losAngeles.sourceType, 'reviewed_public_estimate');
assert.equal(losAngeles.officialConfirmLabel, 'Official county IHSS office directory');
assert.equal(typeof losAngeles.confidenceScore, 'number');

const countyOverride = getIhssWageDisclosure('california', 'los-angeles', 'Los Angeles', 19.64);
assert.ok(countyOverride);
assert.equal(countyOverride.hourlyRate, 19.64);
assert.equal(countyOverride.fallbackUsed, false);
assert.equal(getIhssMonthlyEstimate(countyOverride, 283), 5558.12);
assert.equal(formatIhssHourlyEstimateValue(countyOverride), '$19.64/hour estimate');
assert.equal(formatIhssMonthlyEstimateValue(getIhssMonthlyEstimate(countyOverride, 283)), '$5,558/month estimate');
assert.match(countyOverride.explanation, /reviewed public California county IHSS wage reference|checked public estimate/i);

const conflictingOverride = getIhssWageDisclosure('california', 'los-angeles', 'Los Angeles', 18);
assert.ok(conflictingOverride);
assert.equal(conflictingOverride.hourlyRate, 19.64);
assert.equal(conflictingOverride.fallbackUsed, false);
assert.match(conflictingOverride.explanation, /ignored a conflicting stored county value/i);

const unknownCounty = getIhssWageDisclosure('california', 'unknown-county', 'Unknown County', null);
assert.ok(unknownCounty);
assert.equal(unknownCounty.hourlyRate, null);
assert.equal(unknownCounty.fallbackUsed, true);
assert.equal(unknownCounty.sourceType, 'official_county_directory_fallback');
assert.match(unknownCounty.explanation, /still verifying/i);
assert.equal(formatIhssHourlyEstimateValue(unknownCounty), 'Still being verified');
assert.equal(formatIhssMonthlyEstimateValue(null), 'Still being verified');

const unknownCountyOverride = getIhssWageDisclosure('california', 'unknown-county', 'Unknown County', 22.5);
assert.ok(unknownCountyOverride);
assert.equal(unknownCountyOverride.hourlyRate, null);
assert.equal(unknownCountyOverride.fallbackUsed, true);

const defaultDisclosure = getDefaultCaIhssWageDisclosure();
assert.equal(defaultDisclosure.hourlyRate, DEFAULT_CA_IHSS_ESTIMATE_HOURLY);
assert.equal(defaultDisclosure.countyId, DEFAULT_CA_IHSS_ESTIMATE_COUNTY_ID);
assert.match(defaultDisclosure.explanation, /reviewed public California county IHSS wage reference|checked California estimate/i);
assert.equal(CA_IHSS_COUNTY_ESTIMATES.some((row) => row.countyId === 'los-angeles' && row.hourlyRate === 19.64), true);

const nonCalifornia = getIhssWageDisclosure('texas', 'harris-tx', 'Harris', null);
assert.equal(nonCalifornia, null);

const dashboardPanelSource = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/app/dashboard/components/IHSSOvertimePanel.tsx'),
  'utf8',
);
assert.match(dashboardPanelSource, /getIhssWageDisclosure/);
assert.match(dashboardPanelSource, /activeIhssDisclosure/);
assert.match(dashboardPanelSource, /checked county estimate/i);
assert.match(dashboardPanelSource, /private planning override/i);
assert.match(dashboardPanelSource, /Checked estimate: .*hour estimate/i);

const countyBenefitsPageSource = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx'),
  'utf8',
);
assert.match(countyBenefitsPageSource, /Source Page ↗/);
assert.match(countyBenefitsPageSource, /\$\\?\{displayWage\.toFixed\(2\)\}\/hour estimate/);
assert.match(countyBenefitsPageSource, /\$\\?\{wageDisclosure\.hourlyRate\.toFixed\(2\)\}\/hour estimate/);
assert.doesNotMatch(countyBenefitsPageSource, /\$\\?\{wageDisclosure\.hourlyRate\.toFixed\(2\)\}\/hr/);

const behaviorLogSource = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/app/ihss-behavior-log/behavior-log-client.tsx'),
  'utf8',
);
assert.match(behaviorLogSource, /does not know your county yet/i);
assert.match(behaviorLogSource, /planning wage override/i);
assert.match(behaviorLogSource, /Default checked estimate:/i);
assert.match(behaviorLogSource, /\$\{ihssWage\.toFixed\(2\)\}\/hour estimate/);
assert.doesNotMatch(behaviorLogSource, /\$\{ihssWage\.toFixed\(2\)\}\/hr estimate/);
assert.doesNotMatch(behaviorLogSource, /localStorage\.getItem\('ihss_wage'\)/);

const ihssMiniProductSource = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/app/benefits/components/ihss-mini-product.tsx'),
  'utf8',
);
assert.match(ihssMiniProductSource, /formatIhssHourlyEstimateValue\(wageDisclosure\)/);
assert.doesNotMatch(ihssMiniProductSource, /countyDetails\.wage\.toFixed\(2\)/);

const countiesClientSource = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/app/counties/[state]/counties-client.tsx'),
  'utf8',
);
assert.match(countiesClientSource, /formatIhssHourlyEstimateValue\(wageDisclosure\)/);
assert.doesNotMatch(countiesClientSource, /\$\\?\{wageDisclosure\.hourlyRate\.toFixed\(2\)\}\/hr/);

console.log('ihss wage disclosure tests passed');
