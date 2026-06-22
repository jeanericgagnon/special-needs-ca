import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'west-virginia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'west-virginia_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'west-virginia_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'west-virginia_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'west-virginia_next_action_queue_v2.jsonl'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T23-49-47-617Z', 'pages', '00001-west-virginia-nonprofit-support-west-virginia-parent-training-and-information-pti.html'),
  pandaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-50-966Z', 'pages', '00004-west-virginia-nonprofit-support-drofwv-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch90_west_virginia_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch90-west-virginia-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'west-virginia-california-grade-audit-report-v2.md'),
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

function updateVerifiedRow(row) {
  if (row.family === 'protection_and_advocacy') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Disability Rights of West Virginia artifact explicitly preserves statewide protection-and-advocacy rights and referral language on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights of West Virginia',
          source_url: 'https://www.drofwv.org/',
          final_url: 'https://www.drofwv.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch90_west_virginia_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:44:50.966Z',
          evidence_snippet: 'Disability Rights of West Virginia protects and advocates for the human and legal rights of persons with disabilities. DRWV provides information and referral services to people with disabilities, families, and other interested parties.',
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
      query_basis: 'Reviewed first-party WVPTI artifact explicitly preserves West Virginia Parent Training and Information as the state Parent Training Center on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'West Virginia Parent Training and Information (WVPTI)',
          source_url: 'https://wvpti.org',
          final_url: 'https://wvpti.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch90_west_virginia_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-19T23:49:47.617Z',
          evidence_snippet: 'For over 34 years, WV Parent Training and Information (WVPTI) has been dedicated to serving as West Virginia’s Parent Training Center, empowering parents and caregivers of children, youth, and young adults with disabilities from birth to age 26.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# West Virginia California-Grade Batch 90 Report v1',
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
    '- West Virginia no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy and PTI evidence on disk instead of only weak inventory hints.',
    '- Disability Rights of West Virginia now truthfully satisfies statewide protection and advocacy because the reviewed first-party artifact explicitly states that it protects and advocates for the human and legal rights of persons with disabilities and provides information and referral services.',
    '- WVPTI now truthfully satisfies the statewide PTI family because the reviewed first-party artifact explicitly states that it serves as West Virginia’s Parent Training Center.',
    '- West Virginia still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or structural office evidence instead of reviewed county-grade local-office proof, and statewide legal-aid evidence is still missing on disk.',
    '- West Virginia is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch90WestVirginiaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const ptiHtml = readText(INPUTS.ptiHtml);
  const pandaHtml = readText(INPUTS.pandaHtml);
  assertIncludes(ptiHtml, 'WV Parent Training and Information (WVPTI) has been dedicated to serving as West Virginia’s Parent Training Center', 'WVPTI artifact');
  assertIncludes(pandaHtml, 'Disability Rights of West Virginia protects and advocates for the human and legal rights of persons with disabilities.', 'DRWV artifact');
  assertIncludes(pandaHtml, 'DRWV provides information and referral services to people with disabilities, families, and other interested parties.', 'DRWV artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party DRWV artifact explicitly preserves statewide protection-and-advocacy rights and referral language on the live domain',
      };
    }

    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party WVPTI artifact explicitly preserves the state Parent Training Center role on the live domain',
      };
    }

    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family));
  const updatedVerifiedRows = verifiedRows.map(updateVerifiedRow);
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
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'West Virginia still depends on statewide or structural education evidence instead of reviewed county- or district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'West Virginia county/local disability resources still depend on generic or structural office evidence instead of reviewed county-grade local-office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'West Virginia still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch90_west_virginia_statewide_family_truth_refresh_v1',
    state: 'west-virginia',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['protection_and_advocacy', 'parent_training_information_center'],
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
  const result = generateBatch90WestVirginiaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
