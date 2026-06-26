import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch393WyomingHcbsCountyClearV1 } from './run-batch393-wyoming-hcbs-county-clear-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch393WyomingHcbsCountyClearV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.county_local_family_cleared, true);

const summary = readJson('data/generated/wyoming_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch393_wyoming_hcbs_county_clear_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.equal(summary.primary_gap_reason, 'official_wde_public_again_but_no_reviewable_county_to_district_special_education_crosswalk_or_district_owned_special_education_leaf_set_exists');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'district_or_county_education_routing');

const gapRows = readJsonl('data/generated/wyoming_gap_matrix_v2.jsonl');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_official_hcbs_bes_county_assignments_pdf');
assert.match(countyGap.status_reason, /Benefits and Eligibility Specialists/i);
assert.match(countyGap.status_reason, /all 23 Wyoming counties/i);
assert.match(countyGap.status_reason, /Laramie \(M-Z\), Park/i);

const waiverGap = gapRows.find((row) => row.family === 'medicaid_waiver_hcbs_disability_services');
assert.match(waiverGap.status_reason, /Apply for DD Waivers/i);
assert.match(waiverGap.status_reason, /Supports and Comprehensive Waiver programs/i);

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.match(ddGap.status_reason, /older `dhhs\.wyoming\.gov\/dd` host no longer resolves/i);
assert.match(ddGap.status_reason, /Section Administrator/i);

const failureRows = readJsonl('data/generated/wyoming_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'district_or_county_education_routing');

const nextRows = readJsonl('data/generated/wyoming_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');

const verifiedRows = readJsonl('data/generated/wyoming_verified_sources_v1.jsonl');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_official_hcbs_bes_county_assignments_pdf');
assert.equal(countyVerified.sample_count, 8);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf'));
assert.match(countyVerified.samples.find((sample) => sample.source_url.includes('BES-Caseloads')).evidence_snippet, /all 23 Wyoming counties/i);
assert.match(JSON.stringify(countyVerified.samples), /Crook, Johnson, Lincoln, Niobrara, Uinta/i);
assert.match(JSON.stringify(countyVerified.samples), /Laramie \(M-Z\), Park/i);

const waiverVerified = verifiedRows.find((row) => row.family === 'medicaid_waiver_hcbs_disability_services');
assert.equal(waiverVerified.sample_count, 2);
assert.ok(waiverVerified.samples.some((sample) => sample.source_url === 'https://health.wyo.gov/healthcarefin/hcbs/'));
assert.ok(waiverVerified.samples.some((sample) => sample.source_url.includes('TOOL19-Application-Guide-for-Supports-Waiver.pdf')));

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.sample_count, 2);
assert.ok(ddVerified.samples.some((sample) => sample.source_url === 'https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/'));

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/wyoming-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /`county_local_disability_resources` now clears/i);
assert.match(stateReport, /stale dead `dhhs\.wyoming\.gov\/dd`/i);

const batchSummary = readJson('data/generated/batch393_wyoming_hcbs_county_clear_summary_v1.json');
assert.equal(batchSummary.county_local_family_cleared, true);
assert.equal(batchSummary.county_local_counties_covered, 23);
assert.equal(batchSummary.stale_dhhs_dd_host_replaced, true);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch393-wyoming-hcbs-county-clear-report-v1.md'), 'utf8');
assert.match(batchReport, /county-local disability routing from the live official HCBS county-assignment PDF/i);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /County-Keyed DD Assignment PDFs Can Clear Local Routing When Generic County Resource Pages Fail/);

console.log('test-batch393-wyoming-hcbs-county-clear-v1: ok');
