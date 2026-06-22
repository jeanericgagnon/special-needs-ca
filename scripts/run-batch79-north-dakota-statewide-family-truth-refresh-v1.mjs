import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'north-dakota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'north-dakota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'north-dakota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'north-dakota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'north-dakota_next_action_queue_v2.jsonl'),
  pathfinderHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T23-50-29-273Z', 'pages', '00001-north-dakota-nonprofit-support-pathfinder-parent-center-pti.html'),
  pandaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-50-966Z', 'pages', '00005-north-dakota-nonprofit-support-ndpanda-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch79_north_dakota_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch79-north-dakota-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'north-dakota-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party NDP&A homepage artifact preserves North Dakota protection-and-advocacy identity on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Protection Advocacy Project, North Dakota',
          source_url: 'https://www.ndpanda.org/home',
          final_url: 'https://www.ndpanda.org/home',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-20T00:44:50.966Z',
          evidence_snippet: 'The reviewed first-party page preserves Protection Advocacy Project, North Dakota branding plus a P&A logo and P&A resources navigation on the live ndpanda.org domain.',
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
      query_basis: 'Reviewed first-party Pathfinder homepage artifact preserves statewide nonprofit scope plus explicit Parent Training and Information (PTI) identity on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Pathfinder Parent Center – PTI',
          source_url: 'https://pathfinder-nd.org/',
          final_url: 'https://pathfinder-nd.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-19T23:50:29.273Z',
          evidence_snippet: 'Pathfinder Services of North Dakota describes itself as a statewide nonprofit organization and preserves explicit Parent Training and Information (PTI) navigation and PTI program labeling on the first-party page.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# North Dakota California-Grade Batch 79 Report v1',
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
    '- North Dakota no longer belongs in UNSTARTED because the packet now preserves reviewed first-party statewide P&A and PTI evidence instead of relying on legacy inventory hints.',
    '- Pathfinder Services of North Dakota is preserved as strong statewide PTI support because the reviewed first-party page explicitly labels Parent Training and Information (PTI) and describes statewide nonprofit scope.',
    '- NDP&A is preserved as strong statewide protection-and-advocacy support because the reviewed first-party page preserves Protection Advocacy Project, North Dakota identity and P&A-branded navigation on the live first-party domain.',
    '- North Dakota still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide or non-district leaves, county/local disability resources still depend on structural rather than reviewed county-owned routing evidence, and statewide legal aid is still missing on disk.',
    '- North Dakota is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch79NorthDakotaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const pathfinderHtml = readText(INPUTS.pathfinderHtml);
  assertIncludes(pathfinderHtml, 'We are a statewide nonprofit organization', 'Pathfinder artifact');
  assertIncludes(pathfinderHtml, 'Parent Training and Information (PTI)', 'Pathfinder artifact');
  assertIncludes(pathfinderHtml, 'IDEAs That Work - Office of Special Education Programs, U.S. Department of Education', 'Pathfinder artifact');

  const pandaHtml = readText(INPUTS.pandaHtml);
  assertIncludes(pandaHtml, 'Protection Advocacy Project, North Dakota', 'NDP&A artifact');
  assertIncludes(pandaHtml, 'P&amp;A logo | North Dakota Disability Rights', 'NDP&A artifact');
  assertIncludes(pandaHtml, 'P&amp;A Resources', 'NDP&A artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party NDP&A evidence preserves statewide protection-and-advocacy identity on the live first-party domain',
      };
    }

    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Pathfinder evidence preserves statewide nonprofit scope and explicit Parent Training and Information (PTI) identity',
      };
    }

    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family))
    .sort((a, b) => {
      const severityOrder = { critical: 0, major: 1, minor: 2 };
      return (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9);
    });

  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family))
    .sort((a, b) => a.priority_rank - b.priority_rank)
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 2,
    missing_critical_families: 1,
    major_gap_families: [
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
        evidence: 'North Dakota still routes county education through generic statewide or non-district leaves instead of district-owned special-education routing pages.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'North Dakota still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'North Dakota county/local disability resources still depend on structural dataset-derived rows instead of reviewed county-owned local office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch79_north_dakota_statewide_family_truth_refresh_v1',
    state: 'north-dakota',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
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
  const result = generateBatch79NorthDakotaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
