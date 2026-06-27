import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch412NewHampshireBrowserProofV1 } from './run-batch412-new-hampshire-browser-proof-v1.mjs';

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

const result = generateBatch412NewHampshireBrowserProofV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch412_new_hampshire_browser_proof_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 42);
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_browser_recheck_confirms_nh_dhhs_doe_and_nhes_hosts_fail_with_public_access_denied_shells_not_just_raw_fetch_403s');

const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const dhhsGap = gapRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.match(dhhsGap.status_reason, /browser level/i);
assert.match(dhhsGap.status_reason, /`https:\/\/www\.dhhs\.nh\.gov\/` rendered HTTP 403 with title `Access Denied`/i);
assert.match(dhhsGap.status_reason, /`https:\/\/www\.nh\.gov\/dhhs\/contact-us\/` and `https:\/\/www\.nh\.gov\/dhhs\/district-offices\/` also return HTTP 403/i);
assert.match(dhhsGap.status_reason, /`https:\/\/www\.nh\.gov\/robots\.txt` and `https:\/\/www\.dhhs\.nh\.gov\/robots\.txt` now also return HTTP 403/i);

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(districtGap.status_reason, /browser level/i);
assert.match(districtGap.status_reason, /`https:\/\/www\.education\.nh\.gov\/` rendered HTTP 403 with title `Access Denied`/i);
assert.match(districtGap.status_reason, /school-and-district-profiles.*find-school-or-district.*return HTTP 403/i);
assert.match(districtGap.status_reason, /education\.nh\.gov\/robots\.txt.*returns HTTP 403/i);
assert.match(districtGap.status_reason, /federal IDEA-by-State page still rescues only statewide Part B authority/i);

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.match(vrGap.status_reason, /`https:\/\/www\.nhes\.nh\.gov\/` rendered HTTP 403 with title `Access Denied`/i);
assert.match(vrGap.status_reason, /services\/disabilities\/bvr\.htm.*nh\.gov\/employment\/.*return HTTP 403/i);
assert.match(vrGap.status_reason, /nhes\.nh\.gov\/robots\.txt.*returns HTTP 403/i);

const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
assert.match(JSON.stringify(failureRows), /Access Denied/);

const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
assert.match(JSON.stringify(verifiedRows), /Access Denied/);

const batchSummary = readJson('data/generated/batch412_new_hampshire_browser_proof_summary_v1.json');
assert.equal(batchSummary.dhhs_browser_access_denied, true);
assert.equal(batchSummary.education_browser_access_denied, true);
assert.equal(batchSummary.nhes_browser_access_denied, true);
assert.equal(batchSummary.dhhs_alternate_leaves_403, true);
assert.equal(batchSummary.education_alternate_leaves_403, true);
assert.equal(batchSummary.vr_alternate_leaves_403, true);
assert.equal(batchSummary.robots_footholds_all_403, true);
assert.equal(batchSummary.federal_idea_still_only_statewide_clear_lane, true);
assert.deepEqual(batchSummary.counts_unchanged, { complete: 45, blocked: 5, indexSafe: 45 });

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /browser-rendered `Access Denied` shells/i);
assert.match(report, /alternate-leaf and robots checks/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-hampshire');
assert.equal(auditRow.packetBatch, 'batch412_new_hampshire_browser_proof_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_browser_recheck_confirms_nh_dhhs_doe_and_nhes_hosts_fail_with_public_access_denied_shells_not_just_raw_fetch_403s');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /render public `Access Denied` shells in a live browser/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /- New Hampshire: `bounded_2026_06_26_browser_recheck_confirms_nh_dhhs_doe_and_nhes_hosts_fail_with_public_access_denied_shells_not_just_raw_fetch_403s`/);

const stateCertification = readJson('data/generated/state-certification/new-hampshire.json');
assert.equal(stateCertification.summary.batch, 'batch412_new_hampshire_browser_proof_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch412-new-hampshire-browser-proof-v1: ok');
