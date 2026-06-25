import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch351ArizonaEducationSurfaceRecheckV1 } from './run-batch351-arizona-education-surface-recheck-v1.mjs';

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

const result = generateBatch351ArizonaEducationSurfaceRecheckV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch351_arizona_education_surface_recheck_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch351-arizona-education-surface-recheck-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch351_arizona_education_surface_recheck_v1');
assert.equal(summary.primary_gap_reason, 'ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves');
assert.equal(summary.recommended_batch, 'hold_for_new_official_county_contract_or_role_leaf');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_three_reviewed_public_district_domains_live_surface_recheck_still_without_role_leafs');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_three_reviewed_public_district_domains_live_surface_recheck_still_without_role_leafs');
assert.match(educationGap.status_reason, /WordPress JSON searches/i);
assert.match(educationGap.status_reason, /search-results/i);
assert.match(educationGap.status_reason, /documents\/` page preserved no role-bearing content|documents\/ page preserved no role-bearing content/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'three_reviewed_public_district_domains_live_surface_recheck_exhausts_search_sitemap_and_exact_role_surfaces_without_role_leafs');
assert.match(educationFailure.evidence, /WordPress JSON|wp-json/i);
assert.match(educationFailure.evidence, /search-results\/~board\/news\/post\/special-education/i);
assert.match(educationFailure.evidence, /fs\/pages\/sitemap/);
assert.match(educationFailure.evidence, /documents\//);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.sample_count, 10);
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Coconino wp-json role searches stayed false-positive'));
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Mohave public search-results surface stayed empty'));
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Yavapai documents plus exact role pages still empty'));

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'hold_three_reviewed_public_domains_until_role_bearing_special_education_student_services_or_504_leaves_exist');

const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves');
assert.equal(queueRow.repair_lane, 'blocked_until_real_county_contract_or_role_leaf');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.packetBatch, 'batch351_arizona_education_surface_recheck_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves');
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_three_reviewed_public_district_domains_live_surface_recheck_still_without_role_leafs');

assert.match(stateReport, /Education remains source-final on the remaining three reviewed public district domains after one more live search, sitemap, documents, and exact-role recheck/i);
assert.match(allStateReport, /Arizona remains blocked after a fresh live education-surface recheck/i);
assert.match(handoff, /Current Focus State: Arizona/);
assert.match(handoff, /Mohave public special-education search results/);
assert.match(handoff, /Yavapai documents page/);
assert.match(handoff, /Massachusetts/);

assert.equal(batchSummary.ccasd_role_hits_found, 0);
assert.equal(batchSummary.mohave_role_hits_found, 0);
assert.equal(batchSummary.yavapai_role_hits_found, 0);
assert.equal(batchSummary.ccasd_wp_json_false_positive_searches, 4);
assert.equal(batchSummary.mohave_exact_role_404s, 3);
assert.equal(batchSummary.mohave_search_results_empty, true);
assert.equal(batchSummary.mohave_sitemap_xml_status, 404);
assert.equal(batchSummary.mohave_fs_sitemap_status, 406);
assert.equal(batchSummary.yavapai_exact_role_404s, 3);
assert.equal(batchSummary.yavapai_documents_role_hits_found, 0);
assert.equal(batchSummary.result, 'three_live_public_district_domains_still_lack_role_bearing_local_education_leaves');
assert.match(batchReport, /bounded live public-surface pass/i);

console.log('test-batch351-arizona-education-surface-recheck-v1: ok');
