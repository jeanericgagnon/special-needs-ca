import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'missouri_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'missouri_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'missouri_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'missouri_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'missouri_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch172_missouri_arcgis_directory_completion_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch172-missouri-arcgis-directory-completion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'missouri-california-grade-audit-report-v2.md'),
};

const COMPLETION_EVIDENCE =
  'Reviewed 2026-06-23 the live official DESE School Data and School Directory pages at https://dese.mo.gov/school-data and https://dese.mo.gov/data-system-management/directory. The current directory page now exposes direct public resources that the older blocker missed, including an official ArcGIS Missouri Public School Directory app and direct county and district PDF downloads. The public ArcGIS app config is also open and points to the official district layer https://gis.mo.gov/arcgis/rest/services/DESE/Missouri_Public_Schools/MapServer/1. That live layer returns district rows with DIST_NAME, COUNTY, DIST_CODE, address, phone, district email, and URL fields, and a bounded distinct-value query returns 115 counties. Sample official rows include Adair Co. R-II in Adair County, Liberty 53 in Clay County, and Ferguson-Florissant R-II in St. Louis County. That county-mapped official district directory clears district_or_county_education_routing.';

const STATUS_REASON =
  'Reviewed 2026-06-23 the live official Missouri DESE School Directory page plus its public ArcGIS district layer. The official district layer returns county-mapped district rows with DIST_NAME, COUNTY, DIST_CODE, address, phone, district email, and URL fields, and a bounded distinct-value query covers all 115 Missouri counties. That county-grade official local-routing contract clears district_or_county_education_routing.';

const NEXT_ACTION =
  'Preserve Missouri as COMPLETE/index_safe and rerun only maintenance truth audits unless the DESE School Directory page or ArcGIS district layer regresses.';

const LESSON_HEADING =
  '### ArcGIS App Configs Can Expose Official District Layers Even When Older Directory Bridges Rot';
const LESSON_BODY =
  '*   **Lesson:** If a state school-directory login bridge or SSRS report path rots, inspect the live official directory page and any linked ArcGIS app config before dropping to district-site authoring. Missouri’s DESE directory page exposed a public ArcGIS app whose config revealed the exact district layer URL and county-mapped contact fields, which was enough to clear local routing without deeper scraping.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildReport(summary, gapRows, verifiedRows, nextRows) {
  return [
    '# Missouri California-Grade Audit Report v2',
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
    '- none',
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
    '- Missouri now reaches California-grade and is index-safe.',
    '- The old DESE SSRS/report-shell blocker was stale because the live School Directory page now exposes a public ArcGIS district layer and direct county/district directory downloads.',
    '- The official district layer returns county-mapped district rows with contact and website fields across all 115 Missouri counties, so the last district-or-county education routing blocker is cleared.',
  ].join('\n') + '\n';
}

export function generateBatch172MissouriArcgisDirectoryCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: 'batch_172_missouri_arcgis_directory_completion_v1',
    classification: 'COMPLETE',
    index_safe: true,
    incorrectly_index_safe: false,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: 'none',
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: [],
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'verified_county_grade',
          status_reason: STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = [];

  const updatedNextRows = [
    {
      state: 'missouri',
      state_code: 'MO',
      priority_rank: 1,
      family: 'maintenance',
      severity: 'info',
      failure_code: 'complete_maintain_truth_only',
      next_action: NEXT_ACTION,
      evidence: COMPLETION_EVIDENCE,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'verified_county_grade',
          evidence_strength: 'strong',
          sample_count: 5,
          query_basis: 'Reviewed live official Missouri DESE School Directory page, public ArcGIS app config, and exact district layer instead of the older broken SSRS bridge.',
          blocker_code: null,
          blocker_evidence: null,
          samples: [
            {
              sample_name: 'DESE School Directory',
              source_url: 'https://dese.mo.gov/data-system-management/directory',
              final_url: 'https://dese.mo.gov/data-system-management/directory',
              verification_status: 'verified',
              source_type: 'official_directory_root',
              source_table: 'batch172_missouri_arcgis_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live official page is titled School Directory and exposes the Missouri Public School Directory ArcGIS map plus direct School Directory by County and School Directory by District downloads.',
            },
            {
              sample_name: 'Missouri Public School Directory ArcGIS app',
              source_url: 'https://mogov.maps.arcgis.com/apps/webappviewer/index.html?id=42394a81012c4737a705d8e943b6fda5',
              final_url: 'https://mogov.maps.arcgis.com/apps/webappviewer/index.html?id=42394a81012c4737a705d8e943b6fda5',
              verification_status: 'verified',
              source_type: 'official_public_school_directory_map',
              source_table: 'batch172_missouri_arcgis_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public ArcGIS app config is open and labels the application Missouri Public School Directory.',
            },
            {
              sample_name: 'Official district layer metadata',
              source_url: 'https://gis.mo.gov/arcgis/rest/services/DESE/Missouri_Public_Schools/MapServer/1',
              final_url: 'https://gis.mo.gov/arcgis/rest/services/DESE/Missouri_Public_Schools/MapServer/1?f=json',
              verification_status: 'verified',
              source_type: 'official_county_mapped_district_layer',
              source_table: 'batch172_missouri_arcgis_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live district layer is named Public School Districts and exposes fields including DIST_NAME, DIST_CODE, DADDRESS_1, DCITY_1, DZIP_1, COUNTY, DPHONE_1, DIEMAIL, and URL.',
            },
            {
              sample_name: 'Official district layer county coverage',
              source_url: 'https://gis.mo.gov/arcgis/rest/services/DESE/Missouri_Public_Schools/MapServer/1/query',
              final_url: 'https://gis.mo.gov/arcgis/rest/services/DESE/Missouri_Public_Schools/MapServer/1/query',
              verification_status: 'verified',
              source_type: 'official_county_mapped_district_layer',
              source_table: 'batch172_missouri_arcgis_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded distinct-value query on COUNTY returns 115 Missouri counties, from Adair through Wright.',
            },
            {
              sample_name: 'Official district layer sample rows',
              source_url: 'https://gis.mo.gov/arcgis/rest/services/DESE/Missouri_Public_Schools/MapServer/1/query',
              final_url: 'https://gis.mo.gov/arcgis/rest/services/DESE/Missouri_Public_Schools/MapServer/1/query',
              verification_status: 'verified',
              source_type: 'official_county_mapped_district_layer',
              source_table: 'batch172_missouri_arcgis_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Sample official rows include Adair Co. R-II in Adair County, Liberty 53 in Clay County, and Ferguson-Florissant R-II in St. Louis County, each with address, phone, district email, and website fields.',
            },
          ],
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'missouri',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    cleared_family: 'district_or_county_education_routing',
    covered_counties: 115,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 172 Missouri ArcGIS Directory Completion Report v1',
      '',
      'This pass replaces the stale DESE SSRS blocker with the live official DESE School Directory page and its public ArcGIS district layer. The official district layer exposes county-mapped local routing fields directly.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- covered_counties: ${batchSummary.covered_counties}`,
      `- cleared_family: ${batchSummary.cleared_family}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch172MissouriArcgisDirectoryCompletionV1();
  console.log(JSON.stringify(summary, null, 2));
}
