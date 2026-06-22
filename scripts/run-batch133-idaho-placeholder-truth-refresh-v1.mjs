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
  batchSummary: path.join(generatedDir, 'batch133_idaho_placeholder_truth_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch133-idaho-placeholder-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'live_db_rows_still_reuse_statewide_placeholders_for_both_local_families';

const EDUCATION_REASON = 'Reviewed live Idaho SDE special-education authority, staff, parent-resources, and Idaho Schools pages plus the current school_district DB inventory. The current official stack preserves statewide authority and staff support, but the live DB rows are still fully statewide placeholders: all 44 Idaho school_district rows reuse statewide SDE URLs instead of district-owned or county-mapped routing leaves. The Idaho Schools page exposes no district entries or county mapping in fetched public content, so district-grade education routing remains blocked.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho SDE pages: https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, and https://www.sde.idaho.gov/about-us/idaho-schools/, plus the live school_district DB rows. The official SDE stack preserves statewide authority, staff contacts, and parent resources, but the Idaho Schools page exposes no district entries or county mapping in fetched public content. The live DB inventory is still 44/44 statewide placeholders: every Idaho school_district row reuses a statewide SDE URL rather than a district-owned or county-mapped routing leaf.';

const COUNTY_REASON = 'Reviewed live Idaho DHW Contact Us and /offices pages plus the current county_offices DB inventory. The reviewed official stack now proves that exact DHW office leaves exist, but the live county routing table is still mostly placeholder-backed: 27 rows still use the dead legacy dhhs.idaho.gov/locations storefront root, while the remaining 18 rows still point to the generic Medicaid page https://healthandwelfare.idaho.gov/services-programs/medicaid-health instead of exact office leaves. Because the public /offices page does not expose county-to-office mapping in fetched public content, county-grade local routing remains blocked.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho DHW office routing pages: https://healthandwelfare.idaho.gov/contact-us and https://healthandwelfare.idaho.gov/offices, plus live county_offices DB rows. The exact office stack repairs named office proof for many locations, but the live DB table is still placeholder-backed: 27 county rows use the dead legacy locator https://dhhs.idaho.gov/locations and the other 18 rows still point to the generic Medicaid page https://healthandwelfare.idaho.gov/services-programs/medicaid-health rather than exact office leaves. The public /offices page also exposes no county-to-office mapping in fetched public content, so a truthful county mapping still cannot be verified.';

const LESSON_HEADING = '### Named Office Labels Still Count As Placeholders When The URL Is Generic';
const LESSON_BODY = '*   **Lesson:** Do not let a realistic office name fool the packet if the stored URL is still generic. Idaho looked partially repaired because rows were labeled `Boise Office`, `Blackfoot Office`, and `Idaho Falls Office`, but the live URLs still pointed at one generic Medicaid page or a dead legacy locator, so those rows were still placeholders until the exact office leaves were attached.';

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
    '- Education is still blocked because all 44 current school_district rows are statewide placeholders and the reviewed Idaho Schools stack exposes no district or county mapping contract.',
    '- County-local is still blocked because 27 current office rows still use the dead legacy locator and the other 18 still point at one generic Medicaid page rather than exact office leaves, while the public offices page exposes no county mapping contract.',
  ].join('\n') + '\n';
}

export function generateBatch133IdahoPlaceholderTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: summary.final_blockers.map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, evidence: EDUCATION_EVIDENCE };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, evidence: COUNTY_EVIDENCE };
      }
      return row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        query_basis: 'Verified school-district routing pages for the state plus live DB placeholder counts.',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Verified county office rows for local routing plus live DB placeholder counts.',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_EVIDENCE };
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
    district_placeholder_rows: 44,
    county_dead_locator_rows: 27,
    county_generic_medicaid_rows: 18,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 133 Idaho Placeholder Truth Refresh Report v1',
      '',
      'This pass does not broaden Idaho discovery. It sharpens the final blockers by reconciling the live DB rows against the reviewed official pages.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- district_placeholder_rows: ${batchSummary.district_placeholder_rows}`,
      `- county_dead_locator_rows: ${batchSummary.county_dead_locator_rows}`,
      `- county_generic_medicaid_rows: ${batchSummary.county_generic_medicaid_rows}`,
      `- primary_gap_reason: ${updatedSummary.primary_gap_reason}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch133IdahoPlaceholderTruthRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
