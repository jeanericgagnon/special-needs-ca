import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'ohio_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'ohio_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'ohio_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'ohio_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'ohio_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'ohio-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch305_ohio_root_family_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch305-ohio-root-family-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only';
const COUNTY_STATUS = 'blocked_retired_official_county_family_and_dead_public_search_surfaces';
const COUNTY_FAILURE =
  'official_root_and_discovery_surfaces_all_404_after_county_directory_retirement';
const COUNTY_NEXT =
  'hold_blocked_until_new_live_official_ohio_county_directory_locator_or_search_index_is_verified';
const EDUCATION_STATUS = 'blocked_exact_leaf_inventory_still_root_only';

const COUNTY_REASON =
  'Reviewed 2026-06-23 one more bounded live official Ohio county-local pass after the earlier JFS retirement finding. The blocker is now stronger than dead guessed county-directory paths alone: in the current repo-side verification lane, even the official root and discovery surfaces fail closed. `https://jfs.ohio.gov/`, `https://medicaid.ohio.gov/`, and `https://ohio.gov/` all return HTTP 404, and the same is true for `robots.txt` and `sitemap.xml` on each host family. The already-tried legacy and guessed county-directory paths remain dead as well, including `https://jfs.ohio.gov/home/local-agencies-directory`, `https://medicaid.ohio.gov/families-and-individuals/county-agencies`, `https://medicaid.ohio.gov/resources/county-agencies`, and `https://ohio.gov/residents/resources/job-family-services-directory`, all of which still return HTTP 404. This means the blocker is no longer just that a county-office page moved; the bounded lane currently has no live official JFS, Medicaid, or Ohio.gov root/discovery contract from which to verify a county-office successor. The DOI-hosted county dataset therefore remains planning evidence only.';

const PRIORITY_ORDER = [
  'utah','kansas','nebraska','nevada','florida','alaska','south-carolina','north-carolina','new-york','oklahoma','oregon','ohio','minnesota','maine','idaho','arizona','massachusetts','new-mexico','south-dakota','rhode-island','virginia','west-virginia','north-dakota','wisconsin','washington','tennessee','vermont','wyoming','new-hampshire',
];

function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => JSON.parse(l));
}
function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((r) => JSON.stringify(r)).join('\n')}${rows.length ? '\n' : ''}`);
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Ohio California-Grade Audit Report v2',
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
    '## Ohio final blocker decision',
    '',
    '- County-local disability resources remain blocked because the retired county-office family now fails at the root/discovery level as well: the official JFS, Medicaid, and Ohio.gov roots plus their `robots.txt` and `sitemap.xml` surfaces all return 404 in the bounded lane.',
    '- The legacy county-directory guesses remain dead, so there is still no live official county-office successor contract to verify.',
    '- District or county education routing remains blocked because only a small exact-leaf inventory is on disk and most surviving education URLs are still root-only.',
    '- Ohio is still truthfully BLOCKED and not index-safe.',
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
    '- Oregon remains blocked on county-local routing because the live ODHS successor is a real custom component shell with no public data contract.',
    '- Ohio remains blocked on two families, and the top county-local blocker is now tighter: the official JFS, Medicaid, and Ohio.gov root/discovery surfaces themselves all 404 in the bounded lane, so there is no live official county-office successor contract to verify.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedSet = new Set(allStateAudit.states.filter((row) => row.classification === 'BLOCKED').map((row) => row.stateId));
  const completeStates = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').map((row) => row.stateName).sort((a,b)=>a.localeCompare(b));
  const blockedRows = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').sort((a,b)=>a.stateName.localeCompare(b.stateName));
  const idx = PRIORITY_ORDER.indexOf('ohio');
  const nextStates = PRIORITY_ORDER.slice(idx + 1).filter((s) => blockedSet.has(s)).slice(0,10).map((s) => {
    const row = allStateAudit.states.find((st) => st.stateId === s);
    return row ? row.stateName : s;
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
    '## Current Focus State: Ohio',
    '',
    '### Blocker Reason',
    '',
    'Ohio still has two critical blockers, but the highest-priority one is `county_local_disability_resources`. The county-local lane is no longer just blocked by dead guessed directory paths; in the current bounded lane, even the official JFS, Medicaid, and Ohio.gov root/discovery surfaces return 404, so there is no live official successor contract to verify.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A live official Ohio county-office directory, locator, search index, sitemap, or county-owned JFS contract that is publicly reviewable in the current lane.',
    '- Any current JFS, Medicaid, or Ohio.gov successor page that explicitly enumerates county agencies or links to county-owned office leaves.',
    '- For education later: more exact district or ESC leaves beyond the tiny current inventory.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [JFS root](https://jfs.ohio.gov/)',
    '- [JFS robots.txt](https://jfs.ohio.gov/robots.txt)',
    '- [JFS sitemap.xml](https://jfs.ohio.gov/sitemap.xml)',
    '- [Legacy JFS county directory](https://jfs.ohio.gov/home/local-agencies-directory)',
    '- [Medicaid root](https://medicaid.ohio.gov/)',
    '- [Medicaid robots.txt](https://medicaid.ohio.gov/robots.txt)',
    '- [Medicaid sitemap.xml](https://medicaid.ohio.gov/sitemap.xml)',
    '- [Guessed Medicaid county agencies path](https://medicaid.ohio.gov/families-and-individuals/county-agencies)',
    '- [Ohio.gov root](https://ohio.gov/)',
    '- [Ohio.gov robots.txt](https://ohio.gov/robots.txt)',
    '- [Ohio.gov sitemap.xml](https://ohio.gov/sitemap.xml)',
    '- [Guessed Ohio.gov county directory](https://ohio.gov/residents/resources/job-family-services-directory)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any live official successor host for Ohio county JFS or county Medicaid agencies that is not currently exposed through the dead root/discovery surfaces.',
    '- Any county-owned JFS leaves that can be verified directly if the state root remains retired.',
    '- Any official statewide dataset or export that explicitly maps counties to JFS or Medicaid office routing.',
    '',
    '## Next State Order After Ohio',
    '',
    ...nextStates.map((stateName, index) => `${index + 1}. ${stateName}`),
  ].join('\n') + '\n';
}

function buildBatchReport(summary) {
  return [
    '# Batch 305 Ohio Root Family Finality Report v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    '- change: sharpened the Ohio county-local blocker from dead guessed directory paths to dead official root/discovery families',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch305OhioRootFamilyFinalityV1() {
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
        failure_code: COUNTY_FAILURE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT,
      },
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'bounded_esc_leaf_packet_exhausted_before_county_grade_coverage',
        evidence: 'Verified exact leaves remain limited to 6 reviewed ESC-owned pages across 8 bounded Ohio packet roots (soesc.org, allencountyesc.org, youresc.k12.oh.us, ashtabulaesc.org, athensmeigs.com, auglaizeesc.org, ecoesc.org, brown.k12.oh.us); this does not truthfully prove district-grade routing statewide.',
        next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: COUNTY_STATUS, status_reason: 'The retired Ohio JFS county-office family now fails at the root/discovery level too: official JFS, Medicaid, and Ohio.gov roots plus robots/sitemaps all return 404, so no live county-office successor contract is verified.' };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: EDUCATION_STATUS };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: COUNTY_FAILURE, evidence: COUNTY_REASON, next_action: COUNTY_NEXT }
    : row);

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: COUNTY_STATUS,
      blocker_code: COUNTY_FAILURE,
      blocker_evidence: COUNTY_REASON,
      evidence_strength: 'weak',
      sample_count: 6,
      samples: [
        { sample_name: 'JFS root 404', source_url: 'https://jfs.ohio.gov/', verification_status: 'blocked', source_type: 'official_root_404', source_table: 'reviewed_live_probe' },
        { sample_name: 'Medicaid root 404', source_url: 'https://medicaid.ohio.gov/', verification_status: 'blocked', source_type: 'official_root_404', source_table: 'reviewed_live_probe' },
        { sample_name: 'Ohio.gov root 404', source_url: 'https://ohio.gov/', verification_status: 'blocked', source_type: 'official_root_404', source_table: 'reviewed_live_probe' },
        { sample_name: 'JFS robots 404', source_url: 'https://jfs.ohio.gov/robots.txt', verification_status: 'blocked', source_type: 'official_discovery_surface_404', source_table: 'reviewed_live_probe' },
        { sample_name: 'Medicaid sitemap 404', source_url: 'https://medicaid.ohio.gov/sitemap.xml', verification_status: 'blocked', source_type: 'official_discovery_surface_404', source_table: 'reviewed_live_probe' },
        { sample_name: 'DOI county dataset planning evidence', source_url: 'https://doi.org/10.7910/DVN/AVRHMI', verification_status: 'planning_only', source_type: 'planning_dataset_only', source_table: 'reviewed_live_probe' },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: COUNTY_FAILURE, next_action: COUNTY_NEXT, evidence: COUNTY_REASON }
    : row);

  const updatedQueueRows = queueRows.map((row) => row.state === 'ohio'
    ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
    : row);

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => row.stateId === 'ohio'
      ? {
          ...row,
          packetBatch: 'batch_305_ohio_root_family_finality_v1',
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          familyStatuses: {
            ...(row.familyStatuses || {}),
            county_local_disability_resources: COUNTY_STATUS,
            district_or_county_education_routing: EDUCATION_STATUS,
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
    batch: 'batch_305_ohio_root_family_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'ohio',
    classification: 'BLOCKED',
    index_safe: false,
    jfsRoot404: true,
    medicaidRoot404: true,
    ohioGovRoot404: true,
    robotsAndSitemaps404: true,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(updatedSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch305OhioRootFamilyFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
