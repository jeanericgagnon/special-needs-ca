import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch342AlaskaLiveDpaOfficesFinalityV1 } from './run-batch342-alaska-live-dpa-offices-finality-v1.mjs';

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

await generateBatch342AlaskaLiveDpaOfficesFinalityV1();

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
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch342_alaska_live_dpa_offices_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch342-alaska-live-dpa-offices-finality-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch342_alaska_live_dpa_offices_finality_v1');
assert.equal(summary.primary_gap_reason, 'reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_reviewed_live_dpa_offices_page_lists_regional_offices_but_no_borough_or_census_area_assignments_and_dfcs_surfaces_add_no_local_mapping_contract');
assert.match(gap.status_reason, /DPA offices page at `https:\/\/health\.alaska\.gov\/en\/resources\/division-of-public-assistance-dpa-offices\/` is also browser-readable/i);
assert.match(gap.status_reason, /still only groups offices by broad regions/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, 'reviewed_live_dpa_offices_page_lists_regional_offices_and_locations_but_still_no_borough_or_census_area_assignment_contract');
assert.match(failure.evidence, /links directly to `https:\/\/health\.alaska\.gov\/en\/resources\/division-of-public-assistance-dpa-offices\/`, which is now publicly reviewable/i);
assert.match(failure.evidence, /still only groups offices by broad regions/i);
assert.match(failure.evidence, /dpa-dashboard\.pdf/i);
assert.match(failure.evidence, /medicaid-enrollment-monthly-snapshot\.pdf/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.query_basis, /live official Alaska DPA landing page, the now-public DPA offices directory, and the public DPA dashboard \/ Medicaid snapshot PDFs/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DPA offices directory' && sample.verification_status === 'reviewed'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Adult Public Assistance leaf target' && sample.verification_status === 'reviewed'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DPA Dashboard PDF' && sample.verification_status === 'reviewed'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska Medicaid enrollment snapshot PDF' && sample.verification_status === 'reviewed'));

const dpaOfficeSample = verified.samples.find((sample) => sample.sample_name === 'Alaska DPA offices directory');
assert.match(dpaOfficeSample.evidence_snippet, /regional offices, office hours, addresses, fax numbers/i);
assert.match(dpaOfficeSample.evidence_snippet, /still does not assign boroughs or census areas/i);
const dpaDashboardSample = verified.samples.find((sample) => sample.sample_name === 'Alaska DPA Dashboard PDF');
assert.match(dpaDashboardSample.evidence_snippet, /Anchorage\/Mat-Su, Gulf Coast, Interior, Northern, Southeast, and Southwest/i);
const medicaidSnapshotSample = verified.samples.find((sample) => sample.sample_name === 'Alaska Medicaid enrollment snapshot PDF');
assert.match(medicaidSnapshotSample.evidence_snippet, /Northern, Southwest, Interior, Mat-Su, Anchorage, Gulf Coast, and Southeast/i);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_or_export');

const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.ok(alaskaAudit);
assert.equal(alaskaAudit.packetBatch, 'batch342_alaska_live_dpa_offices_finality_v1');
assert.equal(alaskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);
assert.equal(alaskaAudit.familyStatuses.county_local_disability_resources, gap.family_status);

const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
assert.ok(alaskaQueue);
assert.equal(alaskaQueue.primary_gap_reason, summary.primary_gap_reason);

assert.match(stateReport, /The current Department of Health DPA landing page is now publicly readable in the reviewed browser lane\./);
assert.match(stateReport, /still does not map boroughs or census areas to those offices/i);
assert.match(allStateReport, /Alaska county-local routing is still blocked, but the blocker sharpened/i);
assert.doesNotMatch(allStateReport, /Alaska county-local routing is still blocked, and the live contract regressed again/i);
assert.match(handoff, /## Current Focus State: Alaska/);
assert.match(handoff, /exact DPA offices page .* publicly reviewable/i);
assert.match(handoff, /DPA Dashboard PDF/);
assert.match(handoff, /Medicaid enrollment snapshot PDF/);
assert.match(handoff, /## Next State Order After Alaska/);
assert.match(handoff, /1\. Oklahoma/);
assert.match(handoff, /2\. Minnesota/);
assert.doesNotMatch(handoff, /2\. Ohio/);
assert.match(lessons, /A Recovered Official Office Page Still Needs County-Equivalent Assignment/);

assert.equal(batchSummary.dpa_landing_review_status, 200);
assert.equal(batchSummary.dpa_offices_review_status, 200);
assert.equal(batchSummary.dpa_dashboard_review_status, 200);
assert.equal(batchSummary.medicaid_snapshot_review_status, 200);
assert.match(batchSummary.dpa_offices_title, /Division of Public Assistance \(DPA\) Offices/i);
assert.match(batchSummary.dpa_offices_h1, /Division of Public Assistance \(DPA\) Offices/i);
assert.ok(batchReport.includes('The exact DPA offices page is now browser-readable'));

console.log('test-batch342-alaska-live-dpa-offices-finality-v1: ok');
