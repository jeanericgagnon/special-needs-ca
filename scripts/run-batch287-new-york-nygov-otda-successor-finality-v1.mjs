import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-york_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-york_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-york_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-york_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-york_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'new-york_county_local_disability_resources_health_host_packet_v1.json'),
  stateReport: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch287_new_york_nygov_otda_successor_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch287-new-york-nygov-otda-successor-finality-report-v1.md'),
};

const COUNTY_REASON =
  'Reviewed 2026-06-23 one more bounded official New York county-local replacement lane using the public `ny.gov` service stack as the discovery surface rather than speculative OTDA host guessing. The original `health.ny.gov` Medicaid lane is still blocked host-wide: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all remain unusable for county-local proof. The live `https://www.ny.gov/services/social-programs` page and `https://www.ny.gov/services/apply-cooling-assistance` now strengthen the blocker instead of clearing it: both public state pages explicitly link exact OTDA successor leaves such as `https://otda.ny.gov/programs/heap/contacts/`, `https://otda.ny.gov/programs/applications/4826.pdf`, `https://otda.ny.gov/programs/snap/work-requirements.asp`, and `https://mybenefits.ny.gov/`. But the exact OTDA benefit and contact leaves still fail on the current host family, including `otda.ny.gov/programs/heap/contacts/`, `otda.ny.gov/programs/heap/`, `otda.ny.gov/programs/applications/4826.pdf`, `otda.ny.gov/workingfamilies/dss.asp`, and the apex `otda.ny.gov` plus `www.otda.ny.gov` roots, all of which reset the connection in the bounded lane. New York therefore remains blocked on county-local not because a successor path is unknown, but because the public New York portal points to an exact official OTDA successor family that is still not reviewable from the repo-side verification lane.';

const LESSON_HEADING =
  '### A Public State Portal Linking An Exact Successor Leaf Does Not Clear The Blocker If The Successor Host Still Fails';
const LESSON_BODY =
  '*   **Lesson:** If a live state portal points to an exact official successor contact page, verify that exact leaf before treating the host family as repaired. New York `ny.gov` linked the precise OTDA `HEAP Local District Contact` page and benefits application files, but those exact OTDA leaves still reset, so the blocker stayed on the successor host family rather than clearing from the portal reference alone.';

const OKLAHOMA_FOCUS = [
  '## Current Focus State: Oklahoma',
  '',
  '### Blocker Reason',
  '',
  'Oklahoma has one remaining California-grade blocker: `county_local_disability_resources`. Education is already cleared by the current official OSDE State School and District Directory, but the county-local lane still depends on a dead statewide locator host and DOI planning rows.',
  '',
  '### Exact Evidence Needed',
  '',
  '- A live official Oklahoma county-grade local office directory that replaces the dead `https://dhhs.oklahoma.gov/locations` host.',
  '- County-owned or state-maintained local office leaves with real county routing, not planning placeholders or DOI mirrors.',
  '- Any public Oklahoma county-mapped office export, directory, or API that materializes county-local disability resource routing directly.',
  '',
  '### Useful Official URLs Already Tried',
  '',
  '- [Dead Oklahoma DHHS locator host](https://dhhs.oklahoma.gov/locations)',
  '- [Official Oklahoma State School Directory](https://oklahoma.gov/education/resources/state-school-directory.html)',
  '- [Official Oklahoma District Directory download lane](https://oklahoma.gov/education/resources/state-school-directory.html)',
  '',
  '### Top Remaining Source-Scouting Targets',
  '',
  '- Any current Oklahoma.gov county-local office directory replacing the dead DHHS locator host.',
  '- Any official county-owned DHS or local human-services office pages that preserve county identity and direct contact routing.',
  '- Any public Oklahoma directory export or API that maps counties to local assistance or disability-resource offices.',
  '',
  '',
].join('\n');

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

function buildAllStateReport(audit) {
  const completeStates = audit.states.filter((row) => row.classification === 'COMPLETE').map((row) => row.stateName);
  const blockedStates = audit.states.filter((row) => row.classification === 'BLOCKED').map((row) => row.stateName);
  return [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    `- packet_coverage_count: ${audit.packetCoverageCount}`,
    `- packet_missing_states: ${audit.packetMissingStates.length ? audit.packetMissingStates.join(', ') : 'none'}`,
    '',
    '## Classification counts',
    '',
    `- COMPLETE: ${audit.classifications.COMPLETE}`,
    `- BLOCKED: ${audit.classifications.BLOCKED}`,
    '',
    `- index-safe states: ${audit.indexSafeCount}`,
    `- complete states: ${completeStates.join(', ')}`,
    `- blocked states: ${blockedStates.join(', ')}`,
    '',
    '## Notes',
    '',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- North Carolina now reaches COMPLETE/index-safe because two public county-bearing contracts replaced both local blockers: the DPI School Report Card location dataset for district routing and the NCDHHS Local DSS sitemap lane for county-local routing.',
    '- New York remains blocked, but the county-local blocker is now tighter: `ny.gov` points to exact OTDA successor leaves, and those exact OTDA contact/benefit targets still fail in the bounded verification lane.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
  ].join('\n') + '\n';
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New York Blocker Packets v6',
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
    '## Education refinement',
    '',
    '- The official NYSED Joint Management Teams and District Superintendents pages still prove county-bearing BOCES routing for the 57 non-NYC counties.',
    '- The remaining education blocker is still just the NYC borough remainder, not a statewide education inventory shortage.',
    '',
    '## County-local refinement',
    '',
    '- The live `ny.gov` service stack now proves New York still intends OTDA to be the successor local-district lane: `Social Programs` and `Apply for Cooling Assistance` both link exact OTDA contact or application leaves.',
    '- The `Apply for Cooling Assistance` page specifically labels the OTDA successor contact path as `HEAP Local District Contact`, which makes the replacement lane exact enough to test but still not reviewable enough to clear.',
    '- But those exact OTDA successor leaves still fail in bounded live review, so the blocker remains on the successor host family rather than on an unknown replacement search.',
    '',
    '## Completion decision',
    '',
    '- New York remains `BLOCKED` and `index_safe=false`.',
    '- County-local remains blocked because the old `health.ny.gov` LDSS family is unusable and the exact OTDA successor leaves publicly linked by `ny.gov` still reset the connection.',
    '- Education remains blocked only on the NYC borough special-education routing remainder.',
    '- PTI remains repaired and is not a blocker.',
  ].join('\n') + '\n';
}

export function generateBatch287NewYorkNygovOtdaSuccessorFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedGapRows = gapRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, family_status: 'blocked_health_hostwide_403', status_reason: COUNTY_REASON }
    : row);

  const updatedFailureRows = failureRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: 'nygov_links_exact_otda_successor_leaves_but_successor_host_still_resets', evidence: COUNTY_REASON, next_action: 'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified' }
    : row);

  const updatedVerifiedRows = verifiedRows.map((row) => row.family === 'county_local_disability_resources'
    ? {
      ...row,
      family_status: 'blocked_health_hostwide_403',
      query_basis: 'Reviewed 2026-06-23 the blocked health.ny.gov Medicaid host family, the live ny.gov service portal, and the exact OTDA successor leaves that ny.gov publicly links.',
      blocker_code: 'nygov_links_exact_otda_successor_leaves_but_successor_host_still_resets',
      blocker_evidence: COUNTY_REASON,
      evidence_strength: 'weak',
      sample_count: 9,
      samples: [
        { sample_name: 'LDSS directory', source_url: 'https://www.health.ny.gov/health_care/medicaid/ldss.htm', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'robots.txt', source_url: 'https://www.health.ny.gov/robots.txt', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'sitemap.xml', source_url: 'https://www.health.ny.gov/sitemap.xml', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'Medicaid root', source_url: 'https://www.health.ny.gov/health_care/medicaid/', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'Medicaid redesign', source_url: 'https://www.health.ny.gov/health_care/medicaid/redesign/', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        { sample_name: 'New York Social Programs portal', source_url: 'https://www.ny.gov/services/social-programs', final_url: 'https://www.ny.gov/services/social-programs', verification_status: 'reviewed', source_type: 'official_state_portal', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The live `Social Programs` page publicly links benefit-service leaves such as `Apply for SNAP` and other assistance routes on the New York state portal.' },
        { sample_name: 'Apply for Cooling Assistance page', source_url: 'https://www.ny.gov/services/apply-cooling-assistance', final_url: 'https://www.ny.gov/services/apply-cooling-assistance', verification_status: 'reviewed', source_type: 'official_state_portal', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The live `Apply for Cooling Assistance` page explicitly links `HEAP Local District Contact` on the OTDA host as the public local-district contact path.' },
        { sample_name: 'OTDA HEAP Local District Contact', source_url: 'https://otda.ny.gov/programs/heap/contacts/', verification_status: 'blocked', source_type: 'official_successor_leaf_reset', source_table: 'reviewed_live_probe' },
        { sample_name: 'OTDA application PDF linked by ny.gov', source_url: 'https://otda.ny.gov/programs/applications/4826.pdf', verification_status: 'blocked', source_type: 'official_successor_leaf_reset', source_table: 'reviewed_live_probe' },
      ],
    }
    : row);

  const updatedNextRows = nextRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: 'nygov_links_exact_otda_successor_leaves_but_successor_host_still_resets', next_action: 'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified', evidence: COUNTY_REASON }
    : row);

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: 'nygov_links_exact_otda_successor_leaves_but_successor_host_still_resets', evidence: COUNTY_REASON, next_action: 'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified' }
      : row),
  };

  const updatedPacket = {
    ...packet,
    current_metrics: {
      ...(packet.current_metrics || {}),
      blockedHealthNySurfaces: 5,
      reviewedStatePortalSuccessorPages: 2,
      boundedOtdaReplacementHostFailures: 9,
    },
    blocked_surfaces: Array.from(new Set([
      ...(packet.blocked_surfaces || []),
      'https://otda.ny.gov/programs/heap/contacts/',
      'https://www.otda.ny.gov/programs/heap/contacts/',
      'https://otda.ny.gov/programs/heap/',
      'https://www.otda.ny.gov/programs/heap/',
      'https://otda.ny.gov/programs/applications/4826.pdf',
      'https://www.otda.ny.gov/programs/applications/4826.pdf',
    ])),
    replacement_host_probe: {
      attempted_at: '2026-06-23T00:00:00.000Z',
      host_family: ['otda.ny.gov', 'www.otda.ny.gov'],
      outcome: 'nygov_points_to_exact_successor_leaves_but_successor_family_still_resets',
      exact_urls: [
        'https://otda.ny.gov/workingfamilies/dss.asp',
        'https://otda.ny.gov/workingfamilies/',
        'https://otda.ny.gov/programs/applications/',
        'https://otda.ny.gov/workingfamilies/contact.asp',
        'https://otda.ny.gov/',
        'https://www.otda.ny.gov/workingfamilies/dss.asp',
        'https://www.otda.ny.gov/',
        'https://otda.ny.gov/programs/heap/contacts/',
        'https://otda.ny.gov/programs/applications/4826.pdf',
      ],
      nygov_successor_refs: [
        'https://www.ny.gov/services/social-programs',
        'https://www.ny.gov/services/apply-cooling-assistance',
      ],
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);

  const updatedQueueRows = readJsonl(INPUTS.queue).map((row) => (
    row.state === 'new-york'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 83,
          search_value_proxy: 62,
          risk_score: 44,
          fast_completion_score: 60,
          priority_score: 55,
          missing_critical_families: 0,
          weak_critical_families: 2,
          primary_gap_reason: 'official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_nygov_linked_otda_successor_leaves_still_reset',
          recommended_batch: 'batch_2_repair_blocked',
          status: 'BLOCKED',
          repair_lane: 'repair_from_state_packet',
        }
      : row
  ));
  writeJsonl(INPUTS.queue, updatedQueueRows);

  const updatedStates = allStateAudit.states.map((row) => (
    row.stateId === 'new-york'
      ? {
          ...row,
          classification: 'BLOCKED',
          indexSafe: false,
          completenessPct: 83,
          strongCriticalFamilies: 10,
          weakCriticalFamilies: 2,
          missingCriticalFamilies: 0,
          familyStatuses: {
            ...row.familyStatuses,
            county_local_disability_resources: 'blocked_health_hostwide_403',
          },
          packetBatch: 'batch_287_new_york_nygov_otda_successor_finality_v1',
          packetPrimaryGapReason: 'official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_nygov_linked_otda_successor_leaves_still_reset',
          packetRecommendedBatch: 'batch_2_repair_blocked',
        }
      : row
  ));
  const updatedAllStateAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    lessonsUpdate: 'Added a new blocker lesson: a public state portal linking an exact successor leaf does not clear the blocker if the successor host still fails.',
    states: updatedStates,
    classifications: {
      COMPLETE: updatedStates.filter((row) => row.classification === 'COMPLETE').length,
      BLOCKED: updatedStates.filter((row) => row.classification === 'BLOCKED').length,
    },
    indexSafeCount: updatedStates.filter((row) => row.indexSafe).length,
    packetCoverageCount: updatedStates.filter((row) => row.packetGenerated).length,
    packetMissingStates: updatedStates.filter((row) => !row.packetGenerated).map((row) => row.stateId),
  };
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(updatedAllStateAudit));

  let handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  handoff = replaceSection(
    handoff,
    '## Current Blocked States',
    '## Current Focus State:',
    [
      '## Current Blocked States',
      '',
      '- Alaska: `live_dfcs_services_page_only_provides_statewide_phone_relay_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked`',
      '- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`',
      '- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell`',
      '- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`',
      '- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_12_counties_but_export_backed_county_grade_coverage_is_still_incomplete`',
      '- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`',
      '- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`',
      '- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`',
      '- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`',
      '- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`',
      '- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`',
      '- New York: `official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_nygov_linked_otda_successor_leaves_still_reset`',
      '- North Dakota: `generic_or_statewide_evidence_used_where_local_required`',
      '- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`',
      '- Oklahoma: `official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local`',
      '- Oregon: `official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract`',
      '- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`',
      '- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`',
      '- Tennessee: `generic_or_statewide_evidence_used_where_local_required`',
      '- Utah: `official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract`',
      '- Vermont: `generic_or_statewide_evidence_used_where_local_required`',
      '- Virginia: `generic_or_statewide_evidence_used_where_local_required`',
      '- Washington: `generic_or_statewide_evidence_used_where_local_required`',
      '- West Virginia: `generic_or_statewide_evidence_used_where_local_required`',
      '- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`',
      '- Wyoming: `legacy_or_inventory_only_evidence`',
      '',
    ].join('\n'),
  );
  handoff = replaceSection(handoff, '## Current Focus State:', '## Next State Order After', OKLAHOMA_FOCUS);
  handoff = handoff.replace(
    /## Next State Order After[\s\S]*$/,
    [
      '## Next State Order After New York',
      '',
      '1. Oklahoma',
      '2. Oregon',
      '3. Ohio',
      '4. Minnesota',
      '5. Maine',
      '6. Idaho',
      '7. Arizona',
      '8. Massachusetts',
      '9. New Mexico',
      '10. South Dakota',
    ].join('\n'),
  );
  fs.writeFileSync(INPUTS.handoff, handoff);

  const batchSummary = {
    state: 'new-york',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    healthNyBlockedSurfaceCount: 5,
    reviewedStatePortalSuccessorPages: 2,
    otdaExactSuccessorLeafFailures: 4,
    totalBoundedOtdaHostFailures: 9,
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 287 New York ny.gov OTDA Successor Finality Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the New York county-local blocker from a generic failed replacement-host search into an exact successor-family failure confirmed from live ny.gov service pages',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Kept New York BLOCKED.',
    '- Confirmed the original `health.ny.gov` Medicaid host family is still unusable for county-local proof.',
    '- Confirmed the live `ny.gov` service stack points to exact OTDA successor leaves, but those exact OTDA contact and application leaves still fail in the bounded verification lane.',
    '- Advanced the handoff to Oklahoma because New York now has a sharper, more final county-local blocker artifact on disk.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch287NewYorkNygovOtdaSuccessorFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
