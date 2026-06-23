import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch188_idaho_county_contract_finalization_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch188-idaho-county-contract-finalization-report-v1.md'),
};

const EDUCATION_FAILURE_CODE = 'official_district_directory_has_116_links_but_zero_county_or_special_education_fields';
const COUNTY_FAILURE_CODE = 'official_dhw_office_stack_has_zero_county_fields_and_only_17_clean_leaf_matches';

const EDUCATION_REASON = 'The official Idaho School Districts directory is live and materially useful for leaf authoring, but it still does not satisfy county-grade routing on its own. A bounded 2026-06-23 HTML and JSON review preserved 116 exact outbound district website links plus only 12 county-bearing district names, while exposing zero explicit county fields and zero special-education or student-services fields on the official directory page itself. The district leaf packet still has 0 authored reviewed local leaves, so Idaho education remains blocked until district-owned special-education or student-services leaves are attached county by county.';
const COUNTY_REASON = 'The official Idaho DHW office stack is live and materially useful for office-leaf authoring, but it still does not satisfy county-grade office routing on its own. A bounded 2026-06-23 HTML review of https://healthandwelfare.idaho.gov/offices preserved named office entries and exact office leaves, but exposed zero county terms or county-served fields in the public office directory HTML. The current packet still resolves only 17 clean county-to-office leaf matches plus one Canyon split, while 27 counties remain on the dead legacy locator with no public county-to-office contract.';

const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 live official Idaho SDE sources at https://www.sde.idaho.gov/school-districts/ and https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049. The directory and public JSON preserve 116 exact outbound district website links, but only 12 county-bearing district names and no explicit county field, county filter, district special-education contact field, special-education heading, or student-services heading. Idaho therefore still lacks a public county-to-district education-routing contract, and the district leaf packet still has 0 authored reviewed local leaves.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 live official Idaho DHW sources at https://healthandwelfare.idaho.gov/offices and https://healthandwelfare.idaho.gov/sitemap.xml. The public office directory HTML preserves named office entries such as Caldwell, Boise, Blackfoot, Idaho Falls, and Sandpoint-Ponderay and the sitemap preserves exact office leaves, but the office directory HTML exposes zero county terms or county-served fields. The county-local packet still resolves only 17 clean county-to-office leaf matches plus one Canyon split, while 27 counties remain on the dead legacy locator https://dhhs.idaho.gov/locations with no public county-to-office contract.';

const LESSON_HEADING = '### Zero County Tokens In A Live Official Locator Means The County Contract Is Still Missing';
const LESSON_BODY = '*   **Lesson:** If a live official office or district directory preserves exact leaves but its public HTML exposes zero county terms, zero county-served fields, and no county filter, do not treat the locator as county-grade proof. Idaho DHW `/offices` and the Idaho SDE district directory were both live and useful for authoring, but still failed the county contract until reviewed local leaves could be attached.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '## Repair decision',
    '',
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education stays blocked because the live official SDE directory is only an authoring surface today: it has 116 district links but still no county field and no special-education field on the official directory itself.',
    '- County-local stays blocked because the live official DHW office stack is only a partial authoring surface today: it has exact office leaves, but the public directory still shows zero county-served fields and only 17 clean county matches on disk.',
    '- Future Idaho work should start from the existing district-leaf packet and office-leaf packet rather than rereading statewide Idaho roots.',
  ].join('\n') + '\n';
}

export function generateBatch188IdahoCountyContractFinalizationV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'live_official_idaho_directory_pages_exist_but_still_do_not_expose_county_grade_contracts_for_education_or_dhw_office_routing',
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE };
      }
      return row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_official_district_directory_without_county_grade_contract',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_office_directory_without_public_county_contract',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: EDUCATION_FAILURE_CODE,
        evidence: EDUCATION_EVIDENCE,
        next_action: 'author_reviewed_district_owned_special_education_or_student_services_leaves_from_existing_idaho_packet',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
        next_action: 'hold_17_clean_office_leaf_matches_and_keep_27_counties_blocked_until_public_county_contract_exists',
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_official_district_directory_without_county_grade_contract',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        query_basis: 'Reviewed live official Idaho SDE district directory HTML and public page JSON, then reconciled those sources against the current district leaf packet.',
        evidence_strength: 'medium',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_office_directory_without_public_county_contract',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        query_basis: 'Reviewed live official Idaho DHW office directory HTML and sitemap, then reconciled those sources against the materialized office-leaf packet.',
        evidence_strength: 'medium',
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: EDUCATION_FAILURE_CODE,
        next_action: 'author_reviewed_district_owned_special_education_or_student_services_leaves_from_existing_idaho_packet',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: COUNTY_FAILURE_CODE,
        next_action: 'hold_17_clean_office_leaf_matches_and_keep_27_counties_blocked_until_public_county_contract_exists',
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_188_idaho_county_contract_finalization_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    official_district_links_reviewed: 116,
    county_bearing_district_names_visible: 12,
    district_directory_has_explicit_county_field: false,
    district_directory_has_special_education_field: false,
    clean_county_office_leaf_matches: 17,
    unresolved_legacy_counties: 27,
    office_directory_has_county_field: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 188 Idaho County Contract Finalization Report v1',
    '',
    '- Reviewed only the live official Idaho SDE district directory/page JSON and the live official Idaho DHW office directory/sitemap.',
    '- Education remains blocked because the official directory is a real authoring surface but still exposes no county field and no special-education field.',
    '- County-local remains blocked because the official office stack is a real authoring surface but still exposes no public county-served field.',
    '- Idaho remains BLOCKED and not index-safe.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch188IdahoCountyContractFinalizationV1();
  console.log(JSON.stringify(result, null, 2));
}
