import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'rhode-island_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'rhode-island_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'rhode-island_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'rhode-island_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'rhode-island_next_action_queue_v2.jsonl'),
  drriHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-11-439Z', 'pages', '00005-rhode-island-nonprofit-support-drri-org.html'),
  ripinHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-03-905Z', 'pages', '00009-rhode-island-nonprofit-support-ripin-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch82_rhode-island_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch82-rhode-island-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'rhode-island-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party Disability Rights Rhode Island artifact explicitly preserves federally mandated statewide P&A designation on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights Rhode Island',
          source_url: 'https://www.drri.org/',
          final_url: 'https://drri.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:46:11.439Z',
          evidence_snippet: 'Disability Rights Rhode Island (DRRI) is the independent federally mandated Protection and Advocacy (P&A) System for the state of Rhode Island.',
        },
      ],
    };
  }
  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Rhode Island California-Grade Batch 82 Report v1',
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
    '- Rhode Island no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy evidence on disk instead of only legacy nonprofit inventory rows.',
    '- Disability Rights Rhode Island is preserved as strong statewide protection-and-advocacy support because the reviewed first-party page explicitly says it is the independent federally mandated Protection and Advocacy (P&A) System for the state of Rhode Island.',
    '- Rhode Island still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic locator-derived or mirror-backed evidence instead of reviewed county-grade local proof, RIPIN still lacks explicit PTI-grade designation in the reviewed artifact chain, and statewide legal aid is still missing on disk.',
    '- Rhode Island is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch82RhodeIslandStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const drriHtml = readText(INPUTS.drriHtml);
  assertIncludes(drriHtml, 'Home | Disability Rights Rhode Island', 'DRRI artifact');
  assertIncludes(drriHtml, 'Disability Rights Rhode Island (DRRI) is the independent federally mandated Protection and Advocacy (P&A) System for the state of Rhode Island.', 'DRRI artifact');

  const ripinHtml = readText(INPUTS.ripinHtml);
  assertIncludes(ripinHtml, 'RIPIN: Help with Special education, Health Insurance & More', 'RIPIN artifact');
  assertIncludes(ripinHtml, 'RIPIN empowers Rhode Islanders by providing guidance in healthcare, special education, and healthy aging.', 'RIPIN artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Disability Rights Rhode Island evidence preserves explicit federally mandated statewide P&A designation on the live first-party domain',
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
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Rhode Island still depends on statewide or structural education evidence instead of reviewed county- or district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Rhode Island county/local disability resources still depend on generic locator-derived or DOI mirror-backed evidence instead of reviewed county-grade official local-office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'RIPIN preserves special-education and health-support language, but the reviewed first-party artifact on disk does not explicitly preserve statewide PTI designation text.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Rhode Island still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
    state: 'rhode-island',
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
  const result = generateBatch82RhodeIslandStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
