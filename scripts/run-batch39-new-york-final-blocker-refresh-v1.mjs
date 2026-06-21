import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-york_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-york_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-york_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-york_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-york_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
  sourceTargets: path.join(repoRoot, 'data', 'source_targets', 'new-york.json'),
  authoredTargets: path.join(docsGeneratedDir, 'authored-missing-source-targets-2026-06-17.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch39_new-york_final_blocker_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch39-new-york-final-blocker-refresh-report-v1.md'),
};

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
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => row.family_status === 'missing').length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: Math.floor((strong / criticalRows.length) * 100),
    strong_critical_families: strong,
    weak_critical_families: weak,
    missing_critical_families: missing,
    primary_gap_reason: 'official_county_directory_returns_http_403',
    recommended_batch: 'batch_2_repair_blocked',
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: failureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows, facts) {
  return [
    '# New York California-Grade Audit Report v2',
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
    '## New York final blocker decision',
    '',
    `- County-local disability resources remain blocked because the official New York LDSS county directory at ${facts.countyDirectoryUrl} returned HTTP 403 during bounded live verification, and no replacement live county-grade official locator is attached to the packet evidence chain.`,
    `- District or county education routing remains blocked because only ${facts.educationLeafCount} reviewed BOCES-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all ${summary.county_count} New York counties without reopening broader district authoring.`,
    `- Vocational rehabilitation / Pre-ETS remains below California-grade because the repo currently has only the planning target for ACCES-VR (${facts.vrUrl}), not a reviewed verified-source row in the packet evidence chain.`,
    `- Protection and advocacy remains below California-grade because the repo currently has only the planning target for Disability Rights New York (${facts.paUrl}), while the existing packet samples point to unrelated advocacy organizations rather than a reviewed DRNY source.`,
    `- Parent training information center remains below California-grade because the repo currently has only the planning target for Parent Network of WNY (${facts.ptiUrl}), not a reviewed packet-grade PTI source that can justify statewide support.`,
    `- Legal aid remains below California-grade because New York currently stops at the authored LSC planning target (${facts.legalAidUrl}), not a reviewed New York legal-aid source.`,
    '- New York is therefore truthfully final-blocked and not index-safe until a live official county-office directory or county-owned locator is verified, district-grade education leaves expand beyond the current bounded BOCES set, and the statewide support families are upgraded from planning-only to reviewed verified evidence.',
  ].join('\n') + '\n';
}

export function generateBatch39NewYorkFinalBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const sourceTargets = readJson(INPUTS.sourceTargets);
  const authoredTargets = readJson(INPUTS.authoredTargets);

  const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
  const vrTarget = sourceTargets.find((row) => row.source_name === 'NYS ACCES-VR');
  const ptiTarget = sourceTargets.find((row) => row.source_name === 'Parent Network of WNY');
  const paTarget = sourceTargets.find((row) => row.source_name === 'Disability Rights New York (DRNY)');
  const countyTarget = sourceTargets.find((row) => row.source_name === 'NYS Local Social Services Districts (LDSS)');
  const authoredRows = authoredTargets.targets || authoredTargets.rows || authoredTargets;
  const legalAidTarget = authoredRows.find((row) => row?.stateId === 'new-york' && row?.gapFamily === 'legal_aid');

  if (!educationVerified || !countyVerified || !vrTarget || !ptiTarget || !paTarget || !countyTarget || !legalAidTarget) {
    throw new Error('New York final blocker refresh requires source targets plus county and education packet evidence.');
  }

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        status_reason: `Reviewed BOCES-owned education exact leaves verified (${educationVerified.sample_count}), but district-grade coverage still cannot be proven for all ${summary.county_count} counties from the authored exact targets.`,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_official_directory_returns_403',
        status_reason: `The live official LDSS county directory ${countyTarget.source_url} returned HTTP 403 during bounded verification, so the current county-office rows cannot remain California-grade local proof.`,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'planning_target_only',
        status_reason: `Only the planning target ${vrTarget.source_url} is present; no reviewed verified ACCES-VR source is attached to the packet.`,
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'missing_verified_source',
        status_reason: `Only the planning target ${paTarget.source_url} is present; current packet samples are not reviewed Disability Rights New York evidence.`,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'planning_target_only',
        status_reason: `Only the planning target ${ptiTarget.source_url} is present; no reviewed verified PTI source is attached to the packet.`,
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'missing_verified_source',
        status_reason: `Only the authored LSC planning target ${legalAidTarget.sourceUrl} is present; no reviewed New York legal-aid source has been verified into the packet.`,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'bounded_boces_leaf_packet_exhausted_before_county_grade_coverage',
        evidence: `Verified exact leaves remain limited to ${educationVerified.sample_count} reviewed BOCES-owned pages; this does not truthfully prove district-grade routing statewide.`,
        next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'live_official_ldss_directory_403_without_replacement_locator',
        evidence: `Official New York LDSS county directory returned HTTP 403 at ${countyTarget.source_url} during bounded live verification, and no replacement live county-grade official locator is attached to the packet.`,
        next_action: 'hold_blocked_until_live_official_ldss_directory_or_county_owned_locator_is_verified',
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        failure_code: 'official_acces_vr_target_not_yet_reviewed_verified',
        evidence: `Planning target ${vrTarget.source_url} exists, but no reviewed verified ACCES-VR leaf has been fetched into the packet evidence chain.`,
        next_action: 'hold_blocked_until_reviewed_acces_vr_leaf_is_verified',
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        failure_code: 'reviewed_drny_source_missing',
        evidence: `Planning target ${paTarget.source_url} exists, but no reviewed verified Disability Rights New York source is attached to the packet.`,
        next_action: 'hold_blocked_until_reviewed_drny_source_is_verified',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'reviewed_new_york_pti_source_missing',
        evidence: `Planning target ${ptiTarget.source_url} exists, but no reviewed verified PTI source is attached to the packet.`,
        next_action: 'hold_blocked_until_reviewed_new_york_pti_source_is_verified',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        failure_code: 'authored_lsc_target_not_yet_replaced_with_reviewed_new_york_source',
        evidence: `New York legal-aid planning currently stops at the authored authoritative target ${legalAidTarget.sourceUrl}; no reviewed New York legal-aid evidence has been fetched and verified from saved artifacts.`,
        next_action: 'hold_blocked_until_reviewed_new_york_legal_aid_source_is_verified',
      };
    }
    return row;
  });

  const failureByFamily = new Map(updatedFailureRows.map((row) => [row.family, row]));
  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (failureByFamily.has(row.family)) {
      const failure = failureByFamily.get(row.family);
      const familyStatus = updatedGapRows.find((gapRow) => gapRow.family === row.family)?.family_status || row.family_status;
      return {
        ...row,
        family_status: familyStatus,
        evidence_strength: row.family === 'district_or_county_education_routing' ? 'weak' : row.sample_count > 0 ? 'weak' : 'missing',
        blocker_code: failure.failure_code,
        blocker_evidence: failure.evidence,
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'new-york',
      state_code: 'NY',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'live_official_ldss_directory_403_without_replacement_locator',
      next_action: 'hold_blocked_until_live_official_ldss_directory_or_county_owned_locator_is_verified',
      evidence: failureByFamily.get('county_local_disability_resources')?.evidence,
    },
    {
      state: 'new-york',
      state_code: 'NY',
      priority_rank: 2,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'bounded_boces_leaf_packet_exhausted_before_county_grade_coverage',
      next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      evidence: failureByFamily.get('district_or_county_education_routing')?.evidence,
    },
    {
      state: 'new-york',
      state_code: 'NY',
      priority_rank: 3,
      family: 'vocational_rehabilitation_pre_ets',
      severity: 'major',
      failure_code: 'official_acces_vr_target_not_yet_reviewed_verified',
      next_action: 'hold_blocked_until_reviewed_acces_vr_leaf_is_verified',
      evidence: failureByFamily.get('vocational_rehabilitation_pre_ets')?.evidence,
    },
    {
      state: 'new-york',
      state_code: 'NY',
      priority_rank: 4,
      family: 'protection_and_advocacy',
      severity: 'major',
      failure_code: 'reviewed_drny_source_missing',
      next_action: 'hold_blocked_until_reviewed_drny_source_is_verified',
      evidence: failureByFamily.get('protection_and_advocacy')?.evidence,
    },
    {
      state: 'new-york',
      state_code: 'NY',
      priority_rank: 5,
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_new_york_pti_source_missing',
      next_action: 'hold_blocked_until_reviewed_new_york_pti_source_is_verified',
      evidence: failureByFamily.get('parent_training_information_center')?.evidence,
    },
    {
      state: 'new-york',
      state_code: 'NY',
      priority_rank: 6,
      family: 'legal_aid',
      severity: 'major',
      failure_code: 'authored_lsc_target_not_yet_replaced_with_reviewed_new_york_source',
      next_action: 'hold_blocked_until_reviewed_new_york_legal_aid_source_is_verified',
      evidence: failureByFamily.get('legal_aid')?.evidence,
    },
  ];

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    countyDirectoryUrl: countyTarget.source_url,
    educationLeafCount: educationVerified.sample_count,
    vrUrl: vrTarget.source_url,
    paUrl: paTarget.source_url,
    ptiUrl: ptiTarget.source_url,
    legalAidUrl: legalAidTarget.sourceUrl,
  };
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_39_new-york_final_blocker_refresh_v1',
    generated_at: new Date().toISOString(),
    state: 'new-york',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    education_leaf_count: educationVerified.sample_count,
    final_blocker_count: updatedFailureRows.length,
    county_directory_url: countyTarget.source_url,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 39 New York Final Blocker Refresh Report v1',
    '',
    'This pass does not reopen scraping. It converts New York’s stale legacy and discovery-only wording into explicit terminal blockers so the state packet, report, and all-state audit all tell the same truth.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- education_leaf_count: ${educationVerified.sample_count}`,
    `- county_directory_url: ${countyTarget.source_url}`,
    '- New York remains blocked until a live official LDSS county directory or county-owned locator is verified, district-grade education leaves expand beyond the current bounded BOCES set, and statewide support families move from planning-only to reviewed verified evidence.',
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch39NewYorkFinalBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
