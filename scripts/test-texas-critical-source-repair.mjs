import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BAD = ['file not found', '404', 'page not found', 'forbidden', 'access denied'];

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
const education = readJsonl(path.join(repoRoot, 'data/generated/tx_askted_district_map_v3.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-critical-source-repair-report-v3.md'), 'utf8');

assert.equal(counties.length, 254, 'tx_county_baseline_v3 must contain exactly 254 counties');
assert.equal(summary.v3.pass_counties + summary.v3.partial_counties + summary.v3.blocked_counties, counties.length, 'tx_verification_summary_v3 totals must match county baseline rows');

for (const row of lidda.filter((item) => item.verification_status === 'verified')) {
  assert.ok(!hasBad(`${row.evidence_snippet || ''} ${row.evidence_title || ''}`), `Verified LIDDA row cannot contain broken evidence: ${row.lidda_id}`);
  assert.notEqual(row.source_url, 'https://apps.hhs.texas.gov/contact/la.cfm', 'Verified LIDDA row cannot use the dead apps.hhs.texas.gov proof URL');
}

for (const row of education.filter((item) => item.verification_status === 'verified')) {
  assert.ok(row.downloaded_artifact_path, `Verified education row ${row.county_id} must keep downloaded artifact reference`);
  assert.notEqual(row.source_url, 'https://tea.texas.gov/AskTED', `Verified education row ${row.county_id} cannot depend only on generic AskTED URL`);
  assert.ok(row.district_name || row.esc_region, `Verified education row ${row.county_id} must contain district or ESC identity`);
}

for (const row of counties.filter((item) => item.verification_status === 'pass')) {
  assert.equal(row.lidda_status, 'verified', `PASS county ${row.county_slug} must have verified LIDDA mapping`);
  assert.equal(row.education_status, 'verified', `PASS county ${row.county_slug} must have verified AskTED mapping`);
}

assert.ok(report.includes('v2 PASS/PARTIAL/BLOCKED'), 'Report must include v2 PASS/PARTIAL/BLOCKED');
assert.ok(report.includes('v3 PASS/PARTIAL/BLOCKED'), 'Report must include v3 PASS/PARTIAL/BLOCKED');
assert.ok(report.includes('Texas is index-safe'), 'Report must state whether Texas is index-safe');

console.log('test-texas-critical-source-repair: ok');
