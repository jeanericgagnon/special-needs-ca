import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'north-carolina_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'north-carolina_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'north-carolina_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'north-carolina_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'north-carolina_next_action_queue_v2.jsonl'),
  ecacHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T23-26-47-012Z', 'pages', '00005-north-carolina-nonprofit-support-ecac-inc-exceptional-children-s-assistance-center-pti-serves-the-entire-state.html'),
  vrHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-18-37-790Z', 'pages', '00016-north-carolina-transition-programs-nc-vocational-rehabilitation-services.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch78_north_carolina_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch78-north-carolina-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'north-carolina-california-grade-audit-report-v2.md'),
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

function assertNotIncludes(text, pattern, label) {
  if (text.includes(pattern)) {
    throw new Error(`Did not expect ${label} to include "${pattern}".`);
  }
}

function updatedVerifiedRow(row) {
  if (row.family === 'parent_training_information_center') {
    return {
      ...row,
      family_status: 'inventory_only',
      evidence_strength: 'weak',
      sample_count: 1,
      query_basis: 'Reviewed ECAC homepage artifact on disk preserves PTI navigation and statewide special-education support language, but no fetched PTI leaf or explicit statewide North Carolina PTI designation is preserved.',
      blocker_code: 'legacy_or_inventory_only_evidence',
      blocker_evidence: 'Reviewed ECAC homepage artifact preserves PTI navigation and special-education family-support language, but the packet still lacks a fetched PTI leaf or explicit statewide North Carolina PTI designation on disk.',
      samples: [
        {
          sample_name: 'Exceptional Children’s Assistance Center (ECAC)',
          source_url: 'https://www.ecac-parentcenter.org/',
          final_url: 'https://www.ecac-parentcenter.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-19T23:26:47.012Z',
          evidence_snippet: 'ECAC homepage preserves Parent Training and Information Center (PTI) navigation plus family support language for children with special needs, but the saved artifact does not preserve an explicit statewide PTI designation leaf.',
        },
      ],
    };
  }

  if (row.family === 'vocational_rehabilitation_pre_ets') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Employment and Independence for People with Disabilities artifact on disk explicitly preserves statewide vocational rehabilitation routing and local office coverage language.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'NC Vocational Rehabilitation Services',
          source_url: 'https://www.ncdhhs.gov/divisions/eipd',
          final_url: 'https://www.ncdhhs.gov/divisions/eipd',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          fetched_at: '2026-06-20T00:18:37.790Z',
          evidence_snippet: 'EIPD helps people with disabilities achieve their goals for competitive employment and more independent living in communities statewide and delivers services statewide through more than 70 local EIPD offices.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# North Carolina California-Grade Batch 78 Report v1',
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
    '- North Carolina no longer belongs in UNSTARTED because the packet now has explicit terminal blockers instead of an open-ended planning status.',
    '- The reviewed ECAC artifact improves PTI truth enough to replace the weaker HOPE-only sample chain, but it still does not preserve a fetched statewide PTI designation leaf on disk, so PTI remains inventory_only rather than verified.',
    '- The reviewed EIPD artifact strengthens vocational rehabilitation truth because it explicitly preserves statewide service language and local office coverage, so North Carolina no longer depends on a generic MH/DD/SAS sample for that family.',
    '- North Carolina still cannot reach California-grade or become index-safe because district or county education routing still depends on generic or statewide fallback instead of district-owned leaves, county/local disability resources still depend on structural or non-county-owned sources, statewide P&A remains missing on disk, statewide legal aid remains missing on disk, and PTI still lacks explicit statewide designation evidence from a fetched leaf.',
    '- North Carolina is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch78NorthCarolinaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const ecacHtml = readText(INPUTS.ecacHtml);
  assertIncludes(ecacHtml, 'Exceptional Children&#039;s Assistance Center (ECAC)', 'ECAC artifact');
  assertIncludes(ecacHtml, 'We help parents navigate the special education system, know their rights, and use their voice.', 'ECAC artifact');
  assertIncludes(ecacHtml, 'Parent Training and Information Center (PTI)', 'ECAC artifact');
  assertNotIncludes(ecacHtml, 'North Carolina&#039;s Parent Training and Information Center', 'ECAC artifact');
  assertNotIncludes(ecacHtml, 'North Carolina\'s Parent Training and Information Center', 'ECAC artifact');

  const vrHtml = readText(INPUTS.vrHtml);
  assertIncludes(vrHtml, 'competitive employment and more independent living in communities statewide', 'VR artifact');
  assertIncludes(vrHtml, 'We deliver services statewide through our network of more than 70 local EIPD offices', 'VR artifact');
  assertIncludes(vrHtml, 'find an EIPD office near you', 'VR artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party EIPD evidence preserves statewide vocational rehabilitation routing and local office coverage language',
      };
    }

    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'inventory_only',
        status_reason: 'reviewed ECAC evidence preserves PTI navigation and special-education family-support language, but no fetched statewide PTI designation leaf is preserved on disk',
      };
    }

    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'Reviewed ECAC homepage artifact preserves PTI navigation and special-education family-support language, but the packet still lacks a fetched PTI leaf or explicit statewide North Carolina PTI designation on disk.',
        next_action: 'author_verified_state_manifest',
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = [...nextRows].sort((a, b) => a.priority_rank - b.priority_rank);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 58,
    strong_critical_families: 7,
    weak_critical_families: 3,
    missing_critical_families: 2,
    major_gap_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
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
        evidence: 'North Carolina still routes many counties through generic statewide DPI fallback or non-district leaves instead of district-owned special-education routing pages.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'North Carolina still lacks any reviewed first-party or authoritative statewide protection-and-advocacy artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'Reviewed ECAC homepage evidence preserves PTI navigation, but the packet still lacks a fetched leaf with explicit statewide North Carolina PTI designation.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'North Carolina still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'North Carolina county/local disability resources still depend on structural dataset-derived rows or non-county-owned routing evidence instead of reviewed county-owned local office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch78_north_carolina_statewide_family_truth_refresh_v1',
    state: 'north-carolina',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: [],
    evidence_refreshed_families: [
      'vocational_rehabilitation_pre_ets',
      'parent_training_information_center',
    ],
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
  const result = generateBatch78NorthCarolinaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
