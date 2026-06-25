import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch364NewMexicoWorkbookStackFinalityV1 } from './run-batch364-new-mexico-workbook-stack-finality-v1.mjs';

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

const result = generateBatch364NewMexicoWorkbookStackFinalityV1();
const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch364_new_mexico_workbook_stack_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch364-new-mexico-workbook-stack-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch364_new_mexico_workbook_stack_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_official_sharepoint_lists_and_six_public_workbooks_live_but_verified_county_crosswalk_still_missing');

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_official_sharepoint_lists_and_six_public_workbooks_live_but_verified_county_crosswalk_still_missing');
assert.match(districtGap.status_reason, /Elementary School Principals\.xlsx/i);
assert.match(districtGap.status_reason, /Middle School Principals\.xlsx/i);
assert.match(districtGap.status_reason, /High School Principals\.xlsx/i);
assert.match(districtGap.status_reason, /Document Library` contains only those six workbook files/i);
assert.match(districtGap.status_reason, /SitePages` contains only `Home\.aspx`, `RECHome\.aspx`, `How To Use This Library\.aspx`, `Home1\.aspx`, and `untitled_1\.aspx`/i);
assert.match(districtGap.status_reason, /still stops short of county-grade routing/i);

const districtFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtFailure.failure_code, 'official_webed_sharepoint_lists_and_six_public_workbooks_verified_live_but_no_county_crosswalk_or_rec_service_area_contract');
assert.match(districtFailure.evidence, /principal workbooks expose district\/location\/contact columns only/i);
assert.match(districtFailure.evidence, /REC Directors\.xlsx/i);
assert.match(districtFailure.evidence, /Document Library` inventory closes at six workbook files/i);
assert.match(districtFailure.evidence, /SitePages` closes at five public pages/i);

const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Elementary School Principals workbook'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Middle School Principals workbook'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'High School Principals workbook'));
assert.equal(districtVerified.family_status, 'blocked_official_sharepoint_lists_and_six_public_workbooks_live_but_verified_county_crosswalk_still_missing');

const districtNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtNext.next_action, 'author_official_county_crosswalk_from_webed_directory_or_rec_contract');

const queueRow = queueRows.find((row) => row.state === 'new-mexico');
assert.equal(queueRow.primary_gap_reason, 'official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate');
assert.equal(queueRow.recommended_batch, 'hold_for_official_county_crosswalk_or_rec_service_area_contract');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-mexico');
assert.equal(auditRow.packetBatch, 'batch364_new_mexico_workbook_stack_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate');
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_official_sharepoint_lists_and_six_public_workbooks_live_but_verified_county_crosswalk_still_missing');

assert.match(stateReport, /public workbook stack is broader than the earlier packet captured/i);
assert.match(stateReport, /six workbook files and `SitePages` exposes only five public pages/i);
assert.match(stateReport, /REC county-service-area field/i);
assert.match(allStateReport, /complete six-file public workbook library/i);
assert.match(allStateReport, /five public SharePoint site pages/i);
assert.match(handoff, /Current Focus State: New Mexico/);
assert.match(handoff, /six public workbook exports/i);
assert.match(handoff, /closed public folder inventory of five site pages and six workbook files/i);
assert.match(handoff, /Elementary School Principals\.xlsx/i);
assert.ok(handoff.includes('1. Arizona'));
assert.ok(handoff.includes('2. New Hampshire'));
assert.match(lessons, /Live SharePoint Workbook Stacks Without County Fields Are Final Negative Evidence/);
assert.match(lessons, /SharePoint Folder Inventories Can Close Official Discovery Without Crawling/);

assert.equal(batchSummary.webed_sharepoint_home_live, true);
assert.equal(batchSummary.webed_rest_backed_school_list_live, true);
assert.equal(batchSummary.public_workbooks_verified_live, 6);
assert.equal(batchSummary.site_pages_verified_live, 5);
assert.equal(batchSummary.public_workbooks_with_county_field, 0);
assert.equal(batchSummary.public_workbooks_with_rec_service_area_field, 0);
assert.equal(batchSummary.public_site_pages_with_county_crosswalk, 0);
assert.equal(batchSummary.result, 'official_webed_lists_and_six_public_workbooks_live_but_no_county_crosswalk_or_rec_service_area_contract');
assert.match(batchReport, /widened the official New Mexico PED blocker evidence/i);

console.log('test-batch364-new-mexico-workbook-stack-finality-v1: ok');
