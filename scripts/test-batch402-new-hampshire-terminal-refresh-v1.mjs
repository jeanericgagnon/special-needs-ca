import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch402NewHampshireTerminalRefreshV1 } from './run-batch402-new-hampshire-terminal-refresh-v1.mjs';

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

const result = generateBatch402NewHampshireTerminalRefreshV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch402_new_hampshire_terminal_refresh_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 33);
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_nh_dhhs_doe_and_nhes_host_families_still_return_access_denied_while_robots_txt_remains_public_only');

const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const dhhsGap = gapRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.equal(dhhsGap.family_status, 'blocked_live_dhhs_roots_still_403_while_robots_txt_only_confirms_host_existence');
assert.match(dhhsGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(dhhsGap.status_reason, /www\.dhhs\.nh\.gov/i);
assert.match(dhhsGap.status_reason, /robots\.txt/i);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_live_education_roots_still_403_while_robots_txt_only_confirms_host_existence');
assert.match(eduGap.status_reason, /my\.doe\.nh\.gov\/ehb/i);

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrGap.family_status, 'blocked_live_nhes_roots_still_403_while_robots_txt_only_confirms_host_existence');
assert.match(vrGap.status_reason, /nhes\.nh\.gov\/robots\.txt/i);

const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
assert.match(JSON.stringify(failureRows), /Reviewed 2026-06-26/);

const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
assert.match(JSON.stringify(verifiedRows), /Reviewed 2026-06-26/);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /robots\.txt/i);
assert.match(report, /still fail closed behind the same `Access Denied` shell/i);

const batchSummary = readJson('data/generated/batch402_new_hampshire_terminal_refresh_summary_v1.json');
assert.equal(batchSummary.dhhs_roots_403, true);
assert.equal(batchSummary.education_roots_403, true);
assert.equal(batchSummary.nhes_roots_403, true);
assert.equal(batchSummary.robots_only_public, true);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch402-new-hampshire-terminal-refresh-report-v1.md'), 'utf8');
assert.match(batchReport, /2026-06-26 live host-family recheck/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-hampshire');
assert.equal(auditRow.packetBatch, 'batch402_new_hampshire_terminal_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_live_recheck_confirms_nh_dhhs_doe_and_nhes_host_families_still_return_access_denied_while_robots_txt_remains_public_only');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /New Hampshire remains blocked after a 2026-06-26 bounded live host-family recheck/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /- New Hampshire: `bounded_2026_06_26_live_recheck_confirms_nh_dhhs_doe_and_nhes_host_families_still_return_access_denied_while_robots_txt_remains_public_only`/);

const stateCertification = readJson('data/generated/state-certification/new-hampshire.json');
assert.equal(stateCertification.summary.batch, 'batch402_new_hampshire_terminal_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch402-new-hampshire-terminal-refresh-v1: ok');
