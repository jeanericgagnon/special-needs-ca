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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch141_idaho_official_local_directory_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch141-idaho-official-local-directory-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'official_directories_now_expose_exact_targets_but_nampa_negative_proof_and_missing_county_mapping_keep_idaho_blocked';

const EDUCATION_CODE = 'official_school_district_directory_exposes_district_links_but_not_county_or_special_education_fields';
const EDUCATION_REASON = 'Reviewed 2026-06-22 official Idaho SDE district routing sources: https://www.sde.idaho.gov/school-districts/, https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, and https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, plus live school_district DB rows and the public WordPress page JSON. The official SDE stack now clearly preserves a real district directory: the public /school-districts/ page exposes 116 exact outbound district website links. But the reviewed public content still exposes no county labels and no district special-education contact fields, and the live DB inventory is still 44 county fallback rows that reuse statewide or generic SDE URLs rather than reviewed county-mapped or district-owned routing leaves.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho SDE pages: https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, https://www.sde.idaho.gov/about-us/idaho-schools/, and the official School Districts directory https://www.sde.idaho.gov/school-districts/ plus its public WordPress page JSON. The School Districts page explicitly says it is a complete list of Idaho K-12 districts and preserves 116 exact outbound district website links, but bounded live content checks show the public directory page itself does not expose county labels such as Canyon County and does not expose district special-education contact fields in reviewed public content. A live DB reconciliation now makes the fallback shape exact: the current school_district table still has 44 Idaho county rows, with 42 rows still using the statewide fallback https://www.sde.idaho.gov/sped/ and the remaining 2 rows (Ada and Canyon) still using the generic SDE root https://www.sde.idaho.gov/. County-grade education routing still cannot be verified.';

const COUNTY_CODE = 'official_dhw_office_directory_exposes_exact_office_leaves_but_nampa_resolves_only_to_switc_and_county_mapping_stays_publicly_missing';
const COUNTY_REASON = 'Reviewed 2026-06-22 current official Idaho DHW office routing pages plus the paginated office directory. The official directory still exposes 27 exact office leaves and 18 DOI-backed county rows already name-match reviewed official office leaves. But the unresolved Canyon/Nampa gap is now narrower: the official directory mentions Nampa only on page 2 for Southwest Idaho Treatment Center (SWITC), not for a county office or benefits office leaf. Twenty-seven county rows still rely on the dead legacy `dhhs.idaho.gov/locations` root, and the public DHW office stack remains city-or-ZIP search only, so county-to-office routing is still not publicly verifiable.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho DHW office routing pages: https://healthandwelfare.idaho.gov/contact-us, https://healthandwelfare.idaho.gov/offices?page=0, https://healthandwelfare.idaho.gov/offices?page=1, https://healthandwelfare.idaho.gov/offices?page=2, and the DHW sitemap https://healthandwelfare.idaho.gov/sitemap.xml, plus one bounded follow-up on Nampa mentions inside the public office directory HTML. The paginated official directory preserves 27 exact office entries and the sitemap preserves exact office leaves such as /dhw/boise-office-westgate-building, /dhw/pocatello-office-horizon-building, /dhw/blackfoot-office-blackfoot-services-complex, /dhw/caldwell-office, /dhw/idaho-falls-office, /dhw/payette-office, /dhw/rexburg-office, /dhw/sandpoint-ponderay-office, and /dhw/twin-falls-office-pole-line-building. Eighteen DOI-backed county rows already name-match official office leaves, but 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations. The bounded Nampa follow-up showed that the current public directory mentions Nampa only for Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not for a reviewed county office or benefits office leaf. The public office search is still city-or-ZIP only, so county-to-office routing cannot yet be verified.';

const LESSON_HEADING = '### Official Local Directories Can Prove Leaf Existence Without Proving County Mapping';
const LESSON_BODY = '*   **Lesson:** When an official state directory or sitemap exposes many local leaves, split “local leaves exist” from “county mapping is verified.” Idaho SDE exposed 116 district links and Idaho DHW exposed exact office leaves, but both families still stayed blocked because the public sources did not map those leaves back to counties and the live DB rows still used statewide placeholders.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '## Completion decision',
    '',
    '- Idaho remains BLOCKED and not index-safe.',
        '- Education is still blocked on county-keyed or reviewed district special-education routing, even though the official state district directory exposes exact district links.',
        '- County-local is still blocked because the public office directory does not map exact office leaves back to counties, and the bounded Nampa follow-up resolves only to Southwest Idaho Treatment Center rather than a county office leaf.',
  ].join('\n') + '\n';
}

export function generateBatch141IdahoOfficialLocalDirectoryRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_CODE, evidence: EDUCATION_EVIDENCE, next_action: 'author_reviewed_district_targets_from_official_school_districts_directory_or_keep_county_routing_blocked' };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_CODE, evidence: COUNTY_EVIDENCE, next_action: 'replace_18_doi_mirror_rows_with_exact_office_leaves_and_keep_27_legacy_counties_blocked_until_a_public_county_to_office_contract_exists' };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_official_district_directory_without_county_or_special_education_fields', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial', status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_district_directory_without_county_or_special_education_fields',
        query_basis: 'Reviewed official Idaho SDE district directory plus live DB placeholder counts.',
        blocker_code: EDUCATION_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        sample_count: 3,
        samples: [
          {
            sample_name: 'School Districts',
            source_url: 'https://www.sde.idaho.gov/school-districts/',
            final_url: 'https://www.sde.idaho.gov/school-districts/',
            verification_status: 'verified',
            source_type: 'official_statewide_district_directory',
            source_table: 'batch141_idaho_official_local_directory_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official School Districts page says it is a complete list of Idaho K-12 districts and preserves 116 exact district website links, but the reviewed page does not expose county labels or district special-education contact fields.',
          },
          ...(row.samples || []).slice(1, 3),
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial',
        query_basis: 'Reviewed official Idaho DHW office directory, sitemap-exposed office leaves, and one bounded Nampa negative-proof follow-up.',
        blocker_code: COUNTY_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        sample_count: 4,
        samples: [
          ...(row.samples || []).filter((sample) => sample.sample_name !== 'Nampa Office unresolved exact leaf').slice(0, 3),
          {
            sample_name: 'Nampa mention resolves only to SWITC',
            source_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
            final_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
            verification_status: 'blocked',
            source_type: 'official_city_match_wrong_role',
            source_table: 'batch141_idaho_official_local_directory_refinement',
            fetched_at: '2026-06-22T22:25:00.000Z',
            evidence_snippet: 'The only public Nampa mention on the official office directory is Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not a county office or benefits office leaf.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_CODE, next_action: 'author_reviewed_district_targets_from_official_school_districts_directory_or_keep_county_routing_blocked', evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_CODE, next_action: 'replace_18_doi_mirror_rows_with_exact_office_leaves_and_keep_27_legacy_counties_blocked_until_a_public_county_to_office_contract_exists', evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    official_district_links: 116,
    exact_office_leaves: 27,
    school_placeholder_rows: 44,
    county_dead_locator_rows: 27,
    county_doi_mirror_rows: 18,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 141 Idaho Official Local Directory Refinement Report v1',
      '',
      'This pass stays bounded to official Idaho SDE and DHW directory sources. It records that public local directories and exact office leaves exist, but county mapping is still missing from the public contract and from live DB rows.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- official_district_links: ${batchSummary.official_district_links}`,
      `- exact_office_leaves: ${batchSummary.exact_office_leaves}`,
      `- school_placeholder_rows: ${batchSummary.school_placeholder_rows}`,
      `- county_dead_locator_rows: ${batchSummary.county_dead_locator_rows}`,
      `- county_doi_mirror_rows: ${batchSummary.county_doi_mirror_rows}`,
      `- primary_gap_reason: ${updatedSummary.primary_gap_reason}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch141IdahoOfficialLocalDirectoryRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
