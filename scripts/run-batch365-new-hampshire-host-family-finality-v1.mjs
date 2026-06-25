import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-hampshire_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-hampshire_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-hampshire_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-hampshire_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-hampshire_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'new-hampshire-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch365_new_hampshire_host_family_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch365-new-hampshire-host-family-finality-report-v1.md'),
};

const BATCH_NAME = 'batch365_new_hampshire_host_family_finality_v1';
const PRIMARY_GAP_REASON =
  'official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead';
const SHARED_DHHS_STATUS =
  'blocked_saved_dhhs_successor_unresolvable_and_nh_gov_successors_forbidden';
const EDUCATION_STATUS =
  'blocked_official_education_hosts_and_nh_gov_successors_forbidden';
const VR_STATUS =
  'blocked_vr_hosts_unresolvable_or_forbidden_with_no_nh_gov_successor';
const COUNTY_STATUS =
  'blocked_official_dhhs_hosts_and_nh_gov_successors_forbidden';
const RECOMMENDED_BATCH =
  'hold_for_public_official_nh_host_recovery_or_export';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Hampshire California-Grade Host-Family Finality v4',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Host-family finality',
    '',
    '- New Hampshire is not blocked on guessed missing child paths; it is blocked on current official host-family failure modes that were rechecked directly.',
    '- The saved `dhhs.new-hampshire.gov` successor family is still DNS-dead on the exact Medicaid, DD, waiver, and early-intervention roots already in the packet.',
    '- The direct DHHS, education, and NHES subdomain families plus the obvious `nh.gov` path successors still return the same short `Access Denied` shell with HTTP 403 immediately.',
    '- No reviewed public official successor host is currently preserved for DHHS, district-directory, county-office, or VR lanes.',
    '',
    '## Completion decision',
    '',
    '- New Hampshire remains `BLOCKED` and `index_safe=false`.',
    '- The highest-priority blocker is still the DHHS host-family failure because it keeps Medicaid, waiver, DD, early-intervention, and county-local lanes blocked at once.',
    '- Education remains separately blocked because the official education host family and obvious `nh.gov` successors still provide no public district- or county-grade routing surface.',
    '- VR remains a major blocker because the official NHES lane and the likely successor roots are still either access-denied or unresolvable.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const newLine = '- New Hampshire remains blocked after a direct host-family recheck: the saved `dhhs.new-hampshire.gov` replacement roots are still DNS-dead, while the exact DHHS, education, NHES, and obvious `nh.gov` successor roots still return the same short Access Denied shell with HTTP 403, so no public official recovery lane exists yet.';
  const lines = text.split('\n').filter((line) => !line.startsWith('- New Hampshire remains blocked after a direct host-family recheck:'));
  return `${lines.join('\n').trimEnd()}\n${newLine}\n`;
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    `Updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: New Hampshire',
    '',
    '### Blocker Reason',
    '',
    '`medicaid_state_health_coverage` is the highest-priority New Hampshire blocker because the same official host-family failure still blocks Medicaid, waiver, DD, early-intervention, and county-local routing together. Reviewed 2026-06-25 bounded exact first-party rechecks across the saved `dhhs.new-hampshire.gov` replacement-host family, the direct `dhhs.nh.gov` agency subdomain family, and the likely public `nh.gov` successor family. The current-looking saved replacement roots still fail DNS resolution. The direct DHHS roots and exact `/dhhs` successor roots still return the same short `Access Denied` shell with HTTP 403. Education remains separately blocked because `education.nh.gov`, `www.education.nh.gov`, exact district-directory leaves, `my.doe.nh.gov/ehb/`, and the obvious `nh.gov` education successors all still return that same shell. VR remains separately blocked because the NHES roots, the BVR disabilities path, and the likely `nh.gov` successors still return the same 403 shell or do not resolve. New Hampshire therefore stays BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any reviewed public official New Hampshire DHHS host that actually renders Medicaid, DD, waiver, early-intervention, or district-office content instead of the Access Denied shell.',
    '- Any public official district-office or county-export surface on the DHHS family that provides real county or district-office routing.',
    '- Any reviewed public official New Hampshire education directory or district-profile surface that returns district- or county-grade routing instead of the Access Denied shell.',
    '- Any reviewed public official New Hampshire VR or BVR surface that loads publicly instead of the same blocked shell.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [DHHS root](https://www.dhhs.nh.gov/)',
    '- [DHHS root without www](https://dhhs.nh.gov/)',
    '- [saved replacement root](https://dhhs.new-hampshire.gov/)',
    '- [saved DD replacement root](https://dhhs.new-hampshire.gov/dd)',
    '- [saved waiver replacement root](https://dhhs.new-hampshire.gov/dd/waivers)',
    '- [saved early-intervention replacement root](https://dhhs.new-hampshire.gov/earlystart)',
    '- [nh.gov DHHS successor root](https://www.nh.gov/dhhs/)',
    '- [nh.gov DHHS contact-us](https://www.nh.gov/dhhs/contact-us/)',
    '- [nh.gov DHHS district offices](https://www.nh.gov/dhhs/district-offices/)',
    '- [Education root](https://www.education.nh.gov/)',
    '- [Education root without www](https://education.nh.gov/)',
    '- [nh.gov Education successor](https://www.nh.gov/education/)',
    '- [nh.gov Education DOE successor](https://www.nh.gov/education/doe/)',
    '- [DOE alternate host](https://my.doe.nh.gov/ehb/)',
    '- [NHES root](https://www.nhes.nh.gov/)',
    '- [NHES root without www](https://nhes.nh.gov/)',
    '- [NHES successor root](https://www.nh.gov/nhes/)',
    '- [nh.gov employment successor](https://www.nh.gov/employment/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any newly public official NH DHHS successor host or export that resolves without the Access Denied shell.',
    '- Any official New Hampshire education directory, profile export, or district-routing surface that becomes publicly reviewable on the current host family.',
    '- Any official New Hampshire VR or BVR surface that becomes publicly reviewable on the current host family.',
    '',
    '## Next State Order After New Hampshire',
    '',
    '1. None remaining in assigned sequence',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 365 New Hampshire Host-Family Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: moved New Hampshire into the current global control plane with an explicit host-family finality refresh and direct bounded revalidation of the official successor roots',
    '',
    '## Evidence',
    '',
    '- The saved `dhhs.new-hampshire.gov` successor roots remain DNS-dead.',
    '- The exact DHHS, education, NHES, and obvious `nh.gov` successor roots still return the same short `Access Denied` shell with HTTP 403.',
    '- No reviewed public official recovery surface is currently preserved for the blocked DHHS, district-directory, county-office, or VR families.',
  ].join('\n') + '\n';
}

export function generateBatch365NewHampshireHostFamilyFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: RECOMMENDED_BATCH,
    familyStatuses: {
      ...summary.familyStatuses,
      medicaid_state_health_coverage: SHARED_DHHS_STATUS,
      medicaid_waiver_hcbs_disability_services: SHARED_DHHS_STATUS,
      developmental_disability_idd_authority: SHARED_DHHS_STATUS,
      early_intervention_part_c: SHARED_DHHS_STATUS,
      district_or_county_education_routing: EDUCATION_STATUS,
      vocational_rehabilitation_pre_ets: VR_STATUS,
      county_local_disability_resources: COUNTY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => ({ ...row }));
  const updatedFailureRows = failureRows.map((row) => ({ ...row }));
  const updatedVerifiedRows = verifiedRows.map((row) => ({ ...row }));
  const updatedNextRows = nextRows.map((row) => ({ ...row }));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'new-hampshire'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 42,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: RECOMMENDED_BATCH,
          status: 'BLOCKED',
          repair_lane: 'blocked_until_live_public_official_host_family_or_export_recovers',
        }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    states: allStateAudit.states.map((row) => (
      row.stateId === 'new-hampshire'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            incorrectlyIndexSafe: false,
            completenessPct: 42,
            strongCriticalFamilies: 5,
            weakCriticalFamilies: 7,
            missingCriticalFamilies: 0,
            packetGenerated: true,
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: RECOMMENDED_BATCH,
            familyStatuses: {
              ...row.familyStatuses,
              medicaid_state_health_coverage: SHARED_DHHS_STATUS,
              medicaid_waiver_hcbs_disability_services: SHARED_DHHS_STATUS,
              developmental_disability_idd_authority: SHARED_DHHS_STATUS,
              early_intervention_part_c: SHARED_DHHS_STATUS,
              district_or_county_education_routing: EDUCATION_STATUS,
              vocational_rehabilitation_pre_ets: VR_STATUS,
              county_local_disability_resources: COUNTY_STATUS,
            },
          }
        : row
    )),
  };

  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const nextAllStateReport = buildAllStateReport(allStateReport);
  const nextHandoff = buildHandoff(updatedAudit);
  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: new Date().toISOString(),
    state: 'new-hampshire',
    classification: 'BLOCKED',
    index_safe: false,
    dhhs_replacement_dns_dead: true,
    dhhs_direct_403_shell: true,
    education_direct_403_shell: true,
    vr_direct_403_shell: true,
    nh_gov_successor_403_shell: true,
    result: 'official_new_hampshire_host_families_still_do_not_expose_public_reviewable_routing_surfaces',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.report, stateReport);
  fs.writeFileSync(INPUTS.allStateReport, nextAllStateReport);
  fs.writeFileSync(INPUTS.handoff, nextHandoff);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return {
    classification: updatedSummary.classification,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    batch: BATCH_NAME,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch365NewHampshireHostFamilyFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
