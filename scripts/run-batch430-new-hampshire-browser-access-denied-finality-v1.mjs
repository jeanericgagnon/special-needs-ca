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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'new-hampshire.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch430_new_hampshire_browser_access_denied_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch430-new-hampshire-browser-access-denied-finality-report-v1.md'),
};

const BATCH_NAME = 'batch430_new_hampshire_browser_access_denied_finality_v1';
const REVIEWED_AT = '2026-06-30T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_30_browser_and_raw_host_recheck_confirms_nh_dhhs_doe_and_nhes_roots_all_return_public_access_denied_shells_with_no_browser_recovery_lane';
const RECOMMENDED_BATCH = 'hold_for_public_official_nh_host_recovery_or_export';

const SHARED_DHHS_STATUS =
  'blocked_live_dhhs_hosts_still_access_denied_in_browser_and_raw_with_no_reviewable_public_content_lane';
const EDUCATION_STATUS =
  'blocked_live_education_hosts_still_access_denied_in_browser_and_raw_with_no_reviewable_public_routing_lane';
const VR_STATUS =
  'blocked_live_nhes_hosts_still_access_denied_in_browser_and_raw_with_no_reviewable_public_vr_lane';
const COUNTY_STATUS =
  'blocked_live_dhhs_hosts_still_access_denied_in_browser_and_raw_with_no_county_reviewable_content_lane';

const DHHS_REASON =
  'Reviewed 2026-06-30 one more bounded New Hampshire DHHS host-family pass in both raw-fetch and browser context. `https://www.dhhs.nh.gov/`, `https://dhhs.nh.gov/`, and `https://www.nh.gov/dhhs/` still return the same public HTTP 403 `Access Denied` shell in browser review, not just in raw HTTP fetches. The rendered browser titles stay `Access Denied`, and the rendered body stays the same Akamai-style denial text instead of reopening any public Medicaid, waiver, DD, early-intervention, or district-office content lane. The partial diagnostics remain non-closing only: `https://www.nh.gov/robots.txt` and `https://www.dhhs.nh.gov/robots.txt` are publicly reachable generic crawler files, while the actual DHHS content roots stay blocked. New Hampshire therefore still has no reviewed public official DHHS lane for Medicaid, waiver, DD, early-intervention, or county-local routing.';
const EDUCATION_REASON =
  'Reviewed 2026-06-30 one more bounded New Hampshire education host-family pass in both raw-fetch and browser context. `https://education.nh.gov/`, `https://www.education.nh.gov/`, `https://www.nh.gov/education/`, and `https://my.doe.nh.gov/ehb/` all still render the same public HTTP 403 `Access Denied` shell in browser review, not just in raw HTTP fetches. The rendered browser titles stay `Access Denied`, and no district-, SAU-, or county-grade routing content becomes reviewable on the live official hosts. The official federal IDEA-by-State page remains the only reviewable statewide special-education authority lane, but it still does not restore local education routing. New Hampshire therefore still lacks a reviewable public DOE lane for district or county education routing.';
const VR_REASON =
  'Reviewed 2026-06-30 one more bounded New Hampshire VR host-family pass in both raw-fetch and browser context. `https://nhes.nh.gov/`, `https://www.nhes.nh.gov/`, and `https://www.nh.gov/nhes/` all still render the same public HTTP 403 `Access Denied` shell in browser review, not just in raw HTTP fetches. The rendered browser titles stay `Access Denied`, and no public vocational-rehabilitation or Pre-ETS content becomes reviewable on the current official host family. New Hampshire therefore still lacks a reviewable public VR successor lane.';

const DHHS_FAMILIES = new Set([
  'medicaid_state_health_coverage',
  'medicaid_waiver_hcbs_disability_services',
  'developmental_disability_idd_authority',
  'early_intervention_part_c',
  'county_local_disability_resources',
]);
const EDUCATION_FAMILIES = new Set(['district_or_county_education_routing']);
const VR_FAMILIES = new Set(['vocational_rehabilitation_pre_ets']);

const LESSON_HEADING =
  '### Browser-Context 403 Parity Confirms A Host-Family Blocker';
const LESSON_BODY =
  '*   **Lesson:** If both raw HTTP and real browser review land on the same public `Access Denied` shell across the exact official roots, treat that host family as truly non-reviewable instead of a scraper-only false positive. New Hampshire DHHS, DOE, and NHES all stayed blocked in browser context on 2026-06-30, so the blocker is public-host availability, not low-token fetch drift.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function familyReason(family) {
  if (DHHS_FAMILIES.has(family)) return DHHS_REASON;
  if (EDUCATION_FAMILIES.has(family)) return EDUCATION_REASON;
  if (VR_FAMILIES.has(family)) return VR_REASON;
  return null;
}

function familyStatus(family) {
  if (DHHS_FAMILIES.has(family) && family !== 'county_local_disability_resources') return SHARED_DHHS_STATUS;
  if (family === 'county_local_disability_resources') return COUNTY_STATUS;
  if (EDUCATION_FAMILIES.has(family)) return EDUCATION_STATUS;
  if (VR_FAMILIES.has(family)) return VR_STATUS;
  return null;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Hampshire California-Grade Audit Report v2',
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
    '- New Hampshire remains blocked on live official host families, not on guessed missing child paths.',
    '- DHHS, DOE, and NHES now fail the stronger browser-and-raw parity check: raw HTTP and real browser review both land on the same public `Access Denied` shell.',
    '- The browser titles remain `Access Denied` and no public program, district-routing, county-routing, or VR content materializes from the reviewed official roots.',
    '- Generic public robots files remain non-closing diagnostics only and do not restore a reviewable official lane.',
    '',
    '## Completion decision',
    '',
    '- New Hampshire remains `BLOCKED` and `index_safe=false`.',
    '- The highest-priority blocker is still the DHHS host family because it keeps Medicaid, waiver, DD, early-intervention, and county-local lanes blocked together.',
    '- Education remains separately blocked because the official education host family still has no public district- or county-grade routing lane in browser or raw review.',
    '- VR remains separately blocked because the official NHES host family still has no public vocational-rehabilitation or Pre-ETS lane in browser or raw review.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const replacement =
    '- New Hampshire remains blocked after a browser-and-raw host-family recheck: the exact DHHS, education, and NHES official roots all still render the same public Access Denied shell in browser context, so no public recovery lane exists beyond generic robots diagnostics.';
  const lines = text.split('\n').filter((line) => !line.startsWith('- New Hampshire remains blocked after'));
  return `${lines.join('\n').trimEnd()}\n${replacement}\n`;
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
    '`medicaid_state_health_coverage` is still the highest-priority New Hampshire blocker because the same official DHHS host-family failure blocks Medicaid, waiver, DD, early-intervention, and county-local routing together. Reviewed 2026-06-30 one more bounded pass in both raw-fetch and browser context. `https://www.dhhs.nh.gov/`, `https://dhhs.nh.gov/`, and `https://www.nh.gov/dhhs/` all still render the same public `Access Denied` shell in browser review, not just in raw HTTP fetches. The same browser-context parity now also holds for `https://education.nh.gov/`, `https://www.education.nh.gov/`, `https://www.nh.gov/education/`, `https://my.doe.nh.gov/ehb/`, `https://nhes.nh.gov/`, `https://www.nhes.nh.gov/`, and `https://www.nh.gov/nhes/`. New Hampshire therefore still has no public reviewable DHHS, DOE, or NHES content lane on the current official hosts.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any reviewed public official New Hampshire DHHS host that renders Medicaid, DD, waiver, early-intervention, or district-office content instead of the Access Denied shell.',
    '- Any public official district-office or county-export surface on the DHHS family that provides real county or district-office routing.',
    '- Any reviewed public official New Hampshire education directory or district-routing surface that renders publicly instead of the Access Denied shell.',
    '- Any reviewed public official New Hampshire VR or BVR surface that renders publicly instead of the Access Denied shell.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [DHHS root](https://www.dhhs.nh.gov/)',
    '- [DHHS root without www](https://dhhs.nh.gov/)',
    '- [nh.gov DHHS successor root](https://www.nh.gov/dhhs/)',
    '- [DHHS robots.txt](https://www.dhhs.nh.gov/robots.txt)',
    '- [nh.gov robots.txt](https://www.nh.gov/robots.txt)',
    '- [Education root](https://www.education.nh.gov/)',
    '- [Education root without www](https://education.nh.gov/)',
    '- [nh.gov Education successor](https://www.nh.gov/education/)',
    '- [DOE alternate host](https://my.doe.nh.gov/ehb/)',
    '- [NHES root](https://www.nhes.nh.gov/)',
    '- [NHES root without www](https://nhes.nh.gov/)',
    '- [NHES successor root](https://www.nh.gov/nhes/)',
    '',
    '## Next State Order After New Hampshire',
    '',
    '1. Arizona',
    '2. California',
    '3. Idaho',
    '4. Maine',
    '5. Alaska',
    '',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 430 New Hampshire Browser Access Denied Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: strengthened New Hampshire from raw-fetch-only host-family blockers to browser-and-raw parity blockers on the official DHHS, DOE, and NHES roots',
    '',
    '## Evidence',
    '',
    `- ${DHHS_REASON}`,
    `- ${EDUCATION_REASON}`,
    `- ${VR_REASON}`,
    '',
  ].join('\n');
}

export function generateBatch430NewHampshireBrowserAccessDeniedFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const stateCertification = readJson(INPUTS.stateCertification);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 42,
    strong_critical_families: 4,
    weak_critical_families: 8,
    missing_critical_families: 0,
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

  const updatedGapRows = gapRows.map((row) => {
    const status = familyStatus(row.family);
    const reason = familyReason(row.family);
    return status && reason ? { ...row, family_status: status, status_reason: reason } : row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    const reason = familyReason(row.family);
    return reason ? { ...row, evidence: reason } : row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    const status = familyStatus(row.family);
    const reason = familyReason(row.family);
    if (!status || !reason) return row;
    return {
      ...row,
      family_status: status,
      query_basis: reason,
      blocker_evidence: reason,
    };
  });

  const updatedNextRows = nextRows.map((row) => {
    const reason = familyReason(row.family);
    return reason ? { ...row, evidence: reason } : row;
  });

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'new-hampshire'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 42,
          missing_critical_families: 0,
          weak_critical_families: 8,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: RECOMMENDED_BATCH,
          status: 'BLOCKED',
          repair_lane: 'repair_from_state_packet',
        }
      : row,
  );

  const auditRow = audit.states.find((row) => row.stateId === 'new-hampshire');
  if (auditRow) {
    auditRow.classification = 'BLOCKED';
    auditRow.indexSafe = false;
    auditRow.index_safe = false;
    auditRow.incorrectlyIndexSafe = false;
    auditRow.incorrectly_index_safe = false;
    auditRow.packetBatch = BATCH_NAME;
    auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
    auditRow.packetRecommendedBatch = RECOMMENDED_BATCH;
    auditRow.primaryGapReason = PRIMARY_GAP_REASON;
    auditRow.primary_gap_reason = PRIMARY_GAP_REASON;
    auditRow.completenessPct = 42;
    auditRow.completeness_pct = 42;
    auditRow.strongCriticalFamilies = 4;
    auditRow.strong_critical_families = 4;
    auditRow.weakCriticalFamilies = 8;
    auditRow.weak_critical_families = 8;
    auditRow.missingCriticalFamilies = 0;
    auditRow.missing_critical_families = 0;
    auditRow.familyStatuses = {
      ...auditRow.familyStatuses,
      medicaid_state_health_coverage: SHARED_DHHS_STATUS,
      medicaid_waiver_hcbs_disability_services: SHARED_DHHS_STATUS,
      developmental_disability_idd_authority: SHARED_DHHS_STATUS,
      early_intervention_part_c: SHARED_DHHS_STATUS,
      district_or_county_education_routing: EDUCATION_STATUS,
      vocational_rehabilitation_pre_ets: VR_STATUS,
      county_local_disability_resources: COUNTY_STATUS,
    };
  }

  const updatedStateCertification = {
    ...stateCertification,
    checkedAt: REVIEWED_AT,
    summary: updatedSummary,
    gapRows: updatedGapRows,
    failures: updatedFailureRows,
    nextActions: updatedNextRows,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeText(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJson(INPUTS.audit, audit);
  writeText(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  writeText(INPUTS.handoff, buildHandoff(audit));
  appendLessonIfMissing(INPUTS.lessons);
  writeJson(INPUTS.stateCertification, updatedStateCertification);

  writeJson(OUTPUTS.summary, {
    batch: BATCH_NAME,
    state: 'new-hampshire',
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 42,
    browser_verified_access_denied_hosts: [
      'https://www.dhhs.nh.gov/',
      'https://dhhs.nh.gov/',
      'https://www.nh.gov/dhhs/',
      'https://education.nh.gov/',
      'https://www.education.nh.gov/',
      'https://www.nh.gov/education/',
      'https://my.doe.nh.gov/ehb/',
      'https://nhes.nh.gov/',
      'https://www.nhes.nh.gov/',
      'https://www.nh.gov/nhes/',
    ],
    browser_access_denied_count: 10,
    raw_and_browser_parity: true,
    dhhs_families_blocked: 5,
    education_families_blocked: 1,
    vr_families_blocked: 1,
    verified_statewide_only_families: [
      'special_education_idea_part_b',
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
      'able_program',
      'ssi_ssa_federal_reference',
    ],
    counts_unchanged: {
      complete: 44,
      blocked: 6,
      indexSafe: 44,
    },
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return {
    classification: 'BLOCKED',
    primary_gap_reason: PRIMARY_GAP_REASON,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch430NewHampshireBrowserAccessDeniedFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
