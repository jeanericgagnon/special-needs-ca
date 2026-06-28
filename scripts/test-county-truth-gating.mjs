import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const countyPagePath = path.join(repoRoot, 'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx');
const countiesSitemapPath = path.join(repoRoot, 'frontend/src/app/sitemaps/counties.xml/route.ts');

const countyPage = fs.readFileSync(countyPagePath, 'utf8');
const countiesSitemap = fs.readFileSync(countiesSitemapPath, 'utf8');

assert.match(
  countyPage,
  /getCountyTruthEligibility/,
  'County benefits route should import county truth gating.'
);

assert.match(
  countyPage,
  /const countyTruth = getCountyTruthEligibility\(stateData\.id, policyCountyDetails\);/,
  'County benefits route should compute county truth from the selected county policy details.'
);

assert.match(
  countyPage,
  /const isIndexable = countyTruth\.indexSafe && countyHubPolicy\.index;/,
  'County benefits route should require both county truth and SEO policy before indexing.'
);

assert.match(
  countyPage,
  /!countyTruth\.publicSafe && \(/,
  'County benefits route should show a verification-pending banner when local truth is incomplete.'
);

assert.match(
  countiesSitemap,
  /const countyTruth = getCountyTruthEligibility\(c\.state_id \|\| 'california', details\);/,
  'Counties sitemap should compute county truth for each county root.'
);

assert.match(
  countiesSitemap,
  /if \(!countyTruth\.indexSafe\) return false;/,
  'Counties sitemap should exclude county roots that fail the county truth gate.'
);

console.log('county truth gating tests passed');
