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
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch303_oklahoma_county_tree_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch303-oklahoma-county-tree-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'live_okdhs_general_office_map_only_materializes_46_counties_while_same_host_child_support_tree_proves_county_contracts_exist_but_not_for_disability_local_routing';
const COUNTY_FAMILY_STATUS = 'blocked_live_office_map_incomplete_county_contract';
const FAILURE_CODE =
  'live_okdhs_general_office_map_stops_at_46_counties_while_only_child_support_publishes_full_county_tree';
const NEXT_ACTION =
  'hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_31_counties';

const COUNTY_REASON =
  'Reviewed 2026-06-23 one more bounded official Oklahoma county-local replacement lane on the live Oklahoma Human Services host. The old `https://dhhs.oklahoma.gov/locations` host still fails DNS, but the current successor root is no longer unknown: `https://oklahoma.gov/okdhs/contact-us.html` explicitly says `If you’re looking for your local office, you’re in the right place` and embeds a public Google My Maps dataset. That KML feed is publicly reachable at `https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1` and preserves real office evidence, but only for 60 placemarks and 46 county-keyed locations after bounded review of `County Name` fields plus county-named `Access Point` rows. One more bounded host recheck now sharpens the blocker further: the same `oklahoma.gov/okdhs` host does publish a county-grade contract when it intends to, because `https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html` exposes a `By County` accordion with county-named leaves across the state. But that tree is explicitly `Child Support District Offices`, so it cannot be substituted as disability-resource proof. The live DDS apply page at `https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html` is still only a statewide intake route with one phone/email and no county-served matrix. Oklahoma therefore remains blocked because the general Human Services local-office lane still does not materialize a full 77-county disability/local-routing contract even though the same host proves county trees are technically publishable for service-specific programs.';

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
    '- The old `dhhs.oklahoma.gov/locations` host is dead, but Oklahoma now has one live official general-office successor lane on `oklahoma.gov/okdhs/contact-us.html`.',
    '- That live page explicitly points users looking for their local office to a public map and the backing KML feed is fetchable, so the lane is no longer speculative.',
    '- The public KML only materializes 46 county-keyed locations from 60 placemarks after bounded review, which is not enough to clear all 77 counties.',
    '- The same `oklahoma.gov/okdhs` host proves that county trees are technically publishable: the child-support office-locations page exposes a `By County` accordion with county-named leaves across the state.',
    '- But that county tree is explicitly `Child Support District Offices`, while the DDS apply page is still only a statewide intake route with no county-served matrix, so neither surface closes disability/local routing for the missing 31 counties.',
    '',
    '## Completion decision',
    '',
    '- Oklahoma remains `BLOCKED` and `index_safe=false`.',
    '- Education remains cleared by the current official OSDE State School and District Directory.',
    '- County-local no longer fails because Oklahoma lacks any county-publishing ability; it now fails because the general local-office lane still stops at 46 county-keyed offices and the only full county tree on the same host is child-support-specific.',
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
    '- New York remains blocked only on county-local routing: `ny.gov` points to exact OTDA and MyBenefits successor surfaces, and those public successor surfaces still reset in bounded review.',
    '- Oklahoma remains blocked, but the blocker is now tighter: the same live OKDHS host proves it can publish county trees for Child Support, while the general local-office map still only materializes 46 county-keyed offices and DDS remains statewide-only.',
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
    'Oklahoma has one remaining California-grade blocker: `county_local_disability_resources`. Education is already cleared by the current official OSDE State School and District Directory. The county-local lane is no longer blocked by an unknown successor host; it is now blocked because the live official general-office map still fails to prove all 77 counties even though the same host clearly can publish county trees for service-specific programs.',
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

function buildBatchReport(summary) {
  return [
    '# Batch 303 Oklahoma County Tree Finality Report v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    '- change: sharpened the Oklahoma blocker from incomplete office-map coverage alone to a same-host contrast between county-capable child-support pages and still-incomplete general office routing',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch303OklahomaCountyTreeFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
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
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: COUNTY_FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, family_status: COUNTY_FAMILY_STATUS, status_reason: 'the live Oklahoma Human Services general office-map lane is real but only materializes 46 county-keyed locations, while the same host only exposes a full county tree for child-support-specific offices and not for disability/local routing' }
    : row);

  const updatedFailureRows = failureRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_REASON, next_action: NEXT_ACTION }
    : row);

  const updatedVerifiedRows = verifiedRows.map((row) => row.family === 'county_local_disability_resources'
    ? {
        ...row,
        family_status: COUNTY_FAMILY_STATUS,
        blocker_code: FAILURE_CODE,
        blocker_evidence: COUNTY_REASON,
        evidence_strength: 'medium',
        sample_count: 5,
        samples: [
          { sample_name: 'Oklahoma Human Services Contact Us page', source_url: 'https://oklahoma.gov/okdhs/contact-us.html', verification_status: 'reviewed', source_type: 'official_general_office_root', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The page says people looking for their local office are in the right place and embeds the public office map.' },
          { sample_name: 'Oklahoma Human Services public office-map KML', source_url: 'https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1', verification_status: 'reviewed', source_type: 'official_kml_partial_county_contract', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'Bounded review of the public KML preserved 60 placemarks but only 46 county-keyed office matches.' },
          { sample_name: 'Oklahoma DDS Apply for Services page', source_url: 'https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html', verification_status: 'reviewed', source_type: 'official_statewide_intake_only', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The page preserves one statewide DDS intake phone/email route with no county-served matrix.' },
          { sample_name: 'Oklahoma child-support county tree', source_url: 'https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html', verification_status: 'reviewed', source_type: 'official_service_specific_county_tree', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The page explicitly preserves `Child Support District Offices` and a `By County` accordion with county-named leaves across the state.' },
          { sample_name: 'Dead legacy DHHS locator host', source_url: 'https://dhhs.oklahoma.gov/locations', verification_status: 'blocked', source_type: 'legacy_dead_host', source_table: 'reviewed_live_probe' },
        ],
      }
    : row);

  const updatedNextRows = nextRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: COUNTY_REASON }
    : row);

  const updatedQueueRows = queueRows.map((row) => row.state === 'oklahoma'
    ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
    : row);

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => row.stateId === 'oklahoma'
      ? {
          ...row,
          packetBatch: 'batch_303_oklahoma_county_tree_finality_v1',
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          familyStatuses: {
            ...(row.familyStatuses || {}),
            county_local_disability_resources: COUNTY_FAMILY_STATUS,
          },
        }
      : row),
  };

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
    batch: 'batch_303_oklahoma_county_tree_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'oklahoma',
    classification: 'BLOCKED',
    index_safe: false,
    liveSuccessorOfficeMapVerified: true,
    officeMapCountyCoverageCount: 46,
    remainingCountyGapCount: 31,
    childSupportCountyTreeVerified: true,
    ddsStatewideOnlyVerified: true,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(updatedSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch303OklahomaCountyTreeFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
