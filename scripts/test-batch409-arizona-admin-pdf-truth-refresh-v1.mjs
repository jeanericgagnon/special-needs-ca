import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch409ArizonaAdminPdfTruthRefreshV1 } from './run-batch409-arizona-admin-pdf-truth-refresh-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch409ArizonaAdminPdfTruthRefreshV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch409_arizona_admin_pdf_truth_refresh_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(
  summary.primary_gap_reason,
  'bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_are_pima_support_letters_not_county_contracts',
);

const countyGap = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_des_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_prove_no_county_contract');
assert.match(countyGap.status_reason, /CountyAdminOffice\.pdf.*PimaCountyAdmin\.pdf.*both return HTTP 200 application\/pdf/i);
assert.match(countyGap.status_reason, /just 2014 Pima County Administrator support letters/i);
assert.match(countyGap.status_reason, /ALTCS_CountyMap\.pdf.*text-extractable/i);

const spedGap = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl').find((row) => row.family === 'special_education_idea_part_b');
assert.equal(spedGap.family_status, 'verified_state_grade');
assert.match(spedGap.status_reason, /IDEA-by-State page for Arizona/i);
assert.match(spedGap.status_reason, /2025 SPP\/APR and State Determination Letters, Part B — Arizona/i);

const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].failure_code, 'official_greenlee_county_assignment_still_missing_after_live_admin_pdf_review');
assert.match(failureRows[0].evidence, /Pima County Administrator support letters about the University Family Care merger/i);
assert.match(failureRows[0].evidence, /still lacks one reviewed public official artifact that explicitly binds Greenlee County/i);

const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.blocker_code, 'official_greenlee_county_assignment_still_missing_after_live_admin_pdf_review');
assert.ok(verified.samples.some((sample) => sample.sample_name === 'AHCCCS CountyAdminOffice PDF support letter'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'AHCCCS PimaCountyAdmin PDF support letter'));
assert.match(
  verified.samples.find((sample) => sample.sample_name === 'AHCCCS CountyAdminOffice PDF support letter').evidence_snippet,
  /2014 Pima County Administrator support letter/i,
);

const spedVerified = verifiedRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(spedVerified.family_status, 'verified_state_grade');
assert.equal(spedVerified.sample_count, 2);
assert.match(spedVerified.samples[0].source_url, /sites\.ed\.gov\/idea\/state\/arizona/);
assert.match(spedVerified.samples[1].source_url, /2025-spp-apr-and-state-determination-letters-part-b-arizona/);

const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
assert.equal(nextRows[0].next_action, 'hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_new_reviewable_county_to_office_contract');

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(
  queueRow.primary_gap_reason,
  'bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_are_pima_support_letters_not_county_contracts',
);

const batchSummary = readJson('data/generated/batch409_arizona_admin_pdf_truth_refresh_summary_v1.json');
assert.equal(batchSummary.county_admin_pdf_live, true);
assert.equal(batchSummary.county_admin_pdf_is_support_letter, true);
assert.equal(batchSummary.pima_admin_pdf_live, true);
assert.equal(batchSummary.pima_admin_pdf_is_support_letter, true);
assert.deepEqual(batchSummary.counts_unchanged, { complete: 43, blocked: 7, indexSafe: 43 });

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /AHCCCS admin-PDF lane is now exhausted truthfully/i);
assert.match(report, /Pima support letters rather than county-routing artifacts/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.packetBatch, 'batch409_arizona_admin_pdf_truth_refresh_v1');
assert.equal(
  auditRow.packetPrimaryGapReason,
  'bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_are_pima_support_letters_not_county_contracts',
);

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /AHCCCS admin PDFs are live and readable but prove to be 2014 Pima support letters/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /Current Focus State: Arizona/);
assert.match(
  handoff,
  /- Arizona: `bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_are_pima_support_letters_not_county_contracts`/,
);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /Readable Official PDFs Still Fail If They Are The Wrong Artifact/);

console.log('test-batch409-arizona-admin-pdf-truth-refresh-v1: ok');
