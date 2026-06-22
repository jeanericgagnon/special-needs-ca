import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'minnesota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'minnesota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'minnesota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'minnesota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'minnesota_next_action_queue_v2.jsonl'),
  pacerHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-00-641Z', 'pages', '00005-minnesota-nonprofit-support-pacer-org.html'),
  mndlcHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-00-641Z', 'pages', '00002-minnesota-nonprofit-support-mndlc-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch72_minnesota_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch72-minnesota-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

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

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(text, pattern, label) {
  if (!text.includes(pattern)) {
    throw new Error(`Expected ${label} to include "${pattern}".`);
  }
}

function buildVerifiedRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        evidence_strength: 'weak',
        sample_count: 1,
        query_basis: 'Reviewed first-party PACER Center evidence on disk proves real Minnesota family-support and special-education guidance scope, but the saved artifact does not preserve explicit PTI / Parent Training and Information Center designation text.',
        blocker_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        blocker_evidence: 'The reviewed PACER Center artifact preserves Minnesota family-support language, special-education guidance, and direct advocate/help routing, but not explicit PTI / Parent Training and Information Center designation text.',
        samples: [
          {
            sample_name: 'PACER Center',
            source_url: 'https://www.pacer.org/',
            final_url: 'https://www.pacer.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:06.000Z',
            evidence_snippet: 'PACER Center - Champions for Children with Disabilities. A trusted source of information, training, and support for families of children with disabilities. Are you a Minnesota family seeking advice or support for your child with a disability? Ask an advocate.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'missing',
        evidence_strength: 'missing',
        sample_count: 0,
        query_basis: 'The inherited Minnesota legal-aid sample chain was demoted after reviewed first-party inspection showed only a Page not found shell for Mid-Minnesota Legal Aid rather than a live role-aligned statewide legal-aid leaf.',
        blocker_code: 'reviewed_first_party_404_shell_not_role_aligned',
        blocker_evidence: 'The reviewed Mid-Minnesota Legal Aid fetch is a Page not found shell that preserves site chrome, contact information, and navigation to MN Disability Law Center, but not a live role-aligned statewide legal-aid leaf.',
        samples: [],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Minnesota California-Grade Batch 72 Report v1',
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
    '- Minnesota no longer belongs in UNSTARTED. The packet already has enough reviewed on-disk evidence to terminalize the real blockers without pretending the state is closer to California-grade than the evidence supports.',
    '- PACER Center is preserved as real reviewed statewide family-support evidence because the first-party page explicitly preserves Minnesota family-support language, special-education guidance, and direct ask-an-advocate routing.',
    '- That reviewed PACER artifact still does not preserve explicit PTI / Parent Training and Information Center designation text, so PTI remains blocked rather than being upgraded by assumption.',
    '- The inherited Minnesota Disability Law Center / Mid-Minnesota Legal Aid sample chain was demoted because the reviewed first-party fetch is a Page not found shell, not a live role-aligned statewide legal-aid or protection-and-advocacy leaf.',
    '- Minnesota still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on generic statewide or structural sources instead of reviewed county-owned local routing, and reviewed first-party statewide Protection and Advocacy plus legal-aid proof is still missing on disk.',
    '- Minnesota is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch72MinnesotaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const pacerHtml = readText(INPUTS.pacerHtml);
  const mndlcHtml = readText(INPUTS.mndlcHtml);
  assertIncludes(pacerHtml, 'PACER Center - Champions for Children with Disabilities', 'PACER artifact');
  assertIncludes(pacerHtml, 'A trusted source of information, training, and support for families of children with disabilities.', 'PACER artifact');
  assertIncludes(pacerHtml, 'Are you a Minnesota family seeking advice or support for your child with a disability?', 'PACER artifact');
  assertIncludes(pacerHtml, 'Ask an advocate', 'PACER artifact');
  assertIncludes(mndlcHtml, 'Page not found - Mid-Minnesota Legal Aid', 'Mid-Minnesota Legal Aid artifact');
  assertIncludes(mndlcHtml, 'MN Disability Law Center:', 'Mid-Minnesota Legal Aid artifact');
  assertIncludes(mndlcHtml, 'Get Help', 'Mid-Minnesota Legal Aid artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        status_reason: 'reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'missing',
        status_reason: 'reviewed first-party Mid-Minnesota Legal Aid evidence is only a Page not found shell and does not preserve a live role-aligned statewide legal-aid leaf',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: 'Reviewed PACER Center evidence preserves Minnesota family-support language, special-education guidance, and direct advocate/help routing, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_404_shell_not_role_aligned',
        evidence: 'The reviewed Mid-Minnesota Legal Aid fetch is a Page not found shell with site chrome and contact/navigation text, not a live role-aligned statewide legal-aid leaf.',
        next_action: 'hold_blocked_until_live_role_aligned_first_party_legal_aid_leaf_is_reviewed',
      };
    }
    return row;
  });

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
        evidence: 'Reviewed PACER Center evidence preserves Minnesota family-support and direct advocate/help routing, but the saved first-party artifact does not preserve explicit PTI designation text.',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_404_shell_not_role_aligned',
        next_action: 'hold_blocked_until_live_role_aligned_first_party_legal_aid_leaf_is_reviewed',
        evidence: 'The reviewed Mid-Minnesota Legal Aid fetch is a Page not found shell rather than a live role-aligned statewide legal-aid leaf.',
      };
    }
    return row;
  }).sort((a, b) => a.priority_rank - b.priority_rank);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 58,
    strong_critical_families: 7,
    weak_critical_families: 3,
    missing_critical_families: 2,
    major_gap_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
    ],
    verified_source_families_with_samples: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
      'parent_training_information_center',
      'able_program',
      'ssi_ssa_federal_reference',
      'county_local_disability_resources',
    ],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Reviewed Minnesota packet evidence still routes district or county education through generic statewide Minnesota special-education pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Minnesota still lacks reviewed first-party or authoritative statewide protection-and-advocacy evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: 'Reviewed PACER Center evidence proves Minnesota statewide family support and special-education guidance scope, but the saved first-party artifact does not preserve explicit PTI designation text.',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'reviewed_first_party_404_shell_not_role_aligned',
        evidence: 'The reviewed Mid-Minnesota Legal Aid fetch is a Page not found shell and cannot stand in for live statewide legal-aid proof.',
        next_action: 'hold_blocked_until_live_role_aligned_first_party_legal_aid_leaf_is_reviewed',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County/local disability resources still depend on generic statewide location pages or structural dataset-derived rows instead of reviewed county-owned local routing evidence.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch_72_minnesota_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'parent_training_information_center',
      'legal_aid',
    ],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      pacer: {
        sourceUrl: 'https://www.pacer.org/',
        finalUrl: 'https://www.pacer.org/',
      },
      mndlc: {
        sourceUrl: 'http://www.mndlc.org',
        finalUrl: 'https://mylegalaid.org/',
      },
    },
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.mkdirSync(path.dirname(OUTPUTS.report), { recursive: true });
  fs.writeFileSync(OUTPUTS.report, [
    '# Minnesota Statewide Family Truth Refresh Summary v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- pacer: ${batchSummary.evidence_checks.pacer.sourceUrl} -> ${batchSummary.evidence_checks.pacer.finalUrl}`,
    `- mndlc: ${batchSummary.evidence_checks.mndlc.sourceUrl} -> ${batchSummary.evidence_checks.mndlc.finalUrl}`,
    '',
    '## Decision',
    '',
    '- PACER Center was preserved as reviewed statewide support evidence but remained blocked for PTI because the saved artifact does not preserve explicit PTI designation text.',
    '- The stale Mid-Minnesota Legal Aid / Minnesota Disability Law Center sample chain was demoted because the reviewed first-party fetch is only a Page not found shell.',
    '- Minnesota remains terminal BLOCKED because district routing, county-local routing, statewide protection-and-advocacy proof, explicit PTI designation, and live statewide legal-aid proof are still unresolved.',
    '',
  ].join('\n'));
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    updatedFamilies: batchSummary.updated_families,
    remainingBlockers: batchSummary.remaining_blockers,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch72MinnesotaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
