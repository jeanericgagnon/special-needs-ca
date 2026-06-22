import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch128_kansas_ksde_host_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch128-kansas-ksde-host-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const KSDE_SPECIAL_ED = 'https://www.ksde.gov/policy-and-funding/special-education';
const KSDE_ECSE = 'https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education';
const KSDE_ROOT = 'https://www.ksde.gov/';
const KANCare_ROOT = 'https://www.kancare.ks.gov/';
const KDADS_ROOT = 'https://kdads.ks.gov/';

const PRIMARY_GAP = 'ksde_request_rejected_shell_plus_kancare_kdads_access_blocked';
const KSDE_BLOCKER = 'ksde_request_rejected_shell_on_exact_special_education_and_ecse_roots';
const MEDICAID_BLOCKER = 'reviewed_exact_medicaid_root_access_blocked';
const WAIVER_BLOCKER = 'reviewed_exact_waiver_leaf_access_blocked';
const DD_BLOCKER = 'legacy_dd_root_dead_and_reviewed_replacement_access_blocked';
const COUNTY_BLOCKER = 'legacy_county_locator_dead_and_reviewed_replacement_access_blocked';

const ECSE_REASON = 'Reviewed 2026-06-22 live probe to the exact KSDE Early Childhood Special Education leaf now returns the same 245-byte Request Rejected shell as the KSDE root and special-education page, so the previously reviewed KSDE Part C evidence is no longer fetchable in the current lane.';
const SPED_REASON = 'Reviewed 2026-06-22 live probe to the exact KSDE Special Education leaf now returns a 245-byte Request Rejected shell rather than special-education content, so the prior statewide IDEA Part B verification no longer survives live host checks.';
const DISTRICT_REASON = 'Kansas district routing remains blocked because the live KSDE host now returns the same Request Rejected shell on both the statewide Special Education root and likely directory paths, while no reviewed district-owned or county-grade special-education leaf is preserved on disk.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Part C Repair v1',
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
    '- Kansas remains BLOCKED and not index-safe because the live KanCare and KDADS roots are still blocked, and the live KSDE host now returns the same tiny Request Rejected shell for the previously verified Special Education and Early Childhood Special Education roots.',
    '- This pass tightens the packet truth model by downgrading KSDE-backed special-education and Part C families that no longer survive current live host checks, instead of preserving stale verified status from earlier fetch conditions.',
  ].join('\n') + '\n';
}

export function generateBatch128KansasKsdeHostBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const queueRows = readJsonl(INPUTS.queue);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return { ...row, family_status: 'blocked_ksde_ecse_root_request_rejected', status_reason: ECSE_REASON };
    }
    if (row.family === 'special_education_idea_part_b') {
      return { ...row, family_status: 'blocked_ksde_special_education_root_request_rejected', status_reason: SPED_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_ksde_host_request_rejected_and_no_local_leafs', status_reason: DISTRICT_REASON };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'medicaid_state_health_coverage',
      severity: 'critical',
      failure_code: MEDICAID_BLOCKER,
      evidence: 'Reviewed 2026-06-22 live probe to the exact Kansas Medicaid root https://www.kancare.ks.gov/ still returns HTTP 403 Forbidden / access denied instead of Medicaid content.',
      next_action: 'browser_assisted_or_reviewed_alt_official_medicaid_leaf',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'medicaid_waiver_hcbs_disability_services',
      severity: 'critical',
      failure_code: WAIVER_BLOCKER,
      evidence: 'Reviewed 2026-06-22 live probe to the exact KDADS waiver and HCBS surfaces still returns HTTP 403 Forbidden / access denied.',
      next_action: 'browser_assisted_or_reviewed_alt_official_waiver_leaf',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'developmental_disability_idd_authority',
      severity: 'critical',
      failure_code: DD_BLOCKER,
      evidence: 'The old dhhs.kansas.gov/dd root remains dead, and reviewed 2026-06-22 live probe to the exact KDADS root still returns HTTP 403 Forbidden / access denied instead of DD content.',
      next_action: 'browser_assisted_or_reviewed_alt_official_dd_leaf',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'early_intervention_part_c',
      severity: 'critical',
      failure_code: KSDE_BLOCKER,
      evidence: 'Reviewed 2026-06-22 live probe to https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education returned a 245-byte Request Rejected shell with support ID instead of Early Childhood Special Education or Part C content.',
      next_action: 'browser_assisted_or_reviewed_alt_official_part_c_leaf',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'special_education_idea_part_b',
      severity: 'critical',
      failure_code: KSDE_BLOCKER,
      evidence: 'Reviewed 2026-06-22 live probe to https://www.ksde.gov/policy-and-funding/special-education returned a 245-byte Request Rejected shell with support ID instead of special-education content.',
      next_action: 'browser_assisted_or_reviewed_alt_official_special_education_leaf',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: KSDE_BLOCKER,
      evidence: 'Reviewed 2026-06-22 live probes to the KSDE root, Special Education root, and likely directory paths all returned the same 245-byte Request Rejected shell, while no reviewed district-owned or county-grade special-education leaf is preserved on disk.',
      next_action: 'browser_assisted_or_author_exact_district_targets_after_host_access_is_restored',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_BLOCKER,
      evidence: 'The old dhhs.kansas.gov/locations locator remains dead, and reviewed 2026-06-22 live probe to the exact KDADS root still returns HTTP 403 Forbidden / access denied, so no reviewed county-grade replacement is captured.',
      next_action: 'browser_assisted_or_author_county_local_exact_targets',
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'blocked_ksde_ecse_root_request_rejected',
        evidence_strength: 'weak',
        blocker_code: KSDE_BLOCKER,
        blocker_evidence: 'The exact KSDE Early Childhood Special Education root now returns only a 245-byte Request Rejected shell in the current lane.',
        sample_count: 0,
        samples: [],
      };
    }
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'blocked_ksde_special_education_root_request_rejected',
        evidence_strength: 'weak',
        blocker_code: KSDE_BLOCKER,
        blocker_evidence: 'The exact KSDE Special Education root now returns only a 245-byte Request Rejected shell in the current lane.',
        sample_count: 0,
        samples: [],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_ksde_host_request_rejected_and_no_local_leafs',
        evidence_strength: 'weak',
        blocker_code: KSDE_BLOCKER,
        blocker_evidence: 'The KSDE host now returns the same Request Rejected shell on the root, special-education, and likely directory paths, and no district-owned local leaves are preserved on disk.',
        sample_count: 0,
        samples: [],
      };
    }
    return row;
  });

  const updatedNextRows = updatedFailureRows.map((row, index) => ({
    state: row.state,
    state_code: row.state_code,
    priority_rank: index + 1,
    family: row.family,
    severity: row.severity,
    failure_code: row.failure_code,
    next_action: row.next_action,
    evidence: row.evidence,
  }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 42,
    strong_critical_families: 5,
    weak_critical_families: 7,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP,
    critical_gap_families: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kansas'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 42,
          weak_critical_families: 7,
          missing_critical_families: 0,
          primary_gap_reason: PRIMARY_GAP,
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    downgraded_families: ['early_intervention_part_c', 'special_education_idea_part_b'],
    refined_family: 'district_or_county_education_routing',
    lesson_added: false,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 128 Kansas KSDE Host Blocker Refresh Report v1',
      '',
      'This pass does not broaden Kansas repair work. It tightens the packet around current live host truth by downgrading previously verified KSDE-backed families that now return the same Request Rejected shell and by aligning the remaining critical blockers to current official host behavior.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- downgraded_families: ${batchSummary.downgraded_families.join(', ')}`,
      `- refined_family: ${batchSummary.refined_family}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch128KansasKsdeHostBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
