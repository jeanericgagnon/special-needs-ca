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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch331_ohio_live_root_recovery_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch331-ohio-live-root-recovery-report-v1.md'),
};

const BATCH_NAME = 'batch331_ohio_live_root_recovery_v1';
const PRIMARY_GAP_REASON =
  'live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only';
const COUNTY_STATUS =
  'blocked_live_root_and_sitemap_family_with_dead_directory_and_sample_cdjfs_leafs';
const COUNTY_FAILURE =
  'live_root_robots_and_sitemap_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404';
const COUNTY_NEXT =
  'hold_blocked_until_live_rendered_ohio_county_directory_or_new_public_county_jfs_successor_leaf_is_verified';
const EDUCATION_STATUS = 'blocked_exact_leaf_inventory_still_root_only';
const LESSON_HEADING = '### Live Roots And Sitemaps Do Not Clear A Directory Lane When The Rendered Leaves Still 404';
const LESSON_BODY =
  '*   **Lesson:** A recovered official root, `robots.txt`, or `sitemap.xml` is only discovery evidence. Ohio JFS and Medicaid are publicly alive again, and the JFS sitemap even advertises 98 `cdjfs-*` leaves across 88 county slugs, but the rendered `job-family-services-directory` page, the `about/local-agencies-directory` root, Ohio search results, and sampled `cdjfs-*` county leaves all still resolve to public 404 pages, so the county-local family stays blocked until a rendered successor contract works.';

const PRIORITY_ORDER = [
  'utah','kansas','nebraska','nevada','florida','alaska','south-carolina','north-carolina','new-york','oklahoma','oregon','ohio','minnesota','maine','idaho','arizona','massachusetts','new-mexico','south-dakota','rhode-island','virginia','west-virginia','north-dakota','wisconsin','washington','tennessee','vermont','wyoming','new-hampshire',
];

const COUNTY_REASON =
  'Reviewed 2026-06-24 one more bounded live official Ohio county-local pass after the earlier stale-root blocker. The official discovery family is now publicly alive again, so the old 404-at-root claim is no longer true: `https://jfs.ohio.gov/`, `https://medicaid.ohio.gov/`, and `https://ohio.gov/` all return HTTP 200, `robots.txt` now returns HTTP 200 on each host family, and `https://jfs.ohio.gov/sitemap.xml`, `https://medicaid.ohio.gov/sitemap.xml`, and `https://ohio.gov/sitemap.xml` are all publicly reviewable. The live JFS sitemap is materially stronger than before because it now advertises 98 `cdjfs-*` local-agency-directory URLs spanning 88 distinct county slugs. But the rendered county-office lane still fails closed: the current `https://ohio.gov/residents/resources/job-family-services-directory` page renders a public `404 Error Page`, the live `https://ohio.gov/search?query=county%20job%20and%20family%20services` page also renders the same public 404, the parent `https://jfs.ohio.gov/about/local-agencies-directory` root renders a public 404, and sampled exact county leaves such as `https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-adams`, `.../cdjfs-cuyahoga-3`, and `.../cdjfs-wood` each render the same public 404 page. This means Ohio no longer lacks official roots or discovery surfaces; instead, it now has a live but stale discovery family whose rendered county-directory pages still do not materialize a reviewable county-local office contract. The county-local blocker therefore remains, but with corrected live-root evidence rather than stale all-root 404 claims.';

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
    '- County-local disability resources remain blocked, but the blocker changed shape: the official roots, robots, and sitemaps are live again.',
    '- The current rendered Ohio county-directory lane still fails closed: the `job-family-services-directory` page, Ohio search results page, JFS `about/local-agencies-directory` root, and sampled `cdjfs-*` county leaves all render public 404 pages.',
    '- The live JFS sitemap is now discovery evidence only. It advertises 98 `cdjfs-*` entries across 88 county slugs, but those sitemap URLs are not self-proving because sampled rendered leaves remain dead.',
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
    '- Ohio remains blocked on two families, but the top county-local blocker is now more accurate: Ohio JFS, Medicaid, and Ohio.gov roots plus their robots and sitemaps are live again, while the rendered county-directory page, search page, and sampled `cdjfs-*` local-agency leaves still 404.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedSet = new Set(allStateAudit.states.filter((row) => row.classification === 'BLOCKED').map((row) => row.stateId));
  const completeStates = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').map((row) => row.stateName).sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').sort((a, b) => a.stateName.localeCompare(b.stateName));
  const idx = PRIORITY_ORDER.indexOf('ohio');
  const nextStates = PRIORITY_ORDER.slice(idx + 1).filter((stateId) => blockedSet.has(stateId)).slice(0, 10).map((stateId) => {
    const row = allStateAudit.states.find((entry) => entry.stateId === stateId);
    return row ? row.stateName : stateId;
  });
  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-24',
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
    'Ohio still has two critical blockers, but the highest-priority one is `county_local_disability_resources`. The old root-404 blocker is no longer true: Ohio JFS, Medicaid, and Ohio.gov roots plus their `robots.txt` and `sitemap.xml` surfaces are live again. The current failure is narrower and more truthful: the rendered `job-family-services-directory` page, Ohio search page, JFS `about/local-agencies-directory` root, and sampled `cdjfs-*` county leaves still render public 404 pages even though the live JFS sitemap advertises 98 `cdjfs-*` entries across 88 county slugs.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A rendered live Ohio county JFS or Medicaid directory page that exposes real county office details instead of the current public 404 page.',
    '- A working current successor to the stale `cdjfs-*` directory family, or proof that the sitemap leaf family itself now renders live office details.',
    '- For education later: more exact district or ESC leaves beyond the tiny current inventory.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [JFS root](https://jfs.ohio.gov/)',
    '- [JFS robots.txt](https://jfs.ohio.gov/robots.txt)',
    '- [JFS sitemap.xml](https://jfs.ohio.gov/sitemap.xml)',
    '- [Ohio.gov county directory page](https://ohio.gov/residents/resources/job-family-services-directory)',
    '- [Ohio.gov search page](https://ohio.gov/search?query=county%20job%20and%20family%20services)',
    '- [JFS local agencies directory root](https://jfs.ohio.gov/about/local-agencies-directory)',
    '- [Sample JFS county leaf: Adams](https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-adams)',
    '- [Sample JFS county leaf: Cuyahoga](https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-cuyahoga-3)',
    '- [Sample JFS county leaf: Wood](https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-wood)',
    '- [Medicaid root](https://medicaid.ohio.gov/)',
    '- [Medicaid robots.txt](https://medicaid.ohio.gov/robots.txt)',
    '- [Medicaid sitemap.xml](https://medicaid.ohio.gov/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current rendered Ohio county-office successor leaf on JFS, Medicaid, or Ohio.gov that replaces the stale public 404 directory family.',
    '- Any official statewide export, table, or rendered directory that maps all 88 counties to county JFS routing without relying on stale sitemap-only leaves.',
    '- For education later: exact district or ESC-owned leaves that materially expand county-grade routing beyond the current root-only inventory.',
    '',
    '## Next State Order After Ohio',
    '',
    ...nextStates.map((stateName, index) => `${index + 1}. ${stateName}`),
    '',
  ].join('\n');
}

function buildBatchReport(summary) {
  return [
    '# Batch 331 Ohio Live Root Recovery Report v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    '- change: corrected the stale Ohio county-local blocker from dead official roots to a live-but-stale directory family',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch331OhioLiveRootRecoveryV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT,
      },
      ...(summary.final_blockers || []).filter((row) => row.family !== 'county_local_disability_resources'),
    ],
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: COUNTY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_STATUS,
        status_reason: 'Ohio JFS, Medicaid, and Ohio.gov roots plus robots and sitemaps are publicly live again, but the rendered county-directory page, search page, JFS local-agencies root, and sampled `cdjfs-*` county leaves still render public 404 pages, so the county-local contract remains unverified.',
      };
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
      sample_count: 8,
      samples: [
        { sample_name: 'JFS root live again', source_url: 'https://jfs.ohio.gov/', verification_status: 'verified', source_type: 'official_root_live', source_table: 'reviewed_live_probe' },
        { sample_name: 'JFS robots live again', source_url: 'https://jfs.ohio.gov/robots.txt', verification_status: 'verified', source_type: 'official_discovery_surface_live', source_table: 'reviewed_live_probe' },
        { sample_name: 'JFS sitemap advertises county family', source_url: 'https://jfs.ohio.gov/sitemap.xml', verification_status: 'reviewed', source_type: 'official_sitemap_discovery_only', source_table: 'reviewed_live_probe' },
        { sample_name: 'Ohio.gov county directory page renders 404', source_url: 'https://ohio.gov/residents/resources/job-family-services-directory', verification_status: 'blocked', source_type: 'official_directory_leaf_404', source_table: 'reviewed_live_probe' },
        { sample_name: 'Ohio.gov search page renders 404', source_url: 'https://ohio.gov/search?query=county%20job%20and%20family%20services', verification_status: 'blocked', source_type: 'official_search_surface_404', source_table: 'reviewed_live_probe' },
        { sample_name: 'JFS local agencies root renders 404', source_url: 'https://jfs.ohio.gov/about/local-agencies-directory', verification_status: 'blocked', source_type: 'official_directory_root_404', source_table: 'reviewed_live_probe' },
        { sample_name: 'Sample county leaf Adams renders 404', source_url: 'https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-adams', verification_status: 'blocked', source_type: 'official_county_leaf_404', source_table: 'reviewed_live_probe' },
        { sample_name: 'Sample county leaf Cuyahoga renders 404', source_url: 'https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-cuyahoga-3', verification_status: 'blocked', source_type: 'official_county_leaf_404', source_table: 'reviewed_live_probe' },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: COUNTY_FAILURE, next_action: COUNTY_NEXT, evidence: COUNTY_REASON }
    : row);

  const updatedQueueRows = queueRows.map((row) => row.state === 'ohio'
    ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON, recommended_batch: 'batch_2_repair_blocked', status: 'BLOCKED' }
    : row);

  const updatedStates = allStateAudit.states.map((row) => row.stateId === 'ohio'
    ? {
        ...row,
        packetBatch: BATCH_NAME,
        packetPrimaryGapReason: PRIMARY_GAP_REASON,
        familyStatuses: {
          ...row.familyStatuses,
          county_local_disability_resources: COUNTY_STATUS,
          district_or_county_education_routing: EDUCATION_STATUS,
        },
      }
    : row);
  const updatedAllStateAudit = { ...allStateAudit, states: updatedStates };

  const updatedStateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const updatedAllStateReport = buildAllStateReport(updatedAllStateAudit);
  const updatedHandoff = buildHandoff(updatedAllStateAudit);
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.report, updatedStateReport);
  fs.writeFileSync(INPUTS.allStateReport, updatedAllStateReport);
  fs.writeFileSync(INPUTS.handoff, updatedHandoff);

  const batchSummary = {
    state: 'Ohio',
    classification: 'BLOCKED',
    index_safe: false,
    countyRootsLive: true,
    discoverySurfacesLive: true,
    advertisedCdjfsLeafCount: 98,
    advertisedCdjfsCountySlugCount: 88,
    renderedDirectory404: true,
    renderedSearch404: true,
    renderedDirectoryRoot404: true,
    sampledCountyLeaf404: true,
    lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch331OhioLiveRootRecoveryV1();
  console.log(JSON.stringify(result, null, 2));
}
