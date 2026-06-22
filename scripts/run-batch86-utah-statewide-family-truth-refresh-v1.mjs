import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'utah_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'utah_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'utah_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'utah_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'utah_next_action_queue_v2.jsonl'),
  pandaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-05-931Z', 'pages', '00009-utah-nonprofit-support-disabilitylawcenter-org.html'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-04-17-699Z', 'pages', '00014-utah-nonprofit-support-utah-parent-center-pti.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch86_utah_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch86-utah-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'utah-california-grade-audit-report-v2.md'),
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
      query_basis: "Reviewed first-party Disability Law Center artifact explicitly preserves Utah's Protection and Advocacy designation on the live first-party domain.",
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Law Center, Utah',
          source_url: 'http://disabilitylawcenter.org/',
          final_url: 'https://disabilitylawcenter.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch86_utah_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:45:05.931Z',
          evidence_snippet: "The Disability Law Center (DLC) is a private, non-profit organization designated by the governor as Utah's Protection and Advocacy (P&A) agency.",
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
      query_basis: 'Reviewed first-party Utah Parent Center PTI leaf explicitly preserves Parent Training and Information identity plus Utah contact evidence.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Utah Parent Center PTI Project',
          source_url: 'https://utahparentcenter.org/projects/pti',
          final_url: 'https://utahparentcenter.org/program/pti/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch86_utah_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:04:17.699Z',
          evidence_snippet: 'Parent Training and Information (PTI) Project | Utah Parent Center. 800-468-1160. 5296 S Commerce Dr., Suite 302, Murray, UT 84107.',
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
      query_basis: 'Reviewed first-party Disability Law Center artifact preserves Utah disability legal-rights routing plus an Apply for Help intake path.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Law Center, Utah',
          source_url: 'http://disabilitylawcenter.org/',
          final_url: 'https://disabilitylawcenter.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch86_utah_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:45:05.931Z',
          evidence_snippet: 'The Disability Law Center enforces and advances the legal rights, opportunities, and choices of Utahns with disabilities. Apply for Help.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Utah California-Grade Batch 86 Report v1',
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
    '- Utah no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide support evidence on disk for P&A, PTI, and disability legal-rights help.',
    "- Utah Parent Center's reviewed PTI leaf explicitly preserves Parent Training and Information identity on the live first-party domain with Utah contact evidence.",
    "- Disability Law Center's reviewed first-party artifact explicitly preserves both Utah's Protection and Advocacy designation and statewide disability legal-rights / Apply for Help routing.",
    '- Utah still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of reviewed county- or district-owned leaves, and county/local disability resources still depend on generic or statewide evidence instead of county-grade official local-office proof.',
    '- Utah is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch86UtahStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const pandaHtml = readText(INPUTS.pandaHtml);
  assertIncludes(pandaHtml, 'Protection and Advocacy Agency', 'DLC artifact');
  assertIncludes(pandaHtml, 'designated by the governor as Utah', 'DLC artifact');
  assertIncludes(pandaHtml, 'Protection and Advocacy (P&amp;A) agency', 'DLC artifact');

  const ptiHtml = readText(INPUTS.ptiHtml);
  assertIncludes(ptiHtml, 'Parent Training and Information (PTI) Project', 'Utah Parent Center PTI artifact');
  assertIncludes(ptiHtml, '5296 S Commerce Dr., Suite 302, Murray, UT 84107', 'Utah Parent Center PTI artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: "reviewed first-party Disability Law Center evidence explicitly preserves Utah's Protection and Advocacy agency designation",
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Utah Parent Center PTI leaf explicitly preserves Parent Training and Information identity plus Utah contact evidence',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Disability Law Center evidence preserves statewide disability legal-rights help plus Apply for Help intake routing',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family));
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family))
    .sort((a, b) => a.priority_rank - b.priority_rank)
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    major_gap_families: [],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Utah still depends on statewide or structural education evidence instead of reviewed county- or district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Utah county/local disability resources still depend on DOI mirror-backed or statewide office evidence instead of reviewed county-grade official local-office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch86_utah_statewide_family_truth_refresh_v1',
    state: 'utah',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'],
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
  const result = generateBatch86UtahStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
