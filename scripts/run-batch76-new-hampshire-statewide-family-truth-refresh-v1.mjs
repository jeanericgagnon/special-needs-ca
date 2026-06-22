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
  picHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-49-018Z', 'pages', '00006-new-hampshire-nonprofit-support-picnh-org.html'),
  picPtiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-04-17-699Z', 'pages', '00024-new-hampshire-nonprofit-support-parent-information-center-pic-pti.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch76_new_hampshire_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch76-new-hampshire-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-hampshire-california-grade-audit-report-v2.md'),
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

function updatedVerifiedRow(row) {
  if (row.family === 'parent_training_information_center') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      blocker_code: null,
      blocker_evidence: null,
      query_basis: 'Reviewed first-party PICNH evidence on disk explicitly preserves New Hampshire parent-information-center identity, special-education help, direct contact routing, and Department of Education support.',
      samples: [
        {
          sample_name: 'Parent Information Center of NH',
          source_url: 'https://picnh.org/',
          final_url: 'https://picnh.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-20T00:45:53.000Z',
          evidence_snippet: 'Parent Information Center of NH supports families of children with disabilities and special health care needs, offers special-education help by email or phone, and the Parent Information Center on Special Education is funded in part or whole by the U.S. Department of Education.',
        },
      ],
    };
  }
  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Hampshire California-Grade Batch 76 Report v1',
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
    '- New Hampshire no longer belongs in UNSTARTED because the packet already preserves reviewed first-party PTI evidence on disk instead of only legacy inventory hints.',
    '- PICNH is preserved as strong statewide PTI-style support because the saved first-party pages explicitly preserve Parent Information Center identity, special-education support language, direct contact routing, and Department of Education funding support.',
    '- New Hampshire still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages, county/local disability resources still depend on non-county-owned structural sources, statewide P&A proof is still missing on disk, statewide legal-aid proof is still missing on disk, and vocational rehabilitation remains inventory-only.',
    '- New Hampshire is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch76NewHampshireStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const picHtml = readText(INPUTS.picHtml);
  assertIncludes(picHtml, 'Home - Parent Information Center of NH', 'PICNH artifact');
  assertIncludes(picHtml, 'Supporting families of children with disabilities and special health care needs', 'PICNH artifact');
  assertIncludes(picHtml, 'Our staff can be reached by email or phone.', 'PICNH artifact');
  assertIncludes(picHtml, 'Resources and information to help navigate the NH special education process', 'PICNH artifact');

  const picPtiHtml = readText(INPUTS.picPtiHtml);
  assertIncludes(picPtiHtml, 'The Parent Information Center on Special Education is funded, in part or whole, by the U.S. Department of Education', 'PICNH PTI artifact');
  assertIncludes(picPtiHtml, '54 Old Suncook Road', 'PICNH PTI artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Parent Information Center of NH evidence preserves statewide parent-center identity, special-education support, and Department of Education funding',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'parent_training_information_center');
  const updatedNextRows = nextRows.filter((row) => row.family !== 'parent_training_information_center')
    .sort((a, b) => a.priority_rank - b.priority_rank);
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 58,
    strong_critical_families: 7,
    weak_critical_families: 3,
    missing_critical_families: 2,
    major_gap_families: [
      'vocational_rehabilitation_pre_ets',
      'protection_and_advocacy',
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
        evidence: 'New Hampshire still routes district or county education through generic statewide Department of Education pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'vocational_rehabilitation_pre_ets',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'New Hampshire still lacks reviewed first-party VR or Pre-ETS artifact evidence on disk and currently depends on inventory-only program hints.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'New Hampshire still lacks reviewed first-party or authoritative statewide protection-and-advocacy evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'New Hampshire still lacks reviewed first-party or authoritative statewide legal-aid evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'New Hampshire county/local disability resources still depend on structural dataset-derived rows instead of reviewed county-owned local routing evidence.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch76_new_hampshire_statewide_family_truth_refresh_v1',
    state: 'new-hampshire',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['parent_training_information_center'],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    summary: updatedSummary,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch76NewHampshireStatewideFamilyTruthRefreshV1();
}
