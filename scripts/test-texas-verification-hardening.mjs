import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const summary = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v2.json'));
const counties = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v2.jsonl'));
const lidda = readJsonl(path.join(repoRoot, 'data/generated/tx_lidda_county_map_v2.jsonl'));
const eci = readJsonl(path.join(repoRoot, 'data/generated/tx_eci_county_map_v2.jsonl'));
const education = readJsonl(path.join(repoRoot, 'data/generated/tx_askted_district_map_v2.jsonl'));
const failures = readJsonl(path.join(repoRoot, 'data/generated/tx_failure_ledger_v2.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-verification-hardening-report-v2.md'), 'utf8');
const v1Doc = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-completion-procedure-and-results-v1.md'), 'utf8');

assert.equal(counties.length, 254, 'Texas v2 county baseline must contain exactly 254 counties.');
assert.equal(summary.v2.pass_counties + summary.v2.partial_counties + summary.v2.blocked_counties, counties.length, 'Texas v2 summary counts must match county baseline.');
assert.ok(v1Doc.includes('## v2 correction notice'), 'Texas v1 procedure doc must include a v2 correction notice.');
assert.ok(report.includes('What v1 got wrong'), 'Texas v2 report must document the v1 defects.');
assert.ok(report.includes('Texas is index-safe: no'), 'Texas v2 report must state that Texas is not index-safe.');

for (const row of lidda.filter((item) => item.verification_status === 'verified')) {
  const blob = `${row.evidence_snippet || ''}`.toLowerCase();
  assert.ok(!blob.includes('file not found'), 'Verified v2 LIDDA row cannot contain File Not Found evidence.');
  assert.ok(!blob.includes('404'), 'Verified v2 LIDDA row cannot contain 404 evidence.');
}

for (const row of counties.filter((item) => item.verification_status === 'pass')) {
  assert.equal(row.lidda_status, 'verified', `PASS county ${row.county_slug} must have verified LIDDA.`);
  assert.equal(row.eci_status, 'verified', `PASS county ${row.county_slug} must have verified ECI.`);
  assert.equal(row.education_status, 'verified', `PASS county ${row.county_slug} must have verified education routing.`);
  assert.equal(row.medicaid_hhs_status, 'verified', `PASS county ${row.county_slug} must have verified HHS routing.`);
}

assert.equal(summary.v2.pass_counties, 0, 'Current hardening inputs should not leave any PASS counties.');
assert.equal(summary.v2.blocked_counties, 254, 'Current hardening inputs should downgrade all counties to BLOCKED.');
assert.equal(lidda.filter((row) => row.verification_status !== 'verified').length, 39, 'All current v1 LIDDA rows should be downgraded.');
assert.equal(education.filter((row) => row.verification_status !== 'verified').length, 255, 'All current v1 education rows should be downgraded.');
assert.ok(failures.some((row) => row.category === 'downgrade_lidda'), 'Failure ledger v2 must include LIDDA downgrade rows.');
assert.ok(failures.some((row) => row.category === 'downgrade_education'), 'Failure ledger v2 must include education downgrade rows.');
assert.ok(failures.some((row) => row.category === 'downgrade_county_gate'), 'Failure ledger v2 must include county gate downgrade rows.');

for (const row of eci.filter((item) => item.verification_status === 'verified')) {
  assert.ok(Array.isArray(row.counties_served) && row.counties_served.length > 0, `Verified ECI row ${row.eci_id} must have county mapping.`);
  assert.ok(row.referral_phone || row.email, `Verified ECI row ${row.eci_id} must have a contact route.`);
}

console.log('test-texas-verification-hardening: ok');
