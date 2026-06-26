import assert from 'node:assert/strict';
import { getSeoPolicyForRoute, hasOfficialProgramSource, verifyClaimEvidence } from '../frontend/src/lib/seo-policy.ts';
import { SITEMAP_CHILD_MANIFEST, isAllowlistedStaticPath } from '../frontend/src/lib/seoRouteManifest.ts';

const benefitsPolicy = getSeoPolicyForRoute('static-page', {
  path: '/benefits'
}, {
  hasNoPlaceholderData: true
});
assert.equal(benefitsPolicy.index, true, 'core /benefits page should remain indexable');

const blockedStatePolicy = getSeoPolicyForRoute('state-hub', {
  stateId: 'alaska'
}, {
  entityCount: 3,
  hasOfficialSource: true,
  lastVerifiedDate: '2026-06-26',
  confidenceScore: 0.9,
  hasNoPlaceholderData: true
});
assert.equal(blockedStatePolicy.index, false, 'blocked states must not index state hubs');
assert(blockedStatePolicy.blockers.some((blocker) => blocker.includes('not index-safe')));

const randomStaticPolicy = getSeoPolicyForRoute('static-page', {
  path: '/totally-random-page'
}, {
  hasNoPlaceholderData: true
});
assert.equal(randomStaticPolicy.index, false, 'non-allowlisted static routes must fail closed');

const schoolPolicy = getSeoPolicyForRoute('school-district', {
  stateId: 'california',
  programId: 'lausd'
}, {
  hasNoPlaceholderData: true,
  lastVerifiedDate: '2026-06-26',
  confidenceScore: 0.9
});
assert.equal(schoolPolicy.includeInSitemap, false, 'school districts must remain blocked from sitemap output');

const cityPolicy = getSeoPolicyForRoute('city', {
  stateId: 'california',
  countyId: 'los-angeles',
  diagnosisId: 'autism-spectrum-disorder'
}, {
  hasNoPlaceholderData: true,
  confidenceScore: 0.9
});
assert.equal(cityPolicy.includeInSitemap, false, 'city routes must remain blocked from sitemap output');

assert.equal(isAllowlistedStaticPath('/forms/soc-873'), true);
assert.equal(isAllowlistedStaticPath('/unknown/path'), false);

assert.equal(hasOfficialProgramSource('https://www.cdss.ca.gov/in-home-supportive-services'), true);
assert.equal(hasOfficialProgramSource('https://example.com/fake-program'), false);

const weakClaim = verifyClaimEvidence({
  text: 'You are legally entitled to benefits within typically 15 to 30 days.',
  type: 'eligibility',
  jurisdiction: 'california',
  sourceUrl: 'https://www.cdss.ca.gov/in-home-supportive-services',
  confidence: 0.95
});
assert.equal(weakClaim.verified, false, 'high-risk unsupported claims must fail the evidence gate');

const validClaim = verifyClaimEvidence({
  text: 'Application details are published on the official state program page.',
  type: 'eligibility',
  jurisdiction: 'california',
  sourceUrl: 'https://www.cdss.ca.gov/in-home-supportive-services',
  confidence: 0.95
});
assert.equal(validClaim.verified, true, 'official low-risk claims should pass the evidence gate');

assert.deepEqual(
  SITEMAP_CHILD_MANIFEST.filter((child) => !child.hardBlocked).map((child) => child.id),
  ['static', 'counties'],
  'only verified sitemap children should remain in the sitemap index'
);

console.log('SEO hardening tests passed.');
