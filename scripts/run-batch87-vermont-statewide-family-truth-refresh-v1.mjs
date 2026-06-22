import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'vermont_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'vermont_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'vermont_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'vermont_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'vermont_next_action_queue_v2.jsonl'),
  legalAidHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-42-308Z', 'pages', '00005-vermont-nonprofit-support-vtlegalaid-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch87_vermont_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch87-vermont-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'vermont-california-grade-audit-report-v2.md'),
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
  if (row.family === 'legal_aid') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Vermont Legal Aid evidence explicitly preserves statewide free civil legal-help routing on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Vermont Legal Aid',
          source_url: 'https://www.vtlegalaid.org/',
          final_url: 'https://www.vtlegalaid.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch87_vermont_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:45:42.308Z',
          evidence_snippet: 'Vermont Legal Aid helps Vermonters faced with a civil legal problem and offers Get Free Legal Help.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Vermont California-Grade Batch 87 Report v1',
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
    '- Vermont no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide legal-aid evidence on disk instead of only generic inventory hints.',
    '- Vermont Legal Aid now truthfully satisfies the statewide legal-aid family because the reviewed first-party domain explicitly offers free civil legal help to Vermonters.',
    '- Vermont still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on statewide locator-derived office evidence instead of reviewed county-grade local-office proof, protection and advocacy still lacks a reviewed first-party designation artifact on disk, and Vermont Family Network still lacks a reviewed PTI-designation artifact chain.',
    '- Vermont is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch87VermontStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const legalAidHtml = readText(INPUTS.legalAidHtml);
  assertIncludes(legalAidHtml, 'Official site for Vermont Legal Aid, helping Vermonters faced with a civil legal problem.', 'Vermont Legal Aid artifact');
  assertIncludes(legalAidHtml, 'Get Free Legal Help', 'Vermont Legal Aid artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Vermont Legal Aid evidence preserves statewide free civil legal-help routing on the live first-party domain',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'legal_aid');
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'legal_aid')
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
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Vermont still depends on statewide or structural education evidence instead of reviewed county- or district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Vermont county/local disability resources still depend on statewide locator-derived office evidence instead of reviewed county-grade local-office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Vermont still lacks any reviewed first-party protection-and-advocacy designation artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'Vermont Family Network preserves statewide family-support language, but the reviewed artifact chain still does not preserve explicit PTI designation text on the fetched page itself.',
        next_action: 'author_verified_state_manifest',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch87_vermont_statewide_family_truth_refresh_v1',
    state: 'vermont',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['legal_aid'],
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
  const result = generateBatch87VermontStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
