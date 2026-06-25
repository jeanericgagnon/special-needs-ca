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
  leaves: path.join(generatedDir, 'kansas_reviewed_district_owned_special_education_leaves_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch335_kansas_labette_tricounty_leaf_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch335-kansas-labette-tricounty-leaf-report-v1.md'),
};

const COUNT = 24;
const PRIMARY_GAP_REASON =
  'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_24_counties';
const FAMILY_STATUS =
  'blocked_reviewed_local_kansas_district_leaves_expand_to_24_counties_but_current_live_ksde_submit_replay_is_rejected';
const NEXT_ACTION =
  'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible';
const BATCH = 'batch335_kansas_labette_tricounty_leaf_v1';
const LESSON_HEADING = '### District Sitemaps Can Surface Exact Cooperative Leaves Even When State Export Roots Stay Rejected';
const LESSON_BODY =
  '*   **Lesson:** If an official district sitemap exposes a role-exact cooperative leaf on the district-owned host, promote that leaf directly instead of waiting on a blocked state export lane. Kansas Labette cleared once the Parsons USD 503 sitemap surfaced `/page/tri-county-special-education-cooperative/`, whose district-owned page preserved the role-exact title `Tri-County Special Education Cooperative` plus Child Find screening language.';

const NEW_LEAF = {
  county_id: 'labette-ks',
  county_name: 'labette',
  district_name: 'Parsons District Schools USD 503',
  district_website: 'https://www.usd503.org/',
  source_url: 'https://www.usd503.org/page/tri-county-special-education-cooperative/',
  final_url: 'https://www.usd503.org/page/tri-county-special-education-cooperative/',
  verification_status: 'verified',
  source_type: 'district_owned_special_education_cooperative_leaf',
  fetched_at: '2026-06-24T00:00:00.000Z',
  evidence_title: 'Tri-County Special Education Cooperative | Parsons District Schools',
  evidence_h1: 'Tri-County Special Education',
  evidence_snippet:
    'The official Parsons District Schools sitemap exposes an exact district-owned `/page/tri-county-special-education-cooperative/` leaf, and the fetched usd503.org page preserves the role-exact title `Tri-County Special Education Cooperative | Parsons District Schools`, H1 `Tri-County Special Education`, and Child Find screening language on the district host.',
};

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function buildStatusReason() {
  return `Kansas still has reviewed local education-routing proof for only ${COUNT} counties, so the state remains blocked on incomplete county-grade local education evidence. The preserved district-owned and district-linked local leaf lane is still real, but the current live KSDE state directory/export lane is no longer reproducibly usable in the bounded raw pass because the Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay all now return \`Request Rejected\` shells. The correct next lane is therefore saved district-owned or district-linked local leaf authoring only, not more retries against the current live KSDE state roots.`;
}

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-24 one more bounded official Kansas district-routing pass against exact saved district-host leads, then promoted only exact local district-host evidence. The current live raw lane still returns the same \`Request Rejected\` shell for \`https://uapps.ksde.gov/Directory_Rpts/default.aspx\`, \`https://www.ksde.gov/data-and-reporting/directories\`, and \`https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12\`. One fresh exact district-scoped submit replay against the current Directory Reports root using the public hidden fields and \`ctl00$MainContent$ddDistricts=D0435\`, \`ctl00$MainContent$RadioGroup1=RadioUSD1\`, \`ctl00$MainContent$rblFormat=Excel\`, and \`ctl00$MainContent$btnPrintSection1=Run Report\` also returned the same \`Request Rejected\` shell instead of a workbook. Kansas now has reviewed local proof for ${leaves.length}/105 counties from preserved district-owned or district-linked leaves: ${counties.join(', ')}. Labette now clears because the official Parsons District Schools USD 503 sitemap exposes an exact district-owned \`/page/tri-county-special-education-cooperative/\` leaf, and the fetched usd503.org page preserves the role-exact title \`Tri-County Special Education Cooperative | Parsons District Schools\`, H1 \`Tri-County Special Education\`, and Child Find screening language on the district host. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties, and the only trustworthy next lane is saved district-owned or district-linked local leaf authoring rather than the current flapping-or-rejected KSDE export stack.`;
}

function buildSamples(existingSamples) {
  const next = existingSamples.filter((sample) => sample.source_url !== NEW_LEAF.source_url);
  next.push({
    sample_name: 'labette district leaf',
    source_url: NEW_LEAF.source_url,
    final_url: NEW_LEAF.final_url,
    verification_status: NEW_LEAF.verification_status,
    source_type: NEW_LEAF.source_type,
    source_table: 'reviewed_live_probe',
    fetched_at: NEW_LEAF.fetched_at,
    evidence_snippet: NEW_LEAF.evidence_snippet,
  });
  return next;
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
    '- Labette now clears from the district-owned Parsons USD 503 `Tri-County Special Education Cooperative` leaf.',
    `- Kansas now has reviewed local education-routing proof for ${COUNT} counties, but county-grade local coverage remains incomplete across the remaining unresolved counties.`,
    '- The current official KSDE Directory Reports root, Directories page, educational-directory PDF URL, and exact district-scoped submit replay still fail closed as `Request Rejected` shells in the bounded raw lane.',
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
    `\`district_or_county_education_routing\` is the only remaining Kansas critical blocker. Kansas now has reviewed local education-routing proof for ${COUNT}/105 counties from preserved district-owned or district-linked local leaves, but the current live KSDE state directory/export lane is still not reproducible in the bounded raw pass. \`https://uapps.ksde.gov/Directory_Rpts/default.aspx\`, \`https://www.ksde.gov/data-and-reporting/directories\`, and the current Kansas educational-directory PDF URL now each return HTTP 200 only as the same \`Request Rejected\` shell, and one fresh exact district-scoped submit replay on the Directory Reports root also returns that shell instead of a workbook. Labette now clears because the official Parsons District Schools USD 503 sitemap exposes an exact district-owned \`/page/tri-county-special-education-cooperative/\` leaf, and the fetched usd503.org page preserves the role-exact title \`Tri-County Special Education Cooperative | Parsons District Schools\`, H1 \`Tri-County Special Education\`, and Child Find screening language on the district host. Kansas remains BLOCKED and not index-safe because county-grade local education proof is still incomplete across the remaining counties and the state-level export lane is not trustworthy enough to drive deterministic repair work right now.`,
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
    '- [Parsons District Schools sitemap](https://www.usd503.org/sitemap.xml)',
    '- [Parsons district leaf](https://www.usd503.org/page/tri-county-special-education-cooperative/)',
    '- [Coffeyville USD 445 home](https://www.cvilleschools.com/)',
    '- [Coffeyville USD 445 site map](https://www.cvilleschools.com/site-map)',
    '- [Tri County Special Education Coop 607 child-find leaf](https://www.tricounty607.com/child-find)',
    '- [Marysville USD 364 sitemap](https://www.usd364.org/sitemap.xml)',
    '- [Marshall County Special Education Coop eligibility page](https://www.usd364.org/o/mcsec/page/special-education-eligibility/)',
    '- [McPherson County Special Education Cooperative](https://mccsec.mcpherson.com/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved district-owned domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.',
    '- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or Child Find.',
    '- Additional district-owned document-folder or CMS routes like the Parsons USD 503, Hays USD 489, Hutchinson USD 308, Marysville USD 364, and Coffeyville USD 445 recoveries, but only on already-preserved district domains.',
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
    '- Kansas remains blocked because the live KSDE Directory Reports root, Directories page, educational-directory PDF URL, and exact district-scoped submit replay still collapse to `Request Rejected` shells, even though reviewed local district-owned or district-linked special-education leaves now cover 24 of 105 counties, including the district-owned Parsons USD 503 `Tri-County Special Education Cooperative` leaf for Labette County.';
  const current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  if (current.includes(note)) {
    return;
  }
  if (current.includes('Kansas remains blocked because')) {
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
    '# Batch 335 Kansas Labette Tri County Leaf v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    `- reviewed_leaf_count: ${COUNT}`,
    `- primary_gap_reason: ${PRIMARY_GAP_REASON}`,
    '',
    '## What changed',
    '',
    '- Labette now clears from the district-owned Parsons USD 503 `Tri-County Special Education Cooperative` leaf.',
    '- The official Parsons District Schools sitemap exposes the exact `/page/tri-county-special-education-cooperative/` route on the district-owned host.',
    '- The fetched Parsons district leaf preserves the role-exact title `Tri-County Special Education Cooperative | Parsons District Schools`, H1 `Tri-County Special Education`, and Child Find screening language.',
    '- Kansas remains blocked because the live KSDE state directory/export lane still fails as `Request Rejected` and local county-grade coverage is still incomplete.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch335KansasLabetteTricountyLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const leaves = readJsonl(INPUTS.leaves);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const mergedLeaves = [...leaves.filter((row) => row.county_id !== NEW_LEAF.county_id), NEW_LEAF]
    .sort((a, b) => a.county_id.localeCompare(b.county_id));
  const counties = mergedLeaves.map((row) => row.county_id);
  const evidence = buildEvidence(mergedLeaves);
  const statusReason = buildStatusReason();

  summary.batch = BATCH;
  summary.primary_gap_reason = PRIMARY_GAP_REASON;
  summary.final_blockers[0].failure_code = PRIMARY_GAP_REASON;
  summary.final_blockers[0].evidence = evidence;
  summary.final_blockers[0].next_action = NEXT_ACTION;
  summary.familyStatuses.district_or_county_education_routing = FAMILY_STATUS;

  const nextGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: statusReason, failure_code: PRIMARY_GAP_REASON, next_action: NEXT_ACTION }
      : row
  );

  const nextFailureRows = failureRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: PRIMARY_GAP_REASON, evidence, next_action: NEXT_ACTION }
      : row
  );

  const nextVerifiedRows = verifiedRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          blocker_code: PRIMARY_GAP_REASON,
          blocker_evidence: 'The current KSDE Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay still return `Request Rejected` shells, so the trustworthy Kansas lane remains preserved local district leaves rather than the current live state export stack.',
          samples: buildSamples(row.samples || []),
          sample_count: (row.samples || []).filter((sample) => sample.source_url !== NEW_LEAF.source_url).length + 1,
        }
      : row
  );

  const nextActionRows = nextRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: PRIMARY_GAP_REASON, next_action: NEXT_ACTION, evidence }
      : row
  );

  packet.current_problem_metrics.placeholderSourceRows = 105 - mergedLeaves.length;
  packet.current_problem_metrics.placeholderWebsiteRows = 105 - mergedLeaves.length;
  packet.current_problem_metrics.authoredExactLeafCount = mergedLeaves.length;
  packet.current_problem_metrics.reviewedDistrictOwnedLeafCount = mergedLeaves.length;
  packet.reviewed_local_leaf_counties = counties;
  packet.unresolved_local_leaf_counties = packet.affected_counties.filter((county) => !counties.includes(county));

  const nextQueueRows = allStateQueue.map((row) =>
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  );

  const nextAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) =>
      row.stateId === 'kansas'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            completenessPct: 92,
            weakCriticalFamilies: 1,
            packetBatch: BATCH,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...(row.familyStatuses || {}),
              district_or_county_education_routing: FAMILY_STATUS,
            },
          }
        : row
    ),
  };

  writeJson(INPUTS.summary, summary);
  writeJsonl(INPUTS.gap, nextGapRows);
  writeJsonl(INPUTS.failures, nextFailureRows);
  writeJsonl(INPUTS.verified, nextVerifiedRows);
  writeJsonl(INPUTS.next, nextActionRows);
  writeJson(INPUTS.packet, packet);
  writeJsonl(INPUTS.leaves, mergedLeaves);
  writeJsonl(INPUTS.allStateQueue, nextQueueRows);
  writeJson(INPUTS.allStateAudit, nextAudit);
  fs.writeFileSync(INPUTS.report, buildStateReport(summary, nextGapRows, nextFailureRows, nextVerifiedRows, nextActionRows));
  updateHandoff();
  updateAllStateReport();
  appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    state: 'kansas',
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    promoted_county: 'labette-ks',
    promoted_counties_total: mergedLeaves.length,
    district_sitemap_status: 200,
    district_leaf_status: 200,
    district_leaf_title: 'Tri-County Special Education Cooperative | Parsons District Schools',
    district_leaf_h1: 'Tri-County Special Education',
    remaining_blocker_family: 'district_or_county_education_routing',
    failure_code: PRIMARY_GAP_REASON,
    next_action: NEXT_ACTION,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch335KansasLabetteTricountyLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
