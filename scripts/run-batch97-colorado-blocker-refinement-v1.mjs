import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'colorado_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'colorado_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'colorado_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'colorado_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'colorado_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch97_colorado_blocker_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch97-colorado-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'colorado-california-grade-audit-report-v2.md'),
};

const EDUCATION_EVIDENCE = 'Reviewed current Colorado school_district rows on 2026-06-22. All 64 county-linked school_district rows still collapse to the same statewide CDE special-education URL https://www.cde.state.co.us/cdesped, including county fallback names like Adams, Alamosa, and Arapahoe, so no district-owned education leaf is currently verified for California-grade county routing.';
const COUNTY_EVIDENCE = 'Reviewed current Colorado county_offices rows on 2026-06-22. At least 67 county-office rows for Colorado counties still use the DOI mirror https://doi.org/10.7910/DVN/AVRHMI with source_listed evidence levels, including Adams, Alamosa, Arapahoe, and Boulder, so county-local office routing is still backed by mirror data rather than reviewed county-owned leaves.';

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
    '# Colorado California-Grade Audit Report v2',
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
    '- Colorado still cannot reach California-grade or become index-safe because district or county education routing still collapses to one statewide CDE root across all 64 counties, and county/local disability resources still rely on DOI mirror rows instead of reviewed county-owned office leaves.',
    '- Colorado is therefore still BLOCKED and not index-safe, but the remaining blockers are now tied to exact fallback row classes rather than vague inventory counts.',
  ].join('\n') + '\n';
}

export function generateBatch97ColoradoBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_statewide_cde_fallback_rows_only',
        status_reason: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_doi_mirror_county_rows_only',
        status_reason: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'all_counties_still_use_statewide_cde_special_education_root',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'county_office_rows_still_backed_by_doi_mirror',
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_statewide_cde_fallback_rows_only',
        blocker_code: 'all_counties_still_use_statewide_cde_special_education_root',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_doi_mirror_county_rows_only',
        blocker_code: 'county_office_rows_still_backed_by_doi_mirror',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'all_counties_still_use_statewide_cde_special_education_root',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'county_office_rows_still_backed_by_doi_mirror',
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
        failure_code: 'all_counties_still_use_statewide_cde_special_education_root',
        evidence: EDUCATION_EVIDENCE,
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'county_office_rows_still_backed_by_doi_mirror',
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
    batch: 'batch_97_colorado_blocker_refinement_v1',
    generated_at: '2026-06-22T18:40:00.000Z',
    state: 'colorado',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      education: EDUCATION_EVIDENCE,
      countyLocal: COUNTY_EVIDENCE,
    },
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Colorado Blocker Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      '',
      '## Evidence checks',
      '',
      `- education: ${EDUCATION_EVIDENCE}`,
      `- county_local: ${COUNTY_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch97ColoradoBlockerRefinementV1();
}
