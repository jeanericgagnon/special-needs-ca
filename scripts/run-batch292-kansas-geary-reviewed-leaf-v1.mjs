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
  summary: path.join(generatedDir, 'batch292_kansas_geary_reviewed_leaf_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch292-kansas-geary-reviewed-leaf-report-v1.md'),
};

const FAILURE_CODE = 'reviewed_kansas_district_and_district_owned_leaves_now_cover_15_counties_but_export_backed_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'continue_export_backed_district_and_affiliated_coop_leaf_authoring_county_by_county_and_keep_exact_non_matches_frozen';

const NEW_LEAF = {
  county_id: 'geary-ks',
  county_name: 'geary',
  district_name: 'Geary County Unified School District 475',
  district_website: 'https://www.usd475.org/',
  source_url: 'https://www.usd475.org/departments/special-education',
  final_url: 'https://www.usd475.org/departments/special-education',
  verification_status: 'verified',
  source_type: 'district_owned_special_education_leaf',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_title: 'Special Education - Geary County Unified School District 475',
  evidence_h1: null,
  evidence_snippet: 'The official usd475.org district-owned Special Education leaf preserves role-exact special-education routing on the live Geary County Unified School District 475 host.',
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

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-23 one more bounded official Kansas district-routing pass using only export-backed district hosts, official district-owned pages, district-linked cooperative leaves on district hosts, and exact same-domain checks. Education routing now has reviewed local proof for ${leaves.length}/105 counties: ${counties.join(', ')}. Geary now clears because https://www.usd475.org/departments/special-education returned HTTP 200 with title \`Special Education - Geary County Unified School District 475\` on the official Geary County USD 475 host, and the live district homepage also exposes that exact same-domain special-education leaf in public navigation. Dickinson remains a correct exact non-match freeze: the official Abilene Public Schools host at https://www.abileneschools.org/ and its public sitemap both returned HTTP 200, but the bounded same-domain pass still found no role-exact special-education, student-services, procedural-safeguards, or parent-rights leaf. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties.`;
}

function buildStatusReason(count) {
  return `Kansas is past a root-only blocker: reviewed district-owned and district-linked cooperative local education-routing leaves now exist for ${count}/105 counties, but county-grade local education routing is still incomplete across the packet. Export-backed district hosts remain the right lane, and exact non-match districts such as Abilene USD 435 should stay frozen until a role-exact local leaf appears on the official host stack.`;
}

function buildVerifiedSamples(leaves) {
  const samples = leaves.map((leaf) => ({
    sample_name: `${leaf.county_id.replace('-ks', '')} local education-routing leaf`,
    source_url: leaf.source_url,
    final_url: leaf.final_url,
    verification_status: leaf.verification_status,
    source_type: leaf.source_type,
    source_table: 'reviewed_live_probe',
    fetched_at: leaf.fetched_at,
    evidence_snippet: leaf.evidence_snippet,
  }));

  samples.push({
    sample_name: 'Kansas Educational Directory Reports home page',
    source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
    final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
    verification_status: 'reviewed',
    source_type: 'official_public_directory_app',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet: 'The public KSDE Directory Reports app still preserves the exact district-scoped export contract that feeds Kansas district-owned leaf repair.',
  });

  samples.push({
    sample_name: 'abilene export-backed district root unresolved',
    source_url: 'https://www.abileneschools.org/',
    final_url: 'https://www.abileneschools.org/',
    verification_status: 'reviewed',
    source_type: 'export_backed_district_root_without_role_exact_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet: 'The KSDE export-backed Abilene USD 435 district root and sitemap are live, but bounded role-exact special-education path checks all returned Page Not Found and the sitemap preserved no special-education leaf.',
  });

  return samples;
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
    '- Geary now clears from the district-owned Geary County USD 475 Special Education leaf on the live usd475.org host.',
    '- Dickinson remains frozen as an exact non-match on the live Abilene district host and sitemap.',
    '- Kansas now has reviewed local education-routing proof for fifteen counties, but county-grade coverage is still incomplete across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 292 Kansas Geary Reviewed Leaf v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- index_safe: ${batchSummary.index_safe}`,
    `- reviewed_leaf_count: ${batchSummary.reviewed_leaf_count}`,
    '',
    '## What changed',
    '',
    '- Geary now clears from the district-owned `Special Education` leaf on `usd475.org`.',
    '- Dickinson remains an exact non-match freeze on the live Abilene district host and public sitemap.',
    '',
    '## Repair decision',
    '',
    '- Kansas remains blocked because county-grade education routing is still incomplete statewide.',
    '- The local reviewed-leaf count rises from fourteen to fifteen counties without loosening the gate.',
    '',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current.replace(
    '- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_14_counties_but_export_backed_county_grade_coverage_is_still_incomplete`',
    '- Kansas: `reviewed_kansas_district_and_district_owned_leaves_now_cover_15_counties_but_export_backed_county_grade_coverage_is_still_incomplete`',
  );

  const focusBlock = [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. Reviewed local education-routing proof now covers 15/105 counties after Geary cleared through Geary County USD 475’s district-owned special-education leaf, but Kansas still lacks county-grade local proof across the remaining packet and stays BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- More export-backed Kansas district-owned special-education or student-support leaves that stay role-exact on the live district host.',
    '- More district-linked cooperative routes where the district explicitly labels the path as local special-education services and the linked cooperative host clearly states the service scope, parent-rights path, or local IEP routing.',
    '- Exact non-match freezes for districts whose live pages are still generic program hubs, homepage-only, or sitemap-only content so they do not get re-tried loosely.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Kansas KSDE directories root](https://www.ksde.gov/data-and-reporting/directories)',
    '- [Kansas 2025-2026 educational directory PDF](https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12)',
    '- [Kansas Directory Reports app](https://uapps.ksde.gov/Directory_Rpts/default.aspx)',
    '- [Geary County USD 475 root](https://www.usd475.org/)',
    '- [Geary County USD 475 Special Education](https://www.usd475.org/departments/special-education)',
    '- [Newton USD 373 Special Education](https://www.usd373.org/about/departments/special-education)',
    '- [Flint Hills Special Education Cooperative on Emporia host](https://www.usd253.org/services/fhsec)',
    '- [Abilene Public Schools root](https://www.abileneschools.org/)',
    '- [Abilene Public Schools sitemap](https://www.abileneschools.org/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Additional Kansas district-owned `special education`, `student support`, or `special services` leaves on export-backed district hosts for unresolved counties.',
    '- Additional district-linked cooperative hosts that explicitly state they provide special-education services across partner districts and preserve parent-rights or IEP routing on the same local stack.',
    '- Exact county-by-county non-match documentation where a district host is live but only exposes generic or non-role-bearing local pages.',
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
    ].join('\n'),
  );
  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStatesReport() {
  let report = fs.readFileSync(INPUTS.allStatesReport, 'utf8');
  const oldLine = '- Kansas remains blocked, but reviewed local education-routing proof now covers 14 of 105 counties after Newton USD 373 and Emporia USD 253 added two more district-host local leaves.';
  const newLine = '- Kansas remains blocked, but reviewed local education-routing proof now covers 15 of 105 counties after Geary County USD 475 added one more district-host local leaf.';
  if (report.includes(oldLine)) {
    report = report.replace(oldLine, newLine);
  } else if (!report.includes(newLine)) {
    report = `${report.trimEnd()}\n${newLine}\n`;
  }
  fs.writeFileSync(INPUTS.allStatesReport, report);
}

export function generateBatch292KansasGearyReviewedLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const leaves = readJsonl(INPUTS.leaves);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);

  const mergedLeaves = [...leaves];
  if (!mergedLeaves.some((row) => row.county_id === NEW_LEAF.county_id && row.source_url === NEW_LEAF.source_url)) {
    mergedLeaves.push(NEW_LEAF);
  }
  mergedLeaves.sort((a, b) => a.county_id.localeCompare(b.county_id));

  const evidence = buildEvidence(mergedLeaves);
  const statusReason = buildStatusReason(mergedLeaves.length);
  const reviewedCounties = mergedLeaves.map((row) => row.county_id).sort();
  const unresolvedCounties = (packet.unresolved_local_leaf_counties || []).filter((county) => county !== 'geary-ks');
  const verifiedSamples = buildVerifiedSamples(mergedLeaves);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: FAILURE_CODE,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade', status_reason: statusReason }
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
          family_status: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade',
          query_basis: 'Reviewed one bounded Kansas district-routing pass against export-backed district hosts, district-linked cooperative stacks, and exact same-domain non-match freezes.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: evidence,
          sample_count: verifiedSamples.length,
          samples: verifiedSamples,
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
      ...(packet.current_problem_metrics || {}),
      authoredExactLeafCount: reviewedCounties.length,
      reviewedDistrictOwnedLeafCount: reviewedCounties.length,
    },
    reviewed_local_leaf_counties: reviewedCounties,
    unresolved_local_leaf_counties: unresolvedCounties,
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: FAILURE_CODE, classification: 'BLOCKED', index_safe: false }
      : row
  ));

  const updatedAudit = {
    ...audit,
    states: (audit.states || []).map((row) => (
      row.stateId === 'kansas'
        ? { ...row, packetPrimaryGapReason: FAILURE_CODE, classification: 'BLOCKED', indexSafe: false }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.leaves, mergedLeaves);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateAllStatesReport();

  const batchSummary = {
    state: 'kansas',
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_leaf_count: reviewedCounties.length,
    promoted_counties: ['geary-ks'],
    unresolved_county_count: unresolvedCounties.length,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch292KansasGearyReviewedLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
