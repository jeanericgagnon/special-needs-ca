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

const PTI_EVIDENCE = 'Reviewed 2026-06-22 live CPAC homepage plus bounded same-domain follow-ups. The homepage exposed only two same-domain links, likely About roots and sitemap endpoints returned 404, and no fetched first-party page preserved explicit PTI / Parent Training and Information designation text. CPAC still proves statewide Connecticut family-support and training scope, but not the exact PTI designation required for California-grade statewide support.';
const EDUCATION_EVIDENCE = 'Reviewed current Connecticut school_district rows on 2026-06-22. Six county-linked rows still point to the statewide CDE special-education leaf https://portal.ct.gov/sde/special-education, and the remaining Fairfield and Hartford rows still point only to the generic CT SDE root https://portal.ct.gov/sde, so no district-owned education leaf is currently verified for any of Connecticut’s 8 counties.';
const COUNTY_EVIDENCE = 'Reviewed current Connecticut county_offices rows on 2026-06-22. Eleven county-office rows still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence, and the remaining Tolland row still points only to the generic locations root https://dhhs.connecticut.gov/locations, so county-local office routing is not yet backed by reviewed county-owned leaves.';

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
    '- Connecticut still cannot reach California-grade or become index-safe because district routing remains statewide-root fallback only across all 8 counties, county-local office routing still relies on DOI mirror plus one generic locations root row, and CPAC still lacks explicit PTI designation text in the reviewed first-party chain.',
    '- Connecticut is therefore still BLOCKED and not index-safe, but the remaining blockers are now tied to exact row classes and bounded first-party PTI failure evidence.',
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
        status_reason: PTI_EVIDENCE,
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

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'all_counties_still_use_statewide_ct_sde_roots',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        evidence: PTI_EVIDENCE,
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
        query_basis: 'Reviewed 2026-06-22 live CPAC homepage plus bounded same-domain follow-ups after the saved first-party artifact remained too generic for PTI designation.',
        blocker_evidence: PTI_EVIDENCE,
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

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'all_counties_still_use_statewide_ct_sde_roots',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        evidence: PTI_EVIDENCE,
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
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'all_counties_still_use_statewide_ct_sde_roots',
        evidence: EDUCATION_EVIDENCE,
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: PTI_EVIDENCE,
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
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
      pti: PTI_EVIDENCE,
      countyLocal: COUNTY_EVIDENCE,
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
      `- pti: ${PTI_EVIDENCE}`,
      `- county_local: ${COUNTY_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch98ConnecticutBlockerRefinementV1();
}
