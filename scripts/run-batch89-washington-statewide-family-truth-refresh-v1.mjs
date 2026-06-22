import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'washington_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'washington_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'washington_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'washington_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'washington_next_action_queue_v2.jsonl'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-56-734Z', 'pages', '00009-washington-nonprofit-support-wapave-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch89_washington_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch89-washington-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'washington-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party WAPAVE artifact explicitly preserves the Parent Training and Information Program (PTI) on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'WAPAVE Parent Training and Information Program',
          source_url: 'https://wapave.org/parent-training-and-information-program/',
          final_url: 'https://wapave.org/parent-training-and-information-program/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch89_washington_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:44:56.734Z',
          evidence_snippet: "PAVE's PTI program helps family caregivers, youth and professionals with questions about services for children and young people with disabilities, ages 0-26.",
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Washington California-Grade Batch 89 Report v1',
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
    '- Washington no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide PTI evidence on disk instead of only weak inventory hints.',
    '- WAPAVE now truthfully satisfies the statewide PTI family because the reviewed first-party artifact explicitly preserves the Parent Training and Information Program (PTI) on the live domain.',
    '- Washington still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on statewide locator-derived office evidence instead of reviewed county-grade local-office proof, and reviewed first-party P&A plus legal-aid artifacts are still missing on disk.',
    '- Washington is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch89WashingtonStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const ptiHtml = readText(INPUTS.ptiHtml);
  assertIncludes(ptiHtml, 'Parent Training and Information Program (PTI)', 'WAPAVE artifact');
  assertIncludes(ptiHtml, "PAVE’s PTI program helps family caregivers", 'WAPAVE artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party WAPAVE artifact explicitly preserves the Parent Training and Information Program (PTI) on the live domain',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'parent_training_information_center');
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'parent_training_information_center')
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
      'legal_aid',
    ],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Washington still depends on statewide or structural education evidence instead of reviewed county- or district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Washington county/local disability resources still depend on statewide locator-derived office evidence instead of reviewed county-grade local-office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Washington still lacks any reviewed first-party protection-and-advocacy designation artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Washington still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch89_washington_statewide_family_truth_refresh_v1',
    state: 'washington',
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
  const result = generateBatch89WashingtonStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
