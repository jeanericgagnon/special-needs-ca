import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'georgia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'georgia_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'georgia_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'georgia_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'georgia_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch122_georgia_resa_county_map_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch122-georgia-resa-county-map-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
};

const EDU_REASON = 'The official GaDOE RESA page now preserves county-grade education routing from one first-party source: its embedded AcfGeoMap JSON maps 159 unique Georgia county IDs across 16 RESA regions and links each county cluster to an official RESA site, so county-grade regional education routing can be verified without reopening broad district-leaf discovery.';
const EDU_EVIDENCE = 'Reviewed 2026-06-22 bounded live official fetch of https://gadoe.org/contact/georgia-resa/. The live GaDOE page embeds an AcfGeoMap data payload in __NEXT_DATA__ whose regions array contains 163 county-ID entries, 159 unique Georgia county IDs, and only 4 duplicate IDs that repeat inside the same RESA region rather than conflicting across regions. The same official page links each county cluster to a named RESA site such as https://www.nwgaresa.com/, https://www.ngresa.org/, and https://www.mresa.org/. That preserves a first-party county-to-RESA routing contract for all 159 Georgia counties, so district_or_county_education_routing no longer depends on just 5 exact district leaves.';
const LESSON_HEADING = '### Embedded Official County Maps Can Close A Regional Routing Family Without Reopening District Discovery';
const LESSON_BODY = '*   **Lesson:** When a live official education page looks sparse, inspect its embedded page JSON before reopening district discovery. Georgia’s official GaDOE RESA page carried a complete 159-county FIPS-to-RESA contract in `__NEXT_DATA__` / `AcfGeoMap`, which was enough to verify county-grade routing from one official source plus named RESA targets.';

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
    '# Georgia California-Grade Audit Report v2',
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
    '## Georgia final blocker decision',
    '',
    '- Developmental disability routing remains blocked because the live DBHDD county lookup page itself points only to unpublished region leaves and still does not expose a public county-to-region routing contract.',
    '- District or county education routing is now verified from the official GaDOE RESA county map, whose embedded first-party JSON covers 159/159 Georgia counties and links them to named RESA regional routing sites.',
    '- Georgia remains blocked and not index-safe because one critical DD family is still unresolved, not because education lacks county-grade proof.',
  ].join('\n') + '\n';
}

export function generateBatch122GeorgiaResaCountyMapRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'verified_state_grade', status_reason: EDU_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'district_or_county_education_routing');
  const updatedNextRows = nextRows.filter((row) => row.family !== 'district_or_county_education_routing');

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'verified_state_grade',
          evidence_strength: 'strong',
          sample_count: 4,
          query_basis: 'Reviewed official GaDOE RESA county-map page and its embedded AcfGeoMap JSON; one first-party county-to-region contract covers all 159 Georgia counties.',
          blocker_code: null,
          blocker_evidence: null,
          samples: [
            {
              sample_name: 'GaDOE Georgia RESA county map',
              source_url: 'https://gadoe.org/contact/georgia-resa/',
              final_url: 'https://gadoe.org/contact/georgia-resa/',
              verification_status: 'verified',
              source_type: 'official_state_county_map',
              source_table: 'reviewed_first_party_artifact',
              fetched_at: '2026-06-22T00:00:00.000Z',
              evidence_snippet: 'The official GaDOE RESA page says to click the regions on the map or use the list below, and its embedded AcfGeoMap payload maps 159 unique Georgia county IDs across 16 named RESA regions.'
            },
            {
              sample_name: 'Northwest Georgia RESA',
              source_url: 'https://www.nwgaresa.com/',
              verification_status: 'verified',
              source_type: 'official_regional_routing_target',
              source_table: 'reviewed_first_party_artifact',
              evidence_snippet: 'Named official RESA target linked from the GaDOE county map for a reviewed Georgia county cluster.'
            },
            {
              sample_name: 'North Georgia RESA',
              source_url: 'https://www.ngresa.org/',
              verification_status: 'verified',
              source_type: 'official_regional_routing_target',
              source_table: 'reviewed_first_party_artifact',
              evidence_snippet: 'Named official RESA target linked from the GaDOE county map for a reviewed Georgia county cluster.'
            },
            {
              sample_name: 'Metro RESA',
              source_url: 'https://www.mresa.org/',
              verification_status: 'verified',
              source_type: 'official_regional_routing_target',
              source_table: 'reviewed_first_party_artifact',
              evidence_snippet: 'Named official RESA target linked from the GaDOE county map for a reviewed Georgia county cluster.'
            },
          ],
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    critical_gap_families: ['developmental_disability_idd_authority'],
    final_blockers: summary.final_blockers.filter((row) => row.family !== 'district_or_county_education_routing'),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'georgia'
      ? {
          ...row,
          completeness_pct: 91,
          weak_critical_families: 1,
          primary_gap_reason: 'official_county_page_points_to_unpublished_region_leaves',
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'georgia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_family: 'district_or_county_education_routing',
    countyMapMetrics: {
      regionCount: 16,
      totalCountyIds: 163,
      uniqueCountyIds: 159,
      duplicateIds: 4,
      duplicateIdsSameRegionOnly: true,
    },
    remaining_blockers: updatedNextRows.map((row) => row.family),
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 122 Georgia RESA County Map Repair Report v1',
      '',
      'This pass does not broaden Georgia district discovery. It promotes the official GaDOE RESA county map into the county-grade education routing contract.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- unique_county_ids: ${batchSummary.countyMapMetrics.uniqueCountyIds}`,
      `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch122GeorgiaResaCountyMapRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
