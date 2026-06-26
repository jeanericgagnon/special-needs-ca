import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch413IdahoAttachmentProofV1 } from './run-batch413-idaho-attachment-proof-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

const result = generateBatch413IdahoAttachmentProofV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch413_idaho_attachment_proof_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_attachment_recheck_confirms_camas_board_doc_and_clark_child_find_manual_policy_attachments_still_fail_to_create_local_special_ed_contract');

const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(districtGap.status_reason, /Google Doc .* board-of-trustees zone roster/i);
assert.match(districtGap.status_reason, /Drive item .* returned HTTP 500/i);
assert.match(districtGap.status_reason, /Federal Policy and Procedure Manual PDF is a federal-funds administration manual/i);
assert.match(districtGap.status_reason, /Spanish Child Find flyer preserves generic statewide language telling families to contact their local district/i);
assert.match(districtGap.status_reason, /Equal Education \/ Nondiscrimination PDF routes grievances to Title IX/i);

const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const districtFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(districtFailure.evidence, /board-of-trustees zone roster/i);
assert.match(districtFailure.evidence, /returned HTTP 500/i);
assert.match(districtFailure.evidence, /federal-funds administration manual/i);

const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtVerified.sample_count, 45);
assert.ok(districtVerified.samples.some((sample) => sample.sample_name === 'Camas district-linked Google Doc board roster'));
assert.ok(districtVerified.samples.some((sample) => sample.sample_name === 'Camas district-linked Drive item HTTP 500'));
assert.ok(districtVerified.samples.some((sample) => sample.sample_name === 'Clark federal policy and procedure manual PDF'));
assert.ok(districtVerified.samples.some((sample) => sample.sample_name === 'Clark Idaho Child Find English flyer'));
assert.ok(districtVerified.samples.some((sample) => sample.sample_name === 'Clark Idaho Child Find Spanish flyer'));
assert.ok(districtVerified.samples.some((sample) => sample.sample_name === 'Clark Equal Education policy PDF'));

const batchSummary = readJson('data/generated/batch413_idaho_attachment_proof_summary_v1.json');
assert.equal(batchSummary.camas_board_doc_wrong_role, true);
assert.equal(batchSummary.camas_drive_item_http_500, true);
assert.equal(batchSummary.clark_manual_wrong_role, true);
assert.equal(batchSummary.clark_child_find_generic_only, true);
assert.equal(batchSummary.clark_equal_education_wrong_role, true);
assert.deepEqual(batchSummary.counts_unchanged, { complete: 44, blocked: 6, indexSafe: 44 });

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /board, finance, generic Child Find, or generic compliance artifacts/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(auditRow.packetBatch, 'batch413_idaho_attachment_proof_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_attachment_recheck_confirms_camas_board_doc_and_clark_child_find_manual_policy_attachments_still_fail_to_create_local_special_ed_contract');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /Camas and Clark district-linked files now resolve to a board-zone document, an unreviewable Drive item, a federal-funds manual, generic Idaho Child Find flyers, and generic equal-education compliance policy/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /- Idaho: `bounded_2026_06_26_attachment_recheck_confirms_camas_board_doc_and_clark_child_find_manual_policy_attachments_still_fail_to_create_local_special_ed_contract`/);

const stateCertification = readJson('data/generated/state-certification/idaho.json');
assert.equal(stateCertification.summary.batch, 'batch413_idaho_attachment_proof_v1');

console.log('test-batch413-idaho-attachment-proof-v1: ok');
