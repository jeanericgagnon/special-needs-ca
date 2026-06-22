import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'tennessee_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'tennessee_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'tennessee_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'tennessee_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'tennessee_next_action_queue_v2.jsonl'),
  pandaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-43-43-495Z', 'pages', '00003-tennessee-nonprofit-support-disabilityrightstn-org.html'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T23-29-29-506Z', 'pages', '00002-tennessee-nonprofit-support-113-austin-street-greeneville-tn-37745.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch85_tennessee_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch85-tennessee-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'tennessee-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party Disability Rights Tennessee artifact preserves statewide first-party organizational identity on the live domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights Tennessee',
          source_url: 'https://www.disabilityrightstn.org/',
          final_url: 'https://www.disabilityrightstn.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch85_tennessee_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:43:43.495Z',
          evidence_snippet: 'The reviewed first-party Disability Rights Tennessee page preserves statewide organizational identity on the live domain.',
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
      query_basis: 'Reviewed first-party TNSTEP artifact explicitly preserves Tennessee statewide PTI designation on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'TNSTEP',
          source_url: 'https://tnstep.info/',
          final_url: 'https://tnstep.info/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch85_tennessee_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-19T23:29:29.506Z',
          evidence_snippet: "TNSTEP is a statewide non-profit that serves as Tennessee's only Parent Training and Information Center and is dedicated to providing special education support and training to families of children and youth with disabilities and special health care needs.",
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Tennessee California-Grade Batch 85 Report v1',
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
    '- Tennessee no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide P&A and PTI evidence on disk instead of only legacy support inventory rows.',
    "- TNSTEP is preserved as statewide PTI support because the reviewed first-party artifact explicitly says it serves as Tennessee's only Parent Training and Information Center.",
    '- Tennessee still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on DOI mirror-backed office evidence instead of reviewed county-grade local-office proof, vocational rehabilitation and Pre-ETS remain inventory-only, and statewide legal aid is still missing on disk.',
    '- Tennessee is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch85TennesseeStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const pandaHtml = readText(INPUTS.pandaHtml);
  assertIncludes(pandaHtml, 'Disability Rights Tennessee', 'DRTN artifact');

  const ptiHtml = readText(INPUTS.ptiHtml);
  assertIncludes(ptiHtml, "TNSTEP is a statewide non-profit that serves as Tennessee's only Parent Training and Information Center", 'TNSTEP artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Disability Rights Tennessee evidence preserves statewide protection-and-advocacy identity on the live first-party domain',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: "reviewed first-party TNSTEP evidence explicitly preserves Tennessee's only Parent Training and Information Center designation",
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family));
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family))
    .sort((a, b) => a.priority_rank - b.priority_rank)
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 67,
    strong_critical_families: 8,
    weak_critical_families: 4,
    missing_critical_families: 1,
    major_gap_families: [
      'vocational_rehabilitation_pre_ets',
      'legal_aid',
    ],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Tennessee still depends on statewide or structural education evidence instead of reviewed county- or district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Tennessee county/local disability resources still depend on DOI mirror-backed office evidence instead of reviewed county-grade official local-office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'vocational_rehabilitation_pre_ets',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'Tennessee vocational rehabilitation and Pre-ETS routing still depend on inventory-only evidence and lack a reviewed role-pure statewide VR plus student-transition leaf on disk.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Tennessee still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch85_tennessee_statewide_family_truth_refresh_v1',
    state: 'tennessee',
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
  const result = generateBatch85TennesseeStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
