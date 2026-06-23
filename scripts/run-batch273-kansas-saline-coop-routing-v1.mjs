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
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch273_kansas_saline_coop_routing_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch273-kansas-saline-coop-routing-report-v1.md'),
};

const FAILURE_CODE = 'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'continue_export_backed_district_and_affiliated_coop_leaf_authoring_county_by_county_and_keep_exact_non_matches_frozen';
const PRIMARY_GAP_REASON = 'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete';
const LESSON_HEADING = '### A District-Linked Special-Education Cooperative Can Clear A County When The District Labels The Route And The Cooperative States The Service Scope';
const LESSON_BODY = '*   **Lesson:** A district-linked cooperative can satisfy county-grade education routing when the district explicitly labels the route as `Special Education Services` and the linked cooperative home states that it provides special-education services across partner school districts. Kansas Salina USD 305 did not need a brand-new district-owned `/special-education` leaf once the district pages pointed into CKCIE and the CKCIE home/parents stack preserved special-education services, IEP, parent-rights, and local Salina contact evidence.';

const SALINE_LEAF = {
  county_id: 'saline-ks',
  county_name: 'saline',
  district_name: 'Salina USD 305',
  district_website: 'https://www.usd305.com/',
  source_url: 'https://www.305ckcie.com/',
  final_url: 'https://www.305ckcie.com/',
  verification_status: 'verified',
  source_type: 'district_linked_special_education_cooperative_home',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_title: 'Home - CKCIE',
  evidence_h1: 'Home',
  evidence_snippet: 'Salina USD 305 labels a district link as `Special Education Services`, and the linked CKCIE home states that it provides special education services to more than 3,100 exceptional students across 12 school districts, with a Salina office at 409 W. Cloud Street and phone (785) 309-5100.'
};

const SALINE_SUPPORTING_SAMPLE = {
  sample_name: 'saline district-linked cooperative parent-rights leaf',
  source_url: 'https://www.305ckcie.com/parents',
  final_url: 'https://www.305ckcie.com/parents',
  verification_status: 'reviewed',
  source_type: 'district_linked_special_education_cooperative_parent_leaf',
  source_table: 'reviewed_live_probe',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_snippet: 'The CKCIE Parents page preserves parent portal access through a student special education case manager, Transition in the IEP, Parent Rights in Special Education, and a Salina office contact on the same local cooperative host.'
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

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-23 one bounded official Kansas district-routing pass using only export-backed district hosts plus district-linked cooperative leaves that stayed role-pure. Education routing now has reviewed local proof for ${leaves.length}/105 counties: ${counties.join(', ')}. Saline now clears from a district-linked cooperative stack instead of a district-owned leaf alone: https://www.usd305.com/site-map and https://www.usd305.com/departments/administrative-student-support both label a link as \`Special Education Services\`, and the linked CKCIE home page at https://www.305ckcie.com/ says it provides special education services to more than 3,100 exceptional students across 12 school districts. The CKCIE Parents page at https://www.305ckcie.com/parents preserves parent portal access through a student special education case manager, Transition in the IEP, Parent Rights in Special Education, and the Salina office contact on the same local host. Kansas therefore improves from nine to ten reviewed counties, but county-grade education proof is still incomplete across the 105-county packet.`;
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
    '- Saline now clears from a district-linked cooperative route because USD 305 labels the path as `Special Education Services` and the linked CKCIE host explicitly states that it provides special education services across partner districts.',
    '- Kansas now has reviewed local education-routing proof for ten counties, but county-grade coverage is still incomplete across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current.replace(
    '- Kansas: `reviewed_kansas_district_owned_leaves_now_cover_9_counties_but_export_backed_county_grade_coverage_is_still_incomplete`',
    '- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete`'
  );

  const focusBlock = [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. Reviewed local education-routing proof now covers 10/105 counties after Saline cleared through a district-linked cooperative route, but Kansas still lacks county-grade local proof across the remaining packet and stays BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- More export-backed Kansas district-owned special-education or student-support leaves that stay role-exact on the live district host.',
    '- More district-linked cooperative routes where the district explicitly labels the path as local special-education services and the linked cooperative host clearly states the service scope, parent-rights path, or local IEP routing.',
    '- Exact non-match freezes for districts whose live pages are still generic `special programs`, directory, or root-only content so they do not get re-tried loosely.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Kansas KSDE directories root](https://www.ksde.gov/data-and-reporting/directories)',
    '- [Kansas Directory Reports](https://uapps.ksde.gov/Directory_Rpts/default.aspx)',
    '- [Kansas Data Central](https://datacentral.ksde.gov/default.aspx)',
    '- [Kansas district maps PDF](https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5)',
    '- [Leavenworth USD 453 Special Education](https://www.usd453.org/district-departments/special-education)',
    '- [Manhattan-Ogden USD 383 About Special Education](https://www.usd383.org/32689_3)',
    '- [Salina USD 305 site map](https://www.usd305.com/site-map)',
    '- [Salina USD 305 Administrative & Student Support](https://www.usd305.com/departments/administrative-student-support)',
    '- [CKCIE home](https://www.305ckcie.com/)',
    '- [CKCIE Parents](https://www.305ckcie.com/parents)',
    '- [CKCIE Individual Education Plan](https://www.305ckcie.com/employees/professional-development/individual-education-plan)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Additional Kansas district-owned `special education`, `student support`, or `special services` leaves on export-backed district hosts for unresolved counties.',
    '- Additional district-linked cooperative hosts that explicitly state they provide special-education services across partner districts and preserve parent-rights or IEP routing on the same local stack.',
    '- Exact county-by-county non-match documentation where a district host is live but only exposes generic program hubs instead of a local special-education contract.',
    '',
  ].join('\n');

  current = current.replace(/## Current Focus State:[\s\S]*?## Next State Order After [^\n]+\n\n(?:\d+\..*\n){1,12}/, `${focusBlock}## Next State Order After Kansas\n\n1. Nebraska\n2. Florida\n3. Alaska\n4. South Carolina\n5. North Carolina\n6. New York\n7. Oklahoma\n8. Oregon\n9. Ohio\n10. Minnesota\n`);
  fs.writeFileSync(INPUTS.handoff, current);
}

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

export function generateBatch273KansasSalineCoopRoutingV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const existingLeaves = readJsonl(INPUTS.leaves);

  const mergedLeaves = [...existingLeaves];
  if (!mergedLeaves.some((row) => row.county_id === SALINE_LEAF.county_id && row.source_url === SALINE_LEAF.source_url)) {
    mergedLeaves.push(SALINE_LEAF);
  }
  mergedLeaves.sort((a, b) => a.county_id.localeCompare(b.county_id));

  const evidence = buildEvidence(mergedLeaves);
  const statusReason = `Kansas is past a root-only blocker: reviewed district-owned and district-linked cooperative local education-routing leaves now exist for ${mergedLeaves.length}/105 counties, but county-grade local education routing is still incomplete across the packet. Export-backed district hosts remain the right lane, and district-linked cooperative routes may count only when the district labels the path as local special-education services and the cooperative host preserves a role-pure service scope.`;

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
      ? { ...row, family_status: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade', status_reason: statusReason }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    const preserved = (row.samples || []).filter((sample) => ![
      'saline district-linked cooperative lead',
      'saline district-linked cooperative parent-rights leaf',
    ].includes(sample.sample_name));
    const samples = [
      ...mergedLeaves.map((leaf) => ({
        sample_name: `${leaf.county_id.replace('-ks', '')} local education-routing leaf`,
        source_url: leaf.source_url,
        final_url: leaf.final_url,
        verification_status: leaf.verification_status,
        source_type: leaf.source_type,
        source_table: 'reviewed_live_probe',
        fetched_at: leaf.fetched_at,
        evidence_snippet: leaf.evidence_snippet,
      })),
      SALINE_SUPPORTING_SAMPLE,
      ...preserved,
    ];
    return {
      ...row,
      family_status: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade',
      query_basis: 'Reviewed one bounded Kansas district-routing pass against export-backed district hosts and district-linked local cooperative stacks.',
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
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
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
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  const lessonsUpdated = appendLessonIfMissing();

  const batchSummary = {
    batch: 'batch273_kansas_saline_coop_routing_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_leaf_counties: mergedLeaves.map((row) => row.county_id).sort(),
    reviewed_leaf_count: mergedLeaves.length,
    newly_verified_county: SALINE_LEAF.county_id,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 273 Kansas Saline Cooperative Routing v1',
      '',
      `- reviewed leaf counties: ${mergedLeaves.length}`,
      `- newly verified county: ${SALINE_LEAF.county_id}`,
      '',
      '## Repair decision',
      '',
      '- Kansas remains blocked, but reviewed local education-routing proof now covers ten counties instead of nine.',
      '- Saline now clears from a district-linked cooperative route because USD 305 labels the path as `Special Education Services` and CKCIE explicitly states that it provides special-education services across 12 school districts.',
      '- Kansas still fails closed until many more counties gain reviewed district-owned or district-linked local education-routing proof.',
    ].join('\n') + '\n'
  );

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch273KansasSalineCoopRoutingV1();
  console.log(JSON.stringify(result, null, 2));
}
