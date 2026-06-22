import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'connecticut_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'connecticut_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'connecticut_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'connecticut_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'connecticut_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch98_connecticut_blocker_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch98-connecticut-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'connecticut-california-grade-audit-report-v2.md'),
};

const PTI_EVIDENCE = 'Reviewed 2026-06-22 live first-party CPAC About page https://cpacinc.org/about.aspx. The page preserves the sentence "Beth is also the Director of CPAC\'s federally funded Parent Training and Information (PTI) Center project," so CPAC now has explicit first-party PTI designation evidence rather than only generic statewide family-support language.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 bounded live checks on the exact Connecticut SDE special-education leaf https://portal.ct.gov/sde/special-education, the generic SDE root https://portal.ct.gov/sde, and the official EdSight portal https://edsight.ct.gov/. The special-education leaf exposed no district-directory links beyond itself, the SDE root exposed only statewide Bureau/central-office and data-portal links, and EdSight described statewide reports about schools and districts but did not preserve district-owned special-education routing contacts. No district-grade education leaf is currently verified for any of Connecticut’s 8 counties.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live checks on the Connecticut DSS root https://portal.ct.gov/dss/home plus likely office-location leaves https://portal.ct.gov/dss/common-elements/office-locations and https://portal.ct.gov/dss/common-elements/search-dss-office-locations. The DSS home exposed statewide program/help and hearing links only, and both office-location guesses returned HTTP 404, so no reviewed official county office directory leaf currently replaces the DOI mirror office rows.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Connecticut California-Grade Audit Report v2',
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
    '- Connecticut still cannot reach California-grade or become index-safe because district routing remains unresolved after bounded checks of the exact SDE and EdSight leaves, and county-local office routing still lacks a reviewed official county office directory leaf after bounded DSS location-path checks.',
    '- CPAC is no longer a blocker because the live first-party About page explicitly preserves federally funded Parent Training and Information (PTI) Center designation text.',
    '- Connecticut is therefore still BLOCKED and not index-safe, but the remaining blockers are now reduced to the two local-proof families with sharper bounded-source evidence.',
  ].join('\n') + '\n';
}

export function generateBatch98ConnecticutBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_statewide_ct_sde_fallback_rows_only',
        status_reason: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'The live first-party CPAC About page now explicitly preserves federally funded Parent Training and Information (PTI) Center designation text.',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_doi_and_generic_locations_rows_only',
        status_reason: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family !== 'parent_training_information_center')
    .map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'all_counties_still_use_statewide_ct_sde_roots',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'county_office_rows_still_backed_by_doi_or_generic_locations_root',
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
    });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_statewide_ct_sde_fallback_rows_only',
        blocker_code: 'all_counties_still_use_statewide_ct_sde_roots',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed live first-party CPAC About page now explicitly preserves Parent Training and Information Center designation text for Connecticut statewide family support.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Connecticut Parent Advocacy Center PTI About page',
            source_url: 'https://cpacinc.org/about.aspx',
            final_url: 'https://cpacinc.org/about.aspx',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Beth is also the Director of CPAC\'s federally funded Parent Training and Information (PTI) Center project.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_doi_and_generic_locations_rows_only',
        blocker_code: 'county_office_rows_still_backed_by_doi_or_generic_locations_root',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'parent_training_information_center')
    .map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'all_counties_still_use_statewide_ct_sde_roots',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'county_office_rows_still_backed_by_doi_or_generic_locations_root',
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
    });

  const updatedSummary = {
    ...summary,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: 'district_grade_education_and_official_county_office_directory_leaves_still_missing',
    major_gap_families: [],
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'all_counties_still_use_statewide_ct_sde_roots',
        evidence: EDUCATION_EVIDENCE,
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'county_office_rows_still_backed_by_doi_or_generic_locations_root',
        evidence: COUNTY_EVIDENCE,
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_98_connecticut_blocker_refinement_v1',
    generated_at: '2026-06-22T19:00:00.000Z',
    state: 'connecticut',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      education: EDUCATION_EVIDENCE,
      countyLocal: COUNTY_EVIDENCE,
      pti: PTI_EVIDENCE,
    },
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Connecticut Blocker Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      '',
      '## Evidence checks',
      '',
      `- education: ${EDUCATION_EVIDENCE}`,
      `- county_local: ${COUNTY_EVIDENCE}`,
      `- pti_repair: ${PTI_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch98ConnecticutBlockerRefinementV1();
}
