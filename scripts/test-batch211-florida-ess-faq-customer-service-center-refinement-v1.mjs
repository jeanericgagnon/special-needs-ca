import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch211FloridaEssFaqCustomerServiceCenterRefinementV1 } from './run-batch211-florida-ess-faq-customer-service-center-refinement-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch211FloridaEssFaqCustomerServiceCenterRefinementV1();
const batchSummary = readJson('data/generated/batch211_florida_ess_faq_customer_service_center_refinement_summary_v1.json');
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch211-florida-ess-faq-customer-service-center-refinement-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.essFaqMentionsLocalServiceCenter, true);
assert.equal(batchSummary.essFaqMentionsCustomerServiceCenter, true);
assert.equal(batchSummary.publicCountyOfficeLeafExposed, false);
assert.equal(summary.primary_gap_reason, 'ess_faq_names_customer_service_center_but_exposes_no_public_county_leaf_and_myaccess_results_stay_authenticated');

const queueRow = queueRows.find((row) => row.state === 'florida');
assert.equal(queueRow.primary_gap_reason, 'ess_faq_names_customer_service_center_but_exposes_no_public_county_leaf_and_myaccess_results_stay_authenticated');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_ess_faq_local_service_center_prose_without_county_leaf');
assert.match(countyGap.status_reason, /local service center or community partner location/i);
assert.match(countyGap.status_reason, /customer service center/i);
assert.match(countyGap.status_reason, /no county list, no county office table/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'ess_faq_names_customer_service_center_but_exposes_no_public_county_leaf_and_myaccess_results_stay_authenticated');
assert.match(countyFailure.evidence, /ESS FAQ now sharpens the blocker/i);
assert.match(countyFailure.evidence, /customer service center/i);
assert.match(countyFailure.evidence, /no county list, no county office table/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_ess_faq_local_service_center_prose_without_county_leaf');
const faqSample = countyVerified.samples.find((row) => row.source_url === 'https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/');
const communitySample = countyVerified.samples.find((row) => row.source_url === 'https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/');
assert.ok(faqSample);
assert.ok(communitySample);
assert.match(faqSample.evidence_snippet, /local service center or community partner location/i);
assert.match(faqSample.evidence_snippet, /customer service center/i);
assert.match(communitySample.evidence_snippet, /Find your nearest Partner/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'ess_faq_names_customer_service_center_but_exposes_no_public_county_leaf_and_myaccess_results_stay_authenticated');
assert.equal(countyNext.next_action, 'hold_county_local_until_first_party_public_county_office_leaf_or_anonymous_myaccess_results_exist');

assert.ok(report.includes('FAQ still names local service centers and customer service centers only in prose'));
assert.ok(batchReport.includes('FAQ still names local service centers and customer service centers only in prose'));

console.log('test-batch211-florida-ess-faq-customer-service-center-refinement-v1: ok');
