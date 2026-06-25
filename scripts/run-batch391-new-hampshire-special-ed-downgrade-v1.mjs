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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch391_new_hampshire_special_ed_downgrade_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch391-new-hampshire-special-ed-downgrade-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-hampshire-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const BATCH_NAME = 'batch391_new_hampshire_special_ed_downgrade_v1';
const PRIMARY_GAP_REASON =
  'official_nh_dhhs_education_and_vr_host_families_plus_diagnostic_robots_sitemaps_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead';
const RECOMMENDED_BATCH =
  'hold_for_public_official_nh_host_recovery_or_export';
const SPECIAL_ED_STATUS =
  'blocked_official_education_hosts_and_diagnostic_surfaces_forbidden';
const SPECIAL_ED_FAILURE =
  'official_nh_statewide_special_education_host_family_and_direct_successors_still_return_access_denied_shell';
const SPECIAL_ED_NEXT =
  'hold_blocked_until_public_nh_special_education_host_or_statewide_leaf_is_reviewable';
const SPECIAL_ED_REASON =
  'Reviewed 2026-06-25 bounded exact first-party rechecks on the official New Hampshire education host family, both `education.nh.gov` subdomain variants, exact district-directory leaves, the alternate `https://my.doe.nh.gov/ehb/` host, and the likely `nh.gov` successor family. `https://www.education.nh.gov/`, `https://education.nh.gov/`, exact district-directory leaves under `www.education.nh.gov`, and `https://my.doe.nh.gov/ehb/` all still return the same short `Access Denied` shell with HTTP 403. Exact successor probes `https://www.nh.gov/education/` and `https://www.nh.gov/education/doe/` still do the same. No reviewed statewide Part B authority leaf is publicly fetchable from the current official education family or the obvious `nh.gov` successor roots.';

const LESSON_HEADING =
  '### A Statewide Family Cannot Stay Verified After Its Only Official Proof Lane Turns Into The Blocker';
const LESSON_BODY =
  '*   **Lesson:** If the only saved official sample for a statewide family is now the same live blocked host-family as the local routing lane, downgrade the statewide family too instead of preserving the older green label. New Hampshire special education could not stay `verified_state_grade` once the DOE root, district-profile leaves, alternate DOE host, and obvious `nh.gov` successors all replayed the same short `Access Denied` shell.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function replaceOrAppendReportLine(text, prefix, nextLine) {
  const lines = text.split('\n').filter((line) => !line.startsWith(prefix));
  return `${lines.join('\n').trimEnd()}\n${nextLine}\n`;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Hampshire California-Grade Host-Family Finality v6',
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
    '- One more bounded diagnostic pass now closes the obvious recovery surfaces too: even `robots.txt` and `sitemap.xml` on the official DHHS and `nh.gov/dhhs` host family return that same short 403 shell.',
    '- The statewide special-education family can no longer stay green off that blocked DOE host family because its only saved official evidence lane is now the same blocked root-plus-leaf set as the district-routing family.',
    '- No reviewed public official successor host is currently preserved for DHHS, statewide special education, district-directory, county-office, or VR lanes.',
    '',
    '## Completion decision',
    '',
    '- New Hampshire remains `BLOCKED` and `index_safe=false`.',
    '- The highest-priority blocker is still the DHHS host-family failure because it keeps Medicaid, waiver, DD, early-intervention, and county-local lanes blocked at once.',
    '- Statewide special education is now also blocked truthfully because no reviewed public Part B authority leaf survives on the official education host family.',
    '- District/county education routing remains separately blocked because the official education host family and obvious `nh.gov` successors still provide no public district- or county-grade routing surface.',
    '- VR remains a major blocker because the official NHES lane and the likely successor roots are still either access-denied or unresolvable.',
  ].join('\n') + '\n';
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
    '`medicaid_state_health_coverage` is still the highest-priority New Hampshire blocker because the same official host-family failure still blocks Medicaid, waiver, DD, early-intervention, and county-local routing together. Reviewed 2026-06-25 bounded exact first-party rechecks across the saved `dhhs.new-hampshire.gov` replacement-host family, the direct `dhhs.nh.gov` agency subdomain family, and the likely public `nh.gov` successor family. The current-looking saved replacement roots still fail DNS resolution. The direct DHHS roots and exact `/dhhs` successor roots still return the same short `Access Denied` shell with HTTP 403. The exact DOE roots, district-profile leaves, alternate `my.doe.nh.gov/ehb/` host, and the obvious `nh.gov` education successors still return that same shell too, so statewide Part B can no longer stay verified off that blocked host family either. VR remains separately blocked because the NHES roots, the BVR disabilities path, and the likely `nh.gov` successors still return the same 403 shell or do not resolve. New Hampshire therefore stays BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any reviewed public official New Hampshire DHHS host that actually renders Medicaid, DD, waiver, early-intervention, or district-office content instead of the Access Denied shell.',
    '- Any public official district-office or county-export surface on the DHHS family that provides real county or district-office routing.',
    '- Any reviewed public official New Hampshire statewide special-education leaf or district-profile surface that returns content instead of the Access Denied shell.',
    '- Any reviewed public official New Hampshire VR or BVR surface that loads publicly instead of the same blocked shell.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [DHHS root](https://www.dhhs.nh.gov/)',
    '- [DHHS root without www](https://dhhs.nh.gov/)',
    '- [DHHS robots.txt](https://www.dhhs.nh.gov/robots.txt)',
    '- [DHHS sitemap.xml](https://www.dhhs.nh.gov/sitemap.xml)',
    '- [saved replacement root](https://dhhs.new-hampshire.gov/)',
    '- [saved DD replacement root](https://dhhs.new-hampshire.gov/dd)',
    '- [saved waiver replacement root](https://dhhs.new-hampshire.gov/dd/waivers)',
    '- [saved early-intervention replacement root](https://dhhs.new-hampshire.gov/earlystart)',
    '- [nh.gov DHHS successor root](https://www.nh.gov/dhhs/)',
    '- [nh.gov DHHS robots.txt](https://www.nh.gov/dhhs/robots.txt)',
    '- [nh.gov DHHS sitemap.xml](https://www.nh.gov/dhhs/sitemap.xml)',
    '- [Education root](https://www.education.nh.gov/)',
    '- [Education root without www](https://education.nh.gov/)',
    '- [School and District Profiles](https://www.education.nh.gov/school-and-district-profiles)',
    '- [Find School or District](https://www.education.nh.gov/find-school-or-district)',
    '- [DOE alternate host](https://my.doe.nh.gov/ehb/)',
    '- [nh.gov Education successor](https://www.nh.gov/education/)',
    '- [nh.gov Education DOE successor](https://www.nh.gov/education/doe/)',
    '- [NHES root](https://www.nhes.nh.gov/)',
    '- [NHES root without www](https://nhes.nh.gov/)',
    '- [NHES successor root](https://www.nh.gov/nhes/)',
    '- [nh.gov employment successor](https://www.nh.gov/employment/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any newly public official NH DHHS successor host or export that resolves without the Access Denied shell.',
    '- Any official New Hampshire special-education or district-profile export that becomes publicly reviewable on the current host family.',
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
    '# Batch 391 New Hampshire Special-Ed Downgrade v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: downgraded New Hampshire statewide special education from stale verified state-grade to the same blocked official education host-family lane already proven by exact DOE root and child-surface probes',
    '',
    '## Evidence',
    '',
    '- The only saved official statewide special-education evidence lane was the blocked DOE host family.',
    '- `https://www.education.nh.gov/`, exact district-profile leaves, `https://my.doe.nh.gov/ehb/`, and the obvious `nh.gov` education successors all still return the same short `Access Denied` shell with HTTP 403.',
    '- New Hampshire therefore cannot keep statewide Part B marked verified while the only official DOE proof lane remains publicly blocked.',
  ].join('\n') + '\n';
}

export function generateBatch391NewHampshireSpecialEdDowngradeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'special_education_idea_part_b'
      ? {
          ...row,
          family_status: SPECIAL_ED_STATUS,
          statewide_enough: false,
          status_reason: SPECIAL_ED_REASON,
        }
      : row
  ));

  const specialEdFailure = {
    state: 'new-hampshire',
    state_code: 'NH',
    family: 'special_education_idea_part_b',
    severity: 'critical',
    failure_code: SPECIAL_ED_FAILURE,
    evidence: SPECIAL_ED_REASON,
    next_action: SPECIAL_ED_NEXT,
  };

  const updatedFailureRows = [
    ...failureRows.filter((row) => row.family !== 'special_education_idea_part_b'),
    specialEdFailure,
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'special_education_idea_part_b'
      ? {
          ...row,
          family_status: SPECIAL_ED_STATUS,
          evidence_strength: 'weak',
          query_basis: 'Reviewed 2026-06-25 the exact New Hampshire statewide Part B host family plus direct district-profile leaves and alternate DOE host with exact first-party probes.',
          blocker_code: SPECIAL_ED_FAILURE,
          blocker_evidence: SPECIAL_ED_REASON,
          sample_count: 4,
          samples: [
            {
              sample_name: 'New Hampshire DOE home',
              source_url: 'https://www.education.nh.gov/',
              final_url: 'https://www.education.nh.gov/',
              verification_status: 'blocked',
              source_type: 'official_root_access_denied_shell',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The official DOE root still returns the same short Access Denied shell instead of a public statewide special-education authority page.',
            },
            {
              sample_name: 'School and District Profiles',
              source_url: 'https://www.education.nh.gov/school-and-district-profiles',
              final_url: 'https://www.education.nh.gov/school-and-district-profiles',
              verification_status: 'blocked',
              source_type: 'official_leaf_access_denied_shell',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The exact school-and-district profiles leaf still returns the same short Access Denied shell as the root.',
            },
            {
              sample_name: 'Find School or District',
              source_url: 'https://www.education.nh.gov/find-school-or-district',
              final_url: 'https://www.education.nh.gov/find-school-or-district',
              verification_status: 'blocked',
              source_type: 'official_leaf_access_denied_shell',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The exact district-finder leaf still returns the same short Access Denied shell as the root.',
            },
            {
              sample_name: 'Alternate DOE host',
              source_url: 'https://my.doe.nh.gov/ehb/',
              final_url: 'https://my.doe.nh.gov/ehb/',
              verification_status: 'blocked',
              source_type: 'alternate_official_host_access_denied_shell',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The alternate official DOE host still returns the same short Access Denied shell, so no statewide Part B authority leaf is currently reviewable on the official education family.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = [
    ...nextRows.filter((row) => row.family !== 'special_education_idea_part_b')
      .map((row) => ({ ...row })),
    {
      state: 'new-hampshire',
      state_code: 'NH',
      priority_rank: 5,
      family: 'special_education_idea_part_b',
      severity: 'critical',
      failure_code: SPECIAL_ED_FAILURE,
      next_action: SPECIAL_ED_NEXT,
      evidence: SPECIAL_ED_REASON,
    },
  ].sort((a, b) => {
    const order = [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'county_local_disability_resources',
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
    ];
    return order.indexOf(a.family) - order.indexOf(b.family);
  }).map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 33,
    strong_critical_families: 4,
    weak_critical_families: 8,
    missing_critical_families: 0,
    total_critical_families: 12,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: RECOMMENDED_BATCH,
    critical_gap_families: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
    major_gap_families: [
      'vocational_rehabilitation_pre_ets',
    ],
    final_blockers: [
      ...updatedFailureRows
        .filter((row) => [
          'medicaid_state_health_coverage',
          'medicaid_waiver_hcbs_disability_services',
          'developmental_disability_idd_authority',
          'early_intervention_part_c',
          'special_education_idea_part_b',
          'district_or_county_education_routing',
          'vocational_rehabilitation_pre_ets',
          'county_local_disability_resources',
        ].includes(row.family)),
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      special_education_idea_part_b: SPECIAL_ED_STATUS,
    },
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'new-hampshire'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 33,
          weak_critical_families: 8,
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
            strongCriticalFamilies: 4,
            weakCriticalFamilies: 8,
            missingCriticalFamilies: 0,
            completenessPct: 33,
            familyStatuses: {
              ...row.familyStatuses,
              special_education_idea_part_b: SPECIAL_ED_STATUS,
            },
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: RECOMMENDED_BATCH,
          }
        : row
    )),
  };

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  updatedAudit.lessonsUpdate = lessonsUpdated
    ? `${allStateAudit.lessonsUpdate || ''}\n- New Hampshire: downgrade statewide special education if the only official DOE proof lane is the same blocked host family as local routing.`.trim()
    : allStateAudit.lessonsUpdate;

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);

  const updatedAllStateReport = replaceOrAppendReportLine(
    allStateReport,
    '- New Hampshire remains blocked after a direct host-family recheck:',
    '- New Hampshire remains blocked after a direct host-family recheck: the saved `dhhs.new-hampshire.gov` replacement roots are still DNS-dead, the exact DHHS, education, NHES, and obvious `nh.gov` successor roots still return the same short Access Denied shell with HTTP 403, even the DHHS/`nh.gov` robots.txt and sitemap.xml diagnostics return that same shell, and statewide special education can no longer stay verified because its only saved official DOE proof lane is inside that same blocked education host family.'
  );
  fs.writeFileSync(INPUTS.allStateReport, updatedAllStateReport);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(OUTPUTS.handoff, `${buildHandoff(updatedAudit)}\n`);

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'new-hampshire',
    classification: 'BLOCKED',
    index_safe: false,
    downgraded_families: ['special_education_idea_part_b'],
    strong_critical_families: 4,
    weak_critical_families: 8,
    completeness_pct: 33,
    global_counts: updatedAudit.classifications,
    indexSafeCount: updatedAudit.indexSafeCount,
    incorrectlyIndexSafeStates: updatedAudit.incorrectlyIndexSafeStates,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch391NewHampshireSpecialEdDowngradeV1();
}
