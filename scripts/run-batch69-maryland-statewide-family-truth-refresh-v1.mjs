import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maryland_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maryland_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'maryland_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maryland_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'maryland_next_action_queue_v2.jsonl'),
  ppmdHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-13-847Z', 'pages', '00006-maryland-nonprofit-support-ppmd-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch69_maryland_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch69-maryland-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maryland-california-grade-audit-report-v2.md'),
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
        query_basis: 'Reviewed first-party Parents’ Place of Maryland evidence on disk proves real statewide Maryland parent-support, special-education information, contact routing, and training scope, but the saved artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        blocker_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        blocker_evidence: 'The reviewed Parents’ Place of Maryland artifact preserves Maryland statewide support and special-education information-center language plus direct contact evidence, but not explicit PTI / Parent Training and Information Center designation text.',
        samples: [
          {
            sample_name: "Parents' Place of Maryland",
            source_url: 'https://www.ppmd.org/',
            final_url: 'https://www.ppmd.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:20.000Z',
            evidence_snippet: 'Parents’ Place of Maryland - Maryland’s Special Education and Health Information Center. The Parents’ Place of Maryland. 802 Cromwell Park Drive, Suite H, Glen Burnie, MD 21061. phone | 1.800.394.5694 or 410.768.9100. PPMD information, resources, and trainings can be made available in languages other than English, including sign language upon request.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Maryland California-Grade Batch 69 Report v1',
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
    '- Maryland no longer belongs in UNSTARTED. The packet already has enough reviewed on-disk evidence to identify the real final blockers without pretending the state is closer to California-grade than the evidence supports.',
    "- Parents' Place of Maryland is preserved as real reviewed statewide support evidence because the first-party page explicitly calls itself Maryland’s Special Education and Health Information Center, preserves direct Maryland contact routing, and preserves statewide information, resources, and trainings language.",
    '- That reviewed Parents’ Place artifact still does not preserve explicit PTI / Parent Training and Information Center designation text, so PTI remains blocked rather than being upgraded by assumption.',
    '- Maryland still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on generic statewide or structural sources instead of reviewed county-owned local routing, and reviewed first-party statewide Protection and Advocacy plus legal-aid proof is still missing on disk.',
    '- Maryland is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch69MarylandStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const ppmdHtml = readText(INPUTS.ppmdHtml);
  assertIncludes(ppmdHtml, 'Maryland’s Special Education and Health Information Center', 'Parents’ Place of Maryland artifact');
  assertIncludes(ppmdHtml, '802 Cromwell Park Drive', 'Parents’ Place of Maryland artifact');
  assertIncludes(ppmdHtml, '1.800.394.5694', 'Parents’ Place of Maryland artifact');
  assertIncludes(ppmdHtml, 'PPMD\'s information, resources, and trainings can be made available', 'Parents’ Place of Maryland artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        status_reason: 'reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: 'Reviewed Parents’ Place of Maryland evidence preserves Maryland statewide support, special-education information-center language, and direct contact routing, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
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
        evidence: 'Reviewed Parents’ Place of Maryland evidence preserves Maryland statewide support and training scope, but the saved first-party artifact does not preserve explicit PTI designation text.',
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
        evidence: 'Reviewed Maryland packet evidence still routes district or county education through generic statewide Maryland special-education pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Maryland still lacks reviewed first-party or authoritative statewide protection-and-advocacy evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: 'Reviewed Parents’ Place of Maryland evidence proves Maryland statewide support and special-education information-center scope, but the saved first-party artifact does not preserve explicit PTI designation text.',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Maryland still lacks reviewed first-party or authoritative statewide legal-aid evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
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
    batch: 'batch_69_maryland_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'maryland',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'parent_training_information_center',
    ],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      ppmd: {
        sourceUrl: 'https://www.ppmd.org/',
        finalUrl: 'https://www.ppmd.org/',
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
    '# Maryland Statewide Family Truth Refresh Summary v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- ppmd: ${batchSummary.evidence_checks.ppmd.sourceUrl} -> ${batchSummary.evidence_checks.ppmd.finalUrl}`,
    '',
    '## Decision',
    '',
    '- Parents’ Place of Maryland was clarified into a reviewed-first-party PTI blocker rather than left as vague inventory-only evidence.',
    '- Maryland remains terminal BLOCKED because district routing, county-local routing, protection and advocacy, and legal aid are still unresolved.',
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
  const result = generateBatch69MarylandStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
