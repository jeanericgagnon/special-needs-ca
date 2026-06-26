import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch367NewHampshireRobotsSitemapFinalityV1 } from './run-batch367-new-hampshire-robots-sitemap-finality-v1.mjs';

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

const result = generateBatch367NewHampshireRobotsSitemapFinalityV1();
const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch367_new_hampshire_robots_sitemap_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch367-new-hampshire-robots-sitemap-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch367_new_hampshire_robots_sitemap_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_nh_dhhs_education_and_vr_host_families_plus_diagnostic_robots_sitemaps_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead');
assert.equal(summary.recommended_batch, 'hold_for_public_official_nh_host_recovery_or_export');
assert.equal(summary.familyStatuses.medicaid_state_health_coverage, 'blocked_saved_dhhs_successor_unresolvable_and_diagnostic_surfaces_forbidden');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_official_dhhs_hosts_and_diagnostic_surfaces_forbidden');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_official_education_hosts_and_diagnostic_surfaces_forbidden');

const medicaidGap = gapRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.match(medicaidGap.status_reason, /robots\.txt/i);
assert.match(medicaidGap.status_reason, /sitemap\.xml/i);
assert.match(medicaidGap.status_reason, /same short `Access Denied` shell with HTTP 403/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /robots\.txt/i);

const medicaidFailure = failureRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.match(medicaidFailure.evidence, /https:\/\/www\.dhhs\.nh\.gov\/robots\.txt/);
assert.match(medicaidFailure.evidence, /https:\/\/www\.nh\.gov\/dhhs\/sitemap\.xml/);

const vrFailure = failureRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrFailure.severity, 'critical');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_official_dhhs_hosts_and_diagnostic_surfaces_forbidden');
assert.match(countyVerified.blocker_evidence, /robots\.txt/);

const queueRow = queueRows.find((row) => row.state === 'new-hampshire');
assert.equal(queueRow.primary_gap_reason, 'official_nh_dhhs_education_and_vr_host_families_plus_diagnostic_robots_sitemaps_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead');
assert.equal(queueRow.recommended_batch, 'hold_for_public_official_nh_host_recovery_or_export');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-hampshire');
assert.equal(auditRow.packetBatch, 'batch367_new_hampshire_robots_sitemap_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_nh_dhhs_education_and_vr_host_families_plus_diagnostic_robots_sitemaps_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead');

assert.match(stateReport, /even `robots\.txt` and `sitemap\.xml` on the official DHHS and `nh\.gov\/dhhs` host family return that same short 403 shell/i);
assert.match(stateReport, /VR remains a critical blocker/i);
assert.match(allStateReport, /robots\.txt and sitemap\.xml diagnostics return that same shell/i);
assert.match(handoff, /robots\.txt/);
assert.match(handoff, /sitemap\.xml/);
assert.match(lessons, /Access-Denied Host Families Sometimes Block Diagnostics Too/);

assert.equal(batchSummary.dhhs_replacement_dns_dead, true);
assert.equal(batchSummary.dhhs_direct_403_shell, true);
assert.equal(batchSummary.dhhs_robots_403_shell, true);
assert.equal(batchSummary.dhhs_sitemap_403_shell, true);
assert.equal(batchSummary.nh_gov_dhhs_robots_403_shell, true);
assert.equal(batchSummary.nh_gov_dhhs_sitemap_403_shell, true);
assert.equal(batchSummary.result, 'official_new_hampshire_host_families_and_diagnostics_still_do_not_expose_public_reviewable_routing_surfaces');
assert.match(batchReport, /robots\/sitemap diagnostics/i);

console.log('test-batch367-new-hampshire-robots-sitemap-finality-v1: ok');
