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

const summary = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v5.json'));
const counties = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v5.jsonl'));
const directSources = readJsonl(path.join(repoRoot, 'data/generated/tx_education_direct_district_sources_v5.jsonl'));
const failures = readJsonl(path.join(repoRoot, 'data/generated/tx_failure_ledger_v5.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-district-grade-education-repair-report-v5.md'), 'utf8');

assert.equal(counties.length, 254, 'tx_county_baseline_v5.jsonl must have exactly 254 counties');
assert.equal(summary.v5.pass_counties + summary.v5.partial_counties + summary.v5.blocked_counties, 254, 'v5 summary totals must equal 254');

const sourceByCounty = new Map(directSources.map((row) => [row.county_slug, row]));
const failureByCounty = new Map(failures.map((row) => [row.county_slug, row]));

function sameDomainFamily(a, b) {
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

for (const row of counties.filter((item) => item.verification_status === 'pass')) {
  const source = sourceByCounty.get(row.county_slug);
  assert.ok(source, `PASS county ${row.county_slug} must have a direct education source row`);
  assert.equal(source.verification_status, 'verified', `PASS county ${row.county_slug} must have verified direct district-grade education evidence`);
  const sourceHost = new URL(source.source_url).hostname.replace(/^www\./, '');
  const finalHost = new URL(source.final_url).hostname.replace(/^www\./, '');
  const homepageHost = new URL(source.district_homepage).hostname.replace(/^www\./, '');
  assert.ok(!/(tea\.texas\.gov|tealprod\.tea\.state\.tx\.us|askted)/i.test(`${source.source_url} ${source.final_url}`), `PASS county ${row.county_slug} cannot use generic TEA/AskTED fallback proof`);
  assert.ok(!/education service center|esc region/i.test(source.district_name), `PASS county ${row.county_slug} cannot use ESC routing as the district identity`);
  assert.ok(source.http_status >= 200 && source.http_status < 400, `PASS county ${row.county_slug} cannot have a broken source URL`);
  assert.ok(Array.isArray(source.evidence_terms_found) && source.evidence_terms_found.length > 0, `PASS county ${row.county_slug} must have special-education evidence terms`);
  assert.ok(sameDomainFamily(finalHost, homepageHost), `Verified education source for ${row.county_slug} must stay on the district domain`);
  assert.ok(sameDomainFamily(sourceHost, homepageHost), `Verified education source for ${row.county_slug} must originate from the district homepage domain`);
  assert.equal(row.role_statuses.education, 'verified', `PASS county ${row.county_slug} must keep verified education status`);
}

for (const row of counties.filter((item) => item.verification_status !== 'pass')) {
  assert.ok(failureByCounty.has(row.county_slug), `Unresolved county ${row.county_slug} must have a failure ledger row`);
}

for (const row of counties) {
  assert.equal(row.role_statuses.lidda, 'verified', `v5 must preserve v4 verified LIDDA for ${row.county_slug}`);
  assert.equal(row.role_statuses.eci, 'verified', `v5 must preserve v4 verified ECI for ${row.county_slug}`);
  assert.equal(row.role_statuses.medicaid_hhs, 'verified', `v5 must preserve v4 verified HHS for ${row.county_slug}`);
  assert.equal(row.role_statuses.legal, 'verified', `v5 must preserve v4 verified legal route for ${row.county_slug}`);
  assert.equal(row.role_statuses.pti, 'verified', `v5 must preserve v4 verified PTI route for ${row.county_slug}`);
  assert.equal(row.role_statuses.able, 'verified', `v5 must preserve v4 verified ABLE route for ${row.county_slug}`);
}

assert.ok(report.includes('v4 PASS/PARTIAL/BLOCKED'), 'v5 report must include v4 counts');
assert.ok(report.includes('v5 PASS/PARTIAL/BLOCKED'), 'v5 report must include v5 counts');
assert.ok(report.includes('Texas is index-safe'), 'v5 report must state index-safety');

console.log('test-texas-district-grade-education-repair-v5: ok');
