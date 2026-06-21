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

function sameDomainFamily(a, b) {
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

const summaryV5 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v5.json'));
const summaryV6 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v6.json'));
const countiesV5 = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v5.jsonl'));
const countiesV6 = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v6.jsonl'));
const directSourcesV6 = readJsonl(path.join(repoRoot, 'data/generated/tx_education_direct_district_sources_v6.jsonl'));
const failuresV6 = readJsonl(path.join(repoRoot, 'data/generated/tx_failure_ledger_v6.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-final-district-education-cleanup-report-v6.md'), 'utf8');

assert.equal(countiesV6.length, 254, 'tx_county_baseline_v6.jsonl must have exactly 254 counties');
assert.equal(summaryV6.v6.pass_counties + summaryV6.v6.partial_counties + summaryV6.v6.blocked_counties, 254, 'v6 summary totals must equal 254');

const sourceByCounty = new Map(directSourcesV6.map((row) => [row.county_slug, row]));
const failureByCounty = new Map(failuresV6.map((row) => [row.county_slug, row]));
const v5ByCounty = new Map(countiesV5.map((row) => [row.county_slug, row]));

for (const row of countiesV5.filter((item) => item.verification_status === 'pass')) {
  const v6 = countiesV6.find((item) => item.county_slug === row.county_slug);
  assert.ok(v6, `v6 must preserve county ${row.county_slug}`);
  assert.equal(v6.verification_status, 'pass', `v5 PASS county ${row.county_slug} cannot be downgraded in v6`);
}

for (const row of countiesV6.filter((item) => item.verification_status === 'pass')) {
  const source = sourceByCounty.get(row.county_slug);
  assert.ok(source, `PASS county ${row.county_slug} must have direct education source row`);
  assert.equal(source.verification_status, 'verified', `PASS county ${row.county_slug} must have verified district-grade evidence`);
  assert.notEqual(source.evidence_quality, 'weak_student_services', `PASS county ${row.county_slug} cannot use weak student services only`);
  assert.notEqual(source.evidence_quality, 'homepage_only', `PASS county ${row.county_slug} cannot use homepage-only evidence`);
  assert.ok(!/(tea\.texas\.gov|tealprod\.tea\.state\.tx\.us|askted)/i.test(`${source.source_url} ${source.final_url}`), `PASS county ${row.county_slug} cannot use ESC/TEA fallback as proof`);
  const sourceHost = new URL(source.source_url).hostname.replace(/^www\./, '');
  const finalHost = new URL(source.final_url).hostname.replace(/^www\./, '');
  const homepageHost = new URL(source.district_homepage).hostname.replace(/^www\./, '');
  assert.ok(sameDomainFamily(finalHost, homepageHost), `Verified source for ${row.county_slug} must stay on official district domain/canonical redirect`);
  assert.ok(sameDomainFamily(sourceHost, homepageHost), `Verified source for ${row.county_slug} must originate from official district domain/canonical redirect`);
  assert.ok(Array.isArray(source.evidence_terms_found) && source.evidence_terms_found.length > 0, `PASS county ${row.county_slug} must contain district-grade evidence terms`);
}

for (const row of countiesV6.filter((item) => item.verification_status !== 'pass')) {
  assert.ok(failureByCounty.has(row.county_slug), `Unresolved county ${row.county_slug} must have failure ledger row`);
}

for (const row of countiesV6) {
  const prev = v5ByCounty.get(row.county_slug);
  assert.ok(prev, `v5 county ${row.county_slug} must exist`);
  assert.equal(row.role_statuses.lidda, prev.role_statuses.lidda, `v6 must preserve v5 LIDDA for ${row.county_slug}`);
  assert.equal(row.role_statuses.eci, prev.role_statuses.eci, `v6 must preserve v5 ECI for ${row.county_slug}`);
  assert.equal(row.role_statuses.medicaid_hhs, prev.role_statuses.medicaid_hhs, `v6 must preserve v5 HHS for ${row.county_slug}`);
  assert.equal(row.role_statuses.legal, prev.role_statuses.legal, `v6 must preserve v5 legal for ${row.county_slug}`);
  assert.equal(row.role_statuses.pti, prev.role_statuses.pti, `v6 must preserve v5 PTI for ${row.county_slug}`);
  assert.equal(row.role_statuses.able, prev.role_statuses.able, `v6 must preserve v5 ABLE for ${row.county_slug}`);
}

assert.ok(report.includes('v5 PASS/PARTIAL/BLOCKED'), 'v6 report must include v5 counts');
assert.ok(report.includes('v6 PASS/PARTIAL/BLOCKED'), 'v6 report must include v6 counts');
assert.ok(report.includes('Texas is index-safe'), 'v6 report must state index safety');
assert.equal(summaryV6.v5.pass_counties, summaryV5.v5.pass_counties, 'v6 summary must preserve v5 baseline counts');

console.log('test-texas-final-district-education-cleanup-v6: ok');
