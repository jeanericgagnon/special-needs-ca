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
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch264_idaho_emmett_reviewed_district_leaf_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch264-idaho-emmett-reviewed-district-leaf-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete';
const EDUCATION_FAILURE_CODE = 'reviewed_district_special_services_leaves_now_cover_12_counties_but_county_grade_mapping_is_still_incomplete';
const EDUCATION_NEXT_ACTION = 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet';
const EDUCATION_STATUS_REASON = 'The Idaho education blocker remains an exact reviewed-leaf expansion lane, but it is stronger than before: official district-owned local leaves are now reviewable for twelve counties. Emmett Independent School District now joins Cassia, Payette, Bannock, Boundary, Butte, Bonneville, Jerome, Minidoka, Blaine, Teton, Gooding, and the earlier reviewed set through a direct district-owned `Special Education` page. Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the packet still carries reviewed local leaves for only a subset of the 44 counties.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 one more bounded live Idaho district-owned leaf directly from the official SDE district root lane. The official Idaho School Districts page JSON links Emmett School District #221 at https://www.emmettschools.org/. That live district root exposed exact special-education candidates, including https://www.emmettschools.org/departments/special-education and https://www.emmettschools.org/our-district/programs/special-education-early-childhood-preschool. The exact district-owned Special Education page returned HTTP 200 with title `Special Education - Emmett Independent School District`, H1 `Special Education`, and preserved procedural-safeguards text on the district-owned host. Idaho education therefore now has twelve reviewed county-level district-owned leaves, but the statewide SDE directory still exposes no county-to-district contract and the remaining counties still need exact leaf expansion.';

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
    '- Education is still a county-by-county exact-leaf expansion lane, but Emmett Independent School District brings the reviewed count to twelve counties with a newly verified district-owned Special Education page.',
    '- County-local remains the same explicit split: 17 clean office replacements plus the Canyon split are preserved, and 27 counties stay blocked until Idaho publishes a public county-to-office contract.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Idaho: `reviewed_idaho_district_leaves_now_cover_11_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`', '- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`')
    .replace('## Current Focus State: Maine', '## Current Focus State: Idaho')
    .replace(
      '`district_or_county_education_routing` remains the top Maine blocker in the state queue. The official DOE selector pages and SAU workbook are live, but the workbook only carries municipality-to-organization mapping fields and the named contact-search/export replays still return the same HTTP 500 error shell. Maine therefore still lacks a reproducible county-grade local contact contract in the low-token lane.',
      '`district_or_county_education_routing` remains the top Idaho blocker in the state queue. The official SDE district directory still exposes no county contract, but district-owned special-education leaves are reviewable county by county. Emmett Independent School District now adds Gem County to the reviewed set, bringing Idaho to twelve reviewed district-owned county leaves while the remaining counties still need exact local expansion.'
    )
    .replace(
      '- Any first-party Maine DOE contact row lane that materializes real local contacts from the live selector/workbook contract.\n- Or, an official Maine workbook or export that includes county-grade contact fields rather than only municipality-to-organization mappings.\n- Or, an official DHHS county or service-area crosswalk for the named district office towns.\n- A stable mapping workbook alone is still not enough if it lacks contact fields.',
      '- Any additional Idaho district-owned special-education or special-services leaf reached from the official SDE district directory for uncovered counties.\n- Or, a truthful statewide county-to-district contract on an official Idaho SDE surface.\n- Or, an official DHW county-to-office contract for the still-blocked 27 counties.\n- The live SDE district root and DHW office root are still not enough without county-grade routing fields.'
    )
    .replace(
      '- [Maine NEO Primary Contacts By Organization](https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU)\n- [Maine NEO Town selector](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town)\n- [Maine SAU workbook](https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx)\n- [Maine special education landing page](https://www.maine.gov/doe/learning/specialed)\n- [Maine DHHS district offices](https://www.maine.gov/dhhs/about/contact/offices)',
      '- [Idaho SDE School Districts page](https://www.sde.idaho.gov/school-districts/)\n- [Idaho SDE School Districts JSON](https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049)\n- [Emmett Independent School District root](https://www.emmettschools.org/)\n- [Emmett district Special Education page](https://www.emmettschools.org/departments/special-education)\n- [Emmett Special Education - Early Childhood Preschool](https://www.emmettschools.org/our-district/programs/special-education-early-childhood-preschool)\n- [Idaho DHW office root](https://healthandwelfare.idaho.gov/offices)\n- [Idaho DHW Caldwell Office](https://healthandwelfare.idaho.gov/dhw/caldwell-office)'
    )
    .replace(
      '- Any official Maine DOE contact export or search result that returns real local contact rows instead of the generic HTTP 500 NEO shell.\n- Any official DOE workbook or adjacent file that includes county or contact fields, not just Municipality, TownCode, GEOCode, OrganizationId, and OrganizationName.\n- Any official DHHS county/service-area crosswalk for office towns like Bangor, Calais, Machias, Portland, or Skowhegan.',
      '- Any official Idaho district-owned special-education or special-services leaves for uncovered counties reached from the SDE directory.\n- Any official Idaho SDE county-to-district contract or district export with explicit county routing.\n- Any official Idaho DHW county-to-office crosswalk for the still-blocked 27 counties.'
    )
    .replace(
      '## Next State Order After Maine\n\n1. Idaho\n2. Arizona\n3. Massachusetts\n4. Oregon\n5. Oklahoma\n6. Utah\n7. New Hampshire\n8. New Mexico\n9. New York\n10. North Carolina',
      '## Next State Order After Idaho\n\n1. Arizona\n2. Massachusetts\n3. Oregon\n4. Oklahoma\n5. Utah\n6. New Hampshire\n7. New Mexico\n8. New York\n9. North Carolina\n10. North Dakota'
    );
  fs.writeFileSync(INPUTS.handoff, replacement);
}

export function generateBatch264IdahoEmmettReviewedDistrictLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? {
            ...blocker,
            failure_code: EDUCATION_FAILURE_CODE,
            evidence: EDUCATION_EVIDENCE,
            next_action: EDUCATION_NEXT_ACTION,
          }
        : blocker
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: EDUCATION_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          sample_count: 14,
          query_basis: 'Reviewed live official Idaho district-owned special-education or special-services leaves reached directly from the existing packet signals plus exact district-root anchors and official district sitemap leaves.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          samples: [
            ...(row.samples || []).filter((sample) => sample.source_url !== 'https://www.emmettschools.org/departments/special-education'),
            {
              sample_name: 'Emmett Independent School District Special Education',
              source_url: 'https://www.emmettschools.org/departments/special-education',
              final_url: 'https://www.emmettschools.org/departments/special-education',
              verification_status: 'verified',
              source_type: 'district_owned_exact_education_leaf',
              source_table: 'batch264_idaho_emmett_reviewed_district_leaf',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The district-owned page title `Special Education - Emmett Independent School District`, H1 `Special Education`, and procedural-safeguards text preserve exact special-education role evidence on the Emmett host.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();

  writeJson(OUTPUTS.batchSummary, {
    batch: 'batch264_idaho_emmett_reviewed_district_leaf_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_exact_leaf_count: 12,
    new_county: 'gem-id',
    new_leaf_url: 'https://www.emmettschools.org/departments/special-education',
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 264 Idaho Emmett Reviewed District Leaf Report v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- refined_family: district_or_county_education_routing',
      `- failure_code: ${EDUCATION_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${EDUCATION_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Idaho remains blocked and not index-safe.',
      '- Education is still a county-by-county exact-leaf expansion lane.',
      '- Emmett Independent School District adds Gem County to the reviewed district-owned special-education leaf set, bringing the reviewed count to twelve counties.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch264IdahoEmmettReviewedDistrictLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
