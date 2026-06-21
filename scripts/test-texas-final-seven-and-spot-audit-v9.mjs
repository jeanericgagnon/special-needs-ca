import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { classifyEducationCandidate, SPOT_AUDIT_COUNTIES, FINAL_SEVEN_TARGETS } from './run-texas-final-seven-and-spot-audit-v9.mjs';

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

const summaryV8 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v8.json'));
const summaryV9 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v9.json'));
const countiesV9 = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v9.jsonl'));
const directSourcesV9 = readJsonl(path.join(repoRoot, 'data/generated/tx_education_direct_district_sources_v9.jsonl'));
const failuresV9 = readJsonl(path.join(repoRoot, 'data/generated/tx_failure_ledger_v9.jsonl'));
const spotAuditV9 = readJsonl(path.join(repoRoot, 'data/generated/tx_v8_spot_audit_v9.jsonl'));
const documentTextV9 = readJsonl(path.join(repoRoot, 'data/generated/tx_document_text_extraction_v9.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-final-seven-and-spot-audit-report-v9.md'), 'utf8');

assert.equal(countiesV9.length, 254, 'tx_county_baseline_v9.jsonl must have exactly 254 counties');
assert.equal(summaryV9.v9.pass_counties + summaryV9.v9.partial_counties + summaryV9.v9.blocked_counties, 254, 'v9 summary totals must equal 254');
assert.equal(summaryV9.index_safe, summaryV9.v9.partial_counties === 0, 'index_safe is true only if partial_counties is 0');
assert.equal(spotAuditV9.length, 14, 'v9 must audit all 14 v8 repaired counties');
assert.deepEqual(new Set(spotAuditV9.map((row) => row.county_slug)), new Set(SPOT_AUDIT_COUNTIES.map((row) => row.county_slug)), 'spot audit must cover the exact v8 repaired counties');
assert.deepEqual(new Set(Object.keys(FINAL_SEVEN_TARGETS)), new Set(summaryV8.counties_below_california_grade), 'v9 must attempt exactly the 7 v8 partial counties');

const sourceByCounty = new Map(directSourcesV9.map((row) => [row.county_slug, row]));
for (const county of ['andrews-tx', 'franklin-tx', 'sabine-tx', 'stonewall-tx']) assert.equal(sourceByCounty.get(county)?.verification_status, 'verified', `${county} should be verified in v9`);
for (const county of ['king-tx', 'maverick-tx', 'mcmullen-tx']) assert.equal(sourceByCounty.get(county)?.verification_status, 'partial', `${county} should remain partial in v9`);

for (const row of countiesV9.filter((item) => item.verification_status === 'partial')) {
  assert.ok(failuresV9.some((failure) => failure.county_slug === row.county_slug), `every partial county must have failure ledger row: ${row.county_slug}`);
}

const stonewallDoc = documentTextV9.find((row) => row.county_slug === 'stonewall-tx');
assert.ok(stonewallDoc, 'stonewall OCR/document artifact must exist');
assert.equal(stonewallDoc.parser_status, 'ocr_text_extract', 'stonewall PDF must use OCR text extraction');
assert.ok(/special education/i.test(stonewallDoc.extracted_text), 'stonewall OCR text must include special education');

const genericStaffFail = classifyEducationCandidate(
  { target_url: 'https://district.example/staff', district_homepage: 'https://district.example', source_type: 'staff_directory' },
  { ok: true, finalUrl: 'https://district.example/staff', status: 200, contentType: 'text/html', title: 'Staff', headings: ['Staff'], snippet: 'General staff directory with no special program context', text: 'General staff directory with no special program context' },
);
assert.notEqual(genericStaffFail.status, 'verified', 'generic staff page cannot pass without special-education context');

const strongStaffPass = classifyEducationCandidate(
  { target_url: 'https://district.example/staff', district_homepage: 'https://district.example', source_type: 'staff_directory' },
  { ok: true, finalUrl: 'https://district.example/staff', status: 200, contentType: 'text/html', title: 'Staff – Special Education/Special Programs', headings: ['Staff'], snippet: 'Special Education Director Jane Doe jane@example.org Phone 555-111-2222', text: 'Special Education Director Jane Doe jane@example.org Phone 555-111-2222' },
);
assert.equal(strongStaffPass.status, 'verified', 'staff directory can pass only with explicit special-education contact context');

const googleSitePass = classifyEducationCandidate(
  { target_url: 'https://sites.google.com/exampleisd.net/specialservices/home', district_homepage: 'https://www.exampleisd.net', source_type: 'district_owned_google_site' },
  { ok: true, finalUrl: 'https://sites.google.com/exampleisd.net/specialservices/home', status: 200, contentType: 'text/html', title: 'Special Services', headings: ['Child Find'], snippet: 'Department of Special Services Child Find referral Special Education', text: 'Department of Special Services Child Find referral Special Education' },
);
assert.equal(googleSitePass.status, 'verified', 'district-owned Google Site can pass only with fetched/verifiable special-ed text');

const googleSiteFail = classifyEducationCandidate(
  { target_url: 'https://sites.google.com/exampleisd.net/specialservices/home', district_homepage: 'https://www.exampleisd.net', source_type: 'district_owned_google_site' },
  { ok: true, finalUrl: 'https://sites.google.com/exampleisd.net/specialservices/home', status: 200, contentType: 'text/html', title: 'Resources', headings: ['Home'], snippet: 'General parent resources only', text: 'General parent resources only' },
);
assert.notEqual(googleSiteFail.status, 'verified', 'district-owned Google Site without fetched special-ed evidence must fail closed');

const pdfPass = classifyEducationCandidate(
  { target_url: 'https://district.example/special-ed.pdf', district_homepage: 'https://district.example', source_type: 'district_document' },
  { ok: true, finalUrl: 'https://district.example/special-ed.pdf', status: 200, contentType: 'application/pdf', title: '', headings: [], snippet: '', text: '' },
  { documentEvidence: { extracted_text: 'Updates in Special Education Contact Person for Special Education Referrals Phone Number 940-989-3355 SpEdTex.org', extracted_terms_found: ['special education', 'spedtex'] } },
);
assert.equal(pdfPass.status, 'verified', 'PDF can pass only with extracted special-education evidence');

const pdfFail = classifyEducationCandidate(
  { target_url: 'https://district.example/special-ed.pdf', district_homepage: 'https://district.example', source_type: 'district_document' },
  { ok: true, finalUrl: 'https://district.example/special-ed.pdf', status: 200, contentType: 'application/pdf', title: '', headings: [], snippet: '', text: '' },
  { documentEvidence: { extracted_text: '', extracted_terms_found: [] } },
);
assert.notEqual(pdfFail.status, 'verified', 'PDF without extracted or manual evidence must fail');

const genericTeaFail = classifyEducationCandidate(
  { target_url: 'https://tea.texas.gov/special-education', district_homepage: 'https://district.example', source_type: 'special_education_page' },
  { ok: true, finalUrl: 'https://tea.texas.gov/special-education', status: 200, contentType: 'text/html', title: 'TEA Special Education', headings: ['Special Education'], snippet: 'Statewide page', text: 'Statewide page' },
);
assert.notEqual(genericTeaFail.status, 'verified', 'statewide TEA evidence cannot pass as district-grade proof');

assert.ok(report.includes('v8 PASS/PARTIAL/BLOCKED'), 'v9 report must include v8 counts');
assert.ok(report.includes('v9 PASS/PARTIAL/BLOCKED'), 'v9 report must include v9 counts');
assert.ok(report.includes('Texas is index-safe'), 'v9 report must state index safety');

console.log('test-texas-final-seven-and-spot-audit-v9: ok');
