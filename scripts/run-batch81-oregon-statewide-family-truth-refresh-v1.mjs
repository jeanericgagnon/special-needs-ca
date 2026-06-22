import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'oregon_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'oregon_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'oregon_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'oregon_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'oregon_next_action_queue_v2.jsonl'),
  droHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-05-931Z', 'pages', '00002-oregon-nonprofit-support-droregon-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch81_oregon_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch81-oregon-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'oregon-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party Disability Rights Oregon artifact preserves Oregon-specific disability-related legal help identity, contact information, and first-party domain evidence.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights Oregon',
          source_url: 'https://droregon.org/',
          final_url: 'https://droregon.org/get-help',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-20T00:45:05.931Z',
          evidence_snippet: 'Disability Rights Oregon helps people with disabilities with their disability-related legal issues in Oregon, and the reviewed first-party page preserves welcome@droregon.org plus the Portland office address.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Oregon California-Grade Batch 81 Report v1',
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
    '- Oregon no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy evidence on disk instead of only legacy nonprofit inventory rows.',
    '- Disability Rights Oregon is preserved as strong statewide protection-and-advocacy support because the reviewed first-party page explicitly says it helps people with disabilities with disability-related legal issues in Oregon and preserves direct first-party contact and office evidence.',
    '- Oregon still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of district-owned leaves, county/local disability resources still depend on structural rather than reviewed county-owned local routing proof, PTI still remains inventory-only rather than explicit PTI-grade evidence, and statewide legal aid is still missing on disk.',
    '- Oregon is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch81OregonStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const droHtml = readText(INPUTS.droHtml);
  assertIncludes(droHtml, 'Disability Rights Oregon helps people with disabilities with their disability-related legal issues in Oregon.', 'DRO artifact');
  assertIncludes(droHtml, 'welcome@droregon.org', 'DRO artifact');
  assertIncludes(droHtml, 'Disability Rights Oregon <br>900 SW 5th Avenue, Suite 1800 <br>Portland, Oregon 97204', 'DRO artifact');
  assertIncludes(droHtml, 'ACKNOWLEDGEMENT', 'DRO artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Disability Rights Oregon evidence preserves statewide protection-and-advocacy identity plus Oregon-specific disability legal help language',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'protection_and_advocacy');
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'protection_and_advocacy')
    .sort((a, b) => a.priority_rank - b.priority_rank)
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 67,
    strong_critical_families: 8,
    weak_critical_families: 3,
    missing_critical_families: 1,
    major_gap_families: [
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
      'protection_and_advocacy',
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
        evidence: 'Oregon still routes counties through statewide or structural education evidence instead of district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Oregon county/local disability resources still depend on structural or mixed-quality statewide routing evidence instead of reviewed county-owned local office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'FACT Oregon preserves statewide special-education and disability support language, but the current reviewed first-party evidence on disk does not explicitly preserve PTI-grade designation.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Oregon still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch81_oregon_statewide_family_truth_refresh_v1',
    state: 'oregon',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['protection_and_advocacy'],
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
  const result = generateBatch81OregonStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
