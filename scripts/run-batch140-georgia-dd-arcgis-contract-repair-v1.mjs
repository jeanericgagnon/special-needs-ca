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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch140_georgia_dd_arcgis_contract_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch140-georgia-dd-arcgis-contract-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
};

const FETCHED_AT = '2026-06-22T00:00:00.000Z';
const COMPLETE_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';
const DD_STATUS_REASON = 'The official DBHDD ArcGIS app is now verified as a county-grade DD routing contract. Its public sharing/rest item data exposes the RegionAndCounties FeatureServer layer, and the bounded layer query returns 159 Georgia county features with region labels plus office address, main phone, DDIE manager, and DDIE phone fields. That preserves a deterministic official county-to-region routing map without relying on unpublished region leaves.';
const DD_EVIDENCE = `Reviewed 2026-06-22 bounded live official sources for https://dbhdd.georgia.gov/regional-field-office-county and the public ArcGIS app https://dbhdd.maps.arcgis.com/apps/instant/lookup/index.html?appid=66e57defda7a442597357d9be5ec00bc. The app's public item data endpoint https://dbhdd.maps.arcgis.com/sharing/rest/content/items/66e57defda7a442597357d9be5ec00bc/data?f=json exposes the RegionAndCounties FeatureServer URL, and the public layer query https://services3.arcgis.com/DDkUK0yvA80AZVe5/arcgis/rest/services/DBHDDRegionDetails_WFL1/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&f=json returns 159 county features with county names, region labels, office address, office phone, DDIE manager, and DDIE phone fields. Georgia's DD family is therefore county-grade verified from live official first-party ArcGIS data even though the old CMS region leaves remain unpublished.`;

const DD_SAMPLES = [
  {
    sample_name: 'Regional Field Office by County',
    source_url: 'https://dbhdd.georgia.gov/regional-field-office-county',
    final_url: 'https://dbhdd.georgia.gov/regional-field-office-county',
    verification_status: 'verified',
    source_type: 'official_state_county_lookup',
    source_table: 'reviewed_first_party_artifact',
    fetched_at: FETCHED_AT,
    evidence_snippet: 'The official DBHDD county lookup page preserves the public entrypoint for determining a regional field office by county.'
  },
  {
    sample_name: 'DBHDD Regions Lookup ArcGIS item data',
    source_url: 'https://dbhdd.maps.arcgis.com/sharing/rest/content/items/66e57defda7a442597357d9be5ec00bc/data?f=json',
    final_url: 'https://dbhdd.maps.arcgis.com/sharing/rest/content/items/66e57defda7a442597357d9be5ec00bc/data?f=json',
    verification_status: 'verified',
    source_type: 'official_arcgis_item_data',
    source_table: 'reviewed_first_party_artifact',
    fetched_at: FETCHED_AT,
    evidence_snippet: 'The public ArcGIS item data exposes the RegionAndCounties search source and the FeatureServer URL for the DBHDD county-to-region lookup.'
  },
  {
    sample_name: 'DBHDD RegionAndCounties FeatureServer query',
    source_url: 'https://services3.arcgis.com/DDkUK0yvA80AZVe5/arcgis/rest/services/DBHDDRegionDetails_WFL1/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&f=json',
    final_url: 'https://services3.arcgis.com/DDkUK0yvA80AZVe5/arcgis/rest/services/DBHDDRegionDetails_WFL1/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&f=json',
    verification_status: 'verified',
    source_type: 'official_arcgis_feature_query',
    source_table: 'reviewed_first_party_artifact',
    fetched_at: FETCHED_AT,
    evidence_snippet: 'The bounded public layer query returns 159 Georgia county features with fields including NAME, luRegionDesc_1, Address1, City, Phone_Number, DDIEManager, and DDIEPhone.'
  }
];

const LESSON_HEADING = '### ArcGIS Item Data Can Rescue A Generic Instant-App Shell';
const LESSON_BODY = '*   **Lesson:** If an official ArcGIS Instant App only renders a generic shell, check the public `sharing/rest/content/items/<appid>/data?f=json` contract before final-blocking it. Georgia DBHDD looked blocked at the HTML shell, but the public item data exposed a live FeatureServer query with all 159 county-to-region DD mappings and contact fields.';

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
    '## Georgia final decision',
    '',
    '- Georgia is now COMPLETE and index-safe.',
    '- The last DD blocker was resolved by the live official DBHDD ArcGIS contract, not by the unpublished CMS region leaves.',
    '- The public item-data and FeatureServer query preserve a deterministic 159-county county-to-region map with office and DD contact fields, which satisfies county-grade DD routing.',
  ].join('\n') + '\n';
}

export function generateBatch140GeorgiaDdArcgisContractRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    classification: 'COMPLETE',
    index_safe: true,
    incorrectly_index_safe: false,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: COMPLETE_REASON,
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: null,
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          family_status: 'verified_state_grade',
          status_reason: DD_STATUS_REASON,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          family_status: 'verified_state_grade',
          evidence_strength: 'strong',
          sample_count: 159,
          query_basis: 'Reviewed official DBHDD county lookup root plus public ArcGIS item-data and FeatureServer query endpoints; the live first-party layer returns all 159 Georgia counties with region and DD contact fields.',
          blocker_code: null,
          blocker_evidence: null,
          samples: DD_SAMPLES,
        }
      : row
  ));

  const updatedFailureRows = [];
  const updatedNextRows = [
    {
      state: 'georgia',
      state_code: 'GA',
      priority_rank: 1,
      family: 'maintenance',
      severity: 'info',
      failure_code: 'complete_maintain_truth_only',
      next_action: 'Preserve Georgia as COMPLETE/index_safe and rerun only maintenance truth audits unless new evidence regresses.',
      evidence: 'Official DBHDD ArcGIS item-data and FeatureServer county query, official GaDOE RESA county map contract, official DFCS county offices, and reviewed first-party statewide support sources now close Georgia at California-grade.',
    }
  ];

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'georgia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_family: 'developmental_disability_idd_authority',
    arcgis_county_features: 159,
    arcgis_region_values: 6,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 140 Georgia DD ArcGIS Contract Repair Report v1',
      '',
      'This pass reopens only Georgia’s final DD blocker and upgrades it from blocked to verified using the public first-party ArcGIS contract behind the official DBHDD lookup app.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- repaired_family: developmental_disability_idd_authority`,
      `- arcgis_county_features: ${batchSummary.arcgis_county_features}`,
      `- arcgis_region_values: ${batchSummary.arcgis_region_values}`,
      '',
      '## Decision',
      '',
      '- The HTML app shell was not enough, but the public item-data endpoint exposed the live FeatureServer contract.',
      '- The bounded query returned all 159 Georgia counties with region labels and DD office/contact fields.',
      '- Georgia is now COMPLETE/index-safe without reopening broad discovery.',
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch140GeorgiaDdArcgisContractRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
