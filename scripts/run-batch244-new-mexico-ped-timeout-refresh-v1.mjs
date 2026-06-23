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
  packet: path.join(generatedDir, 'new-mexico_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch244_new_mexico_ped_timeout_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch244-new-mexico-ped-timeout-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
};

const EDUCATION_REASON =
  'Reviewed 2026-06-23 bounded live PED probes alongside the current California-grade packet. Exact official checks on both `https://webnew.ped.state.nm.us/` and `https://webnew.ped.state.nm.us/bureaus/special-education/` still timed out after 25 seconds, and the preserved New Mexico low-token queue still has zero district-owned, county-grade, or regional education leaves on disk. The only retained PED-side URLs are the generic PED root and the statewide Special Education Bureau page, while one retained candidate is still the wrong-role `https://www.nmhealth.org/about/ddsd` cross-role leak on a non-PED host. district_or_county_education_routing therefore remains blocked on authoring exact local education leaves, not on rerunning the same PED roots.';

const LESSON_HEADING =
  '### If Both The State Root And Bureau Leaf Timeout, Freeze Root Retries And Author Local Leaves';
const LESSON_BODY =
  '*   **Lesson:** When both the exact state root and its best statewide bureau leaf timeout under the same bounded live probe, stop rerunning state-root fetches and move straight to district or regional leaf authoring. New Mexico PED timed out on both `webnew.ped.state.nm.us/` and `/bureaus/special-education/`, so more PED-root retries would only burn tokens without producing local routing proof.';

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
    '# New Mexico Blocker Packets v4',
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
    '## New county-local refinement',
    '',
    '- The official HCA Field Offices archive is no longer just a vague partial source: reviewed pages 1 through 8 preserve county-specific office posts for 29 of 33 counties.',
    '- The exact remaining county-local blocker is now only Catron, Harding, Mora, and Union.',
    '- Harding and Union currently surface only an HCA service-expansion article, Mora only surfaces a SNAP article, and Catron still has no reviewed HCA county-office hit in the bounded same-host search lane.',
    '',
    '## Completion decision',
    '',
    '- New Mexico remains `BLOCKED` and `index_safe=false`.',
    '- Education is still blocked on missing district-owned or county-grade local leaves, and exact live PED root plus bureau probes now confirm this is not just a stale single-timeout assumption.',
    '- County-local is now blocked on a four-county official office-routing remainder, not on a dead or partial archive assumption.',
    '- VR remains blocked on the 401 DVR host plus zero reviewed alternate official roots.',
  ].join('\n') + '\n';
}

export function generateBatch244NewMexicoPedTimeoutRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => row.family === 'district_or_county_education_routing'
    ? { ...row, family_status: 'blocked_exact_district_or_county_leafs_unverified', status_reason: EDUCATION_REASON }
    : row);

  const updatedFailureRows = failureRows.map((row) => row.family === 'district_or_county_education_routing'
    ? { ...row, evidence: EDUCATION_REASON, next_action: 'author_county_or_district_exact_targets' }
    : row);

  const updatedVerifiedRows = verifiedRows.map((row) => row.family === 'district_or_county_education_routing'
    ? {
      ...row,
      family_status: 'blocked_exact_district_or_county_leafs_unverified',
      query_basis: 'Reviewed 2026-06-23 the NM low-token education candidate queue plus bounded live PED root and bureau probes.',
      blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
      blocker_evidence: EDUCATION_REASON,
      evidence_strength: 'missing',
    }
    : row);

  const updatedNextRows = nextRows.map((row) => row.family === 'district_or_county_education_routing'
    ? { ...row, failure_code: 'generic_or_statewide_evidence_used_where_local_required', next_action: 'author_county_or_district_exact_targets', evidence: EDUCATION_REASON }
    : row);

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: 'generic_or_statewide_evidence_used_where_local_required', evidence: EDUCATION_REASON, next_action: 'author_county_or_district_exact_targets' }
      : row),
  };

  const updatedPacket = {
    ...packet,
    current_metrics: {
      ...(packet.current_metrics || {}),
      pedRootTimedOut25s: true,
      pedBureauTimedOut25s: true,
      districtOwnedLeavesOnDisk: 0,
    },
    exhausted_candidates: Array.from(new Set([
      ...(packet.exhausted_candidates || []),
      'https://webnew.ped.state.nm.us/',
      'https://webnew.ped.state.nm.us/bureaus/special-education/',
    ])),
    bounded_live_probe_result: {
      attempted_at: '2026-06-23T00:00:00.000Z',
      urls: [
        'https://webnew.ped.state.nm.us/',
        'https://webnew.ped.state.nm.us/bureaus/special-education/',
      ],
      outcome: 'timed_out_25s_both_exact_urls',
      conclusion: 'Do not reopen PED root retries until exact district-owned, county-grade, or regional leaves are authored.',
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch244_new_mexico_ped_timeout_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'new-mexico',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    ped_root_timed_out_25s: true,
    ped_bureau_timed_out_25s: true,
    district_owned_leaves_on_disk: updatedPacket.current_metrics?.districtOwnedLeavesOnDisk ?? 0,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 244 New Mexico PED Timeout Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the New Mexico education blocker with bounded live PED root and bureau timeout evidence',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Kept New Mexico BLOCKED.',
    '- Confirmed the exact PED root and the statewide PED Special Education Bureau leaf both still time out under a bounded 25-second live probe.',
    '- Kept the repair lane on district-owned, county-grade, or regional leaf authoring instead of reopening PED-root retries.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch244NewMexicoPedTimeoutRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
