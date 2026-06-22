import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'michigan_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'michigan_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'michigan_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'michigan_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'michigan_next_action_queue_v2.jsonl'),
  drmichHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-00-641Z', 'pages', '00007-michigan-nonprofit-support-drmich-org.html'),
  mafHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-00-641Z', 'pages', '00009-michigan-nonprofit-support-michiganallianceforfamilies-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch71_michigan_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch71-michigan-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'michigan-california-grade-audit-report-v2.md'),
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
        query_basis: 'Reviewed first-party Disability Rights Michigan evidence on disk explicitly preserves statewide Protection and Advocacy designation text.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Michigan',
            source_url: 'https://drmich.org/',
            final_url: 'https://www.drmich.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:08.000Z',
            evidence_snippet: 'Disability Rights Michigan (DRM) is the federally mandated protection and advocacy system for Michigan. Formerly Michigan Protection & Advocacy Services, Inc.',
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
        query_basis: 'Reviewed first-party Michigan Alliance for Families evidence on disk explicitly preserves statewide PTIC designation text plus direct contact routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Michigan Alliance for Families',
            source_url: 'https://www.michiganallianceforfamilies.org/',
            final_url: 'https://www.michiganallianceforfamilies.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:10.000Z',
            evidence_snippet: "Michigan Alliance for Families is our state's federally funded Parent Training and Information Center. Michigan Alliance for Families: Your free guide to special education. Connect directly with one of our regional Parent Mentors. 1-800-552-4821. info@michiganallianceforfamilies.org.",
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Michigan California-Grade Batch 71 Report v1',
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
    '- Michigan no longer belongs in UNSTARTED. The packet already had enough reviewed on-disk evidence to repair statewide P&A and PTI truthfully.',
    '- Disability Rights Michigan is explicit enough for Protection and Advocacy because the reviewed first-party page states that DRM is the federally mandated protection and advocacy system for Michigan.',
    "- Michigan Alliance for Families is explicit enough for PTI because the reviewed first-party page states that it is Michigan's federally funded Parent Training and Information Center and preserves direct family-support contact routing.",
    '- Michigan still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on a DOI dataset mirror rather than reviewed county-owned local routing, and statewide legal-aid proof is still missing.',
    '- Michigan is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch71MichiganStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const drmichHtml = readText(INPUTS.drmichHtml);
  const mafHtml = readText(INPUTS.mafHtml);
  assertIncludes(drmichHtml, 'federally mandated protection and advocacy system for Michigan', 'Disability Rights Michigan artifact');
  assertIncludes(drmichHtml, 'Formerly Michigan Protection &amp; Advocacy Services, Inc.', 'Disability Rights Michigan artifact');
  assertIncludes(mafHtml, "our state's federally funded Parent Training and Information Center", 'Michigan Alliance for Families artifact');
  assertIncludes(mafHtml, 'Your free guide to special education', 'Michigan Alliance for Families artifact');
  assertIncludes(mafHtml, '1-800-552-4821', 'Michigan Alliance for Families artifact');
  assertIncludes(mafHtml, 'info@michiganallianceforfamilies.org', 'Michigan Alliance for Families artifact');

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
        status_reason: 'reviewed first-party PTI evidence is present at the required authority level',
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
    verified_source_families_with_samples: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
      'protection_and_advocacy',
      'parent_training_information_center',
      'able_program',
      'ssi_ssa_federal_reference',
      'county_local_disability_resources',
    ],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Reviewed Michigan packet evidence still routes district or county education through generic statewide Michigan special-education pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Michigan still lacks reviewed first-party or authoritative statewide legal-aid evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County/local disability resources still depend on a DOI dataset mirror instead of reviewed county-owned local routing evidence.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch_71_michigan_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'michigan',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      drmich: {
        sourceUrl: 'https://drmich.org/',
        finalUrl: 'https://www.drmich.org/',
      },
      maf: {
        sourceUrl: 'https://www.michiganallianceforfamilies.org/',
        finalUrl: 'https://www.michiganallianceforfamilies.org/',
      },
    },
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.mkdirSync(path.dirname(OUTPUTS.report), { recursive: true });
  fs.writeFileSync(OUTPUTS.report, [
    '# Michigan Statewide Family Truth Refresh Summary v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- drmich: ${batchSummary.evidence_checks.drmich.sourceUrl} -> ${batchSummary.evidence_checks.drmich.finalUrl}`,
    `- maf: ${batchSummary.evidence_checks.maf.sourceUrl} -> ${batchSummary.evidence_checks.maf.finalUrl}`,
    '',
    '## Decision',
    '',
    '- Disability Rights Michigan and Michigan Alliance for Families were both upgraded from reviewed first-party evidence already on disk.',
    '- Michigan remains terminal BLOCKED because district routing, county-local routing, and statewide legal aid are still unresolved.',
    '',
  ].join('\n'));
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    updatedFamilies: batchSummary.updated_families,
    remainingBlockers: batchSummary.remaining_blockers,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch71MichiganStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
