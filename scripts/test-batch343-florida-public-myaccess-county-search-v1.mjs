import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateBatch343FloridaPublicMyaccessCountySearchV1 } from './run-batch343-florida-public-myaccess-county-search-v1.mjs';

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

const result = generateBatch343FloridaPublicMyaccessCountySearchV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gap = readJsonl('data/generated/florida_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const failures = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verified = readJsonl('data/generated/florida_verified_sources_v1.jsonl').find((row) => row.family === 'county_local_disability_resources');
const next = readJsonl('data/generated/florida_next_action_queue_v2.jsonl')[0];
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl').find((row) => row.state === 'florida');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch343_florida_public_myaccess_county_search_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch343-florida-public-myaccess-county-search-report-v1.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.deepEqual(summary.final_blockers, []);
assert.equal(summary.familyStatuses.county_local_disability_resources, 'verified_current_public_myaccess_county_partner_search');

assert.equal(gap.family_status, 'verified_current_public_myaccess_county_partner_search');
assert.match(gap.status_reason, /67 Florida counties/i);
assert.match(gap.status_reason, /Alachua and Washington/i);

assert.equal(failures.length, 0);

assert.equal(verified.family_status, 'verified_state_grade');
assert.equal(verified.sample_count, 6);
assert.equal(verified.blocker_code, null);
assert.ok(verified.samples.some((sample) => /all 67 Florida counties/i.test(sample.evidence_snippet)));
assert.ok(verified.samples.some((sample) => /Alachua County Health Department/i.test(sample.evidence_snippet)));
assert.ok(verified.samples.some((sample) => /Washington/i.test(sample.evidence_snippet)));

assert.equal(next.family, 'maintenance');
assert.equal(next.failure_code, 'complete_maintain_truth_only');
assert.match(next.evidence, /67 Florida counties/i);

assert.equal(queue.classification, 'COMPLETE');
assert.equal(queue.index_safe, true);
assert.equal(queue.primary_gap_reason, 'none');
assert.equal(queue.recommended_batch, 'complete_maintain');
assert.equal(queue.status, 'COMPLETE');

const floridaAudit = audit.states.find((row) => row.stateId === 'florida');
assert.ok(floridaAudit);
assert.equal(floridaAudit.classification, 'COMPLETE');
assert.equal(floridaAudit.indexSafe, true);
assert.equal(floridaAudit.weakCriticalFamilies, 0);
assert.equal(floridaAudit.packetBatch, 'batch343_florida_public_myaccess_county_search_v1');
assert.equal(floridaAudit.packetPrimaryGapReason, 'none');
assert.equal(floridaAudit.familyStatuses.county_local_disability_resources, 'verified_current_public_myaccess_county_partner_search');

assert.equal(audit.classifications.COMPLETE, 30);
assert.equal(audit.classifications.BLOCKED, 20);
assert.equal(audit.indexSafeCount, 30);

assert.match(handoff, /## Current Complete States/);
assert.match(handoff, /Florida/);
assert.doesNotMatch(handoff, /- Florida: `/);
assert.match(handoff, /## Current Focus State: Alaska/);
assert.match(handoff, /boroughs or census areas to DPA offices|borough or census-area assignment contract/i);

assert.match(allStateReport, /- COMPLETE: 30/);
assert.match(allStateReport, /- BLOCKED: 20/);
assert.match(allStateReport, /Florida is now COMPLETE\/index-safe/i);
assert.doesNotMatch(allStateReport, /Florida remains blocked/i);
assert.doesNotMatch(allStateReport, /Florida county-local routing is still blocked/i);

assert.match(report, /Florida is now COMPLETE and index-safe/i);
assert.match(report, /Community Partner Search/i);
assert.match(lessons, /### Public County Search Forms Can Outrun Partial Storefront Lanes/);

assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.county_count, 67);
assert.equal(batchSummary.county_dropdown_count, 67);
assert.equal(batchSummary.alachua_result_count, 7);
assert.equal(batchSummary.washington_result_count, 1);
assert.equal(batchSummary.remaining_blocker_family, null);
assert.match(batchReport, /Florida is COMPLETE and index-safe/i);

console.log('test-batch343-florida-public-myaccess-county-search-v1: ok');
