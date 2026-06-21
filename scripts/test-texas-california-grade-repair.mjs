import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BAD = ['file not found', '404', 'page not found', 'forbidden', 'access denied', 'generic homepage only', 'just a moment'];

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

function hasBad(text) {
  const blob = String(text || '').toLowerCase();
  return BAD.some((item) => blob.includes(item));
}

const summary = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v3.json'));
const counties = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v3.jsonl'));
const lidda = readJsonl(path.join(repoRoot, 'data/generated/tx_lidda_county_map_v3.jsonl'));
const eci = readJsonl(path.join(repoRoot, 'data/generated/tx_eci_county_map_v3.jsonl'));
const hhs = readJsonl(path.join(repoRoot, 'data/generated/tx_hhs_office_map_v3.jsonl'));
const education = readJsonl(path.join(repoRoot, 'data/generated/tx_askted_district_map_v3.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-california-grade-repair-report-v3.md'), 'utf8');

assert.equal(counties.length, 254, 'tx_county_baseline_v3.jsonl must contain exactly 254 counties');
assert.equal(summary.v3.pass_counties + summary.v3.partial_counties + summary.v3.blocked_counties, counties.length, 'v3 summary totals must match county baseline rows');

for (const collection of [lidda, eci, hhs, education]) {
  for (const row of collection.filter((item) => item.verification_status === 'verified')) {
    assert.ok(!hasBad(`${row.evidence_title || ''} ${row.evidence_snippet || ''}`), `Verified row must not contain broken/generic evidence markers: ${row.source_url || row.final_url}`);
  }
}

for (const row of counties.filter((item) => item.verification_status === 'pass')) {
  assert.equal(row.role_statuses.lidda, 'verified', `PASS county ${row.county_slug} lacks verified LIDDA mapping`);
  assert.equal(row.role_statuses.eci, 'verified', `PASS county ${row.county_slug} lacks verified ECI mapping`);
  assert.equal(row.role_statuses.education, 'verified', `PASS county ${row.county_slug} lacks verified education mapping`);
  assert.equal(row.role_statuses.medicaid_hhs, 'verified', `PASS county ${row.county_slug} lacks verified Medicaid/HHS routing`);
  assert.ok(!(row.role_statuses.legal === 'verified' && row.role_statuses.pti === 'verified' && row.role_statuses.able === 'verified' && (!row.role_statuses.lidda || !row.role_statuses.eci || !row.role_statuses.education || !row.role_statuses.medicaid_hhs)), `PASS county ${row.county_slug} depends only on statewide routes`);
}

assert.ok(report.includes('v1:'), 'v3 report must include v1 result');
assert.ok(report.includes('v2:'), 'v3 report must include v2 result');
assert.ok(report.includes('v3:'), 'v3 report must include v3 result');

console.log('test-texas-california-grade-repair: ok');
