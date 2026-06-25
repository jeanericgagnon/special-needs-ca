import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-mexico_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-mexico_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-mexico_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-mexico_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-mexico_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  packet: path.join(generatedDir, 'new-mexico_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch353_new_mexico_education_host_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch353-new-mexico-education-host-finality-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'current_ped_host_timeouts_plus_dead_legacy_education_host_leave_zero_local_education_leaves_and_hca_four_county_remainder_persists';
const EDUCATION_FAILURE_CODE =
  'current_ped_host_timeouts_and_legacy_education_host_unresolvable_without_local_leafs';
const EDUCATION_NEXT = 'author_county_or_district_exact_targets';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 one more bounded official New Mexico education host pass. The legacy repo host family `https://education.new-mexico.gov/` is now source-finally unusable: exact probes on the root, `/regional`, `/sitemap.xml`, `/robots.txt`, `/special-education/`, and `/districts/` all fail DNS resolution. The current official PED host family remains equally non-productive for low-token local routing: earlier bounded exact probes on `https://webnew.ped.state.nm.us/` and `https://webnew.ped.state.nm.us/bureaus/special-education/` had already timed out after 25 seconds, and fresh bounded exact probes on the current host search and API-shaped routes still timed out after 15 seconds. The packet still preserves zero district-owned, county-grade, or regional local education leaves on disk, and the only retained PED-side URLs remain the generic PED root plus the statewide Special Education Bureau page. district_or_county_education_routing therefore remains blocked on authoring exact local leaves from district-owned or regional sources, not on any further state-host retries.';
const COUNTY_REASON =
  'Reviewed 2026-06-23 the live official HCA Field Offices archive across pages 1 through 12 plus bounded same-host county searches. Pages 1 through 8 still prove county-specific office posts for 29 of 33 New Mexico counties, while pages 9 through 12 are now proven empty archive-tail shells. Catron, Harding, Mora, and Union remain the only uncovered counties in the official county-local lane.';
const LESSON_HEADING =
  '### Retire Dead Legacy State Hosts Once The Current Replacement Also Fails Closed';
const LESSON_BODY =
  '*   **Lesson:** If the legacy official host family is unresolvable and the current replacement host still times out on exact bounded probes, stop treating either state host as an active discovery lane. New Mexico education now has both a dead `education.new-mexico.gov` host family and a timing-out `webnew.ped.state.nm.us` host family, so the only honest next move is district-owned or regional leaf authoring.';

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
    '# New Mexico Blocker Packets v6',
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
    '## Current education-host finality',
    '',
    '- The legacy `education.new-mexico.gov` host family is now explicitly retired as an active source lane because exact probes on the root, regional, sitemap, robots, and likely child routes all failed DNS resolution.',
    '- The current `webnew.ped.state.nm.us` host family is still not producing any local routing contract under bounded exact probes; the root, bureau, search, and API-shaped routes still time out instead of returning a usable district directory or export.',
    '- The state packet still preserves zero district-owned or regional local education leaves on disk, so further progress depends on exact district-owned or regional leaf authoring rather than more PED host retries.',
    '',
    '## Completion decision',
    '',
    '- New Mexico remains `BLOCKED` and `index_safe=false`.',
    '- Education remains the highest-priority blocker because both official state-host families now fail closed while zero reviewed local leaves are preserved on disk.',
    '- County-local remains separately blocked on the four-county HCA remainder: Catron, Harding, Mora, and Union.',
    '- VR remains blocked on the 401 DVR host plus zero reviewed alternate official roots.',
  ].join('\n') + '\n';
}

function updateAllStateReport(reportText) {
  const lines = reportText.split('\n');
  let replaced = false;
  const updated = lines.map((line) => {
    if (line.startsWith('- New Mexico:') || line.startsWith('- New Mexico remains blocked on')) {
      replaced = true;
      return '- New Mexico remains blocked because both official state-host education families now fail closed in different ways: the legacy `education.new-mexico.gov` family is unresolvable, the current `webnew.ped.state.nm.us` family still times out under bounded probes, and zero district-owned local leaves are preserved on disk; county-local still has a four-county HCA remainder.';
    }
    return line;
  });
  if (!replaced) {
    const notesIndex = updated.findIndex((line) => line.trim() === '## Notes');
    if (notesIndex !== -1) {
      updated.splice(
        notesIndex + 3,
        0,
        '- New Mexico remains blocked because both official state-host education families now fail closed in different ways: the legacy `education.new-mexico.gov` family is unresolvable, the current `webnew.ped.state.nm.us` family still times out under bounded probes, and zero district-owned local leaves are preserved on disk; county-local still has a four-county HCA remainder.',
      );
    }
  }
  return `${updated.join('\n').trimEnd()}\n`;
}

function updateHandoff(handoffText) {
  const blockedBullet =
    '- New Mexico: `current_ped_host_timeouts_plus_dead_legacy_education_host_leave_zero_local_education_leaves_and_hca_four_county_remainder_persists`';
  let updated = handoffText.replace(/^- New Mexico: .*$/m, blockedBullet);

  const replacementSection = [
    '## Current Focus State: New Mexico',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` remains the highest-priority New Mexico blocker. The legacy repo host family `https://education.new-mexico.gov/` is now source-finally dead: exact probes on the root, `/regional`, `/sitemap.xml`, `/robots.txt`, `/special-education/`, and `/districts/` all failed DNS resolution. The current official PED host family still does not yield a reusable local contract in the low-token lane: the packet already had 25-second timeouts on the exact root and Special Education Bureau leaf, and fresh bounded probes on search/API-shaped routes also timed out. The state packet still preserves zero district-owned, county-grade, or regional local education leaves on disk, so New Mexico cannot move without exact local leaf authoring.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any district-owned New Mexico special-education, student-services, exceptional-services, or child-find leaf that can replace the current PED fallback for a county row.',
    '- Any official regional education cooperative or county-owned education-routing page that preserves local routing coverage for named New Mexico counties or districts.',
    '- Any current official PED directory, export, or API that returns district-local rows without timing out and can be replayed deterministically from disk.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Current PED root](https://webnew.ped.state.nm.us/)',
    '- [Current PED Special Education Bureau](https://webnew.ped.state.nm.us/bureaus/special-education/)',
    '- [Current PED WordPress search API shape](https://webnew.ped.state.nm.us/wp-json/wp/v2/search?search=district)',
    '- [Current PED search page shape](https://webnew.ped.state.nm.us/?s=district)',
    '- [Legacy education root](https://education.new-mexico.gov/)',
    '- [Legacy education regional route](https://education.new-mexico.gov/regional)',
    '- [HCA field offices archive root](https://www.hca.nm.gov/lookingforassistance/field_offices_1/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- District-owned New Mexico local special-education or student-services leaves by county.',
    '- Regional education cooperative leaves that explicitly preserve local routing for covered New Mexico districts or counties.',
    '- Same-host HCA county office followups only for Catron, Harding, Mora, and Union.',
    '',
    '## Next State Order After New Mexico',
    '',
    '1. South Dakota',
    '2. Rhode Island',
    '3. Virginia',
    '4. West Virginia',
    '5. North Dakota',
    '6. Wisconsin',
    '7. Washington',
    '8. Tennessee',
    '9. Vermont',
    '10. Wyoming',
  ].join('\n');

  updated = updated.replace(/## Current Focus State:[\s\S]*$/m, replacementSection);
  return `${updated.trimEnd()}\n`;
}

export function generateBatch353NewMexicoEducationHostFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const packet = readJson(INPUTS.packet);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: 'batch353_new_mexico_education_host_finality_v1',
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_REASON, next_action: EDUCATION_NEXT }
        : row
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_exact_district_or_county_leafs_unverified', status_reason: EDUCATION_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_REASON, next_action: EDUCATION_NEXT }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      family_status: 'blocked_exact_district_or_county_leafs_unverified',
      query_basis: 'Reviewed 2026-06-25 the current and legacy official New Mexico education host families plus the existing zero-leaf packet state.',
      blocker_code: EDUCATION_FAILURE_CODE,
      blocker_evidence: EDUCATION_REASON,
      evidence_strength: 'missing',
      sample_count: 5,
      samples: [
        {
          sample_name: 'Current PED root',
          source_url: 'https://webnew.ped.state.nm.us/',
          verification_status: 'blocked',
          source_type: 'current_official_root_timeout',
          source_table: 'bounded_live_probe',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The current official PED root still times out under bounded exact probes and does not yield a local district-routing contract.',
        },
        {
          sample_name: 'Current PED Special Education Bureau',
          source_url: 'https://webnew.ped.state.nm.us/bureaus/special-education/',
          verification_status: 'blocked',
          source_type: 'current_official_bureau_timeout',
          source_table: 'bounded_live_probe',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The statewide PED Special Education Bureau leaf still times out and is statewide authority only, not district-owned local routing.',
        },
        {
          sample_name: 'Current PED API/search routes',
          source_url: 'https://webnew.ped.state.nm.us/wp-json/wp/v2/search?search=district',
          verification_status: 'blocked',
          source_type: 'current_official_search_shape_timeout',
          source_table: 'bounded_live_probe',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'Fresh bounded probes on the current host search/API-shaped routes still timed out instead of returning directory or district-local data.',
        },
        {
          sample_name: 'Legacy education host family',
          source_url: 'https://education.new-mexico.gov/',
          verification_status: 'blocked',
          source_type: 'legacy_official_host_dns_failure',
          source_table: 'bounded_live_probe',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The legacy `education.new-mexico.gov` host family is unresolvable on the root, regional, sitemap, robots, and likely child routes.',
        },
        {
          sample_name: 'Zero local leaves on disk',
          source_url: 'data/generated/new-mexico_district_or_county_education_routing_leaf_authoring_packet_v1.json',
          verification_status: 'blocked',
          source_type: 'packet_zero_local_leafs',
          source_table: 'new-mexico_district_or_county_education_routing_leaf_authoring_packet_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The state packet still preserves zero district-owned, county-grade, or regional local education leaves on disk.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT, evidence: EDUCATION_REASON }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'new-mexico'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedPacket = {
    ...packet,
    current_metrics: {
      ...(packet.current_metrics || {}),
      districtOwnedLeavesOnDisk: 0,
      pedRootTimedOut25s: true,
      pedBureauTimedOut25s: true,
      currentPedSearchTimedOut15s: true,
      legacyEducationHostUnresolvable: true,
    },
    exhausted_candidates: Array.from(new Set([
      ...(packet.exhausted_candidates || []),
      'https://webnew.ped.state.nm.us/',
      'https://webnew.ped.state.nm.us/bureaus/special-education/',
      'https://education.new-mexico.gov/',
      'https://education.new-mexico.gov/regional',
    ])),
    bounded_live_probe_result: {
      attempted_at: '2026-06-25T00:00:00.000Z',
      urls: [
        'https://webnew.ped.state.nm.us/',
        'https://webnew.ped.state.nm.us/bureaus/special-education/',
        'https://webnew.ped.state.nm.us/wp-json/wp/v2/search?search=district',
        'https://education.new-mexico.gov/',
        'https://education.new-mexico.gov/regional',
      ],
      outcome: 'current_host_timeouts_plus_legacy_host_dns_failures',
      conclusion: 'Retire both state-host education families as active low-token discovery lanes and move only through district-owned or regional local leaf authoring.',
    },
  };

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((state) => (
      state.stateId === 'new-mexico'
        ? { ...state, packetBatch: 'batch353_new_mexico_education_host_finality_v1', packetPrimaryGapReason: PRIMARY_GAP_REASON }
        : state
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.allStateReport, updateAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, updateHandoff(handoff));

  const batchSummary = {
    batch: 'batch353_new_mexico_education_host_finality_v1',
    generated_at: '2026-06-25T00:00:00.000Z',
    state: 'new-mexico',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    legacy_education_host_unresolvable: true,
    current_ped_search_timed_out_15s: true,
    current_ped_root_timeout_persisted: true,
    district_owned_leaves_on_disk: 0,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 353 New Mexico Education Host Finality Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: retired the dead legacy New Mexico education host family and tightened the current PED timeout blocker',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Kept New Mexico BLOCKED.',
    '- Confirmed the legacy `education.new-mexico.gov` host family is unresolvable and should not remain an implied active source lane.',
    '- Confirmed the current PED host family still times out on exact root, bureau, and search/API-shaped routes.',
    '- Kept the repair lane on district-owned or regional local leaf authoring and same-host HCA followups for the separate county-local remainder.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch353NewMexicoEducationHostFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
