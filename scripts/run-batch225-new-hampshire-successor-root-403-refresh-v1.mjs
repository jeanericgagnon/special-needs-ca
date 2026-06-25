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
  failures: path.join(generatedDir, 'new-hampshire_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-hampshire_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'new-hampshire_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'new-hampshire_host_family_blocker_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch225_new_hampshire_successor_root_403_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch225-new-hampshire-successor-root-403-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-hampshire-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead';
const DHHS_FAILURE_CODE = 'current_nh_dhhs_replacement_host_dns_dead_and_direct_successors_access_denied_shell';
const EDU_FAILURE_CODE = 'official_nh_doe_host_family_and_direct_successors_still_return_access_denied_shell';
const VR_FAILURE_CODE = 'official_nh_vr_host_family_still_access_denied_or_unresolvable_with_no_public_successor';
const COUNTY_FAILURE_CODE = 'official_nh_dhhs_host_family_and_direct_successors_still_return_access_denied_shell';

const SHARED_DHHS_EVIDENCE = 'Reviewed 2026-06-25 bounded exact first-party rechecks across the saved `dhhs.new-hampshire.gov` replacement-host family, the direct `dhhs.nh.gov` agency subdomain family, and the likely public `nh.gov` successor family. The current-looking saved hostnames `https://dhhs.new-hampshire.gov/`, `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` still fail DNS resolution. Direct agency roots `https://www.dhhs.nh.gov/` and `https://dhhs.nh.gov/` still return the same short `Access Denied` shell with HTTP 403, and exact successor probes `https://www.nh.gov/`, `https://www.nh.gov/dhhs/`, `https://www.nh.gov/dhhs/contact-us/`, and `https://www.nh.gov/dhhs/district-offices/` do the same. New Hampshire therefore still has no reviewed public official DHHS successor host for Medicaid, waiver, DD, early-intervention, or district-office lanes.';
const EDU_EVIDENCE = 'Reviewed 2026-06-25 bounded exact first-party rechecks on the official New Hampshire education host family, both `education.nh.gov` subdomain variants, exact district-directory leaves, the alternate `https://my.doe.nh.gov/ehb/` host, and the likely `nh.gov` successor family. `https://www.education.nh.gov/`, `https://education.nh.gov/`, exact district-directory leaves under `www.education.nh.gov`, and `https://my.doe.nh.gov/ehb/` all still return the same short `Access Denied` shell with HTTP 403. Exact successor probes `https://www.nh.gov/education/` and `https://www.nh.gov/education/doe/` still do the same. No reviewed district- or county-grade education routing chain is publicly fetchable from the current official education family or the obvious `nh.gov` successor roots.';
const VR_EVIDENCE = 'Reviewed 2026-06-25 the current New Hampshire VR lane against the legacy host assumptions, both `nhes.nh.gov` subdomain variants, and the likely `nh.gov` successor family. The legacy root `dhhs.new-hampshire.gov/rehab` still does not resolve, `https://www.nhes.nh.gov/`, `https://nhes.nh.gov/`, and the BVR disabilities path still return the same short `Access Denied` shell with HTTP 403, `https://www.nheasy.nh.gov/` still does not resolve, and exact successor probes `https://www.nh.gov/nhes/` plus `https://www.nh.gov/employment/` still return the same short `Access Denied` shell with HTTP 403. No reviewed first-party VR or Pre-ETS surface is publicly fetchable from the current official host family or the obvious `nh.gov` successor roots.';

const LESSON_HEADING = '### Probe Both Agency Subdomains And State-Path Successors Before Reopening A Host-Family Blocker';
const LESSON_BODY = '*   **Lesson:** When an official host family looks migrated, test both the direct agency subdomain pair and the obvious `nh.gov` path successor before guessing deeper leaves. New Hampshire kept the blocker sharp because `www.dhhs.nh.gov` and `dhhs.nh.gov`, `www.education.nh.gov` and `education.nh.gov`, and `www.nhes.nh.gov` and `nhes.nh.gov` all failed alongside the plain `nh.gov` agency paths.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Hampshire California-Grade Host-Family Packet v3',
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
    '## Completion decision',
    '',
    '- New Hampshire remains BLOCKED and index_safe=false.',
    '- The saved `dhhs.new-hampshire.gov` replacement-host family is still unresolvable.',
    '- Neither the direct agency subdomains nor the likely `nh.gov` path successors are hidden rescue paths in this lane: both `*.nh.gov` agency roots and the obvious `/dhhs`, `/education`, and `/nhes` successors all return the same short Access Denied shell with HTTP 403 immediately.',
    '- No reviewed public official successor host is currently preserved for the blocked DHHS, education, VR, or district-office families.',
  ].join('\n') + '\n';
}

export function generateBatch225NewHampshireSuccessorRoot403RefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const packet = readJson(INPUTS.packet);

  const dhhsFamilies = new Set([
    'medicaid_state_health_coverage',
    'medicaid_waiver_hcbs_disability_services',
    'developmental_disability_idd_authority',
    'early_intervention_part_c',
  ]);

  const updatedGapRows = gapRows.map((row) => {
    if (dhhsFamilies.has(row.family)) {
      return { ...row, family_status: 'blocked_saved_dhhs_successor_unresolvable_and_nh_gov_successors_forbidden', status_reason: SHARED_DHHS_EVIDENCE };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_official_education_hosts_and_nh_gov_successors_forbidden', status_reason: EDU_EVIDENCE };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return { ...row, family_status: 'blocked_vr_hosts_unresolvable_or_forbidden_with_no_nh_gov_successor', status_reason: VR_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'blocked_official_dhhs_hosts_and_nh_gov_successors_forbidden', status_reason: SHARED_DHHS_EVIDENCE };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (dhhsFamilies.has(row.family)) {
      return { ...row, failure_code: DHHS_FAILURE_CODE, evidence: SHARED_DHHS_EVIDENCE, next_action: 'hold_blocked_until_live_public_official_nh_dhhs_host_is_preserved' };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDU_FAILURE_CODE, evidence: EDU_EVIDENCE, next_action: 'hold_blocked_until_public_nh_education_host_or_directory_is_reviewable' };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return { ...row, failure_code: VR_FAILURE_CODE, evidence: VR_EVIDENCE, next_action: 'hold_blocked_until_public_nh_vr_host_is_preserved' };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: SHARED_DHHS_EVIDENCE, next_action: 'hold_blocked_until_public_nh_dhhs_district_directory_or_county_export_is_preserved' };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (dhhsFamilies.has(row.family)) {
      return {
        ...row,
        family_status: 'blocked_saved_dhhs_successor_unresolvable_and_nh_gov_successors_forbidden',
        blocker_code: DHHS_FAILURE_CODE,
        blocker_evidence: SHARED_DHHS_EVIDENCE,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_education_hosts_and_nh_gov_successors_forbidden',
        blocker_code: EDU_FAILURE_CODE,
        blocker_evidence: EDU_EVIDENCE,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'blocked_vr_hosts_unresolvable_or_forbidden_with_no_nh_gov_successor',
        blocker_code: VR_FAILURE_CODE,
        blocker_evidence: VR_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_official_dhhs_hosts_and_nh_gov_successors_forbidden',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: SHARED_DHHS_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (dhhsFamilies.has(row.family)) {
      return { ...row, failure_code: DHHS_FAILURE_CODE, next_action: 'hold_blocked_until_live_public_official_nh_dhhs_host_is_preserved', evidence: SHARED_DHHS_EVIDENCE };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDU_FAILURE_CODE, next_action: 'hold_blocked_until_public_nh_education_host_or_directory_is_reviewable', evidence: EDU_EVIDENCE };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return { ...row, failure_code: VR_FAILURE_CODE, next_action: 'hold_blocked_until_public_nh_vr_host_is_preserved', evidence: VR_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: 'hold_blocked_until_public_nh_dhhs_district_directory_or_county_export_is_preserved', evidence: SHARED_DHHS_EVIDENCE };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (dhhsFamilies.has(row.family)) {
        return { ...row, failure_code: DHHS_FAILURE_CODE, evidence: SHARED_DHHS_EVIDENCE, next_action: 'hold_blocked_until_live_public_official_nh_dhhs_host_is_preserved' };
      }
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, failure_code: EDU_FAILURE_CODE, evidence: EDU_EVIDENCE, next_action: 'hold_blocked_until_public_nh_education_host_or_directory_is_reviewable' };
      }
      if (row.family === 'vocational_rehabilitation_pre_ets') {
        return { ...row, failure_code: VR_FAILURE_CODE, evidence: VR_EVIDENCE, next_action: 'hold_blocked_until_public_nh_vr_host_is_preserved' };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: SHARED_DHHS_EVIDENCE, next_action: 'hold_blocked_until_public_nh_dhhs_district_directory_or_county_export_is_preserved' };
      }
      return row;
    }),
  };

  const updatedPacket = {
    ...packet,
    primary_gap_reason: PRIMARY_GAP_REASON,
    purpose: 'Deterministic blocker packet for New Hampshire while the saved DHHS replacement-host family remains DNS-dead and the direct DHHS, education, VR, and likely nh.gov successor hosts still return the same short Access Denied shell with HTTP 403.',
    blocker_classes: [
      {
        blocker_class: 'saved_successor_host_dns_dead_and_direct_successors_access_denied_shell',
        families: [
          'medicaid_state_health_coverage',
          'medicaid_waiver_hcbs_disability_services',
          'developmental_disability_idd_authority',
          'early_intervention_part_c',
          'county_local_disability_resources'
        ],
        host_families: [
          'dhhs.new-hampshire.gov',
          'www.dhhs.nh.gov',
          'dhhs.nh.gov',
          'www.nh.gov/dhhs'
        ],
        exact_paths: [
          'https://dhhs.new-hampshire.gov/',
          'https://dhhs.new-hampshire.gov/dd',
          'https://dhhs.new-hampshire.gov/dd/waivers',
          'https://dhhs.new-hampshire.gov/earlystart',
          'https://www.dhhs.nh.gov/',
          'https://dhhs.nh.gov/',
          'https://www.nh.gov/',
          'https://www.nh.gov/dhhs/',
          'https://www.nh.gov/dhhs/contact-us/',
          'https://www.nh.gov/dhhs/district-offices/'
        ],
        finding: 'The saved replacement-host family still does not resolve and the direct DHHS plus likely nh.gov DHHS successors still return the same short Access Denied shell with HTTP 403.'
      },
      {
        blocker_class: 'official_education_hosts_and_nh_gov_successors_forbidden',
        families: [
          'district_or_county_education_routing'
        ],
        host_families: [
          'www.education.nh.gov',
          'education.nh.gov',
          'my.doe.nh.gov',
          'www.nh.gov/education'
        ],
        exact_paths: [
          'https://www.education.nh.gov/',
          'https://education.nh.gov/',
          'https://www.education.nh.gov/school-and-district-profiles',
          'https://www.education.nh.gov/find-school-or-district',
          'https://my.doe.nh.gov/ehb/',
          'https://www.nh.gov/education/',
          'https://www.nh.gov/education/doe/'
        ],
        finding: 'The official education hosts return Access Denied and the likely nh.gov education successors return HTTP 403 Forbidden immediately.'
      },
      {
        blocker_class: 'official_vr_hosts_still_access_denied_or_unresolvable_with_no_public_successor',
        families: [
          'vocational_rehabilitation_pre_ets'
        ],
        host_families: [
          'www.nhes.nh.gov',
          'nhes.nh.gov',
          'www.nheasy.nh.gov',
          'www.nh.gov/nhes'
        ],
        exact_paths: [
          'https://www.nhes.nh.gov/',
          'https://nhes.nh.gov/',
          'https://www.nhes.nh.gov/services/disabilities/bvr.htm',
          'https://www.nheasy.nh.gov/',
          'https://www.nh.gov/nhes/',
          'https://www.nh.gov/employment/'
        ],
        finding: 'The current VR host family is still either unresolvable or the same short Access Denied shell, and the likely nh.gov successors do the same.'
      }
    ]
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch225_new_hampshire_successor_root_403_refresh_v1',
    generated_at: '2026-06-25T00:00:00.000Z',
    state: 'new-hampshire',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    nh_gov_root_forbidden: true,
    dhhs_successor_unresolvable: true,
    direct_agency_subdomains_forbidden: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 225 New Hampshire Successor Root 403 Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the host-family blocker with explicit nh.gov successor-root failures',
    '',
    '## Evidence',
    '',
    `- ${SHARED_DHHS_EVIDENCE}`,
    `- ${EDU_EVIDENCE}`,
    `- ${VR_EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Kept New Hampshire BLOCKED.',
    '- Confirmed the saved `dhhs.new-hampshire.gov` successor family is still unresolvable.',
    '- Confirmed the direct `*.nh.gov` agency roots and the obvious `nh.gov` agency successors are not viable rescue paths in this lane because they all return HTTP 403 Forbidden immediately.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch225NewHampshireSuccessorRoot403RefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
