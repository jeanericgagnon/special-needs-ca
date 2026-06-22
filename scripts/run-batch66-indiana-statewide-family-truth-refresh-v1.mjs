import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'indiana_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'indiana_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'indiana_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'indiana_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'indiana_next_action_queue_v2.jsonl'),
  idrHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-43-52-235Z', 'pages', '00005-indiana-nonprofit-support-in-gov.html'),
  insourceHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-43-52-235Z', 'pages', '00004-indiana-nonprofit-support-insource-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch66_indiana_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch66-indiana-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'indiana-california-grade-audit-report-v2.md'),
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
        query_basis: 'Reviewed first-party Indiana Disability Rights evidence on disk explicitly preserves Protection and Advocacy system language plus statewide contact routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Indiana Disability Rights',
            source_url: 'https://www.in.gov/idr/',
            final_url: 'https://www.in.gov/idr/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:43:58.000Z',
            evidence_snippet: 'Indiana Disability Rights. Learn More About The Protection and Advocacy System. Contact Us: 4755 Kingsway Drive, Suite 100, Indianapolis, IN 46205. Local Phone: 317.722.5555. Toll Free Phone: 800.622.4845.',
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
        query_basis: 'Reviewed first-party INSOURCE evidence on disk proves real statewide Indiana family-support, training, and special-education help scope, but the saved artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        blocker_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        blocker_evidence: 'The reviewed INSOURCE artifact preserves Indiana statewide parent-support and training scope, but not explicit PTI / Parent Training and Information Center designation text.',
        samples: [
          {
            sample_name: 'INSOURCE',
            source_url: 'https://www.insource.org/',
            final_url: 'https://www.insource.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:43:57.000Z',
            evidence_snippet: 'Providing Indiana families and service providers the information and training necessary to assure effective educational programs and appropriate services for children and young adults with disabilities. IN*SOURCE exists to help parents of children with disabilities navigate the special education process in the state of Indiana.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Indiana California-Grade Batch 66 Report v1',
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
    '- Indiana no longer belongs in UNSTARTED. Reviewed first-party Indiana Disability Rights and INSOURCE evidence already on disk is enough to move the packet to an explicit final blocker state.',
    '- Indiana Disability Rights is explicit enough for Protection and Advocacy because the reviewed first-party page preserves Indiana Disability Rights branding, statewide contact routing, and direct Protection and Advocacy system language.',
    '- INSOURCE is preserved as real reviewed statewide Indiana parent-support, training, and special-education navigation evidence, but the saved first-party artifact still does not preserve explicit PTI / Parent Training and Information designation text, so PTI remains blocked rather than being upgraded by assumption.',
    '- Indiana still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on a DOI dataset mirror rather than reviewed county-owned local routing, PTI remains below the explicit designation bar, and statewide legal-aid proof is still missing.',
    '- Indiana is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch66IndianaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const idrHtml = readText(INPUTS.idrHtml);
  const insourceHtml = readText(INPUTS.insourceHtml);

  assertIncludes(idrHtml, 'Indiana Disability Rights', 'Indiana Disability Rights artifact');
  assertIncludes(idrHtml, 'Learn More About The Protection and Advocacy System', 'Indiana Disability Rights artifact');
  assertIncludes(idrHtml, '4755 Kingsway Drive, Suite 100', 'Indiana Disability Rights artifact');
  assertIncludes(idrHtml, 'Toll Free Phone: 800.622.4845', 'Indiana Disability Rights artifact');

  assertIncludes(insourceHtml, 'Providing Indiana families and service providers the information and training necessary', 'INSOURCE artifact');
  assertIncludes(insourceHtml, 'IN*SOURCE exists to help parents of children with disabilities navigate the special education process in the state of Indiana.', 'INSOURCE artifact');

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
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: 'Reviewed INSOURCE evidence proves Indiana statewide family-support and training scope, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
      };
    }
    return row;
  }).filter((row) => row.family !== 'protection_and_advocacy');

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);

  const nextRowsByFamily = new Map();
  for (const row of nextRows) {
    if (!['protection_and_advocacy', 'parent_training_information_center'].includes(row.family)) {
      nextRowsByFamily.set(row.family, row);
    }
  }
  nextRowsByFamily.set('parent_training_information_center', {
    state: 'indiana',
    state_code: 'IN',
    priority_rank: 3,
    family: 'parent_training_information_center',
    severity: 'major',
    failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
    next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
    evidence: 'Reviewed INSOURCE evidence preserves Indiana statewide parent-support and training scope, but the saved first-party artifact does not preserve explicit PTI designation text.',
  });
  const updatedNextRows = Array.from(nextRowsByFamily.values())
    .sort((a, b) => a.priority_rank - b.priority_rank);

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
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Reviewed Indiana packet evidence still routes district or county education through generic statewide Indiana DOE fallback pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: 'Reviewed INSOURCE evidence proves Indiana statewide family-support and training scope, but the saved first-party artifact does not preserve explicit PTI designation text.',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Indiana still lacks reviewed first-party or authoritative statewide legal-aid evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County/local disability resources still depend on a DOI dataset mirror instead of reviewed county-owned local-office or locator evidence.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_66_indiana_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'indiana',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      indianaDisabilityRights: {
        sourceUrl: 'https://www.in.gov/idr/',
        finalUrl: 'https://www.in.gov/idr/',
      },
      insource: {
        sourceUrl: 'https://www.insource.org/',
        finalUrl: 'https://www.insource.org/',
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
    '# Batch 66 Indiana Statewide Family Truth Refresh',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- Indiana Disability Rights: ${batchSummary.evidence_checks.indianaDisabilityRights.sourceUrl}`,
    `- INSOURCE: ${batchSummary.evidence_checks.insource.sourceUrl}`,
  ].join('\n') + '\n');

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: batchSummary.updated_families,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch66IndianaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
