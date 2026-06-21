import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'pennsylvania_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'pennsylvania_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'pennsylvania_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'pennsylvania_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'pennsylvania_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'pennsylvania-california-grade-audit-report-v2.md'),
  sourceTargets: path.join(repoRoot, 'data', 'source_targets', 'pennsylvania.json'),
  authoredTargets: path.join(docsGeneratedDir, 'authored-missing-source-targets-2026-06-18.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch42_pennsylvania_final_blocker_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch42-pennsylvania-final-blocker-refresh-report-v1.md'),
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
  const missing = criticalRows.filter((row) => String(row.family_status || '').startsWith('missing')).length;
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
    primary_gap_reason: 'exact_leaf_packet_exhausted_for_iu19_and_no_reviewed_statewide_legal_aid_source',
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
    '# Pennsylvania California-Grade Audit Report v2',
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
    '## Pennsylvania final blocker decision',
    '',
    `- District or county education routing remains blocked because the reviewed exact-leaf packet still stops at ${facts.educationCoveredCount}/${summary.county_count} counties, with Lackawanna County, Susquehanna County, and Wayne County all depending on the same unresolved official Northeastern Educational Intermediate Unit 19 root (${facts.iu19Root}).`,
    `- Legal aid remains blocked because Pennsylvania currently stops at the authored planning target ${facts.legalAidPlannedUrl}; the packet does not yet contain a reviewed Pennsylvania statewide legal-aid source with fetched first-party evidence.`,
    '- Pennsylvania is therefore truthfully final-blocked and not index-safe until an exact IU 19 district-grade education leaf is verified for the remaining three counties and a reviewed statewide legal-aid source is added to the packet.',
  ].join('\n') + '\n';
}

export function generateBatch42PennsylvaniaFinalBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const sourceTargets = readJson(INPUTS.sourceTargets);
  const authoredTargets = readJson(INPUTS.authoredTargets);

  const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  const legalAidTarget = (authoredTargets.targets || authoredTargets.rows || authoredTargets)
    .find((row) => row?.stateId === 'pennsylvania' && row?.gapFamily === 'legal_aid');
  const ptiTarget = sourceTargets.find((row) => row.source_name === 'PEAL Center');
  const paTarget = sourceTargets.find((row) => row.source_name === 'Disability Rights Pennsylvania');

  if (!educationVerified || !legalAidTarget || !ptiTarget || !paTarget) {
    throw new Error('Pennsylvania final blocker refresh requires existing education evidence plus statewide PTI/P&A and legal-aid planning artifacts.');
  }

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        status_reason: 'Official IU and district exact education leaves now cover 64/67 Pennsylvania counties, but the remaining three counties still collapse to one unresolved IU 19 root after the bounded official repair packet was exhausted.',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'missing_verified_source',
        status_reason: `Pennsylvania legal aid currently stops at the authored planning target ${legalAidTarget.sourceUrl}; no reviewed statewide legal-aid source has been verified into the packet.`,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'iu19_root_unresolved_after_bounded_exact_leaf_repair',
        evidence: 'Verified official IU/district exact leaves cover 64/67 counties. Remaining unresolved counties Lackawanna, Susquehanna, and Wayne all depend on the same unresolved Northeastern Educational Intermediate Unit 19 root after bounded official repair.',
        next_action: 'hold_blocked_until_reviewed_iu19_exact_leaf_is_verified',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        failure_code: 'authored_lsc_target_not_yet_replaced_with_reviewed_pennsylvania_source',
        evidence: `Pennsylvania legal-aid planning currently stops at the authored authoritative target ${legalAidTarget.sourceUrl}; no reviewed Pennsylvania statewide legal-aid source has been fetched and verified from saved artifacts.`,
        next_action: 'hold_blocked_until_reviewed_pennsylvania_legal_aid_source_is_verified',
      };
    }
    return row;
  });

  const failureByFamily = new Map(updatedFailureRows.map((row) => [row.family, row]));
  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (failureByFamily.has(row.family)) {
      const failure = failureByFamily.get(row.family);
      return {
        ...row,
        family_status: updatedGapRows.find((gapRow) => gapRow.family === row.family)?.family_status || row.family_status,
        evidence_strength: row.family === 'district_or_county_education_routing' ? 'medium' : 'missing',
        blocker_code: failure.failure_code,
        blocker_evidence: failure.evidence,
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'pennsylvania',
      state_code: 'PA',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'iu19_root_unresolved_after_bounded_exact_leaf_repair',
      next_action: 'hold_blocked_until_reviewed_iu19_exact_leaf_is_verified',
      evidence: failureByFamily.get('district_or_county_education_routing')?.evidence,
    },
    {
      state: 'pennsylvania',
      state_code: 'PA',
      priority_rank: 2,
      family: 'legal_aid',
      severity: 'major',
      failure_code: 'authored_lsc_target_not_yet_replaced_with_reviewed_pennsylvania_source',
      next_action: 'hold_blocked_until_reviewed_pennsylvania_legal_aid_source_is_verified',
      evidence: failureByFamily.get('legal_aid')?.evidence,
    },
  ];

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    educationCoveredCount: 64,
    iu19Root: 'https://www.neiu19.org/',
    legalAidPlannedUrl: legalAidTarget.sourceUrl,
    ptiUrl: ptiTarget.source_url,
    paUrl: paTarget.source_url,
  };
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    state: 'pennsylvania',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    remaining_blockers: updatedNextRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
    })),
    facts,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, updatedReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch42PennsylvaniaFinalBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
