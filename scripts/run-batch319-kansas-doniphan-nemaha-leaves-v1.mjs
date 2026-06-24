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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
  allStatesReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch319_kansas_doniphan_nemaha_leaves_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch319-kansas-doniphan-nemaha-leaves-report-v1.md'),
};

const FAILURE_CODE =
  'live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_18_counties';
const PRIMARY_GAP_REASON = FAILURE_CODE;
const NEXT_ACTION =
  'resume_only_from_live_public_export_backed_district_inventory_and_saved_district_owned_domains_to_expand_reviewed_local_education_leaves';
const FAMILY_STATUS =
  'blocked_live_ksde_export_contract_recovered_but_reviewed_local_district_leaves_still_incomplete';

const NEW_LEAVES = [
  {
    county_id: 'doniphan-ks',
    county_name: 'doniphan',
    district_name: 'Doniphan West USD 111',
    district_website: 'https://www.usd111.org/',
    source_url: 'https://www.usd111.org/o/dwes/page/special-education/',
    final_url: 'https://www.usd111.org/o/dwes/page/special-education/',
    verification_status: 'verified',
    source_type: 'district_owned_special_education_leaf',
    fetched_at: '2026-06-24T00:00:00.000Z',
    evidence_title: 'Special Education | Elementary School',
    evidence_h1: null,
    evidence_snippet:
      'The official Doniphan West USD 111 sitemap exposes an exact same-domain `/o/dwes/page/special-education/` leaf, and the fetched district-host page returned HTTP 200 with title `Special Education | Elementary School` on the live usd111.org stack.',
  },
  {
    county_id: 'nemaha-ks',
    county_name: 'nemaha',
    district_name: 'Nemaha Central USD 115',
    district_website: 'https://www.usd115.org/',
    source_url: 'https://www.usd115.org/o/mnesc/page/early-childhood/',
    final_url: 'https://www.usd115.org/o/mnesc/page/early-childhood/',
    verification_status: 'verified',
    source_type: 'district_linked_special_education_cooperative_leaf',
    fetched_at: '2026-06-24T00:00:00.000Z',
    evidence_title: 'EARLY CHILDHOOD | Marshall-Nemaha Special Education Co-op',
    evidence_h1: null,
    evidence_snippet:
      'The official Nemaha Central USD 115 sitemap exposes an `mnesc` subtree on the district-owned host, and the fetched page title `EARLY CHILDHOOD | Marshall-Nemaha Special Education Co-op` preserves an explicit district-linked special-education cooperative route on usd115.org.',
  },
];

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

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-24 one more bounded official Kansas district-routing pass using only the recovered live KSDE export contract, official district-owned hosts, official public sitemaps, and exact same-domain role-bearing leaves. Education routing now has reviewed local proof for ${leaves.length}/105 counties: ${counties.join(', ')}. Doniphan now clears because the official Doniphan West USD 111 sitemap exposed an exact same-domain \`/o/dwes/page/special-education/\` leaf and the fetched district-host page returned HTTP 200 with title \`Special Education | Elementary School\` on usd111.org. Nemaha now clears because the official Nemaha Central USD 115 sitemap exposed an \`mnesc\` subtree on the district-owned host and the fetched page title \`EARLY CHILDHOOD | Marshall-Nemaha Special Education Co-op\` preserves an explicit district-linked special-education cooperative route on usd115.org. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties even though the live export-backed local-leaf lane keeps producing exact district-host matches.`;
}

function buildStatusReason(count) {
  return `Kansas still has reviewed local education-routing proof for only ${count} counties, so the state remains blocked on incomplete county-grade local education evidence. The live official KSDE export lane is still recovered, and the right next lane remains exact district-owned or district-linked local leaf authoring from the export-backed district inventory.`;
}

function buildSamples(leaves) {
  return [
    {
      sample_name: 'KSDE Directory Reports root recovered',
      source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      verification_status: 'reviewed',
      source_type: 'official_public_directory_app',
      source_table: 'bounded_live_kansas_recheck',
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet:
        'The live official Directory Reports page again exposes `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION` on the public root.',
    },
    {
      sample_name: 'KSDE Directories page recovered',
      source_url: 'https://www.ksde.gov/data-and-reporting/directories',
      final_url: 'https://www.ksde.gov/data-and-reporting/directories',
      verification_status: 'reviewed',
      source_type: 'official_statewide_directory_root',
      source_table: 'bounded_live_kansas_recheck',
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet: 'The official KSDE Directories page is live again on ksde.gov.',
    },
    {
      sample_name: 'Kansas Educational Directory PDF recovered',
      source_url: 'https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12',
      final_url: 'https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12',
      verification_status: 'reviewed',
      source_type: 'official_public_pdf',
      source_table: 'bounded_live_kansas_recheck',
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet:
        'The current Kansas Educational Directory URL again returns a real PDF with `content-type: application/pdf` and a 2025-2026 filename.',
    },
    {
      sample_name: 'Abilene USD 435 public export workbook recovered',
      source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      verification_status: 'reviewed',
      source_type: 'official_public_export_contract',
      source_table: 'bounded_live_kansas_recheck',
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet:
        'A bounded public Run Report POST again returns a real `Directory.xls` workbook whose strings preserve `SCHOOL DISTRICT SUPERINTENDENTS AND BOARD PRESIDENTS`, `County Name`, `Phone`, and Abilene / Dickinson values.',
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
    '- Doniphan now clears from the district-owned Doniphan West USD 111 special-education leaf exposed in the public district sitemap.',
    '- Nemaha now clears from the district-linked Marshall-Nemaha Special Education Co-op leaf exposed on the official Nemaha Central USD 115 host.',
    '- Kansas now has reviewed local education-routing proof for eighteen counties, but county-grade local coverage remains incomplete across the remaining unresolved counties.',
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
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. Kansas now has reviewed local education-routing proof for 18/105 counties after Doniphan and Nemaha cleared from exact district-host leaves, but county-grade local education coverage is still incomplete statewide. The live official KSDE statewide lane remains recovered: `https://uapps.ksde.gov/Directory_Rpts/default.aspx` is live again with `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION`, `https://www.ksde.gov/data-and-reporting/directories` is live again, and the current Kansas Educational Directory PDF is once again a real public PDF. Kansas remains BLOCKED and not index-safe because the local district-leaf conversion work is still incomplete across the remaining counties, not because the state roots are dead.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Additional district-owned Kansas `special education`, `student services`, `special services`, `parent rights`, or district-linked cooperative leaves on unresolved export-backed district domains.',
    '- Exact same-domain district leaf evidence for unresolved counties that is role-bearing enough to replace the statewide KSDE placeholders.',
    '- If a district host is live but lacks any role-exact leaf, exact non-match proof so the county can stay frozen without repeated retries.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [KSDE Directory Reports root](https://uapps.ksde.gov/Directory_Rpts/default.aspx)',
    '- [KSDE Directories root](https://www.ksde.gov/data-and-reporting/directories)',
    '- [Kansas Educational Directory PDF](https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12)',
    '- [Doniphan West USD 111 Special Education](https://www.usd111.org/o/dwes/page/special-education/)',
    '- [Marshall-Nemaha Special Education Co-op Early Childhood](https://www.usd115.org/o/mnesc/page/early-childhood/)',
    '- [Abilene Public Schools root](https://www.abileneschools.org/)',
    '- [Abilene Public Schools sitemap](https://www.abileneschools.org/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved export-backed district domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.',
    '- District-linked cooperative leaves on district-owned hosts where the district nav or sitemap explicitly labels the route as Special Education or similar.',
    '- Additional district-owned document-folder or CMS routes like the Hays USD 489 recovery, but only on already-preserved district domains.',
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
      '4. New York',
      '5. Oklahoma',
      '6. Oregon',
      '7. Ohio',
      '8. Minnesota',
      '9. Maine',
      '10. Idaho',
      '',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStatesReport() {
  let report = fs.readFileSync(INPUTS.allStatesReport, 'utf8');
  const oldLine = '- Kansas now has a recovered state export lane: the official KSDE Directory Reports root, Directories page, and current educational-directory PDF are public again, and the Directory Reports app again returns a real public Excel workbook, so future repairs should continue from the live export-backed district inventory plus exact district-owned leaves.';
  const newLine = '- Kansas now has a recovered state export lane plus eighteen reviewed local county-grade education leaves: Doniphan and Nemaha joined the exact district-host set, but the state remains blocked until the remaining unresolved counties gain comparable local proof.';
  if (report.includes(oldLine)) {
    report = report.replace(oldLine, newLine);
  } else if (!report.includes(newLine)) {
    report = `${report.trimEnd()}\n${newLine}\n`;
  }
  fs.writeFileSync(INPUTS.allStatesReport, report);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 319 Kansas Doniphan Nemaha Leaves v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- reviewed_leaf_count: ${batchSummary.reviewed_leaf_count}`,
    `- newly_verified_counties: ${batchSummary.newly_verified_counties.join(', ')}`,
    '',
    '## What changed',
    '',
    '- Doniphan now clears from an exact district-owned special-education leaf exposed in the public usd111.org sitemap.',
    '- Nemaha now clears from an explicit Marshall-Nemaha Special Education Co-op leaf exposed on the district-owned usd115.org host.',
    '- Kansas remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch319KansasDoniphanNemahaLeavesV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const existingLeaves = readJsonl(INPUTS.leaves);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);

  const mergedLeaves = [...existingLeaves];
  for (const newLeaf of NEW_LEAVES) {
    if (!mergedLeaves.some((row) => row.county_id === newLeaf.county_id && row.source_url === newLeaf.source_url)) {
      mergedLeaves.push(newLeaf);
    }
  }
  mergedLeaves.sort((a, b) => a.county_id.localeCompare(b.county_id));

  const evidence = buildEvidence(mergedLeaves);
  const statusReason = buildStatusReason(mergedLeaves.length);
  const samples = buildSamples(mergedLeaves);

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      authoredExactLeafCount: mergedLeaves.length,
      reviewedDistrictOwnedLeafCount: mergedLeaves.length,
    },
    reviewed_local_leaf_counties: mergedLeaves.map((row) => row.county_id).sort(),
    unresolved_local_leaf_counties: packet.affected_counties.filter((countyId) => !mergedLeaves.some((row) => row.county_id === countyId)),
  };

  const updatedSummary = {
    ...summary,
    batch: 'batch319_kansas_doniphan_nemaha_leaves_v1',
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? { ...blocker, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
        : blocker
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: statusReason }
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
          query_basis: 'Reviewed the recovered live KSDE export-backed district inventory plus exact same-domain district-owned and district-linked cooperative leaves.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: evidence,
          sample_count: samples.length,
          samples,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: '2026-06-24T00:00:00.000Z',
    states: (allStateAudit.states || []).map((state) => (
      state.stateId === 'kansas'
        ? {
            ...state,
            familyStatuses: {
              ...(state.familyStatuses || {}),
              district_or_county_education_routing: FAMILY_STATUS,
            },
            packetBatch: 'batch319_kansas_doniphan_nemaha_leaves_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : state
    )),
  };

  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.leaves, mergedLeaves);
  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateAllStatesReport();

  const batchSummary = {
    batch: 'batch319_kansas_doniphan_nemaha_leaves_v1',
    generated_at: '2026-06-24T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_leaf_count: mergedLeaves.length,
    reviewed_leaf_counties: mergedLeaves.map((row) => row.county_id).sort(),
    newly_verified_counties: NEW_LEAVES.map((row) => row.county_id),
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch319KansasDoniphanNemahaLeavesV1();
  console.log(JSON.stringify(result, null, 2));
}
