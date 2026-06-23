import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch225NewHampshireSuccessorRoot403RefreshV1 } from './run-batch225-new-hampshire-successor-root-403-refresh-v1.mjs';

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

const result = generateBatch225NewHampshireSuccessorRoot403RefreshV1();
const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-hampshire_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/new-hampshire_host_family_blocker_packet_v1.json');
const batchSummary = readJson('data/generated/batch225_new_hampshire_successor_root_403_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root');

for (const fam of ['medicaid_state_health_coverage','medicaid_waiver_hcbs_disability_services','developmental_disability_idd_authority','early_intervention_part_c']) {
  const gap = gapRows.find((row) => row.family === fam);
  assert.equal(gap.family_status, 'blocked_saved_dhhs_successor_unresolvable_and_nh_gov_successors_forbidden');
  assert.match(gap.status_reason, /www\.dhhs\.nh\.gov/i);
  assert.match(gap.status_reason, /https:\/\/dhhs\.nh\.gov\//i);
  assert.match(gap.status_reason, /www\.nh\.gov\/dhhs/i);
}

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_official_education_hosts_and_nh_gov_successors_forbidden');
assert.match(eduGap.status_reason, /education\.nh\.gov/i);
assert.match(eduGap.status_reason, /www\.nh\.gov\/education/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_official_dhhs_hosts_and_nh_gov_successors_forbidden');

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrGap.family_status, 'blocked_vr_hosts_unresolvable_or_forbidden_with_no_nh_gov_successor');
assert.match(vrGap.status_reason, /https:\/\/nhes\.nh\.gov\//i);
assert.match(vrGap.status_reason, /www\.nh\.gov\/nhes/i);

const dhhsFailure = failureRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.equal(dhhsFailure.failure_code, 'current_nh_dhhs_replacement_host_unresolvable_and_likely_nh_gov_successors_forbidden');
assert.match(dhhsFailure.evidence, /https:\/\/www\.nh\.gov\//i);
assert.match(dhhsFailure.evidence, /403 Forbidden/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'official_nh_doe_host_family_and_likely_nh_gov_successors_return_access_denied_shell');

const vrFailure = failureRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrFailure.failure_code, 'official_nh_vr_host_family_forbidden_or_unresolvable_and_no_live_nh_gov_successor_root');

assert.ok(verifiedRows.find((row) => row.family === 'county_local_disability_resources').blocker_evidence.includes('https://www.nh.gov/dhhs/'));

assert.equal(packet.primary_gap_reason, 'official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root');
assert.ok(packet.blocker_classes.some((row) => row.host_families && row.host_families.includes('www.nh.gov/dhhs')));
assert.ok(packet.blocker_classes.some((row) => row.host_families && row.host_families.includes('www.dhhs.nh.gov')));
assert.ok(packet.blocker_classes.some((row) => row.host_families && row.host_families.includes('dhhs.nh.gov')));
assert.ok(packet.blocker_classes.some((row) => row.host_families && row.host_families.includes('www.nh.gov/education')));
assert.ok(packet.blocker_classes.some((row) => row.host_families && row.host_families.includes('education.nh.gov')));
assert.ok(packet.blocker_classes.some((row) => row.host_families && row.host_families.includes('www.nh.gov/nhes')));
assert.ok(packet.blocker_classes.some((row) => row.host_families && row.host_families.includes('nhes.nh.gov')));

assert.equal(batchSummary.nh_gov_root_forbidden, true);
assert.equal(batchSummary.dhhs_successor_unresolvable, true);
assert.equal(batchSummary.direct_agency_subdomains_forbidden, true);
assert.ok(report.includes('both `*.nh.gov` agency roots and the obvious `/dhhs`, `/education`, and `/nhes` successors all return HTTP 403 Forbidden immediately'));
assert.ok(lessons.includes('### Probe Both Agency Subdomains And State-Path Successors Before Reopening A Host-Family Blocker'));

for (const row of nextRows.filter((row) => ['medicaid_state_health_coverage','district_or_county_education_routing','vocational_rehabilitation_pre_ets'].includes(row.family))) {
  assert.ok(/hold_blocked_until/.test(row.next_action));
}

console.log('test-batch225-new-hampshire-successor-root-403-refresh-v1: ok');
