import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch312UtahLiveCountyContractRefreshV1 } from './run-batch312-utah-live-county-contract-refresh-v1.mjs';

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

const result = generateBatch312UtahLiveCountyContractRefreshV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch312_utah_live_county_contract_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch312-utah-live-county-contract-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'utah_dhhs_contacts_now_serves_cloudflare_403_while_live_dws_office_inventory_and_sparse_county_named_labels_still_fail_to_expose_complete_county_service_area_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyGap);
assert.equal(countyGap.family_status, 'blocked_utah_dhhs_cloudflare_plus_dws_sparse_county_named_inventory_without_complete_county_service_area_contract');
assert.match(countyGap.status_reason, /Cloudflare `403 Attention Required` shell/i);
assert.match(countyGap.status_reason, /only two unique office names carry county-like labels/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyFailure);
assert.equal(countyFailure.failure_code, 'utah_dhhs_contacts_now_serves_cloudflare_403_while_live_dws_office_inventory_and_sparse_county_named_labels_still_fail_to_expose_complete_county_service_area_contract');
assert.match(countyFailure.evidence, /HTTP 403 with a Cloudflare `Attention Required` shell/i);
assert.match(countyFailure.evidence, /Emery County \(Castle Dale\)/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyVerified);
assert.equal(countyVerified.blocker_code, countyFailure.failure_code);
assert.match(countyVerified.blocker_evidence, /Cloudflare 403 challenge/i);
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DHHS contacts root now challenge-gated'));
assert.ok(countyVerified.samples.some((sample) => /Office Map/.test(sample.evidence_snippet)));
assert.ok(countyVerified.samples.some((sample) => /Emery County \(Castle Dale\)/.test(sample.evidence_snippet)));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyNext);
assert.equal(countyNext.next_action, 'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices');

const utahQueue = queueRows.find((row) => row.state === 'utah');
assert.ok(utahQueue);
assert.equal(utahQueue.primary_gap_reason, summary.primary_gap_reason);

const utahAudit = allStateAudit.states.find((row) => row.stateId === 'utah');
assert.ok(utahAudit);
assert.equal(utahAudit.packetBatch, 'batch312_utah_live_county_contract_refresh_v1');
assert.equal(utahAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.dhhs_contacts_status, 403);
assert.equal(batchSummary.jobs_robots_status, 200);
assert.equal(batchSummary.jobs_sitemap_status, 500);
assert.equal(batchSummary.jobs_search_status, 500);
assert.equal(batchSummary.office_rows, 99);
assert.equal(batchSummary.unique_offices, 45);
assert.equal(batchSummary.unique_county_like_office_labels, 2);

assert.match(report, /Cloudflare 403 challenge shell/i);
assert.match(report, /Sparse office labels like `Emery County \(Castle Dale\)` and `South County \(Taylorsville\)`/i);
assert.match(handoff, /## Current Focus State: Utah/);
assert.match(handoff, /Cloudflare 403 challenge/);
assert.match(lessons, /### Sparse County-Named Office Labels Still Do Not Create A Statewide County-Service Contract/);
assert.match(allStateReport, /Utah county-local routing is now explicitly sharpened to the current live repo-side contract/i);
assert.match(batchReport, /only two unique office names carry county-like labels/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 24);
assert.equal(blockedCount, 26);

console.log('test-batch312-utah-live-county-contract-refresh-v1: ok');
