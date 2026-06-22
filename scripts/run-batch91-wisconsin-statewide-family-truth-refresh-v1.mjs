import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'wisconsin_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'wisconsin_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'wisconsin_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'wisconsin_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'wisconsin_next_action_queue_v2.jsonl'),
  pandaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-08-435Z', 'pages', '00009-wisconsin-nonprofit-support-disabilityrightswi-org.html'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-17-311Z', 'pages', '00004-wisconsin-nonprofit-support-wifacets-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch91_wisconsin_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch91-wisconsin-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'wisconsin-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party Disability Rights Wisconsin artifact on disk explicitly preserves Wisconsin statewide disability-rights identity plus a dedicated Protection and Advocacy program on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights Wisconsin',
          source_url: 'https://disabilityrightswi.org/',
          final_url: 'https://disabilityrightswi.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch91_wisconsin_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:44:08.435Z',
          evidence_snippet: 'Disability Rights Wisconsin is a private non-profit organization that protects the rights of people with disabilities statewide. Programs include Protection and Advocacy.',
        },
      ],
    };
  }

  if (row.family === 'parent_training_information_center') {
    return {
      ...row,
      family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
      evidence_strength: 'weak',
      sample_count: 1,
      query_basis: 'Reviewed first-party WI FACETS artifact on disk proves real Wisconsin statewide family-support and special-education guidance scope, but the saved artifact does not preserve explicit PTI / Parent Training and Information Center designation text.',
      blocker_code: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
      blocker_evidence: 'WI FACETS is a real first-party Wisconsin support source, but the reviewed homepage only proves statewide special-education help and training scope, not explicit PTI designation.',
      samples: [
        {
          sample_name: 'WI FACETS',
          source_url: 'https://wifacets.org/',
          final_url: 'https://wifacets.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch91_wisconsin_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:44:17.311Z',
          evidence_snippet: 'Our goal is to provide Wisconsin families with disabled children special education resources. We are available to help with your questions and concerns regarding special education.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Wisconsin California-Grade Batch 91 Report v1',
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
    '- Wisconsin no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide nonprofit evidence on disk and its remaining gaps are now explicit terminal blockers.',
    '- Disability Rights Wisconsin now truthfully satisfies statewide protection and advocacy because the reviewed first-party artifact explicitly preserves statewide disability-rights identity and a dedicated Protection and Advocacy program on the live domain.',
    '- WI FACETS no longer stays vague inventory-only evidence. The reviewed first-party artifact proves real statewide family-support and special-education guidance scope, but it still does not preserve explicit PTI designation text, so PTI remains blocked rather than being upgraded by assumption.',
    '- Wisconsin still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or structural office evidence instead of reviewed county-grade local-office proof, statewide PTI designation is still not explicit in the saved artifact, and statewide legal-aid proof is still missing on disk.',
    '- Wisconsin is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch91WisconsinStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const pandaHtml = readText(INPUTS.pandaHtml);
  const ptiHtml = readText(INPUTS.ptiHtml);
  assertIncludes(pandaHtml, 'protects the rights of people with disabilities statewide', 'Disability Rights Wisconsin artifact');
  assertIncludes(pandaHtml, 'Protection and Advocacy', 'Disability Rights Wisconsin artifact');
  assertIncludes(ptiHtml, 'provide Wisconsin families with disabled children special education resources', 'WI FACETS artifact');
  assertIncludes(ptiHtml, 'questions and concerns regarding special education', 'WI FACETS artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party protection-and-advocacy evidence is present at the required authority level',
      };
    }

    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        status_reason: 'reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text',
      };
    }

    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        failure_code: 'resolved_reviewed_first_party_protection_and_advocacy_evidence',
        evidence: 'Disability Rights Wisconsin preserves statewide disability-rights identity and a dedicated Protection and Advocacy program on the live first-party domain.',
        next_action: 'none_terminal_resolved',
      };
    }

    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        evidence: 'WI FACETS is reviewed and statewide, but the saved first-party artifact proves special-education help scope rather than explicit PTI designation.',
        next_action: 'author_verified_state_manifest',
      };
    }

    return row;
  }).filter((row) => row.family !== 'protection_and_advocacy');

  const updatedVerifiedRows = verifiedRows.map(updateVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'protection_and_advocacy')
    .map((row) => {
      if (row.family === 'parent_training_information_center') {
        return {
          ...row,
          failure_code: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
          evidence: 'WI FACETS is reviewed and statewide, but the saved first-party artifact proves special-education help scope rather than explicit PTI designation.',
        };
      }
      return row;
    })
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
        evidence: 'Wisconsin still depends on statewide or structural education evidence instead of reviewed county- or district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Wisconsin county/local disability resources still depend on generic or structural office evidence instead of reviewed county-grade local-office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        evidence: 'WI FACETS is reviewed and statewide, but the saved first-party artifact proves special-education help scope rather than explicit PTI designation.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Wisconsin still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch91_wisconsin_statewide_family_truth_refresh_v1',
    state: 'wisconsin',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['protection_and_advocacy'],
    clarified_blockers: ['parent_training_information_center'],
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
  generateBatch91WisconsinStatewideFamilyTruthRefreshV1();
}
