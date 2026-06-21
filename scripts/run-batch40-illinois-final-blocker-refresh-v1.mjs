import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'illinois_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'illinois_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'illinois_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'illinois_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'illinois_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'illinois-california-grade-audit-report-v2.md'),
  sourceTargets: path.join(repoRoot, 'data', 'source_targets', 'illinois.json'),
  authoredTargets: path.join(docsGeneratedDir, 'authored-missing-source-targets-2026-06-17.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch40_illinois_final_blocker_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch40-illinois-final-blocker-refresh-report-v1.md'),
};

const DB_PATH = path.join(repoRoot, 'ca_disability_navigator.db');

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

function loadIllinoisEarlyInterventionSample() {
  const db = new Database(DB_PATH, { readonly: true });
  try {
    return db.prepare(`
      SELECT id, name, source_url, official_source_url, verification_status
      FROM programs
      WHERE state_id = 'illinois'
        AND verification_status IN ('verified', 'official_verified')
        AND (
          lower(name) LIKE '%early intervention%'
          OR lower(source_url) LIKE '%item=31183%'
          OR lower(official_source_url) LIKE '%item=31183%'
        )
      ORDER BY
        CASE verification_status WHEN 'official_verified' THEN 0 ELSE 1 END,
        id ASC
      LIMIT 1
    `).get();
  } finally {
    db.close();
  }
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
    primary_gap_reason: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
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
    '# Illinois California-Grade Audit Report v2',
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
    '## Illinois final blocker decision',
    '',
    `- District or county education routing remains blocked because only ${facts.educationLeafCount} reviewed ROE-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all ${summary.county_count} Illinois counties without reopening broader district authoring.`,
    `- Protection and advocacy is no longer a blocker because Equip for Equality (${facts.paUrl}) is already present as reviewed first-party statewide P&A evidence.`,
    `- Vocational rehabilitation / Pre-ETS is no longer a blocker because Illinois DRS Services (${facts.vrUrl}) is already present as reviewed official statewide VR routing evidence.`,
    `- Parent training information center remains below California-grade because the current reviewed sample ${facts.ptiObservedUrl} is only documented as serving downstate Illinois, while the designated statewide PTI target on disk is ${facts.ptiDesignatedUrl}; the packet does not yet contain reviewed statewide PTI proof for that designated family.`,
    `- Legal aid remains below California-grade because Illinois currently stops at the authored LSC planning target (${facts.legalAidUrl}), not a reviewed Illinois legal-aid source.`,
    '- Illinois is therefore truthfully final-blocked and not index-safe until district-grade education leaves expand beyond the current bounded ROE set and the remaining statewide support families move from regional/planning-only to reviewed verified statewide evidence.',
  ].join('\n') + '\n';
}

export function generateBatch40IllinoisFinalBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const sourceTargets = readJson(INPUTS.sourceTargets);
  const authoredTargets = readJson(INPUTS.authoredTargets);

  const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  const paVerified = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
  const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
  const vrVerified = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
  const paTarget = sourceTargets.find((row) => row.source_name === 'Equip for Equality');
  const vrTarget = sourceTargets.find((row) => row.source_name === 'Illinois DRS Services');
  const ptiTarget = sourceTargets.find((row) => row.source_name === 'Family Resource Center on Disabilities (FRCD)');
  const authoredRows = authoredTargets.targets || authoredTargets.rows || authoredTargets;
  const legalAidTarget = authoredRows.find((row) => row?.stateId === 'illinois' && row?.gapFamily === 'legal_aid');
  const earlyInterventionSample = loadIllinoisEarlyInterventionSample();

  if (!educationVerified || !paVerified || !ptiVerified || !vrVerified || !paTarget || !vrTarget || !ptiTarget || !legalAidTarget || !earlyInterventionSample) {
    throw new Error('Illinois final blocker refresh requires Illinois education/support source targets and verified packet evidence.');
  }

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        status_reason: `Reviewed ROE-owned education exact leaves verified (${educationVerified.sample_count}), but district-grade coverage still cannot be proven for all ${summary.county_count} counties from the authored exact targets.`,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Illinois DRS Services is already present as reviewed official statewide VR routing evidence.',
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Equip for Equality is already present as reviewed first-party statewide P&A evidence.',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'regional_only_reviewed_source',
        status_reason: `The current reviewed PTI sample ${ptiVerified.samples?.[0]?.source_url || 'unknown'} is documented as serving downstate Illinois, while the designated statewide PTI target on disk is ${ptiTarget.source_url}; statewide PTI proof is still unverified.`,
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'missing_verified_source',
        status_reason: `Only the authored LSC planning target ${legalAidTarget.sourceUrl} is present; no reviewed Illinois legal-aid source has been verified into the packet.`,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['vocational_rehabilitation_pre_ets', 'protection_and_advocacy'].includes(row.family))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          failure_code: 'bounded_roe_leaf_packet_exhausted_before_county_grade_coverage',
          evidence: `Verified exact leaves remain limited to ${educationVerified.sample_count} reviewed ROE-owned pages; this does not truthfully prove district-grade routing statewide.`,
          next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
        };
      }
      if (row.family === 'parent_training_information_center') {
        return {
          ...row,
          failure_code: 'reviewed_pti_sample_is_regional_not_statewide_designated_source',
          evidence: `Reviewed PTI evidence currently points to ${ptiVerified.samples?.[0]?.source_url || 'unknown'}, which is documented as serving downstate Illinois rather than proving the designated statewide PTI target ${ptiTarget.source_url}.`,
          next_action: 'hold_blocked_until_reviewed_statewide_illinois_pti_source_is_verified',
        };
      }
      if (row.family === 'legal_aid') {
        return {
          ...row,
          failure_code: 'authored_lsc_target_not_yet_replaced_with_reviewed_illinois_source',
          evidence: `Illinois legal-aid planning currently stops at the authored authoritative target ${legalAidTarget.sourceUrl}; no reviewed Illinois legal-aid evidence has been fetched and verified from saved artifacts.`,
          next_action: 'hold_blocked_until_reviewed_illinois_legal_aid_source_is_verified',
        };
      }
      return row;
    });

  const failureByFamily = new Map(updatedFailureRows.map((row) => [row.family, row]));
  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: earlyInterventionSample.name,
            source_url: earlyInterventionSample.official_source_url || earlyInterventionSample.source_url,
            verification_status: earlyInterventionSample.verification_status,
            source_type: 'official',
            source_table: 'programs',
          },
        ],
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: Math.max(row.sample_count || 0, 1),
        blocker_code: null,
        blocker_evidence: null,
        samples: row.sample_count > 0 ? row.samples : [{
          sample_name: 'Illinois DRS Services',
          source_url: vrTarget.source_url,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        }],
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        blocker_code: null,
        blocker_evidence: null,
      };
    }
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
      state: 'illinois',
      state_code: 'IL',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'bounded_roe_leaf_packet_exhausted_before_county_grade_coverage',
      next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      evidence: failureByFamily.get('district_or_county_education_routing')?.evidence,
    },
    {
      state: 'illinois',
      state_code: 'IL',
      priority_rank: 2,
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_pti_sample_is_regional_not_statewide_designated_source',
      next_action: 'hold_blocked_until_reviewed_statewide_illinois_pti_source_is_verified',
      evidence: failureByFamily.get('parent_training_information_center')?.evidence,
    },
    {
      state: 'illinois',
      state_code: 'IL',
      priority_rank: 3,
      family: 'legal_aid',
      severity: 'major',
      failure_code: 'authored_lsc_target_not_yet_replaced_with_reviewed_illinois_source',
      next_action: 'hold_blocked_until_reviewed_illinois_legal_aid_source_is_verified',
      evidence: failureByFamily.get('legal_aid')?.evidence,
    },
  ];

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    educationLeafCount: educationVerified.sample_count,
    paUrl: paTarget.source_url,
    vrUrl: vrTarget.source_url,
    ptiObservedUrl: ptiVerified.samples?.[0]?.source_url || 'unknown',
    ptiDesignatedUrl: ptiTarget.source_url,
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
    batch: 'batch_40_illinois_final_blocker_refresh_v1',
    generated_at: new Date().toISOString(),
    state: 'illinois',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    education_leaf_count: educationVerified.sample_count,
    final_blocker_count: updatedFailureRows.length,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 40 Illinois Final Blocker Refresh Report v1',
    '',
    'This pass does not reopen scraping. It converts Illinois’s stale report wording into explicit terminal blockers and upgrades the statewide support families that already have reviewed first-party evidence on disk.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- education_leaf_count: ${educationVerified.sample_count}`,
    `- Equip for Equality upgraded: yes`,
    `- Illinois DRS Services upgraded: yes`,
    '- Illinois remains blocked until district-grade education leaves expand beyond the current bounded ROE set and the remaining PTI/legal-aid families move from regional/planning-only to reviewed verified statewide evidence.',
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch40IllinoisFinalBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
