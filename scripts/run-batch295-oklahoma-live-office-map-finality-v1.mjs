import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'oklahoma_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'oklahoma_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'oklahoma_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'oklahoma_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'oklahoma_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'oklahoma-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch295_oklahoma_live_office_map_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch295-oklahoma-live-office-map-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'live_okdhs_office_map_only_materializes_46_counties_and_no_disability_local_export_closes_the_77_county_contract';
const COUNTY_FAMILY_STATUS = 'blocked_live_office_map_incomplete_county_contract';
const FAILURE_CODE = 'live_okdhs_map_only_covers_46_counties_and_remaining_surfaces_are_not_county_grade_disability_routing';
const NEXT_ACTION =
  'hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_31_counties';
const COUNTY_REASON =
  'Reviewed 2026-06-23 one bounded official Oklahoma county-local replacement lane on the live Oklahoma Human Services host. The old `https://dhhs.oklahoma.gov/locations` host still fails DNS, but the current successor root is no longer unknown: `https://oklahoma.gov/okdhs/contact-us.html` explicitly says `If you’re looking for your local office, you’re in the right place` and embeds a public Google My Maps dataset. That KML feed is publicly reachable at `https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1` and preserves real office evidence, but only for 60 placemarks and 46 county-keyed locations after bounded review of `County Name` fields plus county-named `Access Point` rows. The remaining official Oklahoma surfaces do not close the gap: `https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html` is only a statewide `Apply for DDS Services` page with no county-served matrix, and `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html` does expose by-county leaves but is child-support-specific and cannot be substituted as disability-resource proof. Oklahoma therefore remains blocked because the live successor lane is real but still does not materialize a full 77-county local-routing contract.';
const LESSON_HEADING =
  '### Public Office-Map KML Feeds Still Need A Full County-Coverage Audit';
const LESSON_BODY =
  '*   **Lesson:** If a first-party office page embeds a public map with a reachable KML feed, fetch and audit the feed directly before clearing county-local routing. Oklahoma Human Services exposed a real Google My Maps office dataset behind `Contact Us`, but the live KML only materialized 46 county-keyed locations, so the embed sharpened the blocker instead of clearing it.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Oklahoma California-Grade Audit Report v2',
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
    '## County-local refinement',
    '',
    '- The old `dhhs.oklahoma.gov/locations` host is dead, but Oklahoma now has one live official successor lane on `oklahoma.gov/okdhs/contact-us.html`.',
    '- That live page explicitly points users looking for their local office to a public map and the backing KML feed is fetchable, so the lane is no longer speculative.',
    '- The public KML only materializes 46 county-keyed locations from 60 placemarks after bounded review, which is not enough to clear all 77 counties.',
    '- The live DDS apply page is useful statewide evidence but it does not expose county-served fields or a local office matrix.',
    '- The child-support county-office tree is official and county-keyed, but it is service-specific and cannot be substituted as disability-resource proof.',
    '',
    '## Completion decision',
    '',
    '- Oklahoma remains `BLOCKED` and `index_safe=false`.',
    '- Education remains cleared by the current official OSDE State School and District Directory.',
    '- County-local no longer fails because the successor host is unknown; it now fails because the live official successor map only proves 46 county-keyed local offices and no other reviewed disability/local-office surface closes the remaining 31 counties.',
    '- Oklahoma therefore still cannot be marked `COMPLETE` or index-safe.',
  ].join('\n') + '\n';
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
    '- New York remains blocked, but it is now blocked only on county-local routing: official NYSED BOCES pages plus the official NYC DOE CSE page now cover education across all 62 counties.',
    '- Oklahoma remains blocked, but the blocker is now narrowed to a live official Oklahoma Human Services office-map lane that only materializes 46 county-keyed locations and still lacks a full 77-county contract.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedSet = new Set(
    allStateAudit.states.filter((row) => row.classification === 'BLOCKED').map((row) => row.stateId)
  );
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
  const oklahomaIndex = PRIORITY_ORDER.indexOf('oklahoma');
  const nextStates = PRIORITY_ORDER
    .slice(oklahomaIndex + 1)
    .filter((stateId) => blockedSet.has(stateId))
    .slice(0, 10)
    .map((stateId) => {
      const row = allStateAudit.states.find((state) => state.stateId === stateId);
      return row ? row.stateName : stateId;
    });

  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-23',
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Oklahoma',
    '',
    '### Blocker Reason',
    '',
    'Oklahoma has one remaining California-grade blocker: `county_local_disability_resources`. Education is already cleared by the current official OSDE State School and District Directory. The county-local lane is no longer blocked by an unknown successor host; it is now blocked because the live official Oklahoma Human Services office-map lane still fails to prove all 77 counties.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A live official Oklahoma county-grade local office export, directory, or county-owned leaves that closes the remaining 31 counties not materialized by the current office-map KML.',
    '- County-owned or state-maintained local office leaves with real county routing, not planning placeholders or service-specific substitutes.',
    '- Any public Oklahoma disability/local-office surface that preserves county-to-office assignments directly for the counties the current map still misses.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Dead Oklahoma DHHS locator host](https://dhhs.oklahoma.gov/locations)',
    '- [Official Oklahoma Human Services Contact Us page](https://oklahoma.gov/okdhs/contact-us.html)',
    '- [Public Oklahoma Human Services office-map KML](https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1)',
    '- [Official Oklahoma DDS Apply for Services page](https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html)',
    '- [Official Oklahoma Child Support office locations page](https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html)',
    '- [Official Oklahoma State School Directory](https://oklahoma.gov/education/resources/state-school-directory.html)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any live Oklahoma Human Services county export or office dataset that extends the current public KML from 46 county-keyed locations to full statewide county coverage.',
    '- Any county-owned or state-maintained Oklahoma Human Services local office leaves for the 31 counties still missing from the current office-map evidence.',
    '- Any live DDS, OHCA, or Human Services local-office surface on `oklahoma.gov` that explicitly lists counties served per office.',
    '',
    '## Next State Order After Oklahoma',
    '',
    ...nextStates.map((stateName, index) => `${index + 1}. ${stateName}`),
  ].join('\n') + '\n';
}

const PRIORITY_ORDER = [
  'utah',
  'kansas',
  'nebraska',
  'nevada',
  'florida',
  'alaska',
  'south-carolina',
  'north-carolina',
  'new-york',
  'oklahoma',
  'oregon',
  'ohio',
  'minnesota',
  'maine',
  'idaho',
  'arizona',
  'massachusetts',
  'new-mexico',
  'south-dakota',
  'rhode-island',
  'virginia',
  'west-virginia',
  'north-dakota',
  'wisconsin',
  'washington',
  'tennessee',
  'vermont',
  'wyoming',
  'new-hampshire',
];

function buildBatchReport(summary) {
  return [
    '# Batch 295 Oklahoma Live Office Map Finality Report v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    '- change: replaced the stale dead-host-only Oklahoma blocker with the live official office-map reality',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Kept Oklahoma BLOCKED.',
    '- Retired the stale “unknown successor host” framing for county-local routing.',
    '- Preserved the live official `Contact Us` office-map lane as real evidence, but held the state because the bounded KML review only materialized 46 county-keyed locations.',
    '- Rejected the live child-support office tree as a substitute for disability/local routing proof.',
    '- Left the handoff on Oklahoma because the state is still only one family short of COMPLETE/index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch295OklahomaLiveOfficeMapFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['county_local_disability_resources'],
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: COUNTY_FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: COUNTY_FAMILY_STATUS,
          status_reason:
            'the live Oklahoma Human Services office-map lane is real but only materializes 46 county-keyed locations, and no reviewed DDS or county-owned local-office surface closes the remaining 31 counties',
        }
      : row
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          evidence: COUNTY_REASON,
          next_action: NEXT_ACTION,
        }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: COUNTY_FAMILY_STATUS,
          evidence_strength: 'medium',
          sample_count: 4,
          query_basis:
            'Reviewed the live Oklahoma Human Services Contact Us page, the backing public KML office feed, the DDS apply page, and the child-support office tree on the current Oklahoma.gov host.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: COUNTY_REASON,
          samples: [
            {
              sample_name: 'Oklahoma Human Services Contact Us office-map landing',
              source_url: 'https://oklahoma.gov/okdhs/contact-us.html',
              final_url: 'https://oklahoma.gov/okdhs/contact-us.html',
              verification_status: 'reviewed',
              source_type: 'official_directory_landing_page',
              source_table: 'batch295_oklahoma_live_office_map_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet:
                'If you’re looking for your local office, you’re in the right place. Click the map to interact with it.',
            },
            {
              sample_name: 'Oklahoma Human Services public office-map KML',
              source_url: 'https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1',
              final_url: 'https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1',
              verification_status: 'reviewed',
              source_type: 'official_embedded_directory_export',
              source_table: 'batch295_oklahoma_live_office_map_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet:
                'The public KML feed preserves 60 placemarks and only 46 county-keyed locations after bounded review of County Name fields and county-named Access Point rows.',
            },
            {
              sample_name: 'Oklahoma DDS Apply for Services page',
              source_url: 'https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html',
              final_url: 'https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html',
              verification_status: 'reviewed',
              source_type: 'official_statewide_apply_page',
              source_table: 'batch295_oklahoma_live_office_map_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet:
                'The live page is titled Apply for DDS Services but does not expose a county-served table or local office matrix.',
            },
            {
              sample_name: 'Oklahoma child-support office tree is service-specific',
              source_url: 'https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html',
              final_url: 'https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html',
              verification_status: 'reviewed',
              source_type: 'official_service_specific_directory',
              source_table: 'batch295_oklahoma_live_office_map_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet:
                'The live page exposes Child Support District Offices and a By County index, but it is child-support-specific and cannot substitute for disability/local office proof.',
            },
          ],
        }
      : row
  );

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: COUNTY_REASON,
        }
      : row
  );

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'oklahoma'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 83,
          missing_critical_families: 0,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'batch_3_procedure_hardening',
          status: 'BLOCKED',
          repair_lane: 'repair_from_state_packet',
        }
      : row
  );

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) =>
      row.stateId === 'oklahoma'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            strongCriticalFamilies: 10,
            weakCriticalFamilies: 1,
            missingCriticalFamilies: 0,
            completenessPct: 83,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: COUNTY_FAMILY_STATUS,
            },
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'batch_3_procedure_hardening',
          }
        : row
    ),
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));

  const batchSummary = {
    state: 'oklahoma',
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    liveSuccessorOfficeMapVerified: true,
    officeMapPlacemarkCount: 60,
    officeMapCountyCoverageCount: 46,
    remainingCountyGapCount: 31,
    ddsApplyPageCountyMatrixPresent: false,
    childSupportDirectoryRejectedAsDisabilityProof: true,
    remaining_blocker_family_count: 1,
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(updatedSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch295OklahomaLiveOfficeMapFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
