import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nevada_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nevada_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'nevada_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nevada_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'nevada_next_action_queue_v2.jsonl'),
  ndalcHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-23-447Z', 'pages', '00008-nevada-nonprofit-support-ndalc-org.html'),
  nvpepHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-23-447Z', 'pages', '00009-nevada-nonprofit-support-nvpep-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch75_nevada_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch75-nevada-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nevada-california-grade-audit-report-v2.md'),
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
  if (row.family === 'protection_and_advocacy') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      blocker_code: null,
      blocker_evidence: null,
      query_basis: 'Reviewed first-party NDALC evidence on disk explicitly identifies the organization as Nevada’s federally mandated protection and advocacy system.',
      samples: [
        {
          sample_name: 'Nevada Disability Advocacy and Law Center',
          source_url: 'https://ndalc.org/',
          final_url: 'https://ndalc.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-20T00:45:28.000Z',
          evidence_snippet: 'NDALC is the federally mandated protection and advocacy system for Nevada and serves human, legal, and service rights for individuals with disabilities.',
        },
      ],
    };
  }

  if (row.family === 'parent_training_information_center') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      blocker_code: null,
      blocker_evidence: null,
      query_basis: 'Reviewed first-party Nevada PEP evidence on disk preserves statewide family training and support language, statewide contact routing, and U.S. Department of Education support.',
      samples: [
        {
          sample_name: 'Nevada PEP',
          source_url: 'https://nvpep.org/',
          final_url: 'https://nvpep.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-20T00:45:31.000Z',
          evidence_snippet: 'Nevada PEP will be a long-term, reliable statewide resource for families by providing information, support, and training programs. Statewide: 1-800-216-5188. Programs and Services offered by Nevada PEP are supported in part by the U.S. Department of Education.',
        },
      ],
    };
  }

  if (row.family === 'legal_aid') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      blocker_code: null,
      blocker_evidence: null,
      query_basis: 'Reviewed first-party NDALC evidence on disk explicitly preserves statewide disability legal-rights routing through the Nevada Disability Advocacy and Law Center.',
      samples: [
        {
          sample_name: 'Nevada Disability Advocacy and Law Center',
          source_url: 'https://ndalc.org/',
          final_url: 'https://ndalc.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-20T00:45:28.000Z',
          evidence_snippet: 'Nevada Disability Advocacy and Law Center serves human, legal, and service rights for individuals with disabilities and is the federally mandated protection and advocacy system for Nevada.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Nevada California-Grade Batch 75 Report v1',
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
    '- Nevada no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide evidence for protection and advocacy, parent-training support, and disability legal-rights routing.',
    '- NDALC is preserved as strong statewide proof because the saved first-party page explicitly says it is Nevada’s federally mandated protection and advocacy system and preserves disability legal-rights language.',
    '- Nevada PEP is preserved as strong statewide PTI-style support because the saved first-party page preserves statewide family information, support, training, and statewide contact routing plus Department of Education support.',
    '- Nevada still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, and county/local disability resources still depend on statewide locator or structural sources rather than reviewed county-owned local routing.',
    '- Nevada is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch75NevadaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const ndalcHtml = readText(INPUTS.ndalcHtml);
  assertIncludes(ndalcHtml, 'Home - Nevada Disability Advocacy and Law Center (NDALC)', 'NDALC artifact');
  assertIncludes(ndalcHtml, 'federally-mandated protection and advocacy system', 'NDALC artifact');
  assertIncludes(ndalcHtml, 'human, legal, and service rights for individuals with disabilities', 'NDALC artifact');
  assertIncludes(ndalcHtml, 'federally mandated protection and advocacy system for Nevada', 'NDALC artifact');

  const nvpepHtml = readText(INPUTS.nvpepHtml);
  assertIncludes(nvpepHtml, 'Nevada PEP | Strengthening Families with Education, Empowerment, and Encouragement.', 'Nevada PEP artifact');
  assertIncludes(nvpepHtml, 'Nevada PEP will be a long-term, reliable statewide resource for families', 'Nevada PEP artifact');
  assertIncludes(nvpepHtml, 'Statewide: 1-800-216-5188', 'Nevada PEP artifact');
  assertIncludes(nvpepHtml, 'Programs and Services offered by Nevada PEP are supported in part by the U.S. Department of Education', 'Nevada PEP artifact');

  const resolvedFamilies = new Set([
    'protection_and_advocacy',
    'parent_training_information_center',
    'legal_aid',
  ]);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party NDALC evidence explicitly identifies Nevada’s federally mandated protection and advocacy system',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Nevada PEP evidence preserves statewide family support, training, and Department of Education-backed services',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party NDALC evidence preserves statewide disability legal-rights routing through the Nevada Disability Advocacy and Law Center',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !resolvedFamilies.has(row.family));
  const updatedNextRows = nextRows.filter((row) => !resolvedFamilies.has(row.family))
    .sort((a, b) => a.priority_rank - b.priority_rank);
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    major_gap_families: [],
    verified_source_families_with_samples: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
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
        evidence: 'Nevada still routes district or county education through generic statewide Department of Education pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Nevada county/local disability resources still depend on statewide locator or structural sources instead of reviewed county-owned local routing evidence.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch75_nevada_statewide_family_truth_refresh_v1',
    state: 'nevada',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: Array.from(resolvedFamilies),
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
  generateBatch75NevadaStatewideFamilyTruthRefreshV1();
}
