import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'louisiana_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'louisiana_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'louisiana_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'louisiana_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'louisiana_next_action_queue_v2.jsonl'),
  drlaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-42-022Z', 'pages', '00001-louisiana-nonprofit-support-disabilityrightsla-org.html'),
  lapticHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-42-022Z', 'pages', '00002-louisiana-nonprofit-support-fhfjefferson-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch67_louisiana_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch67-louisiana-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'louisiana-california-grade-audit-report-v2.md'),
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
        query_basis: 'Reviewed first-party Disability Rights Louisiana evidence on disk preserves statewide disability-rights help routing, CAP/PABSS program signals, and direct statewide contact information.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Louisiana',
            source_url: 'https://disabilityrightsla.org/',
            final_url: 'https://disabilityrightsla.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:48.000Z',
            evidence_snippet: 'Disability Rights Louisiana. Client Assistance Program (CAP). Protection & Advocacy of Beneficiaries of Social Security. Information & Referral. GET HELP NOW. Phone: 1(800) 960-7705. Email: info@disabilityrightsla.org.',
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
        query_basis: 'Reviewed first-party LaPTIC evidence on disk explicitly states that Families Helping Families of Greater New Orleans serves as the Louisiana Parent Training and Information Center.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Louisiana Parent Training and Information Center',
            source_url: 'https://fhfofgno.org/laptic',
            final_url: 'https://fhfofgno.org/laptic',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:49.000Z',
            evidence_snippet: 'Louisiana Parent Training & Information Center. Families Helping Families of Greater New Orleans serves as the Louisiana Parent Training and Information Center and has been providing services to Louisiana families of children with disabilities since 1991.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Louisiana California-Grade Batch 67 Report v1',
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
    '- Louisiana no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Louisiana and LaPTIC evidence already on disk is enough to move the packet into an explicit final blocker state.',
    '- Disability Rights Louisiana is strong enough for the statewide protection-and-advocacy family because the reviewed first-party page preserves direct statewide help routing, CAP and PABSS program signals, and direct statewide contact information on the disability-rights organization itself.',
    '- LaPTIC is explicit enough for PTI because the reviewed first-party page says Families Helping Families of Greater New Orleans serves as the Louisiana Parent Training and Information Center.',
    '- Louisiana still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of district- or parish-owned leaves, county/local disability resources still depend on a generic statewide locations root instead of reviewed parish-grade local-office leaves, and statewide legal-aid proof is still missing.',
    '- Louisiana is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch67LouisianaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const drlaHtml = readText(INPUTS.drlaHtml);
  const lapticHtml = readText(INPUTS.lapticHtml);

  assertIncludes(drlaHtml, 'Disability Rights Louisiana', 'Disability Rights Louisiana artifact');
  assertIncludes(drlaHtml, 'Client Assistance Program (CAP)', 'Disability Rights Louisiana artifact');
  assertIncludes(drlaHtml, 'Protection &#038; Advocacy of Beneficiaries of Social Security', 'Disability Rights Louisiana artifact');
  assertIncludes(drlaHtml, 'GET HELP NOW', 'Disability Rights Louisiana artifact');
  assertIncludes(drlaHtml, '1(800) 960-7705', 'Disability Rights Louisiana artifact');
  assertIncludes(drlaHtml, 'info@disabilityrightsla.org', 'Disability Rights Louisiana artifact');

  assertIncludes(lapticHtml, 'Louisiana Parent Training &amp; Information Center', 'LaPTIC artifact');
  assertIncludes(lapticHtml, 'serves as the Louisiana Parent Training and Information Center', 'LaPTIC artifact');
  assertIncludes(lapticHtml, 'Louisiana’s Parent Training and Information Center (LaPTIC) is funded through the US Department of Education', 'LaPTIC artifact');

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
        evidence: 'Louisiana district routing still depends on generic statewide LDOE fallback pages; no reviewed parish- or district-owned special-education leaves are on disk.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Louisiana still lacks reviewed statewide legal-aid evidence on disk in the current packet artifacts.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County-local packet rows still rely on a generic statewide locations root instead of reviewed parish-grade local-office leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_67_louisiana_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'louisiana',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      disabilityRightsLouisiana: {
        sourceUrl: 'https://disabilityrightsla.org/',
        finalUrl: 'https://disabilityrightsla.org/',
      },
      laptic: {
        sourceUrl: 'https://fhfofgno.org/laptic',
        finalUrl: 'https://fhfofgno.org/laptic',
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
    '# Batch 67 Louisiana Statewide Family Truth Refresh',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- Disability Rights Louisiana: ${batchSummary.evidence_checks.disabilityRightsLouisiana.sourceUrl}`,
    `- LaPTIC: ${batchSummary.evidence_checks.laptic.sourceUrl}`,
  ].join('\n') + '\n');

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: batchSummary.updated_families,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch67LouisianaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
