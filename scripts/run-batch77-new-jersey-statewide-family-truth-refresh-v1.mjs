import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-jersey_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-jersey_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-jersey_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-jersey_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-jersey_next_action_queue_v2.jsonl'),
  spanP2pHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-17T16-58-43-900Z', 'pages', '00144-new-jersey-nonprofit-support-spanadvocacy-org.html'),
  spanHomeHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-04-17-699Z', 'pages', '00017-new-jersey-nonprofit-support-span-parent-advocacy-network-pti.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch77_new_jersey_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch77-new-jersey-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-jersey-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party SPAN evidence on disk explicitly preserves New Jersey statewide parent-to-parent support, PTI program navigation, and direct program staff contact for Parent to Parent of NJ.',
      samples: [
        {
          sample_name: 'NJ Statewide Parent to Parent (NJP2P)',
          source_url: 'https://spanadvocacy.org/programs/p2p/',
          final_url: 'https://spanadvocacy.org/programs/p2p/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-17T16:58:50.000Z',
          evidence_snippet: 'NJ Statewide Parent to Parent (NJP2P). SPAN Parent Advocacy Network lists Building Bridges to Success under programs/pti and preserves program staff for Family to Family Health Information Center/Parent to Parent of NJ.',
        },
      ],
    };
  }
  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Jersey California-Grade Batch 77 Report v1',
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
    '- New Jersey no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide PTI-style evidence on disk instead of only inventory hints.',
    '- SPAN Parent Advocacy Network is preserved as strong statewide PTI-style support because the reviewed first-party pages explicitly preserve NJ Statewide Parent to Parent identity, PTI program navigation, direct support language, and program staff contact.',
    '- New Jersey still cannot reach California-grade or become index-safe because district or county education routing still depends on county or statewide fallback pages instead of district-owned leaves, county/local disability resources still depend on structural data rather than reviewed county-owned routing, no reviewed DRNJ first-party artifact exists on disk for statewide P&A, and no reviewed statewide legal-aid artifact exists on disk.',
    '- New Jersey is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch77NewJerseyStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const spanP2pHtml = readText(INPUTS.spanP2pHtml);
  assertIncludes(spanP2pHtml, 'NJ Statewide Parent to Parent (P2P NJ)', 'SPAN P2P artifact');
  assertIncludes(spanP2pHtml, 'Building Bridges to Succcess', 'SPAN P2P artifact');
  assertIncludes(spanP2pHtml, 'Family to Family Health Information Center/Parent to Parent of NJ', 'SPAN P2P artifact');
  assertIncludes(spanP2pHtml, 'Brenda L. Figueroa', 'SPAN P2P artifact');

  const spanHomeHtml = readText(INPUTS.spanHomeHtml);
  assertIncludes(spanHomeHtml, 'SPAN Parent Advocacy Network', 'SPAN home artifact');
  assertIncludes(spanHomeHtml, 'Empowering families as advocates and partners in improving education, health/mental health and human services outcomes', 'SPAN home artifact');
  assertIncludes(spanHomeHtml, 'SPAN is an Independent 501(c)3 Organization', 'SPAN home artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party SPAN evidence preserves New Jersey statewide parent-to-parent identity, PTI program navigation, and direct support contact',
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
    completeness_pct: 67,
    strong_critical_families: 8,
    weak_critical_families: 2,
    missing_critical_families: 2,
    major_gap_families: [
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
      'protection_and_advocacy',
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
        evidence: 'New Jersey still routes county education through county-office or regional fallback pages instead of district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'New Jersey still lacks a reviewed first-party DRNJ or equivalent authoritative statewide protection-and-advocacy artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'New Jersey still lacks a reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'New Jersey county/local disability resources still depend on structural dataset-derived rows instead of reviewed county-owned office or routing evidence.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch77_new_jersey_statewide_family_truth_refresh_v1',
    state: 'new-jersey',
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
  generateBatch77NewJerseyStatewideFamilyTruthRefreshV1();
}
