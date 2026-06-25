import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch350ArizonaPdfSupportLetterFinalityV1 } from './run-batch350-arizona-pdf-support-letter-finality-v1.mjs';

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

const result = generateBatch350ArizonaPdfSupportLetterFinalityV1();
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
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch350_arizona_pdf_support_letter_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch350-arizona-pdf-support-letter-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch350_arizona_pdf_support_letter_finality_v1');
assert.equal(summary.primary_gap_reason, 'ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_azed_remaining_three_public_domains_still_lack_role_leaves');
assert.equal(summary.recommended_batch, 'hold_for_new_official_county_contract_or_role_leaf');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_ahcccs_pdf_bundle_resolves_to_support_letters_without_county_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_ahcccs_pdf_bundle_resolves_to_support_letters_without_county_contract');
assert.match(countyGap.status_reason, /bundled PDF runtime/i);
assert.match(countyGap.status_reason, /support letter/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'ahcccs_university_familycare_pdf_bundle_is_parseable_but_only_support_letters_not_county_admin_routing_contract');
assert.match(countyFailure.evidence, /Michal Goforth/i);
assert.match(countyFailure.evidence, /Pima County Administrator's Office letterhead/i);
assert.match(countyFailure.evidence, /Resources\/Downloads\/UniversityFamilyCare/i);
assert.match(countyFailure.evidence, /OversightOfHealthPlans\/\*\.pdf paths currently return the AHCCCS HTML shell|OversightOfHealthPlans\/\*\.pdf/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 5);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Pima Community Access Program support letter PDF'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Pima County Administrator support letter PDF'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_county_local_until_new_official_html_or_pdf_county_contract_exists_not_support_letters');

const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_azed_remaining_three_public_domains_still_lack_role_leaves');
assert.equal(queueRow.repair_lane, 'blocked_until_real_county_contract_or_role_leaf');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.packetBatch, 'batch350_arizona_pdf_support_letter_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_azed_remaining_three_public_domains_still_lack_role_leaves');
assert.equal(auditRow.familyStatuses.county_local_disability_resources, 'blocked_ahcccs_pdf_bundle_resolves_to_support_letters_without_county_contract');

assert.match(stateReport, /County-local is now blocked for a stronger reason/i);
assert.match(stateReport, /Resources\/Downloads\/UniversityFamilyCare/i);
assert.match(allStateReport, /Arizona remains blocked on a stronger county-local finality check/i);
assert.match(handoff, /Current Focus State: Arizona/);
assert.match(handoff, /Pima Community Access Program PDF/);
assert.match(handoff, /County Administrator Office PDF/);
assert.match(lessons, /A Working PDF Stack Still Does Not Turn Support Letters Into County Contracts/);

assert.equal(batchSummary.pdf_runtime_available, true);
assert.equal(batchSummary.live_download_path_corrected, true);
assert.equal(batchSummary.stale_pdf_paths_return_html_shell, true);
assert.equal(batchSummary.text_extractable_support_pdfs, 1);
assert.equal(batchSummary.rendered_image_support_pdfs, 2);
assert.equal(batchSummary.county_contract_found, false);
assert.equal(batchSummary.result, 'official_pdf_bundle_is_non_contract_support_evidence');
assert.match(batchReport, /support-letter evidence/i);

console.log('test-batch350-arizona-pdf-support-letter-finality-v1: ok');
