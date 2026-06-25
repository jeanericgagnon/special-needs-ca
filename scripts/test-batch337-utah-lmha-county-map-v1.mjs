import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateBatch337UtahLmhaCountyMapV1 } from './run-batch337-utah-lmha-county-map-v1.mjs';

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

const result = generateBatch337UtahLmhaCountyMapV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gap = readJsonl('data/generated/utah_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const failures = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verified = readJsonl('data/generated/utah_verified_sources_v1.jsonl').find((row) => row.family === 'county_local_disability_resources');
const next = readJsonl('data/generated/utah_next_action_queue_v2.jsonl')[0];
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl').find((row) => row.state === 'utah');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch337_utah_lmha_county_map_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch337-utah-lmha-county-map-report-v1.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.deepEqual(summary.final_blockers, []);
assert.equal(summary.familyStatuses.county_local_disability_resources, 'verified_current_official_lmha_county_map');

assert.equal(gap.family_status, 'verified_current_official_lmha_county_map');
assert.match(gap.status_reason, /Local Mental Health Authority \(LMHA\)/i);
assert.match(gap.status_reason, /all 29 Utah counties/i);

assert.equal(failures.length, 0);

assert.equal(verified.family_status, 'verified_state_grade');
assert.equal(verified.sample_count, 4);
assert.equal(verified.blocker_code, null);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://sumh.utah.gov/contact/location-map/'));
assert.ok(verified.samples.some((sample) => /all 29 Utah counties/i.test(sample.evidence_snippet)));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://sumh.utah.gov/mental-health/'));

assert.equal(next.family, 'maintenance');
assert.equal(next.failure_code, 'complete_maintain_truth_only');
assert.match(next.evidence, /all 29 Utah counties/i);

assert.equal(queue.classification, 'COMPLETE');
assert.equal(queue.index_safe, true);
assert.equal(queue.primary_gap_reason, 'none');
assert.equal(queue.recommended_batch, 'complete_maintain');
assert.equal(queue.status, 'COMPLETE');

const utahAudit = audit.states.find((row) => row.stateId === 'utah');
assert.ok(utahAudit);
assert.equal(utahAudit.classification, 'COMPLETE');
assert.equal(utahAudit.indexSafe, true);
assert.equal(utahAudit.weakCriticalFamilies, 0);
assert.equal(utahAudit.packetBatch, 'batch337_utah_lmha_county_map_v1');
assert.equal(utahAudit.packetPrimaryGapReason, 'none');
assert.equal(utahAudit.familyStatuses.county_local_disability_resources, 'verified_current_official_lmha_county_map');

assert.match(handoff, /## Current Complete States/);
assert.match(handoff, /Utah/);
assert.doesNotMatch(handoff, /- Utah: `/);
assert.match(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /Tri-County Special Education Cooperative/);

assert.match(allStateReport, /- COMPLETE: 27/);
assert.match(allStateReport, /- BLOCKED: 23/);
assert.match(allStateReport, /Utah is now COMPLETE\/index-safe/i);
assert.doesNotMatch(allStateReport, /Utah remains blocked/i);

assert.match(report, /Utah is now COMPLETE and index-safe/i);
assert.match(report, /Local Mental Health Authority \(LMHA\)/i);
assert.match(lessons, /### Official County LMHA Maps Can Clear The Last Local-Resource Blocker/);

assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.county_count, 29);
assert.equal(batchSummary.all_29_counties_present, true);
assert.equal(batchSummary.remaining_blocker_family, null);
assert.match(batchReport, /Utah is COMPLETE and index-safe/i);

console.log('test-batch337-utah-lmha-county-map-v1: ok');
