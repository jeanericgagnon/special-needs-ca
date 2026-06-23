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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch175_new_hampshire_host_family_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch175-new-hampshire-host-family-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-hampshire-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE =
  'official_nh_doe_host_family_returns_access_denied_shell';
const EDUCATION_REASON =
  'Reviewed 2026-06-23 bounded browser-style probes on the official New Hampshire education host family. `www.education.nh.gov` root plus exact district-directory leaves and the alternate `my.doe.nh.gov` host all return the same short `Access Denied` shell, so no reviewed district- or county-grade education routing chain is publicly fetchable from the official education stack.';
const EDUCATION_NEXT =
  'hold_blocked_until_public_nh_education_export_or_browser_reviewable_directory_is_preserved';

const VR_FAILURE =
  'official_nh_vr_host_family_returns_access_denied_or_unresolvable';
const VR_REASON =
  'Reviewed 2026-06-23 the current New Hampshire VR lane against the likely official host family. The legacy root `dhhs.new-hampshire.gov/rehab` no longer resolves, `www.nhes.nh.gov` root plus the BVR disabilities path return the same short `Access Denied` shell, and `www.nheasy.nh.gov` does not resolve. No reviewed first-party VR or Pre-ETS surface is publicly fetchable from the current official host family.';
const VR_NEXT =
  'hold_blocked_until_public_nh_vr_host_or_official_export_is_preserved';

const DHHS_REPLACEMENT_FAILURE =
  'current_nh_dhhs_replacement_host_family_unresolvable';
const DHHS_REPLACEMENT_REASON =
  'Reviewed 2026-06-23 exact first-party checks on the current-looking `dhhs.new-hampshire.gov` hostnames already saved in the packet. The root `https://dhhs.new-hampshire.gov/` plus the saved Medicaid/DD/waiver/early-intervention paths `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Those replacement-host assumptions therefore cannot remain verified statewide evidence.';
const DHHS_REPLACEMENT_NEXT =
  'hold_blocked_until_live_official_nh_dhhs_host_or_reviewed_successor_is_preserved';

const COUNTY_FAILURE =
  'official_nh_dhhs_host_family_returns_access_denied_shell';
const COUNTY_REASON =
  'Reviewed 2026-06-23 bounded browser-style probes on the official New Hampshire DHHS host family. `www.dhhs.nh.gov` root plus the exact `/contact-us` and `/contact-us/district-offices` leaves all return the same short `Access Denied` shell, so the old DOI-derived county-office rows still have no reviewed official county-owned replacement.';
const COUNTY_NEXT =
  'hold_blocked_until_public_nh_dhhs_district_directory_or_county_export_is_preserved';

const LESSON_HEADING =
  '### Treat Repeated Access-Denied Shells As A Host-Family Blocker';
const LESSON_BODY =
  '*   **Lesson:** If the official root, the exact leaf paths, and the obvious alternate official subdomain all return the same tiny `Access Denied` shell, stop guessing more paths and classify the whole host family as publicly blocked. New Hampshire DOE, DHHS, and NHES all behaved this way, which was enough to sharpen the blocker without more retries.';
const REPLACEMENT_HOST_LESSON_HEADING =
  '### Unresolvable Successor Hosts Cannot Stay Verified Just Because They Look Official';
const REPLACEMENT_HOST_LESSON_BODY =
  '*   **Lesson:** If a packet swaps in a neat-looking replacement host such as `agency.new-hampshire.gov`, re-probe that exact hostname before preserving it as verified evidence. New Hampshire’s saved `dhhs.new-hampshire.gov` Medicaid/DD/EI paths all failed DNS resolution, so they had to be downgraded back into the blocker set.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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
  const additions = [];
  if (!current.includes(LESSON_HEADING)) additions.push(`${LESSON_HEADING}\n${LESSON_BODY}`);
  if (!current.includes(REPLACEMENT_HOST_LESSON_HEADING)) additions.push(`${REPLACEMENT_HOST_LESSON_HEADING}\n${REPLACEMENT_HOST_LESSON_BODY}`);
  if (!additions.length) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${additions.join('\n\n')}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Hampshire California-Grade Host-Family Blocker Refresh v2',
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
    '- New Hampshire remains `BLOCKED` and `index_safe=false`.',
    '- The remaining blockers now include both host-family public-access failures and an audit-consistency fix for the unresolvable `dhhs.new-hampshire.gov` replacement host family.',
    '- Medicaid, waiver, DD, and early-intervention can no longer stay verified off `dhhs.new-hampshire.gov` because the exact saved first-party hostnames do not resolve in the current lane.',
    '- Education remains blocked because the official DOE root, district leaves, and alternate `my.doe.nh.gov` host all return the same access-denied shell.',
    '- County/local disability resources remain blocked because the official DHHS root and district-office leaves all return the same access-denied shell, leaving only DOI-derived county rows.',
    '- Vocational rehabilitation remains blocked because the legacy root is dead, the likely NHES VR host family is access-denied, and `nheasy` is not resolvable.',
  ].join('\n') + '\n';
}

export function generateBatch175NewHampshireHostFamilyBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => {
    if (['medicaid_state_health_coverage', 'medicaid_waiver_hcbs_disability_services', 'developmental_disability_idd_authority', 'early_intervention_part_c'].includes(row.family)) {
      return {
        ...row,
        family_status: 'blocked_current_nh_dhhs_replacement_host_unresolvable',
        status_reason: DHHS_REPLACEMENT_REASON,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_nh_doe_host_family_access_denied',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'blocked_official_nh_vr_host_family_access_denied_or_unresolvable',
        status_reason: VR_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_official_nh_dhhs_host_family_access_denied',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (['medicaid_state_health_coverage', 'medicaid_waiver_hcbs_disability_services', 'developmental_disability_idd_authority', 'early_intervention_part_c'].includes(row.family)) {
      return { ...row, failure_code: DHHS_REPLACEMENT_FAILURE, evidence: DHHS_REPLACEMENT_REASON, next_action: DHHS_REPLACEMENT_NEXT };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE, evidence: EDUCATION_REASON, next_action: EDUCATION_NEXT };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return { ...row, failure_code: VR_FAILURE, evidence: VR_REASON, next_action: VR_NEXT };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE, evidence: COUNTY_REASON, next_action: COUNTY_NEXT };
    }
    return row;
  });

  for (const family of ['medicaid_state_health_coverage', 'medicaid_waiver_hcbs_disability_services', 'developmental_disability_idd_authority', 'early_intervention_part_c']) {
    if (!updatedFailureRows.some((row) => row.family === family)) {
      updatedFailureRows.push({
        state: 'new-hampshire',
        state_code: 'NH',
        family,
        severity: 'critical',
        failure_code: DHHS_REPLACEMENT_FAILURE,
        evidence: DHHS_REPLACEMENT_REASON,
        next_action: DHHS_REPLACEMENT_NEXT,
      });
    }
  }

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'medicaid_state_health_coverage') {
      return {
        ...row,
        family_status: 'blocked_current_nh_dhhs_replacement_host_unresolvable',
        evidence_strength: 'weak',
        query_basis: 'Reviewed 2026-06-23 the exact saved New Hampshire DHHS replacement-host root used for statewide Medicaid evidence.',
        blocker_code: DHHS_REPLACEMENT_FAILURE,
        blocker_evidence: DHHS_REPLACEMENT_REASON,
        sample_count: 2,
        samples: [
          {
            sample_name: 'Saved New Hampshire DHHS Medicaid root',
            source_url: 'https://dhhs.new-hampshire.gov/',
            verification_status: 'blocked',
            source_type: 'saved_replacement_root_unresolvable',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The exact saved New Hampshire DHHS replacement-host root fails DNS resolution in bounded review and cannot remain verified Medicaid evidence.',
          },
          {
            sample_name: 'Saved Medicaid/DD replacement path family',
            source_url: 'https://dhhs.new-hampshire.gov/dd',
            verification_status: 'blocked',
            source_type: 'saved_replacement_leaf_unresolvable',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The exact saved replacement-path family under `dhhs.new-hampshire.gov` also fails DNS resolution, so the packet has no live reviewed Medicaid-family host on that successor domain.',
          },
        ],
      };
    }
    if (row.family === 'medicaid_waiver_hcbs_disability_services') {
      return {
        ...row,
        family_status: 'blocked_current_nh_dhhs_replacement_host_unresolvable',
        evidence_strength: 'weak',
        query_basis: 'Reviewed 2026-06-23 the exact saved New Hampshire waiver replacement-host path.',
        blocker_code: DHHS_REPLACEMENT_FAILURE,
        blocker_evidence: DHHS_REPLACEMENT_REASON,
      };
    }
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: 'blocked_current_nh_dhhs_replacement_host_unresolvable',
        evidence_strength: 'weak',
        query_basis: 'Reviewed 2026-06-23 the exact saved New Hampshire DD replacement-host path.',
        blocker_code: DHHS_REPLACEMENT_FAILURE,
        blocker_evidence: DHHS_REPLACEMENT_REASON,
      };
    }
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'blocked_current_nh_dhhs_replacement_host_unresolvable',
        evidence_strength: 'weak',
        query_basis: 'Reviewed 2026-06-23 the exact saved New Hampshire early-intervention replacement-host path.',
        blocker_code: DHHS_REPLACEMENT_FAILURE,
        blocker_evidence: DHHS_REPLACEMENT_REASON,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_nh_doe_host_family_access_denied',
        query_basis: 'Reviewed 2026-06-23 the official New Hampshire DOE root, exact district-directory leaves, and alternate my.doe host with browser-style headers.',
        blocker_code: EDUCATION_FAILURE,
        blocker_evidence: EDUCATION_REASON,
        sample_count: 4,
        samples: [
          {
            sample_name: 'New Hampshire DOE home',
            source_url: 'https://www.education.nh.gov/',
            final_url: 'https://www.education.nh.gov/',
            verification_status: 'blocked',
            source_type: 'official_root_access_denied_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official DOE root returned a short Access Denied shell instead of public directory content.',
          },
          {
            sample_name: 'School and District Profiles',
            source_url: 'https://www.education.nh.gov/school-and-district-profiles',
            final_url: 'https://www.education.nh.gov/school-and-district-profiles',
            verification_status: 'blocked',
            source_type: 'official_leaf_access_denied_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The exact school-and-district profiles leaf returned the same short Access Denied shell as the root.',
          },
          {
            sample_name: 'Find School or District',
            source_url: 'https://www.education.nh.gov/find-school-or-district',
            final_url: 'https://www.education.nh.gov/find-school-or-district',
            verification_status: 'blocked',
            source_type: 'official_leaf_access_denied_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The exact district-finder leaf returned the same short Access Denied shell as the root.',
          },
          {
            sample_name: 'Alternate DOE host',
            source_url: 'https://my.doe.nh.gov/ehb/',
            final_url: 'https://my.doe.nh.gov/ehb/',
            verification_status: 'blocked',
            source_type: 'alternate_official_host_access_denied_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The alternate official DOE host `my.doe.nh.gov` returned the same short Access Denied shell, so the blocker is host-family wide rather than one bad leaf.',
          },
        ],
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'blocked_official_nh_vr_host_family_access_denied_or_unresolvable',
        query_basis: 'Reviewed 2026-06-23 the legacy VR root plus likely official NHES and nheasy hosts with browser-style headers.',
        blocker_code: VR_FAILURE,
        blocker_evidence: VR_REASON,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Legacy New Hampshire VR root',
            source_url: 'https://dhhs.new-hampshire.gov/rehab',
            verification_status: 'blocked',
            source_type: 'legacy_root_unresolvable',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The legacy exact VR root no longer resolves.',
          },
          {
            sample_name: 'NHES home',
            source_url: 'https://www.nhes.nh.gov/',
            final_url: 'https://www.nhes.nh.gov/',
            verification_status: 'blocked',
            source_type: 'official_root_access_denied_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official NHES root returned a short Access Denied shell instead of public VR content.',
          },
          {
            sample_name: 'NHES BVR path',
            source_url: 'https://www.nhes.nh.gov/services/disabilities/bvr.htm',
            final_url: 'https://www.nhes.nh.gov/services/disabilities/bvr.htm',
            verification_status: 'blocked',
            source_type: 'official_leaf_access_denied_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The likely Bureau of Vocational Rehabilitation leaf returned the same short Access Denied shell as the NHES root.',
          },
          {
            sample_name: 'NHEasy root',
            source_url: 'https://www.nheasy.nh.gov/',
            verification_status: 'blocked',
            source_type: 'official_host_unresolvable',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The likely public-assistance portal host `www.nheasy.nh.gov` did not resolve during bounded review.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_official_nh_dhhs_host_family_access_denied',
        query_basis: 'Reviewed 2026-06-23 the official New Hampshire DHHS root plus exact contact and district-office leaves with browser-style headers.',
        blocker_code: COUNTY_FAILURE,
        blocker_evidence: COUNTY_REASON,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Legacy DOI county-office row',
            source_url: 'https://doi.org/10.7910/DVN/AVRHMI',
            verification_status: 'blocked',
            source_type: 'legacy_doi_extract_not_official_county_owned',
            source_table: 'county_offices',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The current county-office row still points to a DOI dataset mirror rather than a reviewed official county-owned directory.',
          },
          {
            sample_name: 'New Hampshire DHHS root',
            source_url: 'https://www.dhhs.nh.gov/',
            final_url: 'https://www.dhhs.nh.gov/',
            verification_status: 'blocked',
            source_type: 'official_root_access_denied_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official DHHS root returned the same short Access Denied shell before any local-office evidence could be reviewed.',
          },
          {
            sample_name: 'NH DHHS contact path',
            source_url: 'https://www.dhhs.nh.gov/contact-us',
            final_url: 'https://www.dhhs.nh.gov/contact-us',
            verification_status: 'blocked',
            source_type: 'official_leaf_access_denied_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The exact DHHS contact leaf returned the same short Access Denied shell as the root.',
          },
          {
            sample_name: 'NH DHHS district offices path',
            source_url: 'https://www.dhhs.nh.gov/contact-us/district-offices',
            final_url: 'https://www.dhhs.nh.gov/contact-us/district-offices',
            verification_status: 'blocked',
            source_type: 'official_leaf_access_denied_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The exact district-offices leaf returned the same short Access Denied shell, so no reviewed county-owned replacement exists for the DOI rows.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (['medicaid_state_health_coverage', 'medicaid_waiver_hcbs_disability_services', 'developmental_disability_idd_authority', 'early_intervention_part_c'].includes(row.family)) {
      return { ...row, failure_code: DHHS_REPLACEMENT_FAILURE, next_action: DHHS_REPLACEMENT_NEXT, evidence: DHHS_REPLACEMENT_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE, next_action: EDUCATION_NEXT, evidence: EDUCATION_REASON };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return { ...row, failure_code: VR_FAILURE, next_action: VR_NEXT, evidence: VR_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE, next_action: COUNTY_NEXT, evidence: COUNTY_REASON };
    }
    return row;
  });

  for (const family of ['medicaid_state_health_coverage', 'medicaid_waiver_hcbs_disability_services', 'developmental_disability_idd_authority', 'early_intervention_part_c']) {
    if (!updatedNextRows.some((row) => row.family === family)) {
      updatedNextRows.push({
        state: 'new-hampshire',
        state_code: 'NH',
        priority_rank: family === 'medicaid_state_health_coverage' ? 1 : family === 'medicaid_waiver_hcbs_disability_services' ? 2 : family === 'developmental_disability_idd_authority' ? 3 : 4,
        family,
        severity: 'critical',
        failure_code: DHHS_REPLACEMENT_FAILURE,
        next_action: DHHS_REPLACEMENT_NEXT,
        evidence: DHHS_REPLACEMENT_REASON,
      });
    }
  }

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 42,
    strong_critical_families: 5,
    weak_critical_families: 7,
    missing_critical_families: 0,
    primary_gap_reason: 'official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable',
    critical_gap_families: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
    major_gap_families: ['vocational_rehabilitation_pre_ets'],
    complete_ready: false,
    final_blockers: [
      {
        family: 'medicaid_state_health_coverage',
        severity: 'critical',
        failure_code: DHHS_REPLACEMENT_FAILURE,
        evidence: DHHS_REPLACEMENT_REASON,
        next_action: DHHS_REPLACEMENT_NEXT,
      },
      {
        family: 'medicaid_waiver_hcbs_disability_services',
        severity: 'critical',
        failure_code: DHHS_REPLACEMENT_FAILURE,
        evidence: DHHS_REPLACEMENT_REASON,
        next_action: DHHS_REPLACEMENT_NEXT,
      },
      {
        family: 'developmental_disability_idd_authority',
        severity: 'critical',
        failure_code: DHHS_REPLACEMENT_FAILURE,
        evidence: DHHS_REPLACEMENT_REASON,
        next_action: DHHS_REPLACEMENT_NEXT,
      },
      {
        family: 'early_intervention_part_c',
        severity: 'critical',
        failure_code: DHHS_REPLACEMENT_FAILURE,
        evidence: DHHS_REPLACEMENT_REASON,
        next_action: DHHS_REPLACEMENT_NEXT,
      },
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: EDUCATION_FAILURE,
        evidence: EDUCATION_REASON,
        next_action: EDUCATION_NEXT,
      },
      {
        family: 'vocational_rehabilitation_pre_ets',
        severity: 'major',
        failure_code: VR_FAILURE,
        evidence: VR_REASON,
        next_action: VR_NEXT,
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT,
      },
    ],
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch175_new_hampshire_host_family_blocker_refresh_v1',
    state: 'new-hampshire',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    host_family_blockers: ['education.nh.gov', 'my.doe.nh.gov', 'dhhs.nh.gov', 'dhhs.new-hampshire.gov', 'nhes.nh.gov', 'nheasy.nh.gov'],
    lesson_added: lessonAdded,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch175NewHampshireHostFamilyBlockerRefreshV1();
}
