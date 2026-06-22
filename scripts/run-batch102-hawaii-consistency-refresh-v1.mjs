import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const OUTPUTS = {
  summary: path.join(generatedDir, 'hawaii_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'hawaii_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'hawaii_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'hawaii_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'hawaii_next_action_queue_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch102_hawaii_consistency_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'hawaii-california-grade-audit-report-v2.md'),
  batchReport: path.join(docsGeneratedDir, 'batch102-hawaii-consistency-refresh-report-v1.md'),
};

const REAL_DDD_URL = 'https://health.hawaii.gov/ddd/';
const REAL_DDD_CONTACT_URL = 'https://health.hawaii.gov/ddd/about/contact/';
const SPECIAL_ED_URL = 'https://www.hawaiipublicschools.org/TeachingAndLearning/SpecializedPrograms/SpecialEducation/';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
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

function buildUpdatedGapRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed live Hawaii DOH Developmental Disabilities Division root now replaces the dead dhhs.hawaii.gov DD sample.',
      };
    }
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'missing',
        status_reason: 'Current packet relied on dhhs.hawaii.gov/earlystart, which does not resolve, and no reviewed real official Part C page has yet replaced it.',
      };
    }
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'blocked_official_leaf_access_denied',
        status_reason: 'The likely official Hawaii public schools special-education leaf redirects and then returns HTTP 403, so statewide IDEA Part B still lacks a reviewed exact authority leaf.',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_statewide_school_root_only',
        status_reason: 'District or county education routing still depends on the statewide Hawaii public schools root; the likely special-education leaf returns HTTP 403 and no county- or district-owned leaves are yet reviewed.',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_fake_domain_and_doi_fallback',
        status_reason: 'County/local disability resources still depend on a dead dhhs.hawaii.gov/locations root plus DOI-derived office extracts instead of reviewed county-specific official leaves.',
      };
    }
    return row;
  });
}

function buildUpdatedFailures(existingRows) {
  const preserved = existingRows.filter((row) => !['special_education_idea_part_b', 'district_or_county_education_routing', 'county_local_disability_resources', 'early_intervention_part_c'].includes(row.family));
  return [
    {
      state: 'hawaii',
      state_code: 'HI',
      family: 'early_intervention_part_c',
      severity: 'critical',
      failure_code: 'fake_domain_sample_requires_real_part_c_replacement',
      evidence: 'The current Hawaii Early Intervention family still points to dhhs.hawaii.gov/earlystart, but that domain does not resolve in live checks and no reviewed real official Part C leaf is yet on disk.',
      next_action: 'author_real_official_part_c_leaf',
    },
    {
      state: 'hawaii',
      state_code: 'HI',
      family: 'special_education_idea_part_b',
      severity: 'major',
      failure_code: 'official_special_education_leaf_access_denied',
      evidence: `The likely official Hawaii public schools special-education leaf (${SPECIAL_ED_URL}) redirects and then returns HTTP 403, so statewide IDEA Part B still lacks a reviewed exact authority leaf.`,
      next_action: 'author_reviewed_special_education_authority_leaf',
    },
    {
      state: 'hawaii',
      state_code: 'HI',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'statewide_school_root_only_and_special_education_leaf_403',
      evidence: `District routing still depends on the statewide Hawaii public schools root, and the likely special-education leaf (${SPECIAL_ED_URL}) returns HTTP 403 instead of county- or district-grade routing evidence.`,
      next_action: 'author_county_or_district_exact_targets',
    },
    ...preserved,
    {
      state: 'hawaii',
      state_code: 'HI',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'dead_locations_root_and_doi_directory_fallback',
      evidence: 'County-local disability resources still depend on dhhs.hawaii.gov/locations, which does not resolve, plus DOI-derived office extracts rather than reviewed county-specific official leaves.',
      next_action: 'author_reviewed_county_specific_office_leaves',
    },
  ];
}

function buildUpdatedVerifiedRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed live Hawaii DOH Developmental Disabilities Division root plus visible intake/contact links replace the dead dhhs sample.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Hawaii Developmental Disabilities Division (DDD)',
            source_url: REAL_DDD_URL,
            final_url: REAL_DDD_URL,
            verification_status: 'verified',
            source_type: 'official_live_probe',
            source_table: 'batch102_hawaii_consistency_refresh',
            fetched_at: '2026-06-22T15:49:00.000Z',
            evidence_snippet: 'Developmental Disabilities Division (DDD). Live page exposes DDD title plus contact and revised intake handbook links on the official health.hawaii.gov domain.',
          },
        ],
      };
    }
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'missing',
        evidence_strength: 'weak',
        sample_count: 0,
        query_basis: 'The old Hawaii Early Intervention sample does not survive live domain verification.',
        blocker_code: 'fake_domain_sample_requires_real_part_c_replacement',
        blocker_evidence: 'dhhs.hawaii.gov/earlystart does not resolve in live checks and no reviewed real official Part C page has yet replaced it.',
        samples: [],
      };
    }
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'blocked_official_leaf_access_denied',
        evidence_strength: 'weak',
        sample_count: 0,
        blocker_code: 'official_special_education_leaf_access_denied',
        blocker_evidence: `The likely official Hawaii public schools special-education leaf (${SPECIAL_ED_URL}) redirects and then returns HTTP 403.`,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_statewide_school_root_only',
        evidence_strength: 'weak',
        blocker_code: 'statewide_school_root_only_and_special_education_leaf_403',
        blocker_evidence: `Only statewide Hawaii public schools evidence is preserved, and the likely special-education leaf (${SPECIAL_ED_URL}) returns HTTP 403.`,
        samples: [
          {
            sample_name: "Hawai'i Public Schools",
            source_url: 'https://www.hawaiipublicschools.org/',
            verification_status: 'verified',
            source_type: 'statewide_root_only',
            source_table: 'school_districts',
          },
        ],
        sample_count: 1,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_fake_domain_and_doi_fallback',
        evidence_strength: 'weak',
        blocker_code: 'dead_locations_root_and_doi_directory_fallback',
        blocker_evidence: 'dhhs.hawaii.gov/locations does not resolve in live checks and the remaining office evidence is DOI-derived rather than reviewed county-specific official leaves.',
        samples: [
          {
            sample_name: 'Medicaid Office - State of Hawaii DHS MQD--East Hawaii Section',
            source_url: 'https://doi.org/10.7910/DVN/AVRHMI',
            verification_status: 'verified',
            source_type: 'doi_directory_fallback',
            source_table: 'county_offices',
          },
          {
            sample_name: 'Medicaid Office - State of Hawaii DHS MQD--Kapolei Section',
            source_url: 'https://doi.org/10.7910/DVN/AVRHMI',
            verification_status: 'verified',
            source_type: 'doi_directory_fallback',
            source_table: 'county_offices',
          },
        ],
        sample_count: 2,
      };
    }
    return row;
  });
}

function buildUpdatedSummary(existingSummary, failureRows, verifiedRows) {
  return {
    ...existingSummary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 58,
    strong_critical_families: 7,
    weak_critical_families: 4,
    missing_critical_families: 1,
    primary_gap_reason: 'fake_domains_and_access_denied_leaves_broke_prior_hawaii_packet_truth',
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: failureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };
}

function buildNextActions(failureRows) {
  return failureRows.map((row, index) => ({
    state: row.state,
    state_code: row.state_code,
    priority_rank: index + 1,
    family: row.family,
    severity: row.severity,
    failure_code: row.failure_code,
    next_action: row.next_action,
    evidence: row.evidence,
  }));
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Hawaii California-Grade Batch 64 Report v1',
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
    '- Hawaii still preserves real statewide protection-and-advocacy and PTI evidence from first-party reviewed artifacts, and the developmental-disability family can now point to the live Hawaii DOH DDD root instead of the dead dhhs.hawaii.gov sample.',
    `- Early intervention is no longer safely verified because the current packet relied on dhhs.hawaii.gov/earlystart, which does not resolve, and no reviewed real official Part C replacement is yet on disk.`,
    `- The likely official statewide special-education leaf (${SPECIAL_ED_URL}) redirects and then returns HTTP 403, so both IDEA Part B and district-or-county education routing remain blocked on current exact official evidence.`,
    '- County/local disability resources remain blocked because the old dhhs.hawaii.gov/locations root is dead and the remaining office evidence is DOI-derived rather than reviewed county-specific official leaves.',
    '- Hawaii therefore remains BLOCKED and not index-safe, with a lower but truer completeness score until those fake-domain and access-denied leaves are replaced by reviewed official sources.',
  ].join('\n') + '\n';
}

export function generateBatch102HawaiiConsistencyRefreshV1() {
  const summary = readJson(OUTPUTS.summary);
  const gapRows = readJsonl(OUTPUTS.gap);
  const verifiedRows = readJsonl(OUTPUTS.verified);

  const updatedGapRows = buildUpdatedGapRows(gapRows);
  const updatedFailures = buildUpdatedFailures(readJsonl(OUTPUTS.failures));
  const updatedVerifiedRows = buildUpdatedVerifiedRows(verifiedRows);
  const updatedSummary = buildUpdatedSummary(summary, updatedFailures, updatedVerifiedRows);
  const updatedNextActions = buildNextActions(updatedFailures);

  writeJson(OUTPUTS.summary, updatedSummary);
  writeJsonl(OUTPUTS.gap, updatedGapRows);
  writeJsonl(OUTPUTS.failures, updatedFailures);
  writeJsonl(OUTPUTS.verified, updatedVerifiedRows);
  writeJsonl(OUTPUTS.nextActions, updatedNextActions);
  fs.writeFileSync(OUTPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailures, updatedVerifiedRows, updatedNextActions));

  const batchSummary = {
    state: 'hawaii',
    classification: 'BLOCKED',
    index_safe: false,
    realDddUrl: REAL_DDD_URL,
    realDddContactUrl: REAL_DDD_CONTACT_URL,
    downgradedFamilies: ['early_intervention_part_c'],
    refreshedFamilies: ['developmental_disability_idd_authority'],
    blockerReason: 'fake_domains_and_access_denied_leaves_broke_prior_hawaii_packet_truth',
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 102 Hawaii Consistency Refresh Report v1',
      '',
      'This pass corrects Hawaii packet truth after live checks showed the packet still depended on dead dhhs.hawaii.gov roots and an access-denied DOE special-education leaf.',
      '',
      `- classification: ${batchSummary.classification}`,
      `- index_safe: ${batchSummary.index_safe ? 'true' : 'false'}`,
      `- real_ddd_url: ${batchSummary.realDddUrl}`,
      `- downgraded_families: ${batchSummary.downgradedFamilies.join(', ')}`,
      `- refreshed_families: ${batchSummary.refreshedFamilies.join(', ')}`,
      '',
    ].join('\n'),
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch102HawaiiConsistencyRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
