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
  summary: path.join(generatedDir, 'batch343_kansas_anderson_garnett_forms_leaf_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch343-kansas-anderson-garnett-forms-leaf-report-v1.md'),
};

const COUNT = 29;
const PRIMARY_GAP_REASON =
  'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_29_counties';
const FAMILY_STATUS =
  'blocked_reviewed_local_kansas_district_leaves_expand_to_29_counties_but_current_live_ksde_submit_replay_is_rejected';
const NEXT_ACTION =
  'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible';
const BATCH = 'batch343_kansas_anderson_garnett_forms_leaf_v1';

const NEW_LEAF = {
  county_id: 'anderson-ks',
  county_name: 'anderson',
  district_name: 'Garnett USD 365',
  district_website: 'https://www.usd365.org/',
  source_url: 'https://www.usd365.org/69971_2',
  final_url: 'https://www.usd365.org/69971_2',
  verification_status: 'verified',
  source_type: 'district_owned_child_find_and_complaint_forms_leaf',
  fetched_at: '2026-06-24T00:00:00.000Z',
  evidence_title: 'Garnett USD 365 - Public Info / Forms',
  evidence_h1: 'Public Info / Forms',
  evidence_snippet:
    'The official Garnett USD 365 sitemap exposes the exact district-owned `69971_2` Public Info / Forms leaf, and the fetched page preserves local district document links for `Child Find pdf` and `Complaint Procedure pdf` on the live usd365.org host.',
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
  return `Reviewed 2026-06-24 one more bounded official Kansas district-routing pass against exact saved district-host leads, then promoted only exact local district-host evidence. The current live raw lane still returns the same \`Request Rejected\` shell for \`https://uapps.ksde.gov/Directory_Rpts/default.aspx\`, \`https://www.ksde.gov/data-and-reporting/directories\`, and \`https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12\`. One fresh exact district-scoped submit replay against the current Directory Reports root using the public hidden fields and \`ctl00$MainContent$ddDistricts=D0435\`, \`ctl00$MainContent$RadioGroup1=RadioUSD1\`, \`ctl00$MainContent$rblFormat=Excel\`, and \`ctl00$MainContent$btnPrintSection1=Run Report\` also returned the same \`Request Rejected\` shell instead of a workbook. Kansas now has reviewed local proof for ${leaves.length}/105 counties from preserved district-owned or district-linked leaves: ${counties.join(', ')}. Anderson now clears because the official Garnett USD 365 sitemap exposes the exact district-owned \`69971_2\` Public Info / Forms leaf, and the fetched page preserves local district document links for \`Child Find pdf\` and \`Complaint Procedure pdf\` on the live usd365.org host. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties, and the only trustworthy next lane is saved district-owned or district-linked local leaf authoring rather than the current flapping-or-rejected KSDE export stack.`;
}

function buildSamples(existingSamples) {
  const next = existingSamples.filter((sample) => sample.source_url !== NEW_LEAF.source_url);
  next.push({
    sample_name: 'anderson district leaf',
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
    '- Anderson now clears from the district-owned Garnett USD 365 `Public Info / Forms` leaf with local `Child Find` and `Complaint Procedure` documents.',
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
    `\`district_or_county_education_routing\` is the only remaining Kansas critical blocker. Kansas now has reviewed local education-routing proof for ${COUNT}/105 counties from preserved district-owned or district-linked leaves, but the current live KSDE state directory/export lane is still not reproducible in the bounded raw pass. \`https://uapps.ksde.gov/Directory_Rpts/default.aspx\`, \`https://www.ksde.gov/data-and-reporting/directories\`, and the current Kansas educational-directory PDF URL now each return HTTP 200 only as the same \`Request Rejected\` shell, and one fresh exact district-scoped submit replay on the Directory Reports root also returns that shell instead of a workbook. Anderson now clears because the official Garnett USD 365 sitemap exposes the exact district-owned \`69971_2\` Public Info / Forms leaf, and the fetched page preserves local district document links for \`Child Find pdf\` and \`Complaint Procedure pdf\` on the live usd365.org host. Kansas remains BLOCKED because county-grade local education proof is still incomplete across the remaining counties and the state-level export lane is not trustworthy enough to drive deterministic repair work right now.`,
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
    '- [Garnett USD 365 root](https://www.usd365.org/)',
    '- [Garnett USD 365 sitemap](https://www.usd365.org/sitemap.xml)',
    '- [Garnett USD 365 Public Info / Forms leaf](https://www.usd365.org/69971_2)',
    '- [Fort Scott USD 234 Special Education leaf](https://www.usd234.org/page/special-education/)',
    '- [Wamego USD 320 Child Find leaf](https://www.usd320.com/childfind)',
    '- [Parsons district leaf](https://www.usd503.org/page/tri-county-special-education-cooperative/)',
    '- [Burlington USD 244 CCSEC leaf](https://www.usd244ks.org/ccsec)',
    '- [Marshall County Special Education Coop eligibility page](https://www.usd364.org/o/mcsec/page/special-education-eligibility/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved district-owned domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.',
    '- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or Child Find.',
    '- Additional district-owned document-folder or CMS routes like the Garnett USD 365 forms-folder recovery, Parsons USD 503, Hays USD 489, Hutchinson USD 308, Marysville USD 364, Burlington USD 244, Coffeyville USD 445, Wamego USD 320, and Fort Scott USD 234 recoveries, but only on already-preserved district domains.',
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
    '- Kansas remains blocked because the live KSDE Directory Reports root, Directories page, educational-directory PDF URL, and exact district-scoped submit replay still collapse to `Request Rejected` shells, even though reviewed local district-owned or district-linked special-education leaves now cover 29 of 105 counties, including the district-owned Garnett USD 365 `Public Info / Forms` leaf with local `Child Find` and `Complaint Procedure` documents for Anderson County.';
  const current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  if (current.includes(note)) return;
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
    '# Batch 343 Kansas Anderson Garnett Forms Leaf v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    `- reviewed_leaf_count: ${COUNT}`,
    `- primary_gap_reason: ${PRIMARY_GAP_REASON}`,
    '',
    '## What changed',
    '',
    '- Anderson now clears from the district-owned Garnett USD 365 `Public Info / Forms` leaf.',
    '- The official Garnett USD 365 sitemap exposes the exact `69971_2` route on the district-owned host.',
    '- The fetched district-owned forms page preserves local `Child Find pdf` and `Complaint Procedure pdf` documents on the same first-party stack.',
    '- Kansas remains blocked because the live KSDE state directory/export lane still fails as `Request Rejected` and local county-grade coverage is still incomplete.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch343KansasAndersonGarnettFormsLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const leaves = readJsonl(INPUTS.leaves);
  const queueRows = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const nextLeaves = leaves.filter((row) => row.county_id !== NEW_LEAF.county_id);
  nextLeaves.push(NEW_LEAF);
  nextLeaves.sort((a, b) => a.county_id.localeCompare(b.county_id));

  const statusReason = buildStatusReason();
  const evidence = buildEvidence(nextLeaves);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 93,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? { ...blocker, failure_code: PRIMARY_GAP_REASON, evidence, next_action: NEXT_ACTION }
        : blocker
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: statusReason, failure_code: PRIMARY_GAP_REASON, next_action: NEXT_ACTION }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: PRIMARY_GAP_REASON, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          sample_count: 33,
          blocker_code: PRIMARY_GAP_REASON,
          blocker_evidence: 'The current KSDE Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay still return `Request Rejected` shells, so the trustworthy Kansas lane remains preserved local district leaves rather than the current live state export stack.',
          samples: buildSamples(row.samples || []),
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: PRIMARY_GAP_REASON, next_action: NEXT_ACTION, evidence }
      : row
  ));

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...(packet.current_problem_metrics || {}),
      authoredExactLeafCount: 29,
      reviewedDistrictOwnedLeafCount: 29,
    },
    reviewed_local_leaf_counties: Array.from(new Set([...(packet.reviewed_local_leaf_counties || []), 'anderson-ks'])).sort(),
    unresolved_local_leaf_counties: (packet.unresolved_local_leaf_counties || []).filter((countyId) => countyId !== 'anderson-ks'),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: (allStateAudit.states || []).map((row) => (
      row.stateId === 'kansas'
        ? {
            ...row,
            packetBatch: BATCH,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...(row.familyStatuses || {}),
              district_or_county_education_routing: FAMILY_STATUS,
            },
          }
        : row
    )),
  };

  const batchSummary = {
    state: 'kansas',
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    promoted_county: 'anderson-ks',
    promoted_counties_total: 29,
    district_root_status: 200,
    district_root_title: 'Garnett USD 365 - Home',
    district_leaf_status: 200,
    district_leaf_title: 'Garnett USD 365 - Public Info / Forms',
    district_leaf_h1: 'Public Info / Forms',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.leaves, nextLeaves);
  writeJsonl(INPUTS.allStateQueue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());
  updateHandoff();
  updateAllStateReport();

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch343KansasAndersonGarnettFormsLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
