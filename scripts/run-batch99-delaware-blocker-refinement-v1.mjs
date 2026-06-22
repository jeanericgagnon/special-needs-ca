import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'delaware_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'delaware_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'delaware_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'delaware_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'delaware_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch99_delaware_blocker_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch99-delaware-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'delaware-california-grade-audit-report-v2.md'),
};

const SPECIAL_ED_EVIDENCE = 'Reviewed 2026-06-22 live Delaware DOE navigation and exact special-education leafs. The current DOE homepage exposes https://education.delaware.gov/families/k12/special-education/, which resolves to the live legacy special-education page at https://education.delaware.gov/legacy/home/instruction-and-assessment/exceptional-children/special-education/ and preserves statewide special-education authority evidence. This repairs the zero-sample statewide special_education_idea_part_b family, but it does not satisfy county- or district-grade routing.';
const EDUCATION_ROUTING_EVIDENCE = 'Reviewed 2026-06-22 bounded live Delaware DOE checks on the statewide special-education root, the legacy "For Districts and Charters" leaf, and the official public-school-list leaves discovered through the DOE WordPress sitemap. Those pages preserve statewide special-education authority and public-school list headings, but the fetched HTML still does not preserve district-owned special-education contact routing for Kent, New Castle, or Sussex. Delaware therefore still lacks county-grade district routing evidence.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 live official DHSS State Service Centers page https://dhss.delaware.gov/dss/division-of-social-services/state-service-centers/. The page preserves county-grouped local office routing directly in HTML for all three Delaware counties, including New Castle service centers in Wilmington/Newark/New Castle, Kent County centers in Dover and Smyrna, and Sussex County centers in Georgetown, Laurel, Seaford, Bridgeville, Milford, and Frankford.';

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
    '# Delaware California-Grade Audit Report v2',
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
    '- Delaware now has reviewed statewide special-education authority evidence again, because the live DOE navigation exposes an exact current special-education leaf that resolves to the legacy special-education page.',
    '- Delaware now also has reviewed county-local office routing because the live DHSS State Service Centers page preserves county-grouped service-center listings directly in HTML for New Castle, Kent, and Sussex.',
    '- Delaware still cannot reach California-grade or become index-safe because district routing remains unresolved after bounded DOE special-education, district-and-charter, and public-school-list checks failed to preserve district-owned special-education contacts.',
    '- Delaware is therefore still BLOCKED and not index-safe, but only the education local-proof family remains blocked.',
  ].join('\n') + '\n';
}

export function generateBatch99DelawareBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed live Delaware DOE navigation now preserves an exact statewide special-education authority leaf',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_statewide_de_doe_root_rows_only',
        status_reason: EDUCATION_ROUTING_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'The live DHSS State Service Centers page preserves county-grouped local office routing directly in HTML for New Castle, Kent, and Sussex.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !['special_education_idea_part_b', 'county_local_disability_resources'].includes(row.family)).map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'all_counties_still_use_statewide_de_doe_root',
        evidence: EDUCATION_ROUTING_EVIDENCE,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed 2026-06-22 live Delaware DOE homepage navigation and exact special-education leaf redirect into the legacy special-education page.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Delaware DOE Special Education',
            source_url: 'https://education.delaware.gov/families/k12/special-education/',
            final_url: 'https://education.delaware.gov/legacy/home/instruction-and-assessment/exceptional-children/special-education/',
            verification_status: 'official_verified',
            source_type: 'official_navigation_leaf',
            source_table: 'bounded_live_delaware_check',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The current Delaware DOE homepage exposes a Special Education leaf that resolves to the legacy Special Education page and preserves statewide special-education authority content.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_statewide_de_doe_root_rows_only',
        blocker_code: 'all_counties_still_use_statewide_de_doe_root',
        blocker_evidence: EDUCATION_ROUTING_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'The reviewed Delaware DHSS State Service Centers page itself preserves county-grouped local office routing and replaces DOI mirror placeholders.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Delaware DHSS State Service Centers',
            source_url: 'https://dhss.delaware.gov/dss/division-of-social-services/state-service-centers/',
            final_url: 'https://dhss.delaware.gov/dss/division-of-social-services/state-service-centers/',
            verification_status: 'verified',
            source_type: 'official_county_coverage_leaf',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official State Service Centers page groups local office entries by New Castle, Kent County, and Sussex County and lists specific centers in Wilmington, Newark, New Castle, Dover, Smyrna, Georgetown, Laurel, Seaford, Bridgeville, Milford, and Frankford.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.filter((row) => !['special_education_idea_part_b', 'county_local_disability_resources'].includes(row.family)).map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'all_counties_still_use_statewide_de_doe_root',
        evidence: EDUCATION_ROUTING_EVIDENCE,
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: 'district_grade_education_leafs_still_missing',
    major_gap_families: [],
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'all_counties_still_use_statewide_de_doe_root',
        evidence: EDUCATION_ROUTING_EVIDENCE,
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
    batch: 'batch_99_delaware_blocker_refinement_v1',
    generated_at: '2026-06-22T19:20:00.000Z',
    state: 'delaware',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_families: ['special_education_idea_part_b', 'county_local_disability_resources'],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      specialEducation: SPECIAL_ED_EVIDENCE,
      educationRouting: EDUCATION_ROUTING_EVIDENCE,
      countyLocal: COUNTY_EVIDENCE,
    },
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Delaware Blocker Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      '- repaired_families: special_education_idea_part_b, county_local_disability_resources',
      '',
      '## Evidence checks',
      '',
      `- special_education: ${SPECIAL_ED_EVIDENCE}`,
      `- education_routing: ${EDUCATION_ROUTING_EVIDENCE}`,
      `- county_local: ${COUNTY_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch99DelawareBlockerRefinementV1();
}
