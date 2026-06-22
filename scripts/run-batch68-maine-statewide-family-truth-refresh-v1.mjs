import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maine_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  drmeHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-33-048Z', 'pages', '00005-maine-nonprofit-support-drme-org.html'),
  mpfHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-33-048Z', 'pages', '00006-maine-nonprofit-support-mpf-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch68_maine_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch68-maine-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
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

function buildVerifiedRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed first-party Disability Rights Maine evidence on disk explicitly states that DRM is the federally mandated protection and advocacy system for Maine.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Maine',
            source_url: 'https://drme.org/',
            final_url: 'https://drme.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:38.000Z',
            evidence_snippet: 'Disability Rights Maine (DRM) is the federally mandated protection and advocacy system for Maine.',
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
        query_basis: 'Reviewed first-party Maine Parent Federation evidence on disk explicitly preserves the Parent Training & Info (PTI) program designation.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Maine Parent Federation',
            source_url: 'https://www.mpf.org/',
            final_url: 'https://www.mpf.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:39.000Z',
            evidence_snippet: 'Parent Training & Info (PTI). The Parent Information Center is not a legal services agency. Maine Parent Federation.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Maine California-Grade Batch 68 Report v1',
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
    '- Maine no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Maine and Maine Parent Federation evidence already on disk is enough to move the packet into an explicit final blocker state.',
    '- Disability Rights Maine is explicit enough for the statewide protection-and-advocacy family because the reviewed first-party page says DRM is the federally mandated protection and advocacy system for Maine.',
    '- Maine Parent Federation is explicit enough for PTI because the reviewed first-party page preserves the Parent Training & Info (PTI) program designation directly in the site navigation.',
    '- Maine still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of district-owned leaves, county/local disability resources still depend on a generic statewide locations root and DOI mirror rows instead of reviewed county-grade official office leaves, and statewide legal-aid proof is still missing.',
    '- Maine is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch68MaineStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const drmeHtml = readText(INPUTS.drmeHtml);
  const mpfHtml = readText(INPUTS.mpfHtml);

  assertIncludes(drmeHtml, 'Disability Rights Maine (DRM) is the federally mandated protection and advocacy system for Maine', 'Disability Rights Maine artifact');
  assertIncludes(mpfHtml, 'Parent Training &#038; Info (PTI)', 'Maine Parent Federation artifact');
  assertIncludes(mpfHtml, 'The Parent Information Center is not a legal services agency', 'Maine Parent Federation artifact');

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
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party PTI designation evidence is present at the required authority level',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family));
  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);
  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family))
    .sort((a, b) => a.priority_rank - b.priority_rank);

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
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Maine district routing still depends on generic statewide DOE fallback pages; no reviewed district-owned or county-grade special-education leaves are on disk.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Maine still lacks reviewed statewide legal-aid evidence on disk in the current packet artifacts.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County-local packet rows still rely on a generic statewide locations root or DOI mirror rows instead of reviewed county-grade official office leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_68_maine_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      disabilityRightsMaine: {
        sourceUrl: 'https://drme.org/',
        finalUrl: 'https://drme.org/',
      },
      maineParentFederation: {
        sourceUrl: 'https://www.mpf.org/',
        finalUrl: 'https://www.mpf.org/',
      },
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, updatedReport);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 68 Maine Statewide Family Truth Refresh',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- Disability Rights Maine: ${batchSummary.evidence_checks.disabilityRightsMaine.sourceUrl}`,
    `- Maine Parent Federation: ${batchSummary.evidence_checks.maineParentFederation.sourceUrl}`,
  ].join('\n') + '\n');

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: batchSummary.updated_families,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch68MaineStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
