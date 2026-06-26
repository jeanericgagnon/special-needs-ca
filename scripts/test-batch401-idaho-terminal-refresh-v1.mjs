import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch401IdahoTerminalRefreshV1 } from './run-batch401-idaho-terminal-refresh-v1.mjs';

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

const result = generateBatch401IdahoTerminalRefreshV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch401_idaho_terminal_refresh_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 87);
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_live_recheck_still_confirms_camas_and_clark_wrong_role_surfaces_only_and_idaho_dhw_office_inventory_without_county_contract');

const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(districtGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(districtGap.status_reason, /Camas root, `Contact Information`, `All Resources`, `Federal Programs`, and `Advanced Opportunities` all still return HTTP 200/i);
assert.match(districtGap.status_reason, /Camas.*sitemap\.xml` still returns HTTP 404/i);
assert.match(districtGap.status_reason, /Clark root, `Parent Resources`, `Contact Us`, `Title IX`, and `Parent Notification of General Education Instruction` still return HTTP 200/i);
assert.match(districtGap.status_reason, /Clark.*sitemap\.xml` still returns HTTP 404/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(countyGap.status_reason, /offices\?page=0`, `\/offices\?page=1`, `\/offices\?page=2`, and `https:\/\/healthandwelfare\.idaho\.gov\/sitemap\.xml` all still return HTTP 200/i);
assert.match(countyGap.status_reason, /office inventory only rather than county assignment/i);

const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
assert.match(JSON.stringify(failureRows), /Reviewed 2026-06-26/);

const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyVerified.blocker_evidence, /Reviewed 2026-06-26/);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Idaho remains BLOCKED and not index-safe/i);
assert.match(report, /last residual Camas and Clark district-owned surfaces are live but still wrong-role or too thin/i);

const batchSummary = readJson('data/generated/batch401_idaho_terminal_refresh_summary_v1.json');
assert.equal(batchSummary.camas_live_surfaces_rechecked, true);
assert.equal(batchSummary.clark_live_surfaces_rechecked, true);
assert.equal(batchSummary.idaho_dhw_live_stack_rechecked, true);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch401-idaho-terminal-refresh-report-v1.md'), 'utf8');
assert.match(batchReport, /2026-06-26 live recheck/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(auditRow.packetBatch, 'batch401_idaho_terminal_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_live_recheck_still_confirms_camas_and_clark_wrong_role_surfaces_only_and_idaho_dhw_office_inventory_without_county_contract');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /2026-06-26 bounded live recheck/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /- Idaho: `bounded_2026_06_26_live_recheck_still_confirms_camas_and_clark_wrong_role_surfaces_only_and_idaho_dhw_office_inventory_without_county_contract`/);

const stateCertification = readJson('data/generated/state-certification/idaho.json');
assert.equal(stateCertification.summary.batch, 'batch401_idaho_terminal_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch401-idaho-terminal-refresh-v1: ok');
