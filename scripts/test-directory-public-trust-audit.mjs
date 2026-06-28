import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonPath = path.join(repoRoot, 'docs', 'generated', `directory-public-trust-audit-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `directory-public-trust-audit-${generatedDate}.md`);

execFileSync('node', ['--experimental-strip-types', 'scripts/run-directory-public-trust-audit.mjs'], {
  cwd: repoRoot,
  stdio: 'pipe',
});

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const md = fs.readFileSync(mdPath, 'utf8');

assert.ok(Array.isArray(payload.tables));
assert.equal(payload.tables.length, 4);

const byTable = new Map(payload.tables.map((table) => [table.table, table]));
for (const tableName of ['iep_advocates', 'resource_providers', 'nonprofit_organizations', 'county_offices']) {
  assert.ok(byTable.has(tableName), `missing table summary for ${tableName}`);
}

const advocates = byTable.get('iep_advocates');
assert.ok(advocates.blockedRows >= advocates.samples.length);
assert.ok(advocates.topIssues.some((issue) => (
  issue.issue === 'invalid_public_name'
  || issue.issue === 'missing_source_url'
  || issue.issue === 'not_public_record_eligible'
  || issue.issue === 'invalid_public_phone'
  || issue.issue === 'synthetic_source_url'
  || issue.issue === 'synthetic_website'
)));

const countyOffices = byTable.get('county_offices');
assert.ok(countyOffices.topIssues.some((issue) => issue.issue === 'not_public_record_eligible' || issue.issue === 'not_public_county_office_eligible'));
assert.equal(countyOffices.publicEligibleRows, countyOffices.renderableRows, 'County-office public eligibility must match the county-office-specific renderable gate.');
assert.ok(countyOffices.basePublicRecordEligibleRows >= countyOffices.publicEligibleRows, 'County offices may have broader base public-record eligibility than their stricter county-office gate.');

assert.ok(md.includes('# Directory Public Trust Audit'));
assert.ok(md.includes('placeholder names'));
assert.ok(md.includes('IEP Advocates'));
assert.ok(md.includes('County Offices'));

console.log('directory public trust audit tests passed');
