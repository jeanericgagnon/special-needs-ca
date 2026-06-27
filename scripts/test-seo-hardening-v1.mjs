import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getSeoPolicyForRoute, hasOfficialProgramSource, verifyClaimEvidence } from '../frontend/src/lib/seo-policy.ts';
import { SITEMAP_CHILD_MANIFEST, isAllowlistedStaticPath } from '../frontend/src/lib/seoRouteManifest.ts';
import { QUARANTINED_FIVE_STATE_TEMPLATE_SLUGS } from '../frontend/src/lib/seo-data.ts';

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
assert.equal(hasOfficialProgramSource('https://www.state.gov/ny'), false);
assert.equal(hasOfficialProgramSource('https://www.state.gov/pa'), false);
assert.equal(hasOfficialProgramSource('https://www.state.gov/il'), false);
assert(QUARANTINED_FIVE_STATE_TEMPLATE_SLUGS.has('ny-medicaid-app'));
assert(QUARANTINED_FIVE_STATE_TEMPLATE_SLUGS.has('pa-medicaid-compass-app'));
assert(QUARANTINED_FIVE_STATE_TEMPLATE_SLUGS.has('il-medicaid-abe-app'));

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

const publicCountyHubSource = fs.readFileSync(
  new URL('../frontend/src/app/benefits/[state]/[[...slug]]/page.tsx', import.meta.url),
  'utf8'
);
const publicCountyDiagnosisSource = fs.readFileSync(
  new URL('../frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx', import.meta.url),
  'utf8'
);

assert.equal(
  /source_url\s*\|\|\s*.*website/.test(publicCountyHubSource),
  false,
  'public county hub route must not fall back from source_url to website for provenance'
);
assert.equal(
  /sourceUrl=\{[^}]*website/.test(publicCountyHubSource),
  false,
  'public county hub trust badges must only use source-backed URLs'
);
assert.equal(
  publicCountyHubSource.includes('>California county IHSS offices<'),
  false,
  'public county hub IHSS source label must not imply an official county-office source when using a non-official wage reference'
);
assert.equal(
  /source_url\s*\|\|\s*.*website/.test(publicCountyDiagnosisSource),
  false,
  'public county diagnosis route must not fall back from source_url to website for provenance'
);
assert.equal(
  /sourceUrl=\{[^}]*website/.test(publicCountyDiagnosisSource),
  false,
  'public county diagnosis trust badges must only use source-backed URLs'
);

const seoDataSource = fs.readFileSync(
  new URL('../frontend/src/lib/seo-data.ts', import.meta.url),
  'utf8'
);
const ihssMiniToolSource = fs.readFileSync(
  new URL('../frontend/src/app/benefits/components/ihss-mini-product.tsx', import.meta.url),
  'utf8'
);
const formsIndexSource = fs.readFileSync(
  new URL('../frontend/src/app/forms/page.tsx', import.meta.url),
  'utf8'
);
const benefitsIndexSource = fs.readFileSync(
  new URL('../frontend/src/app/benefits/page.tsx', import.meta.url),
  'utf8'
);
const findHelpSource = fs.readFileSync(
  new URL('../frontend/src/app/find-help/find-help-client.tsx', import.meta.url),
  'utf8'
);
const homepageSource = fs.readFileSync(
  new URL('../frontend/src/app/page.tsx', import.meta.url),
  'utf8'
);
const layoutSource = fs.readFileSync(
  new URL('../frontend/src/app/layout.tsx', import.meta.url),
  'utf8'
);
const directoryPanelSource = fs.readFileSync(
  new URL('../frontend/src/app/components/directory-foundation-panel.tsx', import.meta.url),
  'utf8'
);
const editorialDisclosureSource = fs.readFileSync(
  new URL('../frontend/src/components/editorial-disclosure.tsx', import.meta.url),
  'utf8'
);
const fiveStatesSeoSource = fs.readFileSync(
  new URL('../frontend/src/lib/five-states-seo-data.ts', import.meta.url),
  'utf8'
);
const countyDiagnosisSource = fs.readFileSync(
  new URL('../frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx', import.meta.url),
  'utf8'
);
const countyBenefitsSource = fs.readFileSync(
  new URL('../frontend/src/app/benefits/[state]/[[...slug]]/page.tsx', import.meta.url),
  'utf8'
);

assert.equal(
  seoDataSource.includes('Calculate wages, understand eligibility, and apply.'),
  false,
  'IHSS public guide copy must not present wages as a deterministic calculator claim'
);
assert.equal(
  seoDataSource.includes('Strict 45 calendar days'),
  false,
  'public forms guidance must not hardcode a universal strict 45-day county deadline'
);
assert.equal(
  ihssMiniToolSource.includes('estimate approval likelihood'),
  false,
  'IHSS mini tool must not imply approval likelihood as a public promise'
);
assert.equal(
  formsIndexSource.includes('Official Source Verification:'),
  false,
  'forms hub should use source-backed review wording instead of stronger official-verification branding'
);
assert.equal(
  formsIndexSource.includes('Access official PDFs and source-backed parent guides'),
  false,
  'forms hub hero should avoid stronger "official PDFs" marketing phrasing when the safer source-backed wording is available'
);
assert.equal(
  formsIndexSource.includes('Official forms needed to apply for and manage California IHSS caregiver pay'),
  false,
  'forms hub category copy should avoid stronger official-branding wording when reviewed-source wording is available'
);
assert.equal(
  formsIndexSource.includes('Official PDF / Source'),
  false,
  'forms hub explainer should avoid stronger official-verification badge wording'
);
assert.equal(
  formsIndexSource.includes('Official PDF'),
  false,
  'forms hub document links should prefer reviewed-source wording over stronger official branding'
);
assert.equal(
  benefitsIndexSource.includes('official lanes first'),
  false,
  'benefits hub should avoid stronger official-lane phrasing when public agency route wording is sufficient'
);
assert.equal(
  homepageSource.includes('verified, partial, or gated'),
  false,
  'homepage metadata should avoid using verified as public launch-status branding'
);
assert.equal(
  layoutSource.includes('verified or gated surfaces'),
  false,
  'layout metadata should avoid stronger verified/gated public launch branding'
);
assert.equal(
  editorialDisclosureSource.includes('Verification Status Pending'),
  false,
  'editorial disclosure should use softer source-review wording on public pages'
);
assert.equal(
  findHelpSource.includes('confirm official source URLs, signer requirements, and submission routes'),
  false,
  'find-help forms hold copy should avoid overstating official-source confirmation when publishing-agency review wording is sufficient'
);
assert.equal(
  directoryPanelSource.includes('Visit official website'),
  false,
  'directory panel CTA should avoid stronger official-website wording when the panel only guarantees a source-backed link'
);
assert.equal(
  seoDataSource.includes('Download CDSS official'),
  false,
  'public guide TLDR labels should avoid stronger official-branding shorthand when reviewed-source wording is available'
);
assert.equal(
  seoDataSource.includes('Review official forms, checklists, and planning steps.'),
  false,
  'public guide metadata should avoid stronger official-form phrasing when current-form wording is sufficient'
);
assert.equal(
  seoDataSource.includes('The official service plans generated by your local Regional Center coordinator.'),
  false,
  'public guide supporting-document copy should avoid stronger official-plan branding when current-plan wording is sufficient'
);
assert.equal(
  countyDiagnosisSource.includes('caregiver wages'),
  false,
  'county diagnosis metadata should use pay-estimate wording instead of deterministic caregiver wages'
);
assert.equal(
  countyBenefitsSource.includes('waiver caregiver wages'),
  false,
  'county benefits metadata should use pay-estimate wording instead of deterministic caregiver wages'
);
assert.equal(
  ihssMiniToolSource.includes('Approval Likelihood:'),
  false,
  'IHSS mini tool should not frame the screener as an approval predictor'
);
assert.equal(
  seoDataSource.includes('You are ready to apply.'),
  false,
  'public IHSS quiz copy must avoid deterministic apply-now language'
);
assert.equal(
  seoDataSource.includes('qualify directly under the CCS medical criteria'),
  false,
  'public CCS copy must avoid direct eligibility guarantees'
);
assert.equal(
  seoDataSource.includes('They qualify under the medically fragile criteria for the HCBA waiver.'),
  false,
  'public HCBA copy must avoid direct waiver qualification guarantees'
);
assert.equal(
  seoDataSource.includes('wheelchair bounds'),
  false,
  'public guide copy should not ship obvious typo phrasing'
);
assert.equal(
  fiveStatesSeoSource.includes('Official steps and required forms'),
  false,
  'five-state template SEO copy should not overstate unverified templates as official steps and forms'
);
assert.equal(
  fiveStatesSeoSource.includes('follow official procedures'),
  false,
  'five-state template SEO copy should prefer current-process wording over official-procedure promises'
);
assert.equal(
  fiveStatesSeoSource.includes('Download the official form or log in to the state portal.'),
  false,
  'five-state template SEO copy should avoid stronger official-form calls to action while templates remain under review'
);
assert.equal(
  fiveStatesSeoSource.includes('Template Source Under Review'),
  false,
  'five-state template source labels should use neutral under-review wording instead of faux source naming'
);
assert.equal(
  seoDataSource.includes('The child dial hot stoves'),
  false,
  'public guide copy should not ship obvious typo phrasing'
);

console.log('SEO hardening tests passed.');
