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

const PRIMARY_GAP_REASON = 'official_local_directories_exist_but_live_rows_still_lack_county_mapped_replacements';

const EDUCATION_CODE = 'official_sde_district_directory_exists_but_no_county_mapped_special_education_contract';
const EDUCATION_REASON = 'Reviewed 2026-06-22 official Idaho SDE district routing sources: https://www.sde.idaho.gov/school-districts/, https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, and https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, plus live school_district DB rows. The official SDE stack now clearly preserves a real district directory: the public /school-districts/ page exposes 106 district website links. But the reviewed fetched markup still exposes no county-mapped fields or county-to-district contract, and the live DB inventory is still 44/44 statewide placeholders that reuse statewide SDE URLs rather than reviewed county-mapped or district-owned special-education routing leaves.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho SDE sources including https://www.sde.idaho.gov/school-districts/, https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, and https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, plus the live school_district DB rows. The official /school-districts/ page exposes 106 district website links, proving local district leaves exist. But the fetched public markup exposes no county header, district header, address header, website header, phone header, or other county-mapped table contract, and the live DB inventory is still 44/44 statewide placeholders: every Idaho school_district row still reuses a statewide SDE URL rather than a reviewed county-mapped or district-owned routing leaf.';

const COUNTY_CODE = 'official_dhw_office_leaves_exist_but_live_rows_still_lack_county_to_office_mapping';
const COUNTY_REASON = 'Reviewed 2026-06-22 official Idaho DHW office routing sources: https://healthandwelfare.idaho.gov/offices, https://healthandwelfare.idaho.gov/contact-us, the official DHW sitemap, and live county_offices DB rows. The official office stack is stronger than the current packet implied: the sitemap now exposes 23 exact DHW office leaves. But the public /offices page still exposes no county-to-office mapping contract in fetched content, and the live DB table remains placeholder-backed: 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations while the other 18 still point to the generic Medicaid page https://healthandwelfare.idaho.gov/services-programs/medicaid-health instead of exact office leaves.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho DHW sources including https://healthandwelfare.idaho.gov/offices, https://healthandwelfare.idaho.gov/contact-us, and the official sitemap https://healthandwelfare.idaho.gov/sitemap.xml, plus live county_offices DB rows. The official sitemap exposes 23 exact office leaves such as /dhw/boise-office-westgate-building, /dhw/caldwell-office, and /dhw/idaho-falls-office, proving local office leaves exist. But the fetched public /offices page still exposes no county-to-office mapping contract, while 27 live county rows still use the dead legacy locator https://dhhs.idaho.gov/locations and the other 18 still point to the generic Medicaid page https://healthandwelfare.idaho.gov/services-programs/medicaid-health rather than exact office leaves.';

const LESSON_HEADING = '### Official Local Directories Can Prove Leaf Existence Without Proving County Mapping';
const LESSON_BODY = '*   **Lesson:** When an official state directory or sitemap exposes many local leaves, split “local leaves exist” from “county mapping is verified.” Idaho SDE exposed 106 district links and Idaho DHW exposed 23 office leaves, but both families still stayed blocked because the public sources did not map those leaves back to counties and the live DB rows still used statewide placeholders.';

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
    '- Education is no longer blocked because local leaves are absent; it is blocked because the official district directory is not county-mapped and the live school rows still reuse statewide placeholders.',
    '- County-local is no longer blocked because exact office leaves are unknown; it is blocked because the office leaves are not mapped back to counties in public source and the live county rows still point at placeholder URLs.',
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
      return { ...row, failure_code: EDUCATION_CODE, evidence: EDUCATION_EVIDENCE, next_action: 'author_county_mapped_district_routing_from_official_directory_or_hold_blocked' };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_CODE, evidence: COUNTY_EVIDENCE, next_action: 'author_exact_county_to_office_mappings_from_official_office_leaves_or_hold_blocked' };
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
      return { ...row, family_status: 'blocked_official_district_directory_without_county_mapping', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'blocked_official_office_leaves_without_county_mapping', status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_district_directory_without_county_mapping',
        query_basis: 'Reviewed official Idaho SDE district directory plus live DB placeholder counts.',
        blocker_code: EDUCATION_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Idaho School Districts directory',
            source_url: 'https://www.sde.idaho.gov/school-districts/',
            final_url: 'https://www.sde.idaho.gov/school-districts/',
            verification_status: 'verified',
            source_type: 'official_district_directory',
            source_table: 'batch141_idaho_official_local_directory_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official Idaho School Districts page exposes 106 district website links, proving district-owned leaves exist, but no county-mapped contract is exposed in fetched markup.',
          },
          ...(row.samples || []).slice(1, 4),
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_official_office_leaves_without_county_mapping',
        query_basis: 'Reviewed official Idaho DHW office directory, sitemap-exposed office leaves, and live DB placeholder counts.',
        blocker_code: COUNTY_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Idaho DHW offices sitemap leaf set',
            source_url: 'https://healthandwelfare.idaho.gov/sitemap.xml',
            final_url: 'https://healthandwelfare.idaho.gov/sitemap.xml',
            verification_status: 'verified',
            source_type: 'official_sitemap_with_exact_office_leaves',
            source_table: 'batch141_idaho_official_local_directory_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official Idaho DHW sitemap exposes 23 exact office leaves including Boise, Caldwell, and Idaho Falls office pages, but no county-to-office mapping contract.',
          },
          ...(row.samples || []).slice(0, 3),
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_CODE, next_action: 'author_county_mapped_district_routing_from_official_directory_or_hold_blocked', evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_CODE, next_action: 'author_exact_county_to_office_mappings_from_official_office_leaves_or_hold_blocked', evidence: COUNTY_EVIDENCE };
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
    official_district_links: 106,
    exact_office_leaves: 23,
    school_placeholder_rows: 44,
    county_dead_locator_rows: 27,
    county_generic_medicaid_rows: 18,
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
      `- county_generic_medicaid_rows: ${batchSummary.county_generic_medicaid_rows}`,
      `- primary_gap_reason: ${updatedSummary.primary_gap_reason}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch141IdahoOfficialLocalDirectoryRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
