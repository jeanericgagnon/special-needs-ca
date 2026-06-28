import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const actionsSource = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/actions.ts'), 'utf8');
const countyPageSource = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx'), 'utf8');

assert.match(
  actionsSource,
  /countyOffices:\s*\(details\.countyOffices \|\| \[\]\)\.filter\(isPublicCountyOfficeEligible\)/,
  'fetchCountyDetailsAction should sanitize county offices before returning them to client code.'
);

assert.match(
  actionsSource,
  /schoolDistricts:\s*\(details\.schoolDistricts \|\| \[\]\)\.filter\(isPublicRecordEligible\)/,
  'fetchCountyDetailsAction should sanitize school districts before returning them to client code.'
);

assert.match(
  actionsSource,
  /localOrganizations:\s*\(details\.localOrganizations \|\| \[\]\)\.filter\(isPublicDirectoryRecordEligible\)/,
  'fetchCountyDetailsAction should sanitize local organizations before returning them to client code.'
);

assert.match(
  actionsSource,
  /regionalCenters:\s*\(details\.regionalCenters \|\| \[\]\)\.filter\(isPublicRecordEligible\)/,
  'fetchCountyDetailsAction should sanitize regional centers before returning them to client code.'
);

assert.match(
  countyPageSource,
  /const publicCountyDetailsForCopy = \{/,
  'County benefits page should build a sanitized county details object for public copy.'
);

assert.match(
  countyPageSource,
  /getCountyIntroCopy\(stateData\.id, stateData\.name, stateData\.code, publicCountyDetailsForCopy as any, countyWage, catchmentLabel\)/,
  'County intro copy should use sanitized county details instead of raw published rows.'
);

console.log('county details public sanitization tests passed');
