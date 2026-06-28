import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const helperSource = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/lib/countySeoHelpers.ts'),
  'utf8'
);

assert.match(
  helperSource,
  /function sanitizeCountyDetailsForPublic\(countyDetails: CountyDetails\): CountyDetails/,
  'County SEO helpers should sanitize county details before using them in public metadata and copy.'
);

assert.match(
  helperSource,
  /countyOffices:\s*\(countyDetails\.countyOffices \|\| \[\]\)\.filter\(isPublicCountyOfficeEligible\)/,
  'County SEO helpers should filter county offices through public-truth eligibility.'
);

assert.match(
  helperSource,
  /regionalCenters:\s*\(countyDetails\.regionalCenters \|\| \[\]\)\.filter\(isPublicRecordEligible\)/,
  'County SEO helpers should filter regional centers through public-truth eligibility.'
);

assert.match(
  helperSource,
  /const publicCountyDetails = sanitizeCountyDetailsForPublic\(countyDetails\);/,
  'County SEO helpers should derive a sanitized county details object before generating public copy.'
);

assert.match(
  helperSource,
  /const verifiedOffice = publicCountyDetails\.countyOffices\?\.find/,
  'County metadata should read office fallbacks from sanitized county details only.'
);

assert.match(
  helperSource,
  /const eciContractor = getPrimaryPublicRegionalCenter\(publicCountyDetails\)\?\.name;/,
  'Texas county metadata should use sanitized regional center data only.'
);

assert.match(
  helperSource,
  /const rcName = getPrimaryPublicRegionalCenter\(publicCountyDetails\)\?\.name;/,
  'California county metadata should use sanitized regional center data only.'
);

assert.match(
  helperSource,
  /We are still verifying the local Regional Center routing details for this county\./,
  'California county metadata should fail closed when no reviewed public regional center is available.'
);

assert.doesNotMatch(
  helperSource,
  /Find source-backed local service contacts|Access source-backed local routing|Find source-backed contact numbers|Get source-backed intake contacts/,
  'County SEO helper metadata should not use stronger source-backed-local-routing phrasing than the reviewed public contract supports.'
);

assert.match(
  helperSource,
  /Review currently published public service contacts|Review currently published local routing|Review currently published contact numbers and intake details|Review currently published intake contacts/,
  'County SEO helper metadata should use the reviewed public-routing phrasing after hardening.'
);

assert.match(
  helperSource,
  /We are still verifying the current Regional Center routing for \$\{countyName\} County\./,
  'California county intro copy should say the local Regional Center routing is still being verified when the county has no reviewed public regional center.'
);

assert.match(
  helperSource,
  /const officeName = publicCountyDetails\.countyOffices\?\.\[0\]\?\.office_name \|\| 'the County MH\/ID Office';/,
  'County intro copy should read office names from sanitized county details only.'
);

console.log('county seo helper sanitization tests passed');
