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
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch331_kansas_marshall_mcsec_leaf_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch331-kansas-marshall-mcsec-leaf-report-v1.md'),
};

const COUNT = 22;
const PRIMARY_GAP_REASON =
  'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_22_counties';
const FAMILY_STATUS =
  'blocked_reviewed_local_kansas_district_leaves_expand_to_22_counties_but_current_live_ksde_submit_replay_is_rejected';
const NEXT_ACTION =
  'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible';
const BATCH = 'batch331_kansas_marshall_mcsec_leaf_v1';

const NEW_LEAF = {
  county_id: 'marshall-ks',
  county_name: 'marshall',
  district_name: 'Marysville USD 364',
  district_website: 'https://www.usd364.org/',
  source_url: 'https://www.usd364.org/o/mcsec/page/special-education-eligibility/',
  final_url: 'https://www.usd364.org/o/mcsec/page/special-education-eligibility/',
  verification_status: 'verified',
  source_type: 'district_linked_special_education_cooperative_leaf',
  fetched_at: '2026-06-24T00:00:00.000Z',
  evidence_title: 'Special Education Eligibility | Marshall County Special Education Coop',
  evidence_h1: 'Special Education Eligibility',
  evidence_snippet:
    'The official Marysville USD 364 sitemap exposes an `mcsec` subtree on the district-owned usd364.org host, and the fetched `Special Education Eligibility` page preserves the title `Special Education Eligibility | Marshall County Special Education Coop` plus H1 `Special Education Eligibility` on the same first-party district stack.',
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

function replaceLineByPrefix(text, prefix, replacement) {
  return text.split('\n').map((line) => (line.startsWith(prefix) ? replacement : line)).join('\n');
}

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function buildStatusReason() {
  return `Kansas still has reviewed local education-routing proof for only ${COUNT} counties, so the state remains blocked on incomplete county-grade local education evidence. The preserved district-owned and district-linked local leaf lane is still real, but the current live KSDE state directory/export lane is no longer reproducibly usable in the bounded raw pass because the Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay all now return \`Request Rejected\` shells. The correct next lane is therefore saved district-owned or district-linked local leaf authoring only, not more retries against the current live KSDE state roots.`;
}

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-24 one more bounded official Kansas district-routing pass against the exact official KSDE roots plus one exact saved district-host recovery, then promoted only exact local district-host evidence. The current live raw lane still returns the same \`Request Rejected\` shell for \`https://uapps.ksde.gov/Directory_Rpts/default.aspx\`, \`https://www.ksde.gov/data-and-reporting/directories\`, and \`https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12\`. One fresh exact district-scoped submit replay against the current Directory Reports root using the public hidden fields and \`ctl00$MainContent$ddDistricts=D0435\`, \`ctl00$MainContent$RadioGroup1=RadioUSD1\`, \`ctl00$MainContent$rblFormat=Excel\`, and \`ctl00$MainContent$btnPrintSection1=Run Report\` also returned the same \`Request Rejected\` shell instead of a workbook. Kansas now has reviewed local proof for ${leaves.length}/105 counties from preserved district-owned or district-linked leaves: ${counties.join(', ')}. Marshall now clears because the official Marysville USD 364 sitemap exposes an \`mcsec\` subtree on the district-owned host, and the fetched \`Special Education Eligibility\` leaf preserves the title \`Special Education Eligibility | Marshall County Special Education Coop\` plus H1 \`Special Education Eligibility\` on usd364.org. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties, and the only trustworthy next lane is saved district-owned or district-linked local leaf authoring rather than the current flapping-or-rejected KSDE export stack.`;
}

function buildSamples(existingSamples) {
  const next = existingSamples.filter((sample) => sample.source_url !== NEW_LEAF.source_url);
  next.push({
    sample_name: 'marshall district leaf',
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
    '- Marshall now clears from the district-hosted Marshall County Special Education Coop subtree exposed on the official Marysville USD 364 host.',
    `- Kansas now has reviewed local education-routing proof for ${COUNT} counties, but county-grade local coverage remains incomplete across the remaining unresolved counties.`,
    '- The current official KSDE Directory Reports root, Directories page, educational-directory PDF URL, and exact district-scoped submit replay still fail closed as `Request Rejected` shells in the bounded raw lane.',
  ].join('\n') + '\n';
}

function buildHandoff() {
  return [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    `\`district_or_county_education_routing\` is the only remaining Kansas critical blocker. Kansas now has reviewed local education-routing proof for ${COUNT}/105 counties from preserved district-owned or district-linked local leaves, but the current live KSDE state directory/export lane is still not reproducible in the bounded raw pass. \`https://uapps.ksde.gov/Directory_Rpts/default.aspx\`, \`https://www.ksde.gov/data-and-reporting/directories\`, and the current Kansas educational-directory PDF URL now each return HTTP 200 only as the same \`Request Rejected\` shell, and one fresh exact district-scoped submit replay on the Directory Reports root also returns that shell instead of a workbook. Marshall now clears because the official Marysville USD 364 sitemap exposes an \`mcsec\` subtree, and the fetched \`Special Education Eligibility\` page preserves Marshall County Special Education Coop evidence on the district-owned host. Kansas remains BLOCKED and not index-safe because county-grade local education proof is still incomplete across the remaining counties and the state-level export lane is not trustworthy enough to drive deterministic repair work right now.`,
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
    '- [Marysville USD 364 sitemap](https://www.usd364.org/sitemap.xml)',
    '- [Marshall County Special Education Coop eligibility page](https://www.usd364.org/o/mcsec/page/special-education-eligibility/)',
    '- [Marshall County Special Education Coop parent resources](https://www.usd364.org/o/mcsec/page/parent-resources/)',
    '- [Great Bend USD 428 BCSS Child Find](https://sites.google.com/usd428.net/bartoncountyss/child-find)',
    '- [Hutchinson Public Schools Special Education / Parental Rights folder](https://www.usd308.com/documents/resources/parent-resources/special-education/parental-rights/173274)',
    '- [McPherson County Special Education Cooperative](https://mccsec.mcpherson.com/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved district-owned domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.',
    '- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or similar.',
    '- Additional district-owned document-folder or CMS routes like the Hays USD 489, Hutchinson USD 308, and Marysville USD 364 recoveries, but only on already-preserved district domains.',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 331 Kansas Marshall MCSEC Leaf v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    `- reviewed_leaf_count: ${COUNT}`,
    `- primary_gap_reason: ${PRIMARY_GAP_REASON}`,
    '',
    '## What changed',
    '',
    '- Marshall County now clears from the district-hosted Marshall County Special Education Coop subtree on the official Marysville USD 364 host.',
    '- The live usd364.org sitemap exposes exact `mcsec` leaves including `Special Education Eligibility`, `Early Childhood Special Education`, and `Parent Resources` on the district-owned stack.',
    '- Kansas remains blocked because the live KSDE state directory/export lane still fails as `Request Rejected` and local county-grade coverage is still incomplete.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch331KansasMarshallMcsecLeafV1() {
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

  const nextQueue = allStateQueue.map((row) =>
    row.state === 'kansas' ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON } : row
  );

  const kansasAudit = allStateAudit.states.find((row) => row.stateId === 'kansas');
  kansasAudit.packetBatch = BATCH;
  kansasAudit.packetPrimaryGapReason = PRIMARY_GAP_REASON;
  kansasAudit.familyStatuses.district_or_county_education_routing = FAMILY_STATUS;

  const stateReport = buildStateReport(summary, nextGapRows, nextFailureRows, nextVerifiedRows, nextActionRows);
  let handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  handoff = handoff.split('\n').map((line) => (line.startsWith('- Kansas: `') ? `- Kansas: \`${PRIMARY_GAP_REASON}\`` : line)).join('\n');
  handoff = replaceSection(handoff, '## Current Focus State:', '## Next State Order After', buildHandoff());
  handoff = handoff.replace(
    /## Next State Order After[\s\S]*$/,
    [
      '## Next State Order After Kansas',
      '',
      '1. Nebraska',
      '2. Florida',
      '3. Alaska',
      '4. Oklahoma',
      '5. Ohio',
      '6. Minnesota',
      '7. Maine',
      '8. Idaho',
      '9. Arizona',
      '10. Massachusetts',
      '',
    ].join('\n')
  );

  let allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  allStateReport = replaceLineByPrefix(
    allStateReport,
    '- Kansas still has a strict live state-root stop signal:',
    '- Kansas still has a strict live state-root stop signal: the current KSDE Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay all return `Request Rejected` shells in the bounded raw lane, while reviewed local district leaves now cover 22 counties after Marshall cleared through the district-hosted Marshall County Special Education Coop subtree on Marysville USD 364, so future repairs should continue only from saved district leads plus exact district-owned or district-linked local leaves.'
  );

  writeJson(INPUTS.summary, summary);
  writeJsonl(INPUTS.gap, nextGapRows);
  writeJsonl(INPUTS.failures, nextFailureRows);
  writeJsonl(INPUTS.verified, nextVerifiedRows);
  writeJsonl(INPUTS.next, nextActionRows);
  writeJson(INPUTS.packet, packet);
  writeJsonl(INPUTS.leaves, mergedLeaves);
  fs.writeFileSync(INPUTS.report, stateReport);
  fs.writeFileSync(INPUTS.handoff, handoff);
  writeJsonl(INPUTS.allStateQueue, nextQueue);
  writeJson(INPUTS.allStateAudit, allStateAudit);
  fs.writeFileSync(INPUTS.allStateReport, allStateReport);

  const batchSummary = {
    state: 'kansas',
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_leaf_count: mergedLeaves.length,
    new_counties: ['marshall-ks'],
    remaining_blocker_family: 'district_or_county_education_routing',
    primary_gap_reason: PRIMARY_GAP_REASON,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch331KansasMarshallMcsecLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
