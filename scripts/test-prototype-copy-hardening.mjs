import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const familyDashboardSource = fs.readFileSync(
  path.resolve('src/components/FamilyDashboard.jsx'),
  'utf8',
);

const publicDirectorySource = fs.readFileSync(
  path.resolve('src/components/PublicDirectory.jsx'),
  'utf8',
);

const adminDashboardSource = fs.readFileSync(
  path.resolve('src/components/AdminDashboard.jsx'),
  'utf8',
);

assert.doesNotMatch(
  familyDashboardSource,
  /Official CDSS guidelines/,
  'Prototype family dashboard should not claim every program source is Official CDSS guidelines.',
);

assert.match(
  familyDashboardSource,
  /Source page/,
  'Prototype family dashboard should use source-page wording for outbound program links.',
);

assert.doesNotMatch(
  familyDashboardSource,
  /Official Application Offices/,
  'Prototype family dashboard should not overclaim office sections as official.',
);

assert.match(
  familyDashboardSource,
  /Current Application Offices/,
  'Prototype family dashboard should use current-office wording for application offices.',
);

assert.doesNotMatch(
  publicDirectorySource,
  /Official Reference Information/,
  'Prototype directory should not overclaim all reference blocks as official.',
);

assert.match(
  publicDirectorySource,
  /Source Reference Information/,
  'Prototype directory should use neutral source-reference wording.',
);

assert.match(
  publicDirectorySource,
  /Source Page:/,
  'Prototype directory should label outbound links as source pages.',
);

assert.doesNotMatch(
  publicDirectorySource,
  /Official System Eligibility Mappings/,
  'Prototype directory should not overclaim eligibility mappings as official.',
);

assert.match(
  publicDirectorySource,
  /System Eligibility Mappings/,
  'Prototype directory should keep neutral wording for eligibility mappings.',
);

assert.doesNotMatch(
  adminDashboardSource,
  /\(\d{3}\)\s*555-\d{4}/,
  'Prototype admin dashboard should not ship fake 555 sample phones.',
);

assert.match(
  adminDashboardSource,
  /Pending review/,
  'Prototype admin dashboard should use review-needed placeholders instead of fake phone numbers.',
);

console.log('prototype copy hardening tests passed');
