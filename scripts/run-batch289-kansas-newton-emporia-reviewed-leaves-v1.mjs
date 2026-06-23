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
  summary: path.join(generatedDir, 'batch289_kansas_newton_emporia_reviewed_leaves_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch289-kansas-newton-emporia-reviewed-leaves-report-v1.md'),
};

const FAILURE_CODE = 'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_14_counties_but_export_backed_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'continue_export_backed_district_and_affiliated_coop_leaf_authoring_county_by_county_and_keep_exact_non_matches_frozen';

const NEW_LEAVES = [
  {
    county_id: 'harvey-ks',
    county_name: 'harvey',
    district_name: 'Newton Unified School District 373',
    district_website: 'https://www.usd373.org/',
    source_url: 'https://www.usd373.org/about/departments/special-education',
    final_url: 'https://www.usd373.org/about/departments/special-education',
    verification_status: 'verified',
    source_type: 'district_owned_special_education_leaf',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_title: 'Special Education - Newton Unified School District 373',
    evidence_h1: null,
    evidence_snippet: 'The official usd373.org district-owned Special Education leaf preserves role-exact special-education routing on the live Newton Unified School District 373 host.',
  },
  {
    county_id: 'lyon-ks',
    county_name: 'lyon',
    district_name: 'Emporia Public Schools USD 253',
    district_website: 'https://www.usd253.org/',
    source_url: 'https://www.usd253.org/services/fhsec',
    final_url: 'https://www.usd253.org/services/fhsec',
    verification_status: 'verified',
    source_type: 'district_linked_special_education_cooperative_home',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_title: 'Flint Hills Special Education Cooperative - Emporia Public Schools',
    evidence_h1: 'Flint Hills Special Education Cooperative',
    evidence_snippet: 'The official Emporia Public Schools host preserves a district-linked Flint Hills Special Education Cooperative leaf on the live usd253.org district stack.',
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
  return `Reviewed 2026-06-23 one more bounded official Kansas district-routing pass using only export-backed district hosts, official district-owned pages, district-linked cooperative leaves on district hosts, and exact same-domain checks. Education routing now has reviewed local proof for ${leaves.length}/105 counties: ${counties.join(', ')}. Harvey now clears because https://www.usd373.org/about/departments/special-education returned HTTP 200 with title \`Special Education - Newton Unified School District 373\` on the official Newton USD 373 host and the same district stack also preserves a referral leaf at https://www.usd373.org/about/departments/special-education/referral-process-for-exceptionalities. Lyon now clears because https://www.usd253.org/services/fhsec returned HTTP 200 with title and H1 \`Flint Hills Special Education Cooperative\` on the official Emporia Public Schools host, preserving a district-linked local special-education cooperative route on the same district stack. Dickinson remains a correct exact non-match freeze: the official Abilene Public Schools host at https://www.abileneschools.org/ and its public sitemap both returned HTTP 200, but the bounded same-domain pass still found no role-exact special-education, student-services, procedural-safeguards, or parent-rights leaf. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties.`;
}

function buildStatusReason(count) {
  return `Kansas is past a root-only blocker: reviewed district-owned and district-linked cooperative local education-routing leaves now exist for ${count}/105 counties, but county-grade local education routing is still incomplete across the packet. Export-backed district hosts remain the right lane, and exact non-match districts such as Abilene USD 435 should stay frozen until a role-exact local leaf appears on the official host stack.`;
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
    '- Harvey now clears from the district-owned Newton USD 373 Special Education leaf and the same district stack preserves a role-exact referral leaf for exceptionalities.',
    '- Lyon now clears from the district-linked Flint Hills Special Education Cooperative leaf on the official Emporia Public Schools host.',
    '- Dickinson remains frozen as an exact non-match on the live Abilene district host and sitemap.',
    '- Kansas now has reviewed local education-routing proof for fourteen counties, but county-grade coverage is still incomplete across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 289 Kansas Newton And Emporia Reviewed Leaves v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- index_safe: ${batchSummary.index_safe}`,
    `- reviewed_leaf_count: ${batchSummary.reviewed_leaf_count}`,
    '',
    '## What changed',
    '',
    '- Harvey now clears from the Newton USD 373 district-owned `Special Education` leaf on `usd373.org`.',
    '- Lyon now clears from the Emporia Public Schools district-linked `Flint Hills Special Education Cooperative` leaf on `usd253.org`.',
    '- Dickinson remains an exact non-match freeze on the live Abilene district host and public sitemap.',
    '',
    '## Repair decision',
    '',
    '- Kansas remains blocked because county-grade education routing is still incomplete statewide.',
    '- The local reviewed-leaf count rises from twelve to fourteen counties without loosening the gate.',
    '',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current.replace(
    '- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_12_counties_but_export_backed_county_grade_coverage_is_still_incomplete`',
    '- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_14_counties_but_export_backed_county_grade_coverage_is_still_incomplete`',
  );

  const focusBlock = [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. Reviewed local education-routing proof now covers 14/105 counties after Harvey cleared through Newton USD 373 and Lyon cleared through Emporia Public Schools / Flint Hills Special Education Cooperative, but Kansas still lacks county-grade local proof across the remaining packet and stays BLOCKED and not index-safe.',
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
    '- [Newton USD 373 root](https://www.usd373.org/)',
    '- [Newton USD 373 Special Education](https://www.usd373.org/about/departments/special-education)',
    '- [Newton USD 373 Referral Process for Exceptionalities](https://www.usd373.org/about/departments/special-education/referral-process-for-exceptionalities)',
    '- [Emporia Public Schools root](https://www.usd253.org/)',
    '- [Flint Hills Special Education Cooperative on Emporia host](https://www.usd253.org/services/fhsec)',
    '- [Arkansas City USD 470 Special Education](https://www.usd470.com/academics/special-education)',
    '- [Derby Public Schools Special Education](https://www.derbyschools.com/academics/special-education)',
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
  const oldLine = '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.';
  const newLines = [
    '- Kansas remains blocked, but reviewed local education-routing proof now covers 14 of 105 counties after Newton USD 373 and Emporia USD 253 added two more district-host local leaves.',
    oldLine,
  ].join('\n');
  if (report.includes(oldLine) && !report.includes('Newton USD 373 and Emporia USD 253')) {
    report = report.replace(oldLine, newLines);
    fs.writeFileSync(INPUTS.allStatesReport, report);
  }
}

export function generateBatch289KansasNewtonEmporiaReviewedLeavesV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const existingLeaves = readJsonl(INPUTS.leaves);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);

  const mergedLeaves = [...existingLeaves];
  for (const leaf of NEW_LEAVES) {
    if (!mergedLeaves.some((row) => row.county_id === leaf.county_id && row.source_url === leaf.source_url)) {
      mergedLeaves.push(leaf);
    }
  }
  mergedLeaves.sort((a, b) => a.county_id.localeCompare(b.county_id));

  const evidence = buildEvidence(mergedLeaves);
  const statusReason = buildStatusReason(mergedLeaves.length);

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
      'harvey local education-routing leaf',
      'lyon local education-routing leaf',
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
      ...preserved.filter((sample) => sample.sample_name !== 'dickinson district non-match homepage-and-sitemap'),
    ];
    return {
      ...row,
      family_status: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade',
      query_basis: 'Reviewed one bounded Kansas district-routing pass against export-backed district hosts, district-linked cooperative stacks, and exact same-domain non-match freezes.',
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
    primary_gap_reason: FAILURE_CODE,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
        : row
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade',
    },
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kansas'
      ? {
          ...row,
          status: updatedSummary.classification,
          classification: updatedSummary.classification,
          index_safe: updatedSummary.index_safe,
          primary_gap_reason: FAILURE_CODE,
        }
      : row
  ));

  const updatedAudit = {
    ...audit,
    states: audit.states.map((row) => (
      row.stateId === 'kansas'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            completenessPct: 92,
            strongCriticalFamilies: 11,
            weakCriticalFamilies: 1,
            packetPrimaryGapReason: FAILURE_CODE,
            packetRecommendedBatch: 'batch_2_repair_blocked',
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade',
            },
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
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateAllStatesReport();

  const batchSummary = {
    state: 'kansas',
    batch: 'batch289_kansas_newton_emporia_reviewed_leaves_v1',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_leaf_count: mergedLeaves.length,
    promoted_counties: ['harvey-ks', 'lyon-ks'],
    primary_gap_reason: FAILURE_CODE,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch289KansasNewtonEmporiaReviewedLeavesV1();
  console.log(JSON.stringify(summary, null, 2));
}
