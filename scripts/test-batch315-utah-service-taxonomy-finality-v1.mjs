import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch315UtahServiceTaxonomyFinalityV1 } from './run-batch315-utah-service-taxonomy-finality-v1.mjs';

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

const result = generateBatch315UtahServiceTaxonomyFinalityV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch315_utah_service_taxonomy_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch315-utah-service-taxonomy-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'utah_dhhs_contacts_cloudflare_403_and_live_dws_public_api_surface_still_stops_at_inventory_and_three_service_labels_without_any_county_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyGap);
assert.equal(countyGap.family_status, 'blocked_utah_dhhs_cloudflare_plus_dws_inventory_and_service_taxonomy_without_county_contract');
assert.match(countyGap.status_reason, /three public service labels `All`, `USOR`, and `EC`/i);
assert.match(countyGap.status_reason, /same-host county-style endpoints still do not materialize/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyFailure);
assert.equal(countyFailure.failure_code, summary.primary_gap_reason);
assert.match(countyFailure.evidence, /public API surface is still bounded to `https:\/\/officesearch-api\.jobs\.utah\.gov\/api\/v1\/offices` plus `https:\/\/officesearch-api\.jobs\.utah\.gov\/api\/v1\/services`/i);
assert.match(countyFailure.evidence, /`All Offices`, `USOR Services`, and `Employment Centers`/);
assert.match(countyFailure.evidence, /\/api\/v1\/counties/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyVerified);
assert.equal(countyVerified.blocker_code, countyFailure.failure_code);
assert.match(countyVerified.blocker_evidence, /three service labels/i);
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Public service taxonomy remains tiny'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Same-host county endpoints still absent'));
assert.equal(countyVerified.sample_count, 5);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyNext);
assert.equal(countyNext.next_action, 'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices');
assert.match(countyNext.evidence, /three service labels `All`, `USOR`, and `EC`/);

const utahQueue = queueRows.find((row) => row.state === 'utah');
assert.ok(utahQueue);
assert.equal(utahQueue.primary_gap_reason, summary.primary_gap_reason);

const utahAudit = allStateAudit.states.find((row) => row.stateId === 'utah');
assert.ok(utahAudit);
assert.equal(utahAudit.packetBatch, 'batch315_utah_service_taxonomy_finality_v1');
assert.equal(utahAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.services_api_status, 200);
assert.deepEqual(batchSummary.services_api_labels, ['All Offices', 'USOR Services', 'Employment Centers']);
assert.equal(batchSummary.county_endpoint_status, 404);
assert.equal(batchSummary.search_endpoint_status, 404);
assert.equal(batchSummary.office_search_endpoint_status, 404);
assert.equal(batchSummary.office_rows, 99);
assert.equal(batchSummary.unique_offices, 45);
assert.equal(batchSummary.unique_county_like_office_labels, 2);

assert.match(report, /three service labels: `All`, `USOR`, and `EC`/i);
assert.match(report, /No same-host county endpoint, county field, or service-area field materializes/i);
assert.match(handoff, /## Current Focus State: Utah/);
assert.match(handoff, /Public DWS services API/);
assert.match(handoff, /Missing county endpoint probe/);
assert.match(lessons, /### Tiny Public Service Taxonomies Still Do Not Create County Routing/);
assert.match(allStateReport, /full live public API surface/i);
assert.match(batchReport, /three labels: `All Offices`, `USOR Services`, and `Employment Centers`/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 24);
assert.equal(blockedCount, 26);

console.log('test-batch315-utah-service-taxonomy-finality-v1: ok');
