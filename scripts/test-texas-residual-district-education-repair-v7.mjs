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

const summaryV6 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v6.json'));
const summaryV7 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v7.json'));
const countiesV6 = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v6.jsonl'));
const countiesV7 = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v7.jsonl'));
const directSourcesV7 = readJsonl(path.join(repoRoot, 'data/generated/tx_education_direct_district_sources_v7.jsonl'));
const failuresV7 = readJsonl(path.join(repoRoot, 'data/generated/tx_failure_ledger_v7.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-residual-district-education-repair-report-v7.md'), 'utf8');

assert.equal(countiesV7.length, 254, 'tx_county_baseline_v7.jsonl must have exactly 254 counties');
assert.equal(summaryV7.v7.pass_counties + summaryV7.v7.partial_counties + summaryV7.v7.blocked_counties, 254, 'v7 summary totals must equal 254');
assert.equal(summaryV7.index_safe, summaryV7.v7.partial_counties === 0, 'index_safe is true only when partial_counties is 0');

const sourceByCounty = new Map(directSourcesV7.map((row) => [row.county_slug, row]));
const failureByCounty = new Map(failuresV7.map((row) => [row.county_slug, row]));
const v6ByCounty = new Map(countiesV6.map((row) => [row.county_slug, row]));
const v6PartialSlugs = new Set(countiesV6.filter((item) => item.verification_status === 'partial').map((row) => row.county_slug));

for (const row of countiesV6.filter((item) => item.verification_status === 'pass')) {
  const v7 = countiesV7.find((item) => item.county_slug === row.county_slug);
  assert.ok(v7, `v7 must preserve county ${row.county_slug}`);
  assert.equal(v7.verification_status, 'pass', `v6 PASS county ${row.county_slug} cannot be downgraded in v7`);
}

for (const row of countiesV7.filter((item) => item.verification_status === 'pass')) {
  const source = sourceByCounty.get(row.county_slug);
  assert.ok(source, `PASS county ${row.county_slug} must have direct education source row`);
  assert.equal(source.verification_status, 'verified', `PASS county ${row.county_slug} must have verified district-grade evidence`);
  assert.notEqual(source.evidence_quality, 'weak_student_services', `PASS county ${row.county_slug} cannot use weak student services only`);
  assert.notEqual(source.evidence_quality, 'homepage_only', `PASS county ${row.county_slug} cannot use homepage-only evidence`);
  assert.ok(!/(tea\.texas\.gov|tealprod\.tea\.state\.tx\.us|askted)/i.test(`${source.source_url} ${source.final_url}`), `PASS county ${row.county_slug} cannot use ESC/TEA fallback as proof`);
  assert.ok(!/(duckduckgo\.com|bing\.com|google\.[^/]+\/search|googleusercontent\.com\/search)/i.test(`${source.source_url} ${source.final_url}`), `PASS county ${row.county_slug} cannot use search-result pages as final evidence`);
  const sourceHost = new URL(source.source_url).hostname.replace(/^www\./, '');
  const finalHost = new URL(source.final_url).hostname.replace(/^www\./, '');
  const homepageHost = new URL(source.district_homepage).hostname.replace(/^www\./, '');
  assert.ok(sameDomainFamily(finalHost, homepageHost), `Verified source for ${row.county_slug} must stay on official district domain/canonical redirect`);
  assert.ok(sameDomainFamily(sourceHost, homepageHost), `Verified source for ${row.county_slug} must originate from official district domain/canonical redirect`);
  assert.ok(Array.isArray(source.evidence_terms_found) && source.evidence_terms_found.length > 0, `PASS county ${row.county_slug} must contain district-grade evidence terms`);
}

for (const row of countiesV7.filter((item) => item.verification_status !== 'pass')) {
  assert.ok(failureByCounty.has(row.county_slug), `Unresolved county ${row.county_slug} must have failure ledger row`);
}

for (const row of countiesV7) {
  const prev = v6ByCounty.get(row.county_slug);
  assert.ok(prev, `v6 county ${row.county_slug} must exist`);
  assert.equal(row.role_statuses.lidda, prev.role_statuses.lidda, `v7 must preserve v6 LIDDA for ${row.county_slug}`);
  assert.equal(row.role_statuses.eci, prev.role_statuses.eci, `v7 must preserve v6 ECI for ${row.county_slug}`);
  assert.equal(row.role_statuses.medicaid_hhs, prev.role_statuses.medicaid_hhs, `v7 must preserve v6 HHS for ${row.county_slug}`);
  assert.equal(row.role_statuses.legal, prev.role_statuses.legal, `v7 must preserve v6 legal for ${row.county_slug}`);
  assert.equal(row.role_statuses.pti, prev.role_statuses.pti, `v7 must preserve v6 PTI for ${row.county_slug}`);
  assert.equal(row.role_statuses.able, prev.role_statuses.able, `v7 must preserve v6 ABLE for ${row.county_slug}`);
}

for (const row of failuresV7) {
  assert.ok(v6PartialSlugs.has(row.county_slug), `v7 must start only from the 30 v6 partial counties, found failure row for ${row.county_slug}`);
  assert.ok(Array.isArray(row.homepage_domain_repair_attempts), `v7 failure ledger must include homepage/domain repair attempts for ${row.county_slug}`);
  assert.ok(Array.isArray(row.search_queries), `v7 failure ledger must include search query attempts for ${row.county_slug}`);
  assert.ok(row.recommended_manual_next_action, `v7 failure ledger must include recommended manual next action for ${row.county_slug}`);
}

assert.ok(report.includes('v6 PASS/PARTIAL/BLOCKED'), 'v7 report must include v6 counts');
assert.ok(report.includes('v7 PASS/PARTIAL/BLOCKED'), 'v7 report must include v7 counts');
assert.ok(report.includes('Texas is index-safe'), 'v7 report must state index safety');
assert.ok(/No new generalizable lesson was discovered|Lessons learned update/i.test(report), 'v7 report must state lessons-learned outcome');
assert.equal(summaryV7.v6.pass_counties, summaryV6.v6.pass_counties, 'v7 summary must preserve v6 baseline counts');

console.log('test-texas-residual-district-education-repair-v7: ok');
