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
  /const eciContractor = publicCountyDetails\.regionalCenters\?\.\[0\]\?\.name;/,
  'Texas county metadata should use sanitized regional center data only.'
);

assert.match(
  helperSource,
  /const rcName = publicCountyDetails\.regionalCenters\?\.\[0\]\?\.name \|\| 'Local Regional Center';/,
  'California county metadata should use sanitized regional center data only.'
);

assert.match(
  helperSource,
  /const officeName = publicCountyDetails\.countyOffices\?\.\[0\]\?\.office_name \|\| 'the County MH\/ID Office';/,
  'County intro copy should read office names from sanitized county details only.'
);

console.log('county seo helper sanitization tests passed');
