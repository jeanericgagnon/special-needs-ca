import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'massachusetts_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'massachusetts_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'massachusetts_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'massachusetts_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'massachusetts_next_action_queue_v2.jsonl'),
  countyPacket: path.join(generatedDir, 'massachusetts_county_local_disability_resources_host403_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch185_massachusetts_live_dds_location_lane_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch185-massachusetts-live-dds-location-lane-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'massachusetts-california-grade-audit-report-v2.md'),
};

const COUNTY_REASON = `Massachusetts county-local routing is no longer a host-wide 403 blocker. The live DDS org page, the org-locations index, and the interactive DDS regional map all render on Mass.gov in browser review, but the old \`dds-area-offices\` child is now a true 404 and the live interactive map still exposes only a town-or-city lookup contract in rendered HTML. The live locations index lists named DDS area offices and regions, but the current low-token lane still has no county column, county export, or machine-readable town list to bridge those offices back to all 14 county rows.`;

const COUNTY_EVIDENCE = `Reviewed 2026-06-23 bounded browser checks on the live Massachusetts DDS first-party lane. The org page at https://www.mass.gov/orgs/department-of-developmental-services now renders normally and links exact child surfaces, including \`Contact a DDS Area Office\`, \`Find Your Regional and Area Office\`, and \`/orgs/department-of-developmental-services/locations\`. The old guessed page https://www.mass.gov/info-details/dds-area-offices is not a host-403 lane after all; it is a real 404 \`We can't find that page\`. The live locations index at https://www.mass.gov/orgs/department-of-developmental-services/locations renders 28 results, including named leaves such as DDS Berkshire Area Office, DDS Brockton Area Office, DDS Cape Cod/Islands Area Office, DDS Central Middlesex Area Office, DDS Fall River Area Office, and DDS Franklin/Hampshire Area Office with office addresses. The live interactive map page at https://www.mass.gov/info-details/interactive-dds-regional-map also renders and explicitly says it is used to find which DDS Regional Office and Area Office serves your town or city, but the rendered HTML still preserves no county names, no machine-readable town list, and no county-to-office export contract. Massachusetts therefore still lacks county-grade local routing proof in the low-token lane, but the blocker is now correctly narrowed to a live town/city DDS mapping surface without a reusable county contract.`;

const LESSON_HEADING = '### Replace Stale 403 Assumptions With Exact Child-Surface Rechecks';
const LESSON_BODY = '*   **Lesson:** If a state org page starts rendering again, re-check the exact child surfaces it links before preserving an old host-wide 403 blocker. Massachusetts DDS had moved past the earlier 403 assumption: the org page, `/locations`, and the interactive regional map were live, while the guessed `dds-area-offices` URL was just a true 404 and the remaining blocker was the lack of a county-grade export contract.';

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
    '# Massachusetts California-Grade Audit Report v2',
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
    '- Massachusetts remains BLOCKED and index_safe=false.',
    '- Education is still blocked because the reviewed DESE postback bridge exposes district result rows but still no county-to-district routing contract.',
    '- County-local is now more specific: the DDS org page, locations index, and interactive map are live, but the lane still stops at town-or-city routing and office leaves without a county export or machine-readable local contract.',
  ].join('\n') + '\n';
}

export function generateBatch185MassachusettsLiveDdsLocationLaneRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_live_dds_locations_and_interactive_map_without_county_contract',
          status_reason: COUNTY_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: 'live_dds_locations_and_interactive_map_without_county_contract',
          evidence: COUNTY_EVIDENCE,
          next_action: 'use_live_massachusetts_dds_locations_and_interactive_map_for_browser_or_cached_town_to_office_capture_only',
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'blocked_live_dds_locations_and_interactive_map_without_county_contract',
      blocker_code: 'live_dds_locations_and_interactive_map_without_county_contract',
      blocker_evidence: COUNTY_EVIDENCE,
      query_basis: 'Reviewed the live Massachusetts DDS org page, linked locations index, interactive regional map, and the stale guessed area-offices path.',
      samples: [
        {
          sample_name: 'Massachusetts DDS org page',
          source_url: 'https://www.mass.gov/orgs/department-of-developmental-services',
          final_url: 'https://www.mass.gov/orgs/department-of-developmental-services',
          verification_status: 'verified',
          source_type: 'official_org_page_with_exact_child_links',
          source_table: 'batch185_massachusetts_live_dds_location_lane_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The live DDS org page renders normally and links exact child surfaces including Contact a DDS Area Office, Find Your Regional and Area Office, and the department locations index.',
        },
        {
          sample_name: 'Massachusetts DDS locations index',
          source_url: 'https://www.mass.gov/orgs/department-of-developmental-services/locations',
          final_url: 'https://www.mass.gov/orgs/department-of-developmental-services/locations',
          verification_status: 'verified',
          source_type: 'official_locations_index_without_county_export',
          source_table: 'batch185_massachusetts_live_dds_location_lane_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The live locations index renders 28 DDS location results and lists named area-office leaves such as Berkshire, Brockton, Cape Cod/Islands, Central Middlesex, Fall River, and Franklin/Hampshire, but no county column or county export is preserved.',
        },
        {
          sample_name: 'Massachusetts DDS interactive regional map',
          source_url: 'https://www.mass.gov/info-details/interactive-dds-regional-map',
          final_url: 'https://www.mass.gov/info-details/interactive-dds-regional-map',
          verification_status: 'verified',
          source_type: 'official_interactive_map_without_machine_readable_county_contract',
          source_table: 'batch185_massachusetts_live_dds_location_lane_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The live interactive map page says it is used to find which DDS Regional Office and Area Office serves your town or city, but rendered HTML still exposes no county names, no machine-readable town list, and no county-to-office export contract.',
        },
        {
          sample_name: 'Stale DDS area-offices child path',
          source_url: 'https://www.mass.gov/info-details/dds-area-offices',
          final_url: 'https://www.mass.gov/info-details/dds-area-offices',
          verification_status: 'blocked',
          source_type: 'official_stale_child_path_404',
          source_table: 'batch185_massachusetts_live_dds_location_lane_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: "The guessed `dds-area-offices` path is not the right live lane; it returns a real 404 `We can't find that page` response on Mass.gov.",
        },
      ],
      sample_count: 4,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: 'live_dds_locations_and_interactive_map_without_county_contract',
          next_action: 'use_live_massachusetts_dds_locations_and_interactive_map_for_browser_or_cached_town_to_office_capture_only',
          evidence: COUNTY_EVIDENCE,
        }
      : row
  ));

  countyPacket.repair_lane = 'browser_or_cached_town_to_office_capture_only';
  countyPacket.current_problem_metrics.liveOrgPageAccessible = true;
  countyPacket.current_problem_metrics.liveLocationsIndexAccessible = true;
  countyPacket.current_problem_metrics.liveInteractiveMapAccessible = true;
  countyPacket.current_problem_metrics.staleAreaOfficesPath404 = true;
  countyPacket.current_problem_metrics.hostWide403Surfaces = 0;
  countyPacket.exact_target_goals = [
    'reviewed town-or-city to DDS area-office capture from the live interactive map',
    'official county-grade local office contract on Mass.gov',
    'replacement of legacy and DOI rows only after a reviewable county or equivalent local contract is preserved',
  ];
  countyPacket.representative_sources = [
    'https://www.mass.gov/orgs/department-of-developmental-services',
    'https://www.mass.gov/orgs/department-of-developmental-services/locations',
    'https://www.mass.gov/info-details/interactive-dds-regional-map',
    'https://www.mass.gov/info-details/dds-area-offices',
  ];
  countyPacket.root_domains_to_review = [
    'browser-assisted or cached Mass.gov DDS org, locations, and interactive-map surfaces only',
    'do not reopen generic county-office discovery unless a county-grade export or machine-readable local contract appears on the live DDS lane',
  ];
  countyPacket.packet_complete_when = 'Massachusetts can reopen county-local once the live DDS locations/index and interactive-map lane yields a reviewable county-grade contract or a preserved town-to-office capture that can be truthfully bridged to county rows.';

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_dese_hidden_postback_bridge_renders_real_district_rows_but_no_county_contract_and_live_dds_locations_lane_still_lacks_county_export',
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? {
            ...row,
            failure_code: 'live_dds_locations_and_interactive_map_without_county_contract',
            evidence: COUNTY_EVIDENCE,
            next_action: 'use_live_massachusetts_dds_locations_and_interactive_map_for_browser_or_cached_town_to_office_capture_only',
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.countyPacket, countyPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_185_massachusetts_live_dds_location_lane_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'massachusetts',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    dds_org_page_live: true,
    dds_locations_index_live: true,
    dds_interactive_map_live: true,
    stale_area_offices_path_404: true,
    county_contract_still_missing: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 185 Massachusetts Live DDS Location Lane Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    '- failure_code: live_dds_locations_and_interactive_map_without_county_contract',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Massachusetts remains blocked and not index-safe.',
    '- The old Mass.gov DDS blocker was overstated: the org page, locations index, and interactive regional map are live and reviewable.',
    '- The real blocker is narrower: those live surfaces still do not preserve a county-grade export or machine-readable town list that can be reused safely in the low-token lane.',
    '- The next honest lane is reviewed browser or cached capture from the live DDS locations and interactive map surfaces, not more host-403 guessing.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch185MassachusettsLiveDdsLocationLaneRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
