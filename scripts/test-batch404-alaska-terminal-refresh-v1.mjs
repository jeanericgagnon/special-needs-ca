import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch404AlaskaTerminalRefreshV1 } from './run-batch404-alaska-terminal-refresh-v1.mjs';

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

const result = generateBatch404AlaskaTerminalRefreshV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch404_alaska_terminal_refresh_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_current_dpa_page_and_related_health_surfaces_all_return_403_while_dfcs_successor_surfaces_still_expose_no_borough_or_census_area_contract');

const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_current_health_host_fully_403_again_and_dfcs_successor_surfaces_still_only_statewide_or_search_shell');
assert.match(countyGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(countyGap.status_reason, /dpa-offices.*return HTTP 403/i);
assert.match(countyGap.status_reason, /Search\/Pages\/results\.aspx\?k=public%20assistance.*HTTP 404/i);

const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
assert.match(JSON.stringify(failureRows), /Reviewed 2026-06-26/);

const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
assert.match(JSON.stringify(verifiedRows), /Reviewed 2026-06-26/);

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'alaska');
assert.equal(queueRow.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_current_dpa_page_and_related_health_surfaces_all_return_403_while_dfcs_successor_surfaces_still_expose_no_borough_or_census_area_contract');

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /current health-host family is now fully 403 again/i);

const batchSummary = readJson('data/generated/batch404_alaska_terminal_refresh_summary_v1.json');
assert.equal(batchSummary.dpa_offices_403, true);
assert.equal(batchSummary.dpa_root_403, true);
assert.equal(batchSummary.dfcs_search_results_404, true);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch404-alaska-terminal-refresh-report-v1.md'), 'utf8');
assert.match(batchReport, /DPA offices page itself is back behind the 403 shell/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.equal(auditRow.packetBatch, 'batch404_alaska_terminal_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_live_recheck_confirms_current_dpa_page_and_related_health_surfaces_all_return_403_while_dfcs_successor_surfaces_still_expose_no_borough_or_census_area_contract');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /Alaska remains blocked after a 2026-06-26 bounded live recheck/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /Current Focus State: Alaska/);
assert.match(handoff, /- Alaska: `bounded_2026_06_26_live_recheck_confirms_current_dpa_page_and_related_health_surfaces_all_return_403_while_dfcs_successor_surfaces_still_expose_no_borough_or_census_area_contract`/);

const stateCertification = readJson('data/generated/state-certification/alaska.json');
assert.equal(stateCertification.summary.batch, 'batch404_alaska_terminal_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch404-alaska-terminal-refresh-v1: ok');
