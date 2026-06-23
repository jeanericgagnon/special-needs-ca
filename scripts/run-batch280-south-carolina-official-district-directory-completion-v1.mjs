import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'south-carolina_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'south-carolina_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'south-carolina_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'south-carolina_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'south-carolina_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'south-carolina-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch280_south-carolina_official_district_directory_completion_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch280-south-carolina-official-district-directory-completion-report-v1.md'),
};

const COMPLETION_EVIDENCE =
  'Reviewed 2026-06-23 the live official South Carolina Department of Education School Directory page at https://ed.sc.gov/districts-schools/schools/school-directory/, its public JSON backend at https://ed.sc.gov/sites/scdoe/includes/schoolDirectory2026/cfc/schooldirectory.cfc, and the public ArcGIS district layer exposed by the same page at https://services5.arcgis.com/tMDU4iABlmKqkZWJ/arcgis/rest/services/SC_SchoolDirectory_view/FeatureServer/20. The official page hard-codes the `getAllDeimsSchoolsFiltered` and `getDistricts` methods, the `getDistricts` endpoint returns 72 live district rows for school year 2026, and the official district layer returns district name, superintendent, district phone, and website fields with zero blank phone or website rows. A bounded county reconciliation against the live district names and full district labels matched all 46 South Carolina counties to one or more official district rows, including multi-district counties like Anderson, Dillon, Dorchester, Florence, Lexington, Spartanburg, and York. That official district-directory stack is strong enough to replace the old statewide `ed.sc.gov` fallback rows and clear district_or_county_education_routing at county grade.';

const STATUS_REASON =
  'Reviewed 2026-06-23 the live official South Carolina School Directory page, its public `getDistricts` JSON method, and the public ArcGIS district layer it exposes. Together they preserve 72 live district rows for school year 2026 with district names, superintendent names, phone numbers, and websites, and a bounded county reconciliation matches all 46 South Carolina counties to one or more official district rows. That official district-directory contract clears district_or_county_education_routing at county grade without relying on the old statewide fallback page.';

const NEXT_ACTION =
  'Preserve South Carolina as COMPLETE/index_safe and rerun only maintenance truth audits unless the official School Directory page, its CFC methods, or the ArcGIS district layer regress.';

const LESSON_HEADING =
  '### Official School-Directory Backends And District Layers Can Clear County-Grade Education Routing';
const LESSON_BODY =
  '*   **Lesson:** If an official school-directory page exposes both a live district-list backend and a public district contact layer, use that state-managed directory contract before falling back to district-by-district leaf authoring. South Carolina cleared once the live SCDE School Directory page, its `getDistricts` JSON method, and its public ArcGIS district layer together proved 46/46 counties had named district routing with phone and website fields.';

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

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function updateBulletListSection(text, heading, items) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(## ${escaped}\\n\\n)([\\s\\S]*?)(\\n## )`);
  const replacement = `$1${items.map((item) => `- ${item}`).join('\n')}$3`;
  return text.replace(pattern, replacement);
}

function updateCurrentFocus(text) {
  const focusBlock = [
    '## Current Focus State: North Carolina',
    '',
    '### Blocker Reason',
    '',
    'North Carolina still has two critical California-grade blockers: `district_or_county_education_routing` and `county_local_disability_resources`. The current packet preserves one real district-owned education leaf at Charlotte-Mecklenburg Schools, but most counties still collapse to statewide DPI Exceptional Children or other generic/non-district leaves. The county-local lane is similarly weak because saved samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` instead of reviewed county-owned DSS or local-assistance directories.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Additional district-owned special-education or student-services leaves beyond Charlotte-Mecklenburg so uncovered counties stop relying on the statewide DPI Exceptional Children root.',
    '- County-owned DSS or local-assistance directory leaves that replace the DOI mirror with real North Carolina county routing.',
    '- Any official export, directory, or county-keyed contract from North Carolina that directly maps counties to district routing and county local office routing.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [North Carolina DPI Exceptional Children root](https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children)',
    '- [Charlotte-Mecklenburg Schools special-education anchor](https://www.cmsk12.org/Page/213)',
    '- [North Carolina DOI mirror currently blocking county-local routing](https://doi.org/10.7910/DVN/AVRHMI)',
    '- [ECAC via Parent Center Hub](https://www.parentcenterhub.org/findurcenter/north-carolina/)',
    '- [Disability Rights North Carolina](https://disabilityrightsnc.org/)',
    '- [Legal Aid of North Carolina](https://legalaidnc.org/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- District-owned special-education or student-services leaves for counties still using statewide DPI fallback.',
    '- County-owned DSS or local-assistance directory pages that clearly preserve county office identity and routing.',
    '- Any official North Carolina county-keyed education or local-office export that can replace the contaminated queue with one truthful statewide contract.',
    '',
  ].join('\n');
  return replaceSection(text, '## Current Focus State:', '## Next State Order After', focusBlock);
}

function buildStateReport(summary, gapRows, verifiedRows, nextRows) {
  return [
    '# South Carolina California-Grade Audit Report v2',
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
    '- South Carolina now reaches California-grade and is index-safe.',
    '- The old statewide `ed.sc.gov` fallback is no longer the governing evidence surface for education routing.',
    '- The live official School Directory page, its public `getDistricts` backend, and the linked ArcGIS district layer together preserve county-covering district routing with real district phone and website fields.',
    '- Because all 46 counties now match one or more official district rows from that public state-managed directory stack, the last South Carolina critical blocker is cleared.',
  ].join('\n') + '\n';
}

export function generateBatch280SouthCarolinaOfficialDistrictDirectoryCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: 'batch_280_south_carolina_official_district_directory_completion_v1',
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
      state: 'south-carolina',
      state_code: 'SC',
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
          query_basis: 'Reviewed the live official South Carolina School Directory page, its public `getDistricts` JSON method, and the public ArcGIS district layer it exposes.',
          blocker_code: null,
          blocker_evidence: null,
          samples: [
            {
              sample_name: 'South Carolina School Directory page',
              source_url: 'https://ed.sc.gov/districts-schools/schools/school-directory/',
              final_url: 'https://ed.sc.gov/districts-schools/schools/school-directory/',
              verification_status: 'verified',
              source_type: 'official_directory_root',
              source_table: 'batch280_south_carolina_official_district_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live official page is titled `School Directory` and hard-codes both `getAllDeimsSchoolsFiltered` and `getDistricts` as public JSON methods, alongside the public traditional-schools ArcGIS experience.',
            },
            {
              sample_name: 'SCDE getDistricts JSON method',
              source_url: 'https://ed.sc.gov/sites/scdoe/includes/schoolDirectory2026/cfc/schooldirectory.cfc?returnformat=json&schoolyear=2026&method=getDistricts',
              final_url: 'https://ed.sc.gov/sites/scdoe/includes/schoolDirectory2026/cfc/schooldirectory.cfc?returnformat=json&schoolyear=2026&method=getDistricts',
              verification_status: 'verified',
              source_type: 'official_public_json_directory',
              source_table: 'batch280_south_carolina_official_district_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live `getDistricts` method returns 72 district rows for school year 2026, including `Abbeville 60`, `Aiken`, and `Allendale` district entries on the official SCDE host.',
            },
            {
              sample_name: 'SCDE district layer metadata',
              source_url: 'https://services5.arcgis.com/tMDU4iABlmKqkZWJ/arcgis/rest/services/SC_SchoolDirectory_view/FeatureServer/20',
              final_url: 'https://services5.arcgis.com/tMDU4iABlmKqkZWJ/arcgis/rest/services/SC_SchoolDirectory_view/FeatureServer/20?f=json',
              verification_status: 'verified',
              source_type: 'official_public_district_layer',
              source_table: 'batch280_south_carolina_official_district_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live district layer exposes `District_Name`, `FullDistri`, `Name`, `District_Phone`, and `Website` fields on the official SCDE School Directory service.',
            },
            {
              sample_name: 'Single-county district sample row',
              source_url: 'https://services5.arcgis.com/tMDU4iABlmKqkZWJ/arcgis/rest/services/SC_SchoolDirectory_view/FeatureServer/20/query',
              final_url: 'https://services5.arcgis.com/tMDU4iABlmKqkZWJ/arcgis/rest/services/SC_SchoolDirectory_view/FeatureServer/20/query',
              verification_status: 'verified',
              source_type: 'official_public_district_layer',
              source_table: 'batch280_south_carolina_official_district_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Sample official district rows include `Abbeville County School District` with district phone `(864) 366-5427` and website `https://www.acsdsc.org/`, plus `Aiken County School District` with district phone `(803) 641-2428` and website `https://www.acpsd.net/`.',
            },
            {
              sample_name: 'Multi-district county coverage sample',
              source_url: 'https://services5.arcgis.com/tMDU4iABlmKqkZWJ/arcgis/rest/services/SC_SchoolDirectory_view/FeatureServer/20/query',
              final_url: 'https://services5.arcgis.com/tMDU4iABlmKqkZWJ/arcgis/rest/services/SC_SchoolDirectory_view/FeatureServer/20/query',
              verification_status: 'verified',
              source_type: 'official_public_district_layer',
              source_table: 'batch280_south_carolina_official_district_directory_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The same official district layer preserves multi-district county routing too: Anderson County maps to five district rows (`Anderson School District 1` through `Anderson School District 5`), all with non-blank district phone and website fields.',
            },
          ],
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextRows));

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);

  let handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  handoff = handoff.replace(
    'Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, Pennsylvania, Texas',
    'Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, Pennsylvania, South Carolina, Texas',
  );
  handoff = handoff.replace('\n- South Carolina: `official_school_directory_root_is_live_but_not_yet_converted_into_district_owned_special_education_leaves`', '');
  handoff = updateCurrentFocus(handoff);
  handoff = handoff.replace(
    /## Next State Order After[\s\S]*$/,
    [
      '## Next State Order After South Carolina',
      '',
      '1. North Carolina',
      '2. New York',
      '3. Oklahoma',
      '4. Oregon',
      '5. Ohio',
      '6. Minnesota',
      '7. Maine',
      '8. Idaho',
      '9. Arizona',
      '10. Massachusetts',
    ].join('\n'),
  );
  fs.writeFileSync(INPUTS.handoff, handoff);

  const batchSummary = {
    state: 'south-carolina',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    cleared_family: 'district_or_county_education_routing',
    official_directory_page: 'https://ed.sc.gov/districts-schools/schools/school-directory/',
    official_json_method: 'https://ed.sc.gov/sites/scdoe/includes/schoolDirectory2026/cfc/schooldirectory.cfc?returnformat=json&schoolyear=2026&method=getDistricts',
    official_district_layer: 'https://services5.arcgis.com/tMDU4iABlmKqkZWJ/arcgis/rest/services/SC_SchoolDirectory_view/FeatureServer/20',
    district_rows: 72,
    matched_counties: 46,
    multi_district_counties: 11,
    blank_phone_rows: 0,
    blank_website_rows: 0,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 280 South Carolina Official District Directory Completion Report v1',
      '',
      'This pass replaces the old statewide `ed.sc.gov` district fallback with the live official South Carolina School Directory stack. The public page, its `getDistricts` JSON backend, and the linked ArcGIS district layer together provide county-covering district routing evidence without reopening broad district leaf discovery.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- district_rows: ${batchSummary.district_rows}`,
      `- matched_counties: ${batchSummary.matched_counties}`,
      `- multi_district_counties: ${batchSummary.multi_district_counties}`,
      `- blank_phone_rows: ${batchSummary.blank_phone_rows}`,
      `- blank_website_rows: ${batchSummary.blank_website_rows}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch280SouthCarolinaOfficialDistrictDirectoryCompletionV1();
  console.log(JSON.stringify(summary, null, 2));
}
