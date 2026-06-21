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

const summary = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v4.json'));
const counties = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v4.jsonl'));
const education = readJsonl(path.join(repoRoot, 'data/generated/tx_askted_district_map_v4.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-california-grade-repair-report-v4.md'), 'utf8');

assert.equal(counties.length, 254, 'tx_county_baseline_v4.jsonl must contain exactly 254 counties');
assert.equal(summary.v4.pass_counties + summary.v4.partial_counties + summary.v4.blocked_counties, counties.length, 'v4 summary totals must match county baseline rows');
assert.equal(summary.v4.pass_counties, 10, 'v4 should only pass counties with direct district-grade education evidence');
assert.equal(summary.v4.partial_counties, 244, 'v4 should downgrade fallback education counties to partial');
assert.equal(summary.v4.blocked_counties, 0, 'v4 should not block counties that still retain the rest of the official skeleton');
assert.equal(summary.index_safe, false, 'Texas must not be index-safe under the strict district-grade rule');

for (const row of counties.filter((item) => item.verification_status === 'pass')) {
  assert.equal(row.role_statuses.education, 'verified', `PASS county ${row.county_slug} must retain verified education status`);
  assert.equal(row.strict_education_grade, 'direct_live_district_page', `PASS county ${row.county_slug} must use direct district-grade education evidence`);
}

for (const row of counties.filter((item) => item.verification_status === 'partial')) {
  assert.ok(row.missing_roles.includes('district-grade education routing'), `PARTIAL county ${row.county_slug} must expose missing district-grade education routing`);
}

for (const row of education.filter((item) => item.verification_status === 'verified')) {
  assert.equal(row.evidence_quality, 'live_direct_district_grade_route', `Verified strict education row ${row.county_id} must be district-grade`);
  assert.equal(row.district_type, 'district', `Verified strict education row ${row.county_id} must be district-specific`);
  assert.ok(!String(row.district_id).startsWith('sd-fallback-'), `Verified strict education row ${row.county_id} must not be fallback-based`);
}

assert.ok(report.includes('v4:'), 'v4 report must include v4 result');
assert.ok(report.includes('Texas is index-safe: no'), 'v4 report must clearly say Texas is not index-safe');

console.log('test-texas-california-grade-repair-v4: ok');
