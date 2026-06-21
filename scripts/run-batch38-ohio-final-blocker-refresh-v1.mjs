import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'ohio_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'ohio_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'ohio_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'ohio_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'ohio_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'ohio-california-grade-audit-report-v2.md'),
  districtPacket: path.join(generatedDir, 'ohio_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'ohio_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  sourceTargets: path.join(repoRoot, 'data', 'source_targets', 'ohio.json'),
  authoredTargets: path.join(docsGeneratedDir, 'authored-missing-source-targets-2026-06-17.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch38_ohio_final_blocker_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch38-ohio-final-blocker-refresh-report-v1.md'),
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
    primary_gap_reason: 'official_county_directory_targets_unresolved_after_bounded_live_check',
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
    '# Ohio California-Grade Audit Report v2',
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
    '## Ohio final blocker decision',
    '',
    `- County-local disability resources remain blocked because the bounded live Ohio JFS county-directory roots all failed or returned 404, and the remaining fallback packet evidence is only a DOI-hosted dataset mirror (${facts.countyDatasetUrl}), not live official county-grade office proof.`,
    `- District or county education routing remains blocked because only ${facts.educationLeafCount} reviewed ESC-owned exact leaves across ${facts.educationRootCount} bounded Ohio packet roots have been verified; that is not enough to truthfully prove district-grade routing across all ${summary.county_count} Ohio counties without reopening broader district authoring.`,
    `- Vocational rehabilitation / Pre-ETS remains below California-grade because the repo currently has only a planning target for Opportunities for Ohioans with Disabilities (${facts.oodUrl}), not a reviewed verified-source row in the packet evidence chain.`,
    `- Protection and advocacy remains below California-grade because the repo currently has only the planning target for Disability Rights Ohio (${facts.paUrl}), not reviewed packet-grade evidence.`,
    `- Parent training information center remains below California-grade because the repo currently has only the planning target for OCECD (${facts.ptiUrl}), not reviewed packet-grade evidence.`,
    `- Legal aid remains below California-grade because the repo currently stops at an authored LSC planning target (${facts.legalAidUrl}), not a reviewed Ohio legal-aid source.`,
    '- Ohio is therefore truthfully final-blocked and not index-safe until new exact official county-office or district leaf targets are authored and the statewide support families are upgraded from planning-only to reviewed verified evidence.',
  ].join('\n') + '\n';
}

export function generateBatch38OhioFinalBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const districtPacket = readJson(INPUTS.districtPacket);
  const countyPacket = readJson(INPUTS.countyPacket);
  const sourceTargets = readJson(INPUTS.sourceTargets);
  const authoredTargets = readJson(INPUTS.authoredTargets);

  const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
  const oodTarget = sourceTargets.find((row) => row.source_name === 'Opportunities for Ohioans with Disabilities (OOD)');
  const ptiTarget = sourceTargets.find((row) => row.source_name === 'Ohio Coalition for the Education of Children with Disabilities (OCECD)');
  const paTarget = sourceTargets.find((row) => row.source_name === 'Disability Rights Ohio');
  const authoredRows = authoredTargets.targets || authoredTargets.rows || authoredTargets;
  const legalAidTarget = authoredRows.find((row) => row?.stateId === 'ohio' && row?.gapFamily === 'legal_aid');

  if (!districtVerified || !countyVerified || !oodTarget || !ptiTarget || !paTarget || !legalAidTarget) {
    throw new Error('Ohio final blocker refresh requires district/county packet evidence plus statewide support planning targets.');
  }

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        status_reason: `Reviewed ESC-owned education exact leaves verified (${districtVerified.sample_count}) across ${districtPacket.root_domains_to_review.length} bounded Ohio packet roots, but district-grade coverage still cannot be proven for all ${summary.county_count} counties from the authored exact targets.`,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_missing_live_official_county_directory',
        status_reason: 'Bounded live Ohio JFS county-directory roots all failed or returned 404, and the remaining DOI-hosted dataset mirror is planning evidence only rather than live official county-grade office proof.',
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'planning_target_only',
        status_reason: `Only the planning target ${oodTarget.source_url} is present; no reviewed verified OOD leaf has been fetched into the packet evidence chain.`,
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'missing_verified_source',
        status_reason: `Only the planning target ${paTarget.source_url} is present; no reviewed verified Disability Rights Ohio source is attached to the packet.`,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'planning_target_only',
        status_reason: `Only the planning target ${ptiTarget.source_url} is present; no reviewed verified OCECD source is attached to the packet.`,
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'missing_verified_source',
        status_reason: `Only the authored LSC planning target ${legalAidTarget.sourceUrl} is present; no reviewed Ohio legal-aid source has been verified into the packet.`,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'bounded_esc_leaf_packet_exhausted_before_county_grade_coverage',
        evidence: `Verified exact leaves remain limited to ${districtVerified.sample_count} reviewed ESC-owned pages across ${districtPacket.root_domains_to_review.length} bounded Ohio packet roots (${districtPacket.root_domains_to_review.map((entry) => entry.source_domain).join(', ')}); this does not truthfully prove district-grade routing statewide.`,
        next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'official_county_directory_failed_and_only_non_official_dataset_remains',
        evidence: `Bounded live Ohio JFS county-directory targets failed or returned 404, and the only remaining county-local packet root is the non-official DOI dataset ${countyPacket.root_domains_to_review[0]?.source_root || 'unknown'}.`,
        next_action: 'hold_blocked_until_live_official_county_directory_or_locator_is_verified',
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        failure_code: 'official_ood_target_not_yet_reviewed_verified',
        evidence: `Planning target ${oodTarget.source_url} exists, but no reviewed verified OOD leaf has been fetched into the packet evidence chain.`,
        next_action: 'hold_blocked_until_reviewed_ood_leaf_is_verified',
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        failure_code: 'reviewed_disability_rights_ohio_source_missing',
        evidence: `Planning target ${paTarget.source_url} exists, but no reviewed verified Disability Rights Ohio source is attached to the packet.`,
        next_action: 'hold_blocked_until_reviewed_disability_rights_ohio_source_is_verified',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'reviewed_ocecd_source_missing',
        evidence: `Planning target ${ptiTarget.source_url} exists, but no reviewed verified OCECD source is attached to the packet.`,
        next_action: 'hold_blocked_until_reviewed_ocecd_source_is_verified',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        failure_code: 'authored_lsc_target_not_yet_replaced_with_reviewed_ohio_source',
        evidence: `Ohio legal-aid planning currently stops at the authored authoritative target ${legalAidTarget.sourceUrl}; no reviewed Ohio legal-aid evidence has been fetched and verified from saved artifacts.`,
        next_action: 'hold_blocked_until_reviewed_ohio_legal_aid_source_is_verified',
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
        evidence_strength: row.sample_count > 0 ? 'weak' : 'missing',
        blocker_code: failure.failure_code,
        blocker_evidence: failure.evidence,
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'ohio',
      state_code: 'OH',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'official_county_directory_failed_and_only_non_official_dataset_remains',
      next_action: 'hold_blocked_until_live_official_county_directory_or_locator_is_verified',
      evidence: failureByFamily.get('county_local_disability_resources')?.evidence,
    },
    {
      state: 'ohio',
      state_code: 'OH',
      priority_rank: 2,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'bounded_esc_leaf_packet_exhausted_before_county_grade_coverage',
      next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      evidence: failureByFamily.get('district_or_county_education_routing')?.evidence,
    },
    {
      state: 'ohio',
      state_code: 'OH',
      priority_rank: 3,
      family: 'vocational_rehabilitation_pre_ets',
      severity: 'major',
      failure_code: 'official_ood_target_not_yet_reviewed_verified',
      next_action: 'hold_blocked_until_reviewed_ood_leaf_is_verified',
      evidence: failureByFamily.get('vocational_rehabilitation_pre_ets')?.evidence,
    },
    {
      state: 'ohio',
      state_code: 'OH',
      priority_rank: 4,
      family: 'protection_and_advocacy',
      severity: 'major',
      failure_code: 'reviewed_disability_rights_ohio_source_missing',
      next_action: 'hold_blocked_until_reviewed_disability_rights_ohio_source_is_verified',
      evidence: failureByFamily.get('protection_and_advocacy')?.evidence,
    },
    {
      state: 'ohio',
      state_code: 'OH',
      priority_rank: 5,
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_ocecd_source_missing',
      next_action: 'hold_blocked_until_reviewed_ocecd_source_is_verified',
      evidence: failureByFamily.get('parent_training_information_center')?.evidence,
    },
    {
      state: 'ohio',
      state_code: 'OH',
      priority_rank: 6,
      family: 'legal_aid',
      severity: 'major',
      failure_code: 'authored_lsc_target_not_yet_replaced_with_reviewed_ohio_source',
      next_action: 'hold_blocked_until_reviewed_ohio_legal_aid_source_is_verified',
      evidence: failureByFamily.get('legal_aid')?.evidence,
    },
  ];

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    countyDatasetUrl: countyPacket.root_domains_to_review[0]?.source_root || 'unknown',
    educationLeafCount: districtVerified.sample_count,
    educationRootCount: districtPacket.root_domains_to_review.length,
    oodUrl: oodTarget.source_url,
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
    batch: 'batch_38_ohio_final_blocker_refresh_v1',
    generated_at: new Date().toISOString(),
    state: 'ohio',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    education_leaf_count: districtVerified.sample_count,
    education_root_count: districtPacket.root_domains_to_review.length,
    county_local_root_count: countyPacket.root_domains_to_review.length,
    final_blocker_count: updatedFailureRows.length,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 38 Ohio Final Blocker Refresh Report v1',
    '',
    'This pass does not reopen scraping. It converts Ohio’s stale legacy and planning-only packet wording into explicit terminal blockers so the state packet, report, and all-state audit can tell the same truth.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- education_leaf_count: ${districtVerified.sample_count}`,
    `- education_root_count: ${districtPacket.root_domains_to_review.length}`,
    `- county_local_root_count: ${countyPacket.root_domains_to_review.length}`,
    `- county_local_packet_root: ${countyPacket.root_domains_to_review[0]?.source_root || 'unknown'}`,
    '- Ohio remains blocked until new exact district targets are authored and a live official Ohio county-office directory or county-owned locator is verified.',
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch38OhioFinalBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
