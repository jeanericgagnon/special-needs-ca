import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  report: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch347_kansas_reviewed_district_nonmatch_freeze_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch347-kansas-reviewed-district-nonmatch-freeze-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_30_counties';
const FAMILY_STATUS =
  'blocked_reviewed_local_kansas_district_leaves_expand_to_30_counties_but_current_live_ksde_submit_replay_is_rejected';
const NEXT_ACTION =
  'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible';
const COUNT = 30;
const BATCH = 'batch347_kansas_reviewed_district_nonmatch_freeze_v1';

const REVIEWED_NONMATCH_EVIDENCE =
  'Reviewed 2026-06-25 one more bounded official Kansas district-host freeze pass against unresolved saved district domains instead of retrying the rejected KSDE export lane. Chase County USD 284 now proves a reviewed public non-match: the district homepage, robots.txt, sitemap.xml, and site_map are all public, but the sitemap exposes zero role-bearing special-education, student-services, child-find, parent-rights, or 504 URLs, and the exact same-domain candidate slugs `/page/special-education`, `/page/student-services`, and `/page/child-find` each return explicit 404 pages. Woodson USD 366 now proves the same public non-match class: the district homepage, robots.txt, and sitemap.xml are live, but the sitemap exposes zero role-bearing local education-routing URLs and the exact same-domain candidate slugs `/page/special-education`, `/page/student-services`, and `/page/child-find` each return explicit 404 pages. Chanute USD 413 now proves a separate false-positive class: the official district app host returns HTTP 200 for arbitrary role-like slugs such as `/page/special-education`, `/departments/special-education`, `/special-education`, and `/student-services`, but each page resolves only to the same generic app shell with title `Blue Comets Connect` and no special-education, child-find, 504, procedural-safeguards, or parent-rights text. Kansas therefore still remains blocked on incomplete county-grade local education proof, and these reviewed hosts should stay frozen until an exact role-bearing local leaf appears on the district-owned stack.';

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
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
}

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function updateLessonsLearned() {
  const lessonHeading = '### App Shell 200s And Sitemap-Backed 404s Still Fail Closed';
  const lessonLine =
    '*   **Lesson:** If a district-owned host returns HTTP 200 for arbitrary role-like slugs but every route resolves to the same generic app shell with no special-education, child-find, 504, parent-rights, or procedural-safeguards text, treat that host as a false-positive app shell instead of a verified local leaf. Kansas Chanute USD 413 returned the same `Blue Comets Connect` shell for `/page/special-education`, `/departments/special-education`, `/special-education`, and `/student-services`, while Chase County USD 284 and Woodson USD 366 each exposed public sitemaps plus exact role-slug 404s with zero role-bearing sitemap URLs, which is enough to freeze those domains without more same-host retries.';
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(lessonHeading)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${lessonHeading}\n${lessonLine}\n`);
}

function buildStatusReason() {
  return `Kansas still has reviewed local education-routing proof for only ${COUNT} counties, so the state remains blocked on incomplete county-grade local education evidence. The preserved district-owned and district-linked local leaf lane is still the only trustworthy repair path because the current live KSDE state directory/export lane still fails as \`Request Rejected\`, while three more unresolved district domains now also fail closed in reviewed ways: Chase County USD 284 exposes a live sitemap plus exact role-slug 404s with zero role-bearing sitemap URLs, Woodson USD 366 exposes a live sitemap plus exact role-slug 404s with zero role-bearing sitemap URLs, and Chanute USD 413 returns the same generic \`Blue Comets Connect\` app shell for arbitrary role-like slugs with no special-education text. The correct next lane is therefore saved district-owned or district-linked local leaf authoring only, not more retries against the current live KSDE roots or these reviewed non-match/app-shell district hosts.`;
}

function buildVerifiedBlockerEvidence(existing) {
  return `${existing} ${REVIEWED_NONMATCH_EVIDENCE}`;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Audit Report v2',
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
    '- Kansas remains BLOCKED and not index-safe.',
    '- Education is still the only remaining critical blocker.',
    '- Kansas still has reviewed local education-routing proof for 30 counties and no new county clears in this pass.',
    '- Chase County USD 284 now freezes as a reviewed district-owned non-match because the public sitemap exposes zero role-bearing local-routing URLs and exact role slugs return 404.',
    '- Woodson USD 366 now freezes as a reviewed district-owned non-match because the public sitemap exposes zero role-bearing local-routing URLs and exact role slugs return 404.',
    '- Chanute USD 413 now freezes as a district-owned false-positive app shell because role-like slugs all resolve to the same generic `Blue Comets Connect` shell with no special-education text.',
    '- The live KSDE state directory/export lane still fails closed as `Request Rejected`, so the only trustworthy next lane remains saved district-owned or district-linked local leaves.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current
    .split('\n')
    .map((line) => (line.startsWith('- Kansas: `') ? `- Kansas: \`${PRIMARY_GAP_REASON}\`` : line))
    .join('\n');

  const focusBlock = [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    `\`district_or_county_education_routing\` is the only remaining Kansas critical blocker. Kansas still has reviewed local education-routing proof for ${COUNT}/105 counties from preserved district-owned or district-linked leaves, but the current live KSDE state directory/export lane is still not reproducible in the bounded raw pass because the Directory Reports root, Directories page, educational-directory PDF URL, and one exact district-scoped submit replay still return the same \`Request Rejected\` shell instead of a workbook or public county join. Three more unresolved district domains now also fail closed in deterministic ways: Chase County USD 284 exposes a live sitemap plus exact role-slug 404s with zero role-bearing sitemap URLs, Woodson USD 366 exposes a live sitemap plus exact role-slug 404s with zero role-bearing sitemap URLs, and Chanute USD 413 returns the same generic \`Blue Comets Connect\` app shell for arbitrary role-like slugs with no special-education or child-find text. Kansas remains BLOCKED because county-grade local education proof is still incomplete across the remaining counties and the only trustworthy next lane is saved district-owned or district-linked local leaf authoring.`,
    '',
    '### Exact Evidence Needed',
    '',
    '- Additional district-owned Kansas `special education`, `student services`, `special services`, `parent rights`, or district-linked cooperative leaves on unresolved saved district domains.',
    '- Exact same-domain district leaf evidence for unresolved counties that is role-bearing enough to replace the statewide KSDE placeholders.',
    '- If a district host is live but lacks any role-exact leaf, exact non-match proof so the county can stay frozen without repeated retries.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [KSDE Directory Reports root](https://uapps.ksde.gov/Directory_Rpts/default.aspx)',
    '- [KSDE Directories root](https://www.ksde.gov/data-and-reporting/directories)',
    '- [Kansas Educational Directory PDF](https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12)',
    '- [Chase County USD 284 root](https://www.usd284.org/)',
    '- [Chase County USD 284 sitemap](https://www.usd284.org/sitemap.xml)',
    '- [Chase County USD 284 site map](https://www.usd284.org/site_map)',
    '- [Woodson USD 366 root](https://www.usd366.net/)',
    '- [Woodson USD 366 sitemap](https://www.usd366.net/sitemap.xml)',
    '- [Chanute USD 413 root](https://www.usd413.org/)',
    '- [Chanute USD 413 role-like slug probe](https://www.usd413.org/page/special-education)',
    '- [Chanute USD 413 role-like slug probe](https://www.usd413.org/departments/special-education)',
    '- [Chanute USD 413 role-like slug probe](https://www.usd413.org/student-services)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved district-owned domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.',
    '- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or Child Find.',
    '- Additional district-owned document-folder, Google Sites, or CMS routes like the Ottawa USD 290, Garnett USD 365, Parsons USD 503, Hays USD 489, Hutchinson USD 308, Marysville USD 364, Burlington USD 244, Coffeyville USD 445, Wamego USD 320, and Fort Scott USD 234 recoveries, but only on already-preserved district domains.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n?){1,12}/,
    [
      '## Next State Order After Kansas',
      '',
      '1. Nebraska',
      '2. Nevada',
      '3. Florida',
      '4. Alaska',
      '5. South Carolina',
      '6. North Carolina',
      '7. New York',
      '8. Oklahoma',
      '9. Oregon',
      '10. Ohio',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  const note =
    '- Kansas remains blocked because the live KSDE Directory Reports root, Directories page, educational-directory PDF URL, and exact district-scoped submit replay still collapse to `Request Rejected` shells; Chase County USD 284 and Woodson USD 366 now freeze as reviewed public non-matches with live sitemaps but zero role-bearing local-routing URLs, and Chanute USD 413 now freezes as a false-positive district app shell that returns HTTP 200 for arbitrary role-like slugs without any special-education content.';
  const current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  if (current.includes(note)) return;
  if (current.includes('- Kansas remains blocked because')) {
    fs.writeFileSync(
      INPUTS.allStateReport,
      current.replace(/- Kansas remains blocked because.*$/m, note)
    );
    return;
  }
  fs.writeFileSync(INPUTS.allStateReport, `${current.trimEnd()}\n${note}\n`);
}

function buildBatchReport() {
  return [
    '# Batch 347 Kansas Reviewed District Non-Match Freeze v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- promoted_county_total: 30',
    `- primary_gap_reason: ${PRIMARY_GAP_REASON}`,
    '',
    '## What changed',
    '',
    '- No new Kansas county clears in this pass.',
    '- Chase County USD 284 now freezes as a reviewed public non-match because its live sitemap exposes zero role-bearing local-routing URLs and exact role-like slugs return explicit 404 pages.',
    '- Woodson USD 366 now freezes as a reviewed public non-match because its live sitemap exposes zero role-bearing local-routing URLs and exact role-like slugs return explicit 404 pages.',
    '- Chanute USD 413 now freezes as a false-positive district app shell because arbitrary role-like slugs return the same generic `Blue Comets Connect` shell with no special-education, child-find, 504, parent-rights, or procedural-safeguards text.',
    '- Kansas remains blocked because county-grade local education proof is still incomplete and the current KSDE state export lane still fails as `Request Rejected`.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch347KansasReviewedDistrictNonmatchFreezeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const queueRows = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  summary.batch = BATCH;
  summary.classification = 'BLOCKED';
  summary.index_safe = false;
  summary.incorrectly_index_safe = false;
  summary.completeness_pct = 93;
  summary.primary_gap_reason = PRIMARY_GAP_REASON;
  summary.final_blockers = [
    {
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: PRIMARY_GAP_REASON,
      evidence: REVIEWED_NONMATCH_EVIDENCE,
      next_action: NEXT_ACTION,
    },
  ];
  summary.familyStatuses = {
    ...summary.familyStatuses,
    district_or_county_education_routing: FAMILY_STATUS,
  };

  const nextGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          status_reason: buildStatusReason(),
          failure_code: PRIMARY_GAP_REASON,
          next_action: NEXT_ACTION,
        }
      : row
  );

  const nextFailureRows = failureRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: PRIMARY_GAP_REASON,
          evidence: REVIEWED_NONMATCH_EVIDENCE,
          next_action: NEXT_ACTION,
        }
      : row
  );

  const nextVerifiedRows = verifiedRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          blocker_code: PRIMARY_GAP_REASON,
          blocker_evidence: buildVerifiedBlockerEvidence(row.blocker_evidence || ''),
        }
      : row
  );

  const nextNextRows = nextRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: PRIMARY_GAP_REASON,
          next_action: NEXT_ACTION,
          evidence: REVIEWED_NONMATCH_EVIDENCE,
        }
      : row
  );

  packet.current_problem_metrics.authoredExactLeafCount = COUNT;
  packet.current_problem_metrics.reviewedDistrictOwnedLeafCount = COUNT;
  packet.packet_complete_when =
    'Every Kansas county row either points at a reviewed district-owned or district-linked education-routing leaf from saved district leads or remains explicitly blocked where exact public district-domain checks already prove a non-match, false-positive app shell, or no local role-bearing leaf; do not rely on the current live KSDE state export roots until the exact submit lane is reproducible again.';

  const nextQueueRows = queueRows.map((row) =>
    row.state === 'kansas'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 93,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'batch_2_repair_blocked',
          repair_lane: 'repair_from_state_packet',
        }
      : row
  );

  allStateAudit.classifications = {
    COMPLETE: 27,
    BLOCKED: 23,
  };
  allStateAudit.indexSafeCount = 27;
  allStateAudit.states = allStateAudit.states.map((row) =>
    row.stateId === 'kansas'
      ? {
          ...row,
          classification: 'BLOCKED',
          indexSafe: false,
          completenessPct: 93,
          packetBatch: BATCH,
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          familyStatuses: {
            ...row.familyStatuses,
            district_or_county_education_routing: FAMILY_STATUS,
          },
        }
      : row
  );

  writeJson(INPUTS.summary, summary);
  writeJsonl(INPUTS.gap, nextGapRows);
  writeJsonl(INPUTS.failures, nextFailureRows);
  writeJsonl(INPUTS.verified, nextVerifiedRows);
  writeJsonl(INPUTS.next, nextNextRows);
  writeJson(INPUTS.packet, packet);
  writeJsonl(INPUTS.allStateQueue, nextQueueRows);
  writeJson(INPUTS.allStateAudit, allStateAudit);
  fs.writeFileSync(
    INPUTS.report,
    buildStateReport(summary, nextGapRows, nextFailureRows, nextVerifiedRows, nextNextRows)
  );
  updateHandoff();
  updateLessonsLearned();
  updateAllStateReport();

  const batchSummary = {
    state: 'kansas',
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    promoted_county_total: COUNT,
    chase_home_status: 200,
    chase_sitemap_status: 200,
    chase_special_slug_status: 404,
    woodson_home_status: 200,
    woodson_sitemap_status: 200,
    woodson_special_slug_status: 404,
    chanute_special_slug_status: 200,
    chanute_special_slug_title: 'Blue Comets Connect',
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch347KansasReviewedDistrictNonmatchFreezeV1();
  console.log(JSON.stringify(result, null, 2));
}
