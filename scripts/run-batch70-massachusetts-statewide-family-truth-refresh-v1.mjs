import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'massachusetts_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'massachusetts_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'massachusetts_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'massachusetts_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'massachusetts_next_action_queue_v2.jsonl'),
  fcsnHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-42-308Z', 'pages', '00008-massachusetts-nonprofit-support-fcsn-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch70_massachusetts_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch70-massachusetts-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'massachusetts-california-grade-audit-report-v2.md'),
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
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed first-party Federation for Children with Special Needs evidence on disk explicitly preserves a Parent Training & Information Center route plus Massachusetts contact evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Federation for Children with Special Needs',
            source_url: 'https://fcsn.org/',
            final_url: 'https://fcsn.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:49.000Z',
            evidence_snippet: 'Federation for Children with Special Needs. Parent Training & Information Center. Connect with us. Federation for Children with Special Needs, The Schrafft Center, 529 Main Street, Suite 1M3, Boston, MA 02129. (617) 236-7210. 800-331-0688. info@fcsn.org.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Massachusetts California-Grade Batch 70 Report v1',
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
    '- Massachusetts no longer belongs in UNSTARTED. The packet already had enough reviewed on-disk evidence to identify the final blockers truthfully.',
    '- Federation for Children with Special Needs is explicit enough for PTI because the reviewed first-party page preserves a Parent Training & Information Center route, organization identity, and direct Massachusetts contact evidence.',
    '- Massachusetts still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on generic statewide location evidence instead of reviewed county-owned local routing, and reviewed first-party statewide Protection and Advocacy plus legal-aid proof is still missing on disk.',
    '- Massachusetts is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch70MassachusettsStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const fcsnHtml = readText(INPUTS.fcsnHtml);
  assertIncludes(fcsnHtml, 'Parent Training &#038; Information Center', 'FCSN artifact');
  assertIncludes(fcsnHtml, 'Connect with us', 'FCSN artifact');
  assertIncludes(fcsnHtml, '529 Main Street, Suite 1M3', 'FCSN artifact');
  assertIncludes(fcsnHtml, '(617) 236-7210', 'FCSN artifact');
  assertIncludes(fcsnHtml, 'info@fcsn.org', 'FCSN artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party PTI evidence is present at the required authority level',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'parent_training_information_center');
  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'parent_training_information_center')
    .sort((a, b) => a.priority_rank - b.priority_rank);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 67,
    strong_critical_families: 8,
    weak_critical_families: 2,
    missing_critical_families: 2,
    major_gap_families: [
      'protection_and_advocacy',
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
        evidence: 'Reviewed Massachusetts packet evidence still routes district or county education through generic statewide Massachusetts special-education pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Massachusetts still lacks reviewed first-party or authoritative statewide protection-and-advocacy evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Massachusetts still lacks reviewed first-party or authoritative statewide legal-aid evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County/local disability resources still depend on generic statewide location pages instead of reviewed county-owned local routing evidence.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch_70_massachusetts_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'massachusetts',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'parent_training_information_center',
    ],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      fcsn: {
        sourceUrl: 'https://fcsn.org/',
        finalUrl: 'https://fcsn.org/',
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
    '# Massachusetts Statewide Family Truth Refresh Summary v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- fcsn: ${batchSummary.evidence_checks.fcsn.sourceUrl} -> ${batchSummary.evidence_checks.fcsn.finalUrl}`,
    '',
    '## Decision',
    '',
    '- Federation for Children with Special Needs was upgraded to verified statewide PTI from reviewed first-party evidence already on disk.',
    '- Massachusetts remains terminal BLOCKED because district routing, county-local routing, protection and advocacy, and legal aid are still unresolved.',
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
  const result = generateBatch70MassachusettsStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
