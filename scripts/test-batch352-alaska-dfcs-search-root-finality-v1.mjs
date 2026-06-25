import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch352AlaskaDfcsSearchRootFinalityV1 } from './run-batch352-alaska-dfcs-search-root-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

await generateBatch352AlaskaDfcsSearchRootFinalityV1();

const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch352_alaska_dfcs_search_root_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch352-alaska-dfcs-search-root-finality-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch352_alaska_dfcs_search_root_finality_v1');
assert.equal(summary.primary_gap_reason, 'raw_health_host_challenge_persists_while_browser_reviewed_dpa_offices_page_still_lacks_borough_assignment_and_dfcs_root_sitemap_contacts_search_add_no_dpa_contract');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_raw_health_host_challenge_plus_region_only_dpa_page_and_dfcs_root_sitemap_contacts_search_without_county_equivalent_contract');
assert.match(gap.status_reason, /search-result guesses.*all return 404/i);
assert.match(gap.status_reason, /DFCS root page still only routes into the Commissioner and Office of Children's Services branches/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, 'raw_health_host_challenge_persists_and_dfcs_root_sitemap_contacts_plus_search_guesses_expose_no_dpa_borough_or_census_area_contract');
assert.match(failure.evidence, /Pages\/default\.aspx.*still only routes into Commissioner and OCS branches/i);
assert.match(failure.evidence, /public%20assistance.*all returned 404/i);
assert.match(failure.evidence, /all returned 404/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.query_basis, /DFCS root, site-map, contacts, and search-result pass/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DFCS root page' && sample.verification_status === 'reviewed'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DFCS bounded search-result guesses' && sample.verification_status === 'blocked'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_api_or_directory');

const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.ok(alaskaAudit);
assert.equal(alaskaAudit.packetBatch, 'batch352_alaska_dfcs_search_root_finality_v1');
assert.equal(alaskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);

const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
assert.ok(alaskaQueue);
assert.equal(alaskaQueue.primary_gap_reason, summary.primary_gap_reason);

assert.match(stateReport, /bounded DFCS search-result guesses.*all returned 404/i);
assert.match(stateReport, /DFCS root, Services, Site Map, and Department Contacts pages still expose no DPA\/public-assistance office directory/i);
assert.match(allStateReport, /DFCS root, site-map, contacts, and bounded search-result checks still expose no DPA office contract or public search recovery lane/i);
assert.match(handoff, /## Current Focus State: Alaska/);
assert.match(handoff, /DFCS search guess: public assistance/);
assert.match(handoff, /DFCS does not expose a recoverable public search lane either/i);
assert.match(handoff, /## Next State Order After Alaska/);
assert.match(handoff, /1\. Maine/);
assert.match(handoff, /2\. Idaho/);

assert.equal(batchSummary.health_host_challenge_persists, true);
assert.equal(batchSummary.dfcs_root_status, 200);
assert.equal(batchSummary.dfcs_search_guess_404s, 4);
assert.equal(batchSummary.dfcs_public_search_lane_found, false);
assert.equal(batchSummary.borough_assignment_contract_found, false);
assert.match(batchReport, /DFCS root, site map, contacts, and bounded search-result lane/i);

console.log('test-batch352-alaska-dfcs-search-root-finality-v1: ok');
