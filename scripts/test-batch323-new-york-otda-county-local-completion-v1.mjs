import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch323NewYorkOtdaCountyLocalCompletionV1 } from './run-batch323-new-york-otda-county-local-completion-v1.mjs';

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

const result = generateBatch323NewYorkOtdaCountyLocalCompletionV1();
const summary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-york_next_action_queue_v2.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch323_new_york_otda_county_local_completion_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch323-new-york-otda-county-local-completion-report-v1.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.primary_gap_reason, 'none');
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.final_blockers.length, 0);

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'verified_county_grade');
assert.match(gap.status_reason, /Local Departments of Social Services/);
assert.match(gap.status_reason, /all 62 counties/);

assert.equal(failureRows.length, 0);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'verified_county_grade');
assert.equal(verified.sample_count, 3);
assert.equal(verified.blocker_code, null);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://otda.ny.gov/workingfamilies/dss.asp'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://otda.ny.gov/programs/heap/contacts/'));
assert.ok(verified.samples.some((sample) => /New York City Human Resources Administration/.test(sample.sample_name)));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].failure_code, 'complete_maintain_truth_only');
assert.match(nextRows[0].evidence, /all 62 counties/);

const nyAudit = allStateAudit.states.find((row) => row.stateId === 'new-york');
assert.equal(nyAudit.classification, 'COMPLETE');
assert.equal(nyAudit.indexSafe, true);
assert.equal(nyAudit.packetBatch, 'batch323_new_york_otda_county_local_completion_v1');
assert.equal(nyAudit.packetPrimaryGapReason, 'none');
assert.equal(nyAudit.familyStatuses.county_local_disability_resources, 'verified_county_grade');

assert.equal(allStateAudit.classifications.COMPLETE, 25);
assert.equal(allStateAudit.classifications.BLOCKED, 25);
assert.equal(allStateAudit.indexSafeCount, 25);

const nyQueue = allStateQueue.find((row) => row.state === 'new-york');
assert.equal(nyQueue.classification, 'COMPLETE');
assert.equal(nyQueue.index_safe, true);
assert.equal(nyQueue.primary_gap_reason, 'none');
assert.equal(nyQueue.recommended_batch, 'complete_maintain');

assert.ok(stateReport.includes('New York is now `COMPLETE` and `index_safe=true`'));
assert.ok(stateReport.includes('Local Departments of Social Services'));
assert.ok(allStateReport.includes('COMPLETE: 25'));
assert.ok(allStateReport.includes('BLOCKED: 25'));
assert.ok(allStateReport.includes('New York'));
assert.ok(!allStateReport.includes('New York county-local routing is still blocked'));
assert.ok(handoff.includes('## Current Focus State: Oklahoma'));
assert.ok(!handoff.includes('- New York: `nygov_links_exact_otda_successor_leaves'));
assert.ok(lessons.includes('### Exact Official Successor Leaves Override A Stale Reset Blocker'));

assert.equal(batchSummary.county_local_contract_verified, true);
assert.equal(batchSummary.county_or_city_rows_verified, 62);
assert.equal(batchSummary.otda_dss_page_verified, true);
assert.equal(batchSummary.heap_contacts_page_verified, true);
assert.equal(batchSummary.mybenefits_begin_page_status, 200);
assert.ok(batchReport.includes('New York moves from BLOCKED to COMPLETE/index-safe.'));

console.log('test-batch323-new-york-otda-county-local-completion-v1: ok');
