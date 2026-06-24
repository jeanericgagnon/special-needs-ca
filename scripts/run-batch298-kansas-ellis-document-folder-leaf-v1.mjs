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
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch298_kansas_ellis_document_folder_leaf_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch298-kansas-ellis-document-folder-leaf-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'reviewed_kansas_district_and_district_owned_leaves_now_cover_16_counties_but_export_backed_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'continue_export_backed_district_and_affiliated_coop_leaf_authoring_county_by_county_and_keep_exact_non_matches_frozen';
const PRIMARY_GAP_REASON = 'reviewed_kansas_district_and_district_owned_leaves_now_cover_16_counties_but_export_backed_county_grade_coverage_is_still_incomplete';
const FAMILY_STATUS = 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade';
const LESSON_HEADING = '### District-Owned Document Folders Can Preserve Role-Exact Routing Even When The Page Title Is Generic';
const LESSON_BODY = '*   **Lesson:** If a district-owned CMS route renders a generic document-shell title but its embedded route data preserves a role-exact folder name and child special-education resources on the same first-party host, that can still count as local education-routing proof. Kansas Ellis County cleared once Hays USD 489 exposed a `Special Education` document folder with same-domain `WEBKIDSS Handbook` and `SPED Resources` children in the live Nuxt payload.';

const NEW_LEAF = {
  county_id: 'ellis-ks',
  county_name: 'ellis',
  district_name: 'Hays USD 489',
  district_website: 'https://www.usd489.com/',
  source_url: 'https://www.usd489.com/documents/about-usd-489/special-education/81796',
  final_url: 'https://www.usd489.com/documents/about-usd-489/special-education/81796',
  verification_status: 'verified',
  source_type: 'district_owned_special_education_document_folder',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_title: 'Documents | Hays USD 489',
  evidence_h1: null,
  evidence_snippet: 'The live district-owned Hays USD 489 Nuxt route at `/documents/about-usd-489/special-education/81796` preserves breadcrumb name `Special Education` and same-domain child folders `WEBKIDSS Handbook` plus `SPED Resources` on the official host.',
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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-23 one more bounded official Kansas district-routing pass using only export-backed district hosts, official district-owned pages, district-linked cooperative leaves on district hosts, exact same-domain checks, and one district-owned document-folder route. Education routing now has reviewed local proof for ${leaves.length}/105 counties: ${counties.join(', ')}. Ellis now clears because the live Hays USD 489 sitemap at https://www.usd489.com/sitemap.xml exposes a same-domain Special Education document lane, and the exact district-owned route https://www.usd489.com/documents/about-usd-489/special-education/81796 returned HTTP 200 with a live Nuxt payload whose breadcrumb name is \`Special Education\` and whose same-domain child folders are \`WEBKIDSS Handbook\` and \`SPED Resources\` on the official usd489.com host. Geary remains a clean district-owned Special Education page clear, and Dickinson remains a correct exact non-match freeze: the export-backed Abilene Public Schools host at https://www.abileneschools.org/ and its public sitemap both returned HTTP 200, but the bounded same-domain pass still found no role-exact special-education, student-services, procedural-safeguards, or parent-rights leaf. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties.`;
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
    '- Education is the only remaining critical blocker.',
    '- Ellis now clears from a district-owned Hays USD 489 Special Education document-folder route on the official host, even though the visible shell title is generic.',
    '- Dickinson remains frozen as an exact non-match on the live Abilene district host and sitemap.',
    '- Kansas now has reviewed local education-routing proof for sixteen counties, but county-grade coverage is still incomplete across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const focusBlock = [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. Reviewed local education-routing proof now covers 16/105 counties. The newest bounded recovery is Ellis County: the export-backed Hays USD 489 host is live, its public sitemap is live, and the district-owned route `https://www.usd489.com/documents/about-usd-489/special-education/81796` returns a live Nuxt document shell whose embedded route data preserves breadcrumb name `Special Education` plus same-domain child folders `WEBKIDSS Handbook` and `SPED Resources`. That is enough to clear Ellis as a role-exact district-owned special-education lane. Dickinson remains a correct exact non-match freeze: the official Abilene Public Schools host at `https://www.abileneschools.org/` and its public sitemap are both live, but the bounded same-domain pass still found no role-exact special-education, student-services, procedural-safeguards, or parent-rights leaf on the district host. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties.',
    '',
    '### Exact Evidence Needed',
    '',
    '- More export-backed Kansas district-owned special-education or student-support leaves that stay role-exact on the live district host.',
    '- More district-linked cooperative routes where the district explicitly labels the path as local special-education services and the linked cooperative host clearly states the service scope, parent-rights path, or local IEP routing.',
    '- Exact non-match freezes for districts whose live pages are still generic program hubs, homepage-only, document-shell-only without role-bearing metadata, or sitemap-only content.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Kansas KSDE directories root](https://www.ksde.gov/data-and-reporting/directories)',
    '- [Kansas Directory Reports](https://uapps.ksde.gov/Directory_Rpts/default.aspx)',
    '- [Kansas Data Central](https://datacentral.ksde.gov/default.aspx)',
    '- [Kansas district maps PDF](https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5)',
    '- [Hays USD 489 root](https://www.usd489.com/)',
    '- [Hays USD 489 sitemap](https://www.usd489.com/sitemap.xml)',
    '- [Hays USD 489 Special Education document folder](https://www.usd489.com/documents/about-usd-489/special-education/81796)',
    '- [Hays USD 489 WEBKIDSS child folder](https://www.usd489.com/documents/about-usd-489/special-education/webkidss-handbook/16663727)',
    '- [Hays USD 489 SPED Resources child folder](https://www.usd489.com/documents/about-usd-489/special-education/sped-resources/16663728)',
    '- [Abilene Public Schools root](https://www.abileneschools.org/)',
    '- [Abilene Public Schools sitemap](https://www.abileneschools.org/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Additional Kansas district-owned `special education`, `student support`, `special services`, or role-bearing document-folder routes on export-backed district hosts for unresolved counties.',
    '- Additional district-linked cooperative hosts that explicitly state they provide special-education services across partner districts and preserve parent-rights or IEP routing on the same local stack.',
    '- Exact county-by-county non-match documentation where a district host is live but only exposes generic or non-role-bearing local pages.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n){1,15}/,
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
    ].join('\n')
  );

  current = current.replace(/10\. Idaho(?:10\. Idaho)*(?:10\. Maine)*/g, '10. Idaho');

  current = current.replace(
    '- Kansas: `reviewed_kansas_district_and_district_owned_leaves_now_cover_15_counties_but_export_backed_county_grade_coverage_is_still_incomplete`',
    '- Kansas: `reviewed_kansas_district_and_district_owned_leaves_now_cover_16_counties_but_export_backed_county_grade_coverage_is_still_incomplete`'
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const note = '- Kansas education routing is now explicitly sharpened to 16 reviewed counties: Ellis newly clears from a district-owned `Special Education` document-folder route on the live Hays USD 489 host, while Dickinson stays frozen as a live Abilene exact-host non-match.';
  if (!current.includes(note)) {
    current = `${current.trimEnd()}\n${note}\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 298 Kansas Ellis Document Folder Leaf v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- reviewed_leaf_count: ${batchSummary.reviewed_leaf_count}`,
    `- newly_verified_county: ${batchSummary.newly_verified_county}`,
    '',
    '## What was confirmed',
    '',
    '- The export-backed Hays USD 489 host is live.',
    '- The public Hays USD 489 sitemap is live and exposes a same-domain Special Education document lane.',
    '- The exact district-owned route `/documents/about-usd-489/special-education/81796` returns a live document shell whose embedded route data preserves breadcrumb name `Special Education`.',
    '- That same first-party route also preserves same-domain child folders `WEBKIDSS Handbook` and `SPED Resources`.',
    '- Dickinson remains a correct exact-host non-match freeze on abileneschools.org.',
    '',
    '## Repair decision',
    '',
    '- Kansas remains blocked, but it now has reviewed local education-routing proof for sixteen counties instead of fifteen.',
    '- Ellis now clears from the district-owned Hays USD 489 Special Education document-folder route.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch298KansasEllisDocumentFolderLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const existingLeaves = readJsonl(INPUTS.leaves);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const mergedLeaves = [...existingLeaves];
  if (!mergedLeaves.some((row) => row.county_id === NEW_LEAF.county_id && row.source_url === NEW_LEAF.source_url)) {
    mergedLeaves.push(NEW_LEAF);
  }
  mergedLeaves.sort((a, b) => a.county_id.localeCompare(b.county_id));

  const evidence = buildEvidence(mergedLeaves);
  const statusReason = `Kansas is past a root-only blocker: reviewed district-owned and district-linked cooperative local education-routing leaves now exist for ${mergedLeaves.length}/105 counties, but county-grade local education routing is still incomplete across the packet. Export-backed district hosts remain the right lane, and exact non-match districts such as Abilene USD 435 should stay frozen until a role-exact local leaf appears on the official host stack.`;

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

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    const preserved = (row.samples || []).filter((sample) => sample.sample_name !== `${NEW_LEAF.county_id.replace('-ks', '')} district-owned leaf`);
    const samples = [
      ...mergedLeaves.map((leaf) => ({
        sample_name: `${leaf.county_id.replace('-ks', '')} district-owned leaf`,
        source_url: leaf.source_url,
        final_url: leaf.final_url,
        verification_status: leaf.verification_status,
        source_type: leaf.source_type,
        source_table: 'reviewed_live_probe',
        fetched_at: leaf.fetched_at,
        evidence_snippet: leaf.evidence_snippet,
      })),
      ...preserved.filter((sample) => sample.sample_name !== `${NEW_LEAF.county_id.replace('-ks', '')} district-owned leaf`),
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      query_basis: 'Reviewed one bounded Kansas district-routing pass against export-backed district hosts, official district-owned pages, district-linked cooperative stacks, exact same-domain non-match freezes, and one district-owned document-folder route.',
      blocker_code: FAILURE_CODE,
      blocker_evidence: evidence,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
        : row
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: FAMILY_STATUS,
    },
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kansas'
      ? { ...row, classification: updatedSummary.classification, status: updatedSummary.classification, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'kansas'
        ? {
            ...row,
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: FAMILY_STATUS,
            },
            packetBatch: 'batch298_kansas_ellis_document_folder_leaf_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row
    )),
  };

  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.leaves, mergedLeaves);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateAllStateReport();

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_298_kansas_ellis_document_folder_leaf_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_leaf_counties: mergedLeaves.map((row) => row.county_id).sort(),
    reviewed_leaf_count: mergedLeaves.length,
    newly_verified_county: NEW_LEAF.county_id,
    new_leaf_source: NEW_LEAF.source_url,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch298KansasEllisDocumentFolderLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
