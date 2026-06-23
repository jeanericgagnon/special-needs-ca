import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'michigan_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'michigan_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'michigan_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'michigan_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'michigan_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch160_michigan_county_leaf_completion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch160-michigan-county-leaf-completion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'michigan-california-grade-audit-report-v2.md'),
};

const EDUCATION_BLOCKER_CODE = 'official_mde_arcgis_school_map_exposes_geometry_without_local_routing_contract';
const EDUCATION_NEXT_ACTION = 'hold_blocked_until_official_district_or_isd_routing_contract_exists';
const COUNTY_REASON = 'Reviewed 2026-06-22 the official MDHHS county-offices root, the East Michigan, Urban Counties, U.P. and Northern Michigan, and West Michigan region pages, and the exact missing county leaves for Alger, Alpena, Ingham, Lenawee, and St. Joseph. Those reviewed first-party leaf pages close the previous 78-county plus one combined-leaf contract and now preserve a full 83-county official MDHHS county-office lane.';

const COUNTY_SAMPLES = [
  {
    sample_name: 'MDHHS County Offices Root',
    source_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices',
    final_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices',
    verification_status: 'official_verified',
    source_type: 'official_county_directory_root',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The official County Offices root publicly links the reviewed East Michigan, Urban Counties, U.P. and Northern Michigan, and West Michigan region pages that collectively preserve county-specific MDHHS office leaves.',
  },
  {
    sample_name: 'Alger County MDHHS',
    source_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/up-and-northern-michigan/alger-county-mdhhs',
    final_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/up-and-northern-michigan/alger-county-mdhhs',
    verification_status: 'official_verified',
    source_type: 'official_county_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The reviewed first-party leaf resolves as Alger County MDHHS on the official Michigan domain and preserves a county-specific MDHHS office page.',
  },
  {
    sample_name: 'Alpena County MDHHS',
    source_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/up-and-northern-michigan/alpena-county-mdhhs',
    final_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/up-and-northern-michigan/alpena-county-mdhhs',
    verification_status: 'official_verified',
    source_type: 'official_county_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The reviewed first-party leaf resolves as Alpena County MDHHS on the official Michigan domain and preserves a county-specific MDHHS office page.',
  },
  {
    sample_name: 'Ingham MDHHS',
    source_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/urban-counties/ingham-mdhhs',
    final_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/urban-counties/ingham-mdhhs',
    verification_status: 'official_verified',
    source_type: 'official_county_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The reviewed first-party leaf resolves as Ingham MDHHS on the official Michigan domain and preserves a county-specific MDHHS office page.',
  },
  {
    sample_name: 'Lenawee County',
    source_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/east-michigan/lenawee-county-1',
    final_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/east-michigan/lenawee-county-1',
    verification_status: 'official_verified',
    source_type: 'official_county_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The reviewed first-party leaf resolves as Lenawee County on the official Michigan domain and preserves a county-specific MDHHS office page.',
  },
  {
    sample_name: 'St. Joseph County',
    source_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/west-michigan/st--joseph-county-1',
    final_url: 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/west-michigan/st--joseph-county-1',
    verification_status: 'official_verified',
    source_type: 'official_county_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The reviewed first-party leaf resolves as St. Joseph County on the official Michigan domain and preserves a county-specific MDHHS office page.',
  },
];

const LESSON_HEADING = '### Footer-Heavy Official Region Pages Can Still Complete County-Leaf Coverage';
const LESSON_BODY = '*   **Lesson:** If an official county-office region page looks empty above the fold, inspect the footer-adjacent list before treating counties as missing. Michigan MDHHS kept county leaf links like `Alger County MDHHS`, `Ingham MDHHS`, and `St. Joseph County` near the bottom of the region pages, and those exact official leaves were enough to close the county-local blocker without reopening broad discovery.';

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
    '# Michigan California-Grade Audit Report v2',
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
    '- County-local disability resources now pass at county grade because the official MDHHS region pages and the newly reviewed exact leaves for Alger, Alpena, Ingham, Lenawee, and St. Joseph close the last five unmatched counties from the prior bounded extraction.',
    '- District or county education routing remains blocked because the reviewed official MDE ArcGIS app still exposes only geometry and identifiers, not district-owned special-education leaves, routing contacts, or a county-to-district routing contract.',
    '- Michigan therefore remains `BLOCKED` and `index_safe=false` until the education-routing blocker is replaced with county-grade official routing evidence.',
  ].join('\n') + '\n';
}

export function generateBatch160MichiganCountyLeafCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'verified_county_grade', status_reason: COUNTY_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'county_local_disability_resources');

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        family_status: 'verified_county_grade',
        evidence_strength: 'strong',
        sample_count: COUNTY_SAMPLES.length,
        query_basis: 'Reviewed 2026-06-22 the official MDHHS county-offices root, the named region pages, and the five previously missing exact county leaves.',
        blocker_code: null,
        blocker_evidence: null,
        samples: COUNTY_SAMPLES,
      }
      : row
  ));

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'county_local_disability_resources')
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const remainingBlockers = summary.final_blockers.filter((row) => row.family !== 'county_local_disability_resources');
  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: EDUCATION_BLOCKER_CODE,
    critical_gap_families: ['district_or_county_education_routing'],
    final_blockers: remainingBlockers,
    complete_ready: false,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'michigan',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_family: 'county_local_disability_resources',
    remaining_final_blockers: remainingBlockers.map((row) => row.family),
    newly_verified_counties: ['alger', 'alpena', 'ingham', 'lenawee', 'st-joseph'],
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 160 Michigan County Leaf Completion Report v1',
      '',
      'This pass does not broaden Michigan discovery. It closes the county-local blocker by verifying the five exact MDHHS county leaves that were previously missing from the bounded region-page extraction.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- repaired_family: county_local_disability_resources`,
      `- remaining_blocker: ${EDUCATION_BLOCKER_CODE}`,
      '- newly_verified_counties: alger, alpena, ingham, lenawee, st-joseph',
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch160MichiganCountyLeafCompletionV1();
  console.log(JSON.stringify(summary, null, 2));
}
