import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'south-carolina_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'south-carolina_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'south-carolina_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'south-carolina_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'south-carolina_next_action_queue_v2.jsonl'),
  pandaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-56-734Z', 'pages', '00001-south-carolina-nonprofit-support-disabilityrightssc-org.html'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T23-51-11-814Z', 'pages', '00001-south-carolina-nonprofit-support-family-connection-of-sc-pti.html'),
  legalHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-17T16-58-43-900Z', 'pages', '01053-multi-state-advocates-legal-south-carolina-legal-services.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch83_south-carolina_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch83-south-carolina-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'south-carolina-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party Disability Rights South Carolina artifact explicitly preserves statewide P&A identity on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights South Carolina',
          source_url: 'https://www.disabilityrightssc.org/',
          final_url: 'https://www.disabilityrightssc.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:44:56.734Z',
          evidence_snippet: 'The reviewed first-party Disability Rights South Carolina page preserves statewide organizational identity on the live first-party domain.',
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
      query_basis: 'Reviewed first-party South Carolina Legal Services artifact preserves statewide civil legal-aid identity, low-income eligibility, and intake routes on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'South Carolina Legal Services',
          source_url: 'https://sclegal.org/',
          final_url: 'https://sclegal.org/',
          verification_status: 'verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-17T16:58:43.900Z',
          evidence_snippet: 'South Carolina Legal Services is a statewide law firm that provides civil legal services to protect the rights and represent the interests of low income South Carolinians, with apply online and legal-help routing preserved on the first-party page.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# South Carolina California-Grade Batch 83 Report v1',
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
    '- South Carolina no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy and legal-aid evidence on disk instead of only legacy nonprofit or legal inventory rows.',
    '- Disability Rights South Carolina is preserved as statewide protection-and-advocacy support from the reviewed first-party domain.',
    '- South Carolina Legal Services is preserved as statewide legal aid because the reviewed first-party page explicitly describes a statewide civil legal-services role for low-income South Carolinians and preserves direct intake routes.',
    '- South Carolina still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on DOI mirror-backed office evidence instead of reviewed county-grade official local-office proof, and the Family Connection artifact still does not explicitly preserve PTI-grade designation text in the reviewed chain.',
    '- South Carolina is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch83SouthCarolinaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const pandaHtml = readText(INPUTS.pandaHtml);
  assertIncludes(pandaHtml, 'Disability Rights South Carolina', 'DRSC artifact');

  const ptiHtml = readText(INPUTS.ptiHtml);
  assertIncludes(ptiHtml, 'Supporting families and individuals with disabilities across South Carolina through resources, parent training, advocacy, and community programs.', 'Family Connection artifact');

  const legalHtml = readText(INPUTS.legalHtml);
  assertIncludes(legalHtml, 'South Carolina Legal Services is a statewide law firm that provides civil legal services to protect the rights and represent the interests of low income South Carolinians.', 'SCLS artifact');
  assertIncludes(legalHtml, 'APPLY ONLINE', 'SCLS artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Disability Rights South Carolina evidence preserves statewide protection-and-advocacy identity on the live first-party domain',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party South Carolina Legal Services evidence preserves statewide low-income civil legal-aid identity plus direct intake routing on the live first-party domain',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !['protection_and_advocacy', 'legal_aid'].includes(row.family));
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'legal_aid'].includes(row.family))
    .sort((a, b) => a.priority_rank - b.priority_rank)
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 3,
    missing_critical_families: 0,
    major_gap_families: [
      'parent_training_information_center',
    ],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'South Carolina still depends on statewide or structural education evidence instead of reviewed county- or district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'South Carolina county/local disability resources still depend on DOI mirror-backed office evidence instead of reviewed county-grade official local-office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'Family Connection of South Carolina preserves statewide family-support and parent-training language, but the reviewed first-party artifact does not explicitly preserve PTI-grade designation text.',
        next_action: 'author_verified_state_manifest',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
    state: 'south-carolina',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['protection_and_advocacy', 'legal_aid'],
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
  const result = generateBatch83SouthCarolinaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
