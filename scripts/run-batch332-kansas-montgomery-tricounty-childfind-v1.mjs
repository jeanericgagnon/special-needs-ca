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
  summary: path.join(generatedDir, 'batch332_kansas_montgomery_tricounty_childfind_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch332-kansas-montgomery-tricounty-childfind-report-v1.md'),
};

const COUNT = 23;
const PRIMARY_GAP_REASON =
  'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_23_counties';
const FAMILY_STATUS =
  'blocked_reviewed_local_kansas_district_leaves_expand_to_23_counties_but_current_live_ksde_submit_replay_is_rejected';
const NEXT_ACTION =
  'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible';
const BATCH = 'batch332_kansas_montgomery_tricounty_childfind_v1';

const NEW_LEAF = {
  county_id: 'montgomery-ks',
  county_name: 'montgomery',
  district_name: 'Coffeyville USD 445',
  district_website: 'https://www.cvilleschools.com/',
  source_url: 'https://www.tricounty607.com/child-find',
  final_url: 'https://www.tricounty607.com/child-find',
  verification_status: 'verified',
  source_type: 'district_linked_special_education_cooperative_child_find_leaf',
  fetched_at: '2026-06-24T00:00:00.000Z',
  evidence_title: 'Tri County Special Education Coop 607 - Child Find',
  evidence_h1: null,
  evidence_snippet:
    'The official Coffeyville Unified School District 445 homepage, site map, and search page each expose a district-linked `Child Find Special Education Screening` route to `tricounty607.com`, and the fetched exact child-find leaf returns HTTP 200 with the title `Tri County Special Education Coop 607 - Child Find` on the linked cooperative host.',
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

function buildStatusReason() {
  return `Kansas still has reviewed local education-routing proof for only ${COUNT} counties, so the state remains blocked on incomplete county-grade local education evidence. The preserved district-owned and district-linked local leaf lane is still real, but the current live KSDE state directory/export lane is no longer reproducibly usable in the bounded raw pass because the Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay all now return \`Request Rejected\` shells. The correct next lane is therefore saved district-owned or district-linked local leaf authoring only, not more retries against the current live KSDE state roots.`;
}

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-24 one more bounded official Kansas district-routing pass against the exact official KSDE roots plus one exact saved district-host recovery, then promoted only exact local district-host evidence. The current live raw lane still returns the same \`Request Rejected\` shell for \`https://uapps.ksde.gov/Directory_Rpts/default.aspx\`, \`https://www.ksde.gov/data-and-reporting/directories\`, and \`https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12\`. One fresh exact district-scoped submit replay against the current Directory Reports root using the public hidden fields and \`ctl00$MainContent$ddDistricts=D0435\`, \`ctl00$MainContent$RadioGroup1=RadioUSD1\`, \`ctl00$MainContent$rblFormat=Excel\`, and \`ctl00$MainContent$btnPrintSection1=Run Report\` also returned the same \`Request Rejected\` shell instead of a workbook. Kansas now has reviewed local proof for ${leaves.length}/105 counties from preserved district-owned or district-linked leaves: ${counties.join(', ')}. Montgomery now clears because the official Coffeyville Unified School District 445 homepage, site map, and search page each expose a district-linked \`Child Find Special Education Screening\` route to \`https://www.tricounty607.com/child-find\`, and the fetched exact child-find leaf returns HTTP 200 with the title \`Tri County Special Education Coop 607 - Child Find\` on the linked cooperative host. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties, and the only trustworthy next lane is saved district-owned or district-linked local leaf authoring rather than the current flapping-or-rejected KSDE export stack.`;
}

function buildSamples(existingSamples) {
  const next = existingSamples.filter((sample) => sample.source_url !== NEW_LEAF.source_url);
  next.push({
    sample_name: 'montgomery district leaf',
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
    '- Montgomery now clears from the district-linked Tri County Special Education Coop 607 child-find route exposed directly from the official Coffeyville USD 445 host.',
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
    `\`district_or_county_education_routing\` is the only remaining Kansas critical blocker. Kansas now has reviewed local education-routing proof for ${COUNT}/105 counties from preserved district-owned or district-linked local leaves, but the current live KSDE state directory/export lane is still not reproducible in the bounded raw pass. \`https://uapps.ksde.gov/Directory_Rpts/default.aspx\`, \`https://www.ksde.gov/data-and-reporting/directories\`, and the current Kansas educational-directory PDF URL now each return HTTP 200 only as the same \`Request Rejected\` shell, and one fresh exact district-scoped submit replay on the Directory Reports root also returns that shell instead of a workbook. Montgomery now clears because the official Coffeyville USD 445 host repeatedly links a district-linked \`Child Find Special Education Screening\` route to \`tricounty607.com/child-find\`, and the fetched cooperative child-find leaf preserves a role-exact title on the linked host. Kansas remains BLOCKED and not index-safe because county-grade local education proof is still incomplete across the remaining counties and the state-level export lane is not trustworthy enough to drive deterministic repair work right now.`,
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
    '- [Coffeyville USD 445 home](https://www.cvilleschools.com/)',
    '- [Coffeyville USD 445 site map](https://www.cvilleschools.com/site-map)',
    '- [Coffeyville USD 445 search results](https://www.cvilleschools.com/search-results?q=special%20education)',
    '- [Tri County Special Education Coop 607 child-find leaf](https://www.tricounty607.com/child-find)',
    '- [Marysville USD 364 sitemap](https://www.usd364.org/sitemap.xml)',
    '- [Marshall County Special Education Coop eligibility page](https://www.usd364.org/o/mcsec/page/special-education-eligibility/)',
    '- [McPherson County Special Education Cooperative](https://mccsec.mcpherson.com/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved district-owned domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.',
    '- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or Child Find.',
    '- Additional district-owned document-folder or CMS routes like the Hays USD 489, Hutchinson USD 308, Marysville USD 364, and Coffeyville USD 445 recoveries, but only on already-preserved district domains.',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 332 Kansas Montgomery Tri County Child Find v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    `- reviewed_leaf_count: ${COUNT}`,
    `- primary_gap_reason: ${PRIMARY_GAP_REASON}`,
    '',
    '## What changed',
    '',
    '- Montgomery now clears from the district-linked Tri County Special Education Coop 607 child-find route exposed on the official Coffeyville Unified School District 445 host.',
    '- The official Coffeyville district homepage, site map, and search results all expose the exact link text `Child Find Special Education Screening` to the cooperative host.',
    '- The fetched exact cooperative leaf returns HTTP 200 with the title `Tri County Special Education Coop 607 - Child Find`.',
    '- Kansas remains blocked because the live KSDE state directory/export lane still fails as `Request Rejected` and local county-grade coverage is still incomplete.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch332KansasMontgomeryTricountyChildfindV1() {
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
  packet.packet_complete_when = 'Every Kansas county row either points at a reviewed district-owned or district-linked education-routing leaf from saved district leads or remains explicitly blocked where no district-owned local contract has been preserved; do not rely on the current live KSDE state export roots until the exact submit lane is reproducible again.';

  const nextAllStateQueue = allStateQueue.map((row) =>
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  );

  const nextAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) =>
      row.stateId === 'kansas'
        ? {
            ...row,
            packetBatch: BATCH,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...row.familyStatuses,
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
  fs.writeFileSync(INPUTS.report, buildStateReport(summary, nextGapRows, nextFailureRows, nextVerifiedRows, nextActionRows));
  writeJsonl(INPUTS.allStateQueue, nextAllStateQueue);
  writeJson(INPUTS.allStateAudit, nextAllStateAudit);

  let handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  handoff = handoff
    .split('\n')
    .map((line) => (line.startsWith('- Kansas: `') ? `- Kansas: \`${PRIMARY_GAP_REASON}\`` : line))
    .join('\n');
  handoff = replaceSection(handoff, '## Current Focus State:', '## Next State Order After', buildHandoff());
  handoff = handoff.replace(
    /## Next State Order After[\s\S]*$/,
    [
      '## Next State Order After Kansas',
      '',
      '1. Nebraska',
      '2. Florida',
      '3. Alaska',
      '4. South Carolina',
      '5. North Carolina',
      '6. New York',
      '7. Oklahoma',
      '8. Oregon',
      '9. Ohio',
      '10. Minnesota',
      '',
    ].join('\n')
  );
  fs.writeFileSync(INPUTS.handoff, handoff);

  let allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const priorNote = '- Utah remains blocked because the recovered DHHS contacts hub still defers local office proof, the live first-party DHHS WPSL collections only publish `Double Up Food Bucks locations` and `Home Visiting Locations`, and the current DWS office-search shell still limits lookup to `Zip Code or City` while the public APIs expose no county or service-area field.';
  const newNote = '- Kansas remains blocked, but reviewed local education-routing proof now covers 23 of 105 counties after Coffeyville USD 445 surfaced an exact district-linked `Child Find Special Education Screening` route to Tri County Special Education Coop 607.';
  if (!allStateReport.includes(newNote)) {
    if (allStateReport.includes(priorNote)) {
      allStateReport = allStateReport.replace(priorNote, `${priorNote}\n${newNote}`);
    } else {
      allStateReport = `${allStateReport.trimEnd()}\n${newNote}\n`;
    }
  }
  fs.writeFileSync(INPUTS.allStateReport, allStateReport);

  const batchSummary = {
    state: 'kansas',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'district_or_county_education_routing',
    failure_code: PRIMARY_GAP_REASON,
    promoted_county: 'montgomery-ks',
    promoted_counties_total: COUNT,
    district_host: 'https://www.cvilleschools.com/',
    district_site_map_status: 200,
    district_search_status: 200,
    district_link_label: 'Child Find Special Education Screening',
    cooperative_child_find_status: 200,
    cooperative_child_find_title: 'Tri County Special Education Coop 607 - Child Find',
    next_action: NEXT_ACTION,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch332KansasMontgomeryTricountyChildfindV1();
  console.log(JSON.stringify(result, null, 2));
}
