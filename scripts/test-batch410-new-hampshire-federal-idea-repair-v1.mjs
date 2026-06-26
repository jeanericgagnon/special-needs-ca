import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch410NewHampshireFederalIdeaRepairV1 } from './run-batch410-new-hampshire-federal-idea-repair-v1.mjs';

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

const result = generateBatch410NewHampshireFederalIdeaRepairV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch410_new_hampshire_federal_idea_repair_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 42);
assert.equal(summary.strong_critical_families, 5);
assert.equal(summary.weak_critical_families, 7);
assert.equal(summary.primary_gap_reason, 'federal_part_b_now_clears_but_live_nh_dhhs_nhes_and_local_education_hosts_still_block_public_contracts');
assert.ok(!summary.critical_gap_families.includes('special_education_idea_part_b'));

const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const spedGap = gapRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(spedGap.family_status, 'verified_state_grade');
assert.match(spedGap.status_reason, /IDEA-by-State page for New Hampshire/i);
assert.match(spedGap.status_reason, /2025 SPP\/APR and State Determination Letters, Part B — New Hampshire/i);

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_live_education_roots_still_403_without_local_routing_contract');
assert.match(districtGap.status_reason, /does not provide county-, district-, or SAU-grade routing/i);

const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 7);
assert.ok(!failureRows.some((row) => row.family === 'special_education_idea_part_b'));

const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
const spedVerified = verifiedRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(spedVerified.family_status, 'verified_state_grade');
assert.equal(spedVerified.sample_count, 2);
assert.equal(spedVerified.blocker_code, null);
assert.match(spedVerified.samples[0].source_url, /sites\.ed\.gov\/idea\/state\/new-hampshire/);
assert.match(spedVerified.samples[1].source_url, /2025-spp-apr-and-state-determination-letters-part-b-new-hampshire/);

const nextRows = readJsonl('data/generated/new-hampshire_next_action_queue_v2.jsonl');
assert.ok(!nextRows.some((row) => row.family === 'special_education_idea_part_b'));

const batchSummary = readJson('data/generated/batch410_new_hampshire_federal_idea_repair_summary_v1.json');
assert.equal(batchSummary.special_education_cleared_from_federal_idea, true);
assert.deepEqual(batchSummary.counts_unchanged, { complete: 43, blocked: 7, indexSafe: 43 });

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Statewide IDEA Part B authority now clears from the live official U\.S\. Department of Education IDEA-by-State New Hampshire page/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-hampshire');
assert.equal(auditRow.packetBatch, 'batch410_new_hampshire_federal_idea_repair_v1');
assert.equal(auditRow.completenessPct, 42);
assert.equal(auditRow.strongCriticalFamilies, 5);
assert.equal(auditRow.weakCriticalFamilies, 7);
assert.equal(auditRow.familyStatuses.special_education_idea_part_b, 'verified_state_grade');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /statewide IDEA Part B now clears from the official federal IDEA-by-State New Hampshire pages/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /- New Hampshire: `federal_part_b_now_clears_but_live_nh_dhhs_nhes_and_local_education_hosts_still_block_public_contracts`/);

console.log('test-batch410-new-hampshire-federal-idea-repair-v1: ok');
