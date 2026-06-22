import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'mississippi_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'mississippi_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'mississippi_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'mississippi_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'mississippi_next_action_queue_v2.jsonl'),
  msptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T23-46-59-614Z', 'pages', '00004-mississippi-nonprofit-support-coalition-for-citizens-with-disabilities-pti.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch73_mississippi_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch73-mississippi-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'mississippi-california-grade-audit-report-v2.md'),
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
        query_basis: 'Reviewed first-party Mississippi PTI evidence on disk explicitly preserves Parent Training and Information Center designation text plus family-support and IDEA/transition guidance.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Mississippi Parent Training and Information Center',
            source_url: 'https://mspti.org',
            final_url: 'https://mspti.org/default.asp',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-19T23:47:02.000Z',
            evidence_snippet: 'Welcome to the Mississippi Parent Training and Information Center! Everything we do is designed to help parents and families of children with disabilities. If you are the parent or family member of a child with a disability, age birth to 26, our job is to provide your family with information, resources, support and training. The contents of this website were developed under a grant from the US Department of Education, #H328M200082.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Mississippi California-Grade Batch 73 Report v1',
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
    '- Mississippi no longer belongs in UNSTARTED. The packet already has enough reviewed on-disk evidence to repair PTI truthfully and to terminalize the remaining blockers without inflating county-grade readiness.',
    '- Mississippi PTI is explicit enough to verify because the reviewed first-party page itself says “Welcome to the Mississippi Parent Training and Information Center,” preserves family-support and IDEA/transition guidance, and preserves the federal Department of Education grant statement.',
    '- Mississippi still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on a generic statewide locations page instead of reviewed county-owned local routing, statewide Protection and Advocacy plus legal-aid proof is still missing, and the reviewed statewide MS CAP page is not enough to prove direct statewide VR / Pre-ETS routing.',
    '- Mississippi is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch73MississippiStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const msptiHtml = readText(INPUTS.msptiHtml);
  assertIncludes(msptiHtml, 'Welcome to the Mississippi Parent Training and Information Center!', 'Mississippi PTI artifact');
  assertIncludes(msptiHtml, 'parents and families of children with disabilities', 'Mississippi PTI artifact');
  assertIncludes(msptiHtml, 'The contents of this website were developed under a grant from the US Department of Education', 'Mississippi PTI artifact');
  assertIncludes(msptiHtml, 'Early Intervention and transition services', 'Mississippi PTI artifact');

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
    completeness_pct: 58,
    strong_critical_families: 7,
    weak_critical_families: 3,
    missing_critical_families: 2,
    major_gap_families: [
      'vocational_rehabilitation_pre_ets',
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
        evidence: 'Reviewed Mississippi packet evidence still routes district or county education through generic statewide Mississippi special-education pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'vocational_rehabilitation_pre_ets',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'The reviewed statewide MS CAP page helps VR and VRB clients, but it does not itself prove direct statewide VR / Pre-ETS routing at the required role purity.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Mississippi still lacks reviewed first-party or authoritative statewide protection-and-advocacy evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Mississippi still lacks reviewed first-party or authoritative statewide legal-aid evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County/local disability resources still depend on a generic statewide locations page instead of reviewed county-owned local routing evidence.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch_73_mississippi_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'mississippi',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'parent_training_information_center',
    ],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      mspti: {
        sourceUrl: 'https://mspti.org',
        finalUrl: 'https://mspti.org/default.asp',
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
    '# Mississippi Statewide Family Truth Refresh Summary v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- mspti: ${batchSummary.evidence_checks.mspti.sourceUrl} -> ${batchSummary.evidence_checks.mspti.finalUrl}`,
    '',
    '## Decision',
    '',
    '- Mississippi PTI was upgraded from reviewed first-party evidence already on disk.',
    '- Mississippi remains terminal BLOCKED because district routing, county-local routing, statewide P&A, statewide legal aid, and direct VR / Pre-ETS routing are still unresolved.',
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
  const result = generateBatch73MississippiStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
