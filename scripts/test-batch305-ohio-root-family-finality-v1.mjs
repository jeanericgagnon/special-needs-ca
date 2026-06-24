import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch305OhioRootFamilyFinalityV1 } from './run-batch305-ohio-root-family-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}
function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => JSON.parse(l));
}

const result = generateBatch305OhioRootFamilyFinalityV1();
const summary = readJson('data/generated/ohio_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/ohio_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/ohio_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/ohio_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/ohio_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/ohio-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch305_ohio_root_family_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch305-ohio-root-family-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.jfsRoot404, true);
assert.equal(result.medicaidRoot404, true);
assert.equal(result.ohioGovRoot404, true);
assert.equal(result.robotsAndSitemaps404, true);

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only');
assert.equal(summary.final_blockers[0].failure_code, 'official_root_and_discovery_surfaces_all_404_after_county_directory_retirement');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_retired_official_county_family_and_dead_public_search_surfaces');
assert.match(countyGap.status_reason, /roots plus robots\/sitemaps all return 404/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_root_and_discovery_surfaces_all_404_after_county_directory_retirement');
assert.match(countyFailure.evidence, /https:\/\/jfs\.ohio\.gov\//);
assert.match(countyFailure.evidence, /robots\.txt/);
assert.match(countyFailure.evidence, /sitemap\.xml/);
assert.match(countyFailure.evidence, /DOI-hosted county dataset therefore remains planning evidence only/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 6);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'JFS root 404'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Medicaid root 404'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Ohio.gov root 404'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'official_root_and_discovery_surfaces_all_404_after_county_directory_retirement');
assert.equal(countyNext.next_action, 'hold_blocked_until_new_live_official_ohio_county_directory_locator_or_search_index_is_verified');

const queueRow = queueRows.find((row) => row.state === 'ohio');
assert.equal(queueRow.primary_gap_reason, 'official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only');

const auditOhio = allStateAudit.states.find((row) => row.stateId === 'ohio');
assert.equal(auditOhio.packetBatch, 'batch_305_ohio_root_family_finality_v1');
assert.equal(auditOhio.packetPrimaryGapReason, 'official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only');

assert.match(stateReport, /official JFS, Medicaid, and Ohio\.gov roots plus their `robots\.txt` and `sitemap\.xml` surfaces all return 404/i);
assert.match(allStateReport, /official JFS, Medicaid, and Ohio\.gov root\/discovery surfaces themselves all 404/i);

assert.match(handoff, /## Current Focus State: Ohio/);
assert.match(handoff, /JFS root/);
assert.match(handoff, /1\. Minnesota/);

assert.equal(batchSummary.robotsAndSitemaps404, true);
assert.match(batchReport, /dead official root\/discovery families/i);

console.log('test-batch305-ohio-root-family-finality-v1: ok');
