import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { classifyEducationCandidate, FINAL_THREE_TARGETS } from './run-texas-final-three-repair-v10.mjs';

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

const summaryV9 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v9.json'));
const summaryV10 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v10.json'));
const countiesV9 = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v9.jsonl'));
const countiesV10 = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v10.jsonl'));
const directSourcesV10 = readJsonl(path.join(repoRoot, 'data/generated/tx_education_direct_district_sources_v10.jsonl'));
const failuresV10 = readJsonl(path.join(repoRoot, 'data/generated/tx_failure_ledger_v10.jsonl'));
const candidateRowsV10 = readJsonl(path.join(repoRoot, 'data/generated/tx_final_three_target_candidates_v10.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-final-three-repair-report-v10.md'), 'utf8');

assert.equal(countiesV10.length, 254, 'tx_county_baseline_v10.jsonl must have exactly 254 counties');
assert.equal(summaryV10.v10.pass_counties + summaryV10.v10.partial_counties + summaryV10.v10.blocked_counties, 254, 'v10 summary totals must equal 254');
assert.equal(summaryV10.index_safe, summaryV10.v10.partial_counties === 0 && summaryV10.v10.blocked_counties === 0, 'index_safe is true only if there are no partial or blocked counties');
assert.deepEqual(new Set(Object.keys(FINAL_THREE_TARGETS)), new Set(summaryV9.still_partial_counties), 'v10 must start from exactly the 3 v9 partial counties');

const v9ByCounty = new Map(countiesV9.map((row) => [row.county_slug, row]));
const v10ByCounty = new Map(countiesV10.map((row) => [row.county_slug, row]));
for (const row of countiesV9.filter((item) => item.verification_status === 'pass')) {
  assert.equal(v10ByCounty.get(row.county_slug)?.verification_status, 'pass', `existing v9 PASS county must not be downgraded: ${row.county_slug}`);
}

for (const county of Object.keys(FINAL_THREE_TARGETS)) {
  const row = directSourcesV10.find((item) => item.county_slug === county);
  assert.ok(row, `v10 direct source must exist for ${county}`);
  assert.equal(row.verification_status, 'verified', `${county} should verify in v10`);
  assert.ok(row.source_url, `${county} must preserve source_url`);
  assert.ok(row.final_url, `${county} must preserve final_url`);
  assert.ok(row.fetched_at, `${county} must preserve fetched_at`);
  assert.ok(row.evidence_snippet, `${county} must preserve evidence_snippet`);
}

if (summaryV10.v10.partial_counties > 0 || summaryV10.v10.blocked_counties > 0) {
  for (const row of countiesV10.filter((item) => item.verification_status !== 'pass')) {
    assert.ok(failuresV10.some((failure) => failure.county_slug === row.county_slug), `every non-pass county must have failure ledger row: ${row.county_slug}`);
  }
} else {
  assert.equal(failuresV10.length, 0, 'failure ledger must be empty when all 254 counties pass');
}

assert.equal(candidateRowsV10.length >= 3, true, 'v10 must emit the attempted target candidates');

const genericTeaFail = classifyEducationCandidate(
  { target_url: 'https://tea.texas.gov/special-education', district_homepage: 'https://district.example', source_type: 'special_education_page' },
  { ok: true, finalUrl: 'https://tea.texas.gov/special-education', status: 200, contentType: 'text/html', title: 'TEA Special Education', headings: ['Special Education'], snippet: 'Statewide page', text: 'Statewide page' },
);
assert.notEqual(genericTeaFail.status, 'verified', 'statewide TEA evidence cannot pass as district-grade proof');

const genericParentFail = classifyEducationCandidate(
  { target_url: 'https://district.example/forparents', district_homepage: 'https://district.example', source_type: 'parent_resource_directory' },
  { ok: true, finalUrl: 'https://district.example/forparents', status: 200, contentType: 'text/html', title: 'For Parents', headings: ['For Parents'], snippet: 'Calendar, lunch menu, school supply lists', text: 'Calendar lunch menu school supply lists athletics board meeting notices' },
);
assert.notEqual(genericParentFail.status, 'verified', 'generic parent page without special-education routing cannot pass');

const parentResourcePass = classifyEducationCandidate(
  { target_url: 'https://district.example/forparents', district_homepage: 'https://district.example', source_type: 'parent_resource_directory' },
  { ok: true, finalUrl: 'https://district.example/forparents', status: 200, contentType: 'text/html', title: 'For Parents', headings: ['Parent Resources'], snippet: 'Special Education Guides Section 504 Dyslexia Handbook Public Complaint Form', text: 'For Parents Parent Resources Special Education Guides Section 504 Dyslexia Handbook Public Complaint Form campus resources' },
);
assert.equal(parentResourcePass.status, 'verified', 'district-owned parent resource page can pass only with explicit special-education routing assets');

const loginFail = classifyEducationCandidate(
  { target_url: 'https://district.example/search', district_homepage: 'https://district.example', source_type: 'parent_resource_directory' },
  { ok: true, finalUrl: 'https://district.example/search', status: 200, contentType: 'text/html', title: 'Search Results', headings: ['Search'], snippet: 'search-results log in accounts.google.com', text: 'search-results log in accounts.google.com' },
);
assert.notEqual(loginFail.status, 'verified', 'search or login pages cannot pass');

const pdfPass = classifyEducationCandidate(
  { target_url: 'https://district.example/special-ed.pdf', district_homepage: 'https://district.example', source_type: 'district_document' },
  { ok: true, finalUrl: 'https://district.example/special-ed.pdf', status: 200, contentType: 'application/pdf', title: '', headings: [], snippet: '', text: '' },
  { documentEvidence: { extracted_text: 'Special Education Referrals Contact Person for Special Education Referrals Phone Number 361-274-2000 request an evaluation SpEdTex', extracted_terms_found: ['special education', 'spedtex'] } },
);
assert.equal(pdfPass.status, 'verified', 'district-owned documents can pass only with extracted or manually reviewed special-education evidence');

const pdfFail = classifyEducationCandidate(
  { target_url: 'https://district.example/special-ed.pdf', district_homepage: 'https://district.example', source_type: 'district_document' },
  { ok: true, finalUrl: 'https://district.example/special-ed.pdf', status: 200, contentType: 'application/pdf', title: '', headings: [], snippet: '', text: '' },
  { documentEvidence: { extracted_text: '', extracted_terms_found: [] } },
);
assert.notEqual(pdfFail.status, 'verified', 'unparsed district document must fail closed');

assert.ok(report.includes('v9 PASS/PARTIAL/BLOCKED'), 'v10 report must include v9 counts');
assert.ok(report.includes('v10 PASS/PARTIAL/BLOCKED'), 'v10 report must include v10 counts');
assert.ok(report.includes('Texas is index-safe'), 'v10 report must state index safety');

console.log('test-texas-final-three-repair-v10: ok');
