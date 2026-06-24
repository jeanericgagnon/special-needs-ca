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
  summary: path.join(generatedDir, 'batch330_kansas_mcpherson_coop_leaf_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch330-kansas-mcpherson-coop-leaf-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_21_counties';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION =
  'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible';
const FAMILY_STATUS =
  'blocked_reviewed_local_kansas_district_leaves_expand_to_21_counties_but_current_live_ksde_submit_replay_is_rejected';

const NEW_LEAF = {
  county_id: 'mcpherson-ks',
  county_name: 'mcpherson',
  district_name: 'McPherson USD 418',
  district_website: 'https://www.mcpherson.com/',
  source_url: 'https://mccsec.mcpherson.com/',
  final_url: 'https://mccsec.mcpherson.com/',
  verification_status: 'verified',
  source_type: 'district_linked_special_education_cooperative_home',
  fetched_at: '2026-06-24T00:00:00.000Z',
  evidence_title: 'McPherson County Special Education Cooperative',
  evidence_h1: 'McPherson County Special Education Cooperative Home',
  evidence_snippet:
    'The official McPherson USD 418 homepage exposes `McPherson County Special Education Cooperative` under both `Schools` and `Families > Special Education`, and the fetched first-party cooperative home preserves local contact information, `Special Education Staff`, `Kansas Special Education Process Handbook`, `Special Education Forms`, `Parent Rights`, and `ChildFind Preschool Screening Schedule` on the mccsec.mcpherson.com host.',
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
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function replaceLineByPrefix(text, prefix, replacement) {
  const lines = text.split('\n');
  let replaced = false;
  const next = lines.map((line) => {
    if (!replaced && line.startsWith(prefix)) {
      replaced = true;
      return replacement;
    }
    return line;
  });
  return replaced ? next.join('\n') : `${text.trimEnd()}\n${replacement}\n`;
}

function buildStatusReason(countyCount) {
  return `Kansas still has reviewed local education-routing proof for only ${countyCount} counties, so the state remains blocked on incomplete county-grade local education evidence. The preserved district-owned and district-linked local leaf lane is still real, but the current live KSDE state directory/export lane is no longer reproducibly usable in the bounded raw pass because the Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay all now return \`Request Rejected\` shells. The correct next lane is therefore saved district-owned or district-linked local leaf authoring only, not more retries against the current live KSDE state roots.`;
}

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-24 one more bounded official Kansas district-routing pass against the exact official KSDE roots plus one exact district-linked cooperative recovery, then promoted only exact local district-host evidence. The current live raw lane still returns the same \`Request Rejected\` shell for \`https://uapps.ksde.gov/Directory_Rpts/default.aspx\`, \`https://www.ksde.gov/data-and-reporting/directories\`, and \`https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12\`. One fresh exact district-scoped submit replay against the current Directory Reports root using the public hidden fields and \`ctl00$MainContent$ddDistricts=D0435\`, \`ctl00$MainContent$RadioGroup1=RadioUSD1\`, \`ctl00$MainContent$rblFormat=Excel\`, and \`ctl00$MainContent$btnPrintSection1=Run Report\` also returned the same \`Request Rejected\` shell instead of a workbook. Kansas now has reviewed local proof for ${leaves.length}/105 counties from preserved district-owned or district-linked leaves: ${counties.join(', ')}. McPherson now clears because the official McPherson USD 418 homepage exposes \`McPherson County Special Education Cooperative\` under both \`Schools\` and \`Families > Special Education\`, and the fetched first-party cooperative home preserves local contact information, \`Special Education Staff\`, \`Kansas Special Education Process Handbook\`, \`Special Education Forms\`, \`Parent Rights\`, and \`ChildFind Preschool Screening Schedule\` on the mccsec.mcpherson.com host. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties, and the only trustworthy next lane is saved district-owned or district-linked local leaf authoring rather than the current flapping-or-rejected KSDE export stack.`;
}

function buildSamples(leaves) {
  return [
    {
      sample_name: 'KSDE Directory Reports root now rejected again',
      source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      verification_status: 'blocked',
      source_type: 'official_state_directory_root_request_rejected_shell',
      source_table: 'bounded_live_kansas_recheck',
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet:
        'A fresh bounded GET now returns HTTP 200 only as a `Request Rejected` shell with `The requested URL was rejected. Please consult with your administrator.`',
    },
    {
      sample_name: 'KSDE Directories page now rejected again',
      source_url: 'https://www.ksde.gov/data-and-reporting/directories',
      final_url: 'https://www.ksde.gov/data-and-reporting/directories',
      verification_status: 'blocked',
      source_type: 'official_state_directory_root_request_rejected_shell',
      source_table: 'bounded_live_kansas_recheck',
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet:
        'The current official KSDE Directories page also returns the same `Request Rejected` shell in the bounded raw lane.',
    },
    {
      sample_name: 'Kansas Educational Directory PDF URL now rejected again',
      source_url: 'https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12',
      final_url: 'https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12',
      verification_status: 'blocked',
      source_type: 'official_state_pdf_request_rejected_shell',
      source_table: 'bounded_live_kansas_recheck',
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet:
        'The current educational-directory PDF URL now returns text/html with the same `Request Rejected` shell instead of a PDF body in the bounded raw lane.',
    },
    {
      sample_name: 'Exact district-scoped Directory Reports submit replay rejected',
      source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      verification_status: 'blocked',
      source_type: 'official_public_submit_contract_request_rejected_shell',
      source_table: 'bounded_live_kansas_recheck',
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet:
        'A fresh exact district-scoped submit replay with `ddDistricts=D0435`, `RadioUSD1`, `Excel`, and `Run Report` now returns the same `Request Rejected` shell instead of a workbook.',
    },
    ...leaves.map((leaf) => ({
      sample_name: `${leaf.county_name} district leaf`,
      source_url: leaf.source_url,
      final_url: leaf.final_url,
      verification_status: leaf.verification_status,
      source_type: leaf.source_type,
      source_table: 'reviewed_live_probe',
      fetched_at: leaf.fetched_at,
      evidence_snippet: leaf.evidence_snippet,
    })),
  ];
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
    '- McPherson now clears from the district-linked McPherson County Special Education Cooperative route exposed directly from the official McPherson USD 418 host.',
    '- Kansas now has reviewed local education-routing proof for twenty-one counties, but county-grade local coverage remains incomplete across the remaining unresolved counties.',
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
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. Kansas now has reviewed local education-routing proof for 21/105 counties from preserved district-owned or district-linked local leaves, but the current live KSDE state directory/export lane is still not reproducible in the bounded raw pass. `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and the current Kansas educational-directory PDF URL now each return HTTP 200 only as the same `Request Rejected` shell, and one fresh exact district-scoped submit replay on the Directory Reports root also returns that shell instead of a workbook. Kansas remains BLOCKED and not index-safe because county-grade local education proof is still incomplete across the remaining counties and the state-level export lane is not trustworthy enough to drive deterministic repair work right now.',
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
    '- [McPherson USD 418 home](https://www.mcpherson.com/)',
    '- [McPherson County Special Education Cooperative](https://mccsec.mcpherson.com/)',
    '- [Great Bend USD 428 BCSS Child Find](https://sites.google.com/usd428.net/bartoncountyss/child-find)',
    '- [Hutchinson Public Schools Special Education / Parental Rights folder](https://www.usd308.com/documents/resources/parent-resources/special-education/parental-rights/173274)',
    '- [Marshall-Nemaha Special Education Co-op Early Childhood](https://www.usd115.org/o/mnesc/page/early-childhood/)',
    '- [Abilene Public Schools root](https://www.abileneschools.org/)',
    '- [Abilene Public Schools sitemap](https://www.abileneschools.org/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved district-owned domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.',
    '- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or similar.',
    '- Additional district-owned document-folder or CMS routes like the Hays USD 489 and Hutchinson USD 308 recoveries, but only on already-preserved district domains.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
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

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const note = '- Kansas still has a strict live state-root stop signal: the current KSDE Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay all return `Request Rejected` shells in the bounded raw lane, while reviewed local district leaves now cover 21 counties after McPherson cleared through the district-linked McPherson County Special Education Cooperative route, so future repairs should continue only from saved district leads plus exact district-owned or district-linked local leaves.';
  current = replaceLineByPrefix(current, '- Kansas ', note);
  if (!current.includes(note)) {
    current = `${current.trimEnd()}\n${note}\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 330 Kansas McPherson Cooperative Leaf v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was repaired',
    '',
    '- McPherson now clears from the district-linked McPherson County Special Education Cooperative route exposed directly from the official McPherson USD 418 host.',
    '- The fetched first-party cooperative home preserves local contact information, Special Education staff, process and forms links, Parent Rights, and ChildFind routing on the same official host family.',
    '- The current KSDE Directory Reports root, Directories page, educational-directory PDF URL, and exact district-scoped submit replay remain rejected and therefore stay blocked as a state-level repair lane.',
    '',
    '## Why Kansas remains blocked',
    '',
    '- County-grade local education proof is still incomplete across the remaining unresolved counties.',
    '- The current official KSDE state roots are not reproducible low-token repair entrypoints right now.',
    '- The safe next move is exact district-leaf authoring from saved district leads, not more live KSDE state-root retries.',
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch330KansasMcphersonCoopLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const existingLeaves = readJsonl(INPUTS.leaves);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const leaves = [...existingLeaves];
  if (!leaves.some((row) => row.county_id === NEW_LEAF.county_id && row.source_url === NEW_LEAF.source_url)) {
    leaves.push(NEW_LEAF);
  }
  leaves.sort((a, b) => a.county_id.localeCompare(b.county_id));

  const reviewedLeafCounties = [...new Set(leaves.map((row) => row.county_id))].sort();
  const reviewedLeafCount = reviewedLeafCounties.length;
  const unresolvedLeafCounties = packet.affected_counties.filter((countyId) => !reviewedLeafCounties.includes(countyId));
  const evidence = buildEvidence(leaves);
  const statusReason = buildStatusReason(reviewedLeafCount);
  const samples = buildSamples(leaves);

  const updatedSummary = {
    ...summary,
    batch: 'batch330_kansas_mcpherson_coop_leaf_v1',
    classification: 'BLOCKED',
    index_safe: false,
    complete_ready: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: FAILURE_CODE,
        evidence,
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          status_reason: statusReason,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          blocker_code: FAILURE_CODE,
          blocker_evidence:
            'The current KSDE Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay still return `Request Rejected` shells, so the trustworthy Kansas lane remains preserved local district leaves rather than the current live state export stack.',
          sample_count: samples.length,
          samples,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence }
      : row
  ));

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      authoredExactLeafCount: reviewedLeafCount,
      reviewedDistrictOwnedLeafCount: reviewedLeafCount,
    },
    reviewed_local_leaf_counties: reviewedLeafCounties,
    unresolved_local_leaf_counties: unresolvedLeafCounties,
    packet_complete_when:
      'Every Kansas county row either points at a reviewed district-owned or district-linked education-routing leaf from saved district leads or remains explicitly blocked where no district-owned local contract has been preserved; do not rely on the current live KSDE state export roots until the exact submit lane is reproducible again.',
  };

  const updatedQueueRows = allStateQueue.map((row) => (
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'kansas'
        ? {
            ...row,
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: FAMILY_STATUS,
            },
            packetBatch: 'batch330_kansas_mcpherson_coop_leaf_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row
    )),
  };

  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    state: 'kansas',
    classification: 'BLOCKED',
    remaining_blocker_family: 'district_or_county_education_routing',
    failure_code: FAILURE_CODE,
    reviewed_leaf_count: reviewedLeafCount,
    new_counties: [NEW_LEAF.county_id],
    next_action: NEXT_ACTION,
  };
  const batchReport = buildBatchReport(batchSummary);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.leaves, leaves);
  writeJsonl(INPUTS.allStateQueue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAudit);
  fs.writeFileSync(INPUTS.report, stateReport);
  updateHandoff();
  updateAllStateReport();
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch330KansasMcphersonCoopLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
