import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch349IdahoLiveRootLeafFinalityV1 } from './run-batch349-idaho-live-root-leaf-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch350_idaho_jefferson_leaf_recovery_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch350-idaho-jefferson-leaf-recovery-report-v1.md'),
};

const BATCH_NAME = 'batch350_idaho_jefferson_leaf_recovery_v1';
const PRIMARY_GAP_REASON =
  'remaining_idaho_district_roots_now_reduce_to_live_homepage_sitemap_surfaces_without_role_bearing_leaves_after_jefferson_special_services_recovery';
const EDUCATION_STATUS =
  'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_jefferson_leaf_recovery';
const FAILURE_CODE =
  'remaining_live_idaho_district_roots_expose_zero_role_bearing_special_education_or_student_services_links_after_jefferson_recovery';
const NEXT_ACTION =
  'continue_exact_district_leaf_expansion_only_when_camas_clark_fremont_oneida_or_shoshone_publish_role_bearing_special_education_or_special_services_links';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 one more bounded official Idaho district-root pass against the remaining county-bearing hosts, and the result improved on one district. Jefferson is no longer just a blank-shell blocker: the official `https://www.jeffersonsd251.org/wp-sitemap.xml` is public and exposes district-owned `special-services`, `section-504`, `special-education`, and `student-services` leaves. The live `https://www.jeffersonsd251.org/special-education/` page now provides a district-owned special-education leaf with IDEA scope text, Child Find flyer links, a district Special Education Department contact form, and district office contact information on the official host. The sibling `special-services`, `student-services`, and `section-504` leaves are also public on the same host. The unresolved education blocker therefore shrinks to the other live district roots only: Camas, Clark, Fremont, Oneida, and Shoshone still stay publicly reachable at their official roots, but bounded homepage plus sitemap review still exposes zero reusable role-bearing `special education`, `special services`, `student services`, `504`, or procedural-safeguards leaves that can be safely promoted in the low-token lane.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Idaho district-root checks on https://www.camascountyschools.org/, https://www.clarkcountyschools161.org/, https://www.sd215.net/, https://www.sd215.net/sitemap.xml, https://www.oneidaschooldistrict.org/, https://www.oneidaschooldistrict.org/sitemap.xml, https://shoshonesd.org/, https://shoshonesd.org/sitemap.xml, https://shoshonesd.org/wp-sitemap.xml, and https://www.jeffersonsd251.org/wp-sitemap.xml. Jefferson is now positively recovered: the public sitemap exposes `https://www.jeffersonsd251.org/special-services/`, `https://www.jeffersonsd251.org/section-504/`, `https://www.jeffersonsd251.org/special-education/`, and `https://www.jeffersonsd251.org/student-services/`, and the live `special-education` page explicitly says Jefferson Joint School District 251 provides special education services for students with disabilities ages 3-21, links Child Find flyers, and offers a district Special Education Department contact form plus district office contact information. Camas and Clark both stayed live at their district roots but exposed no role-bearing special-education, special-services, student-services, 504, or procedural-safeguards links in one-hop public HTML. Fremont and Oneida both preserved live homepages and live sitemap.xml files, yet the bounded same-host review still did not materialize a reusable district-owned special-education or student-services leaf. Shoshone preserved live homepage plus both sitemap surfaces, but the only public `special` hit was a `Special-Ed-Records-Distruction-1.pdf` file, not a routing, department, or contact leaf. Idaho therefore remains blocked on the smaller live district-host remainder after Jefferson recovery.';
const LESSON_HEADING = '### Public WP Sitemaps Can Reopen A District Host That Looked Blank In Raw HTML';
const LESSON_BODY =
  '*   **Lesson:** If a district root looks blank or unhelpful in one raw fetch, check the public WordPress sitemap before freezing the host. Jefferson SD 251 looked like a blank shell at the root, but its public `wp-sitemap.xml` exposed district-owned `special-services`, `special-education`, `section-504`, and `student-services` leaves that were strong enough to recover county-grade education routing.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
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
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '## Completion decision',
    '',
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education improved because Jefferson now clears from district-owned special-services pages recovered via the public WordPress sitemap.',
    '- Education still remains blocked overall because Camas, Clark, Fremont, Oneida, and Shoshone still expose no safely promotable role-bearing education leaves in bounded public review.',
    '- County-local remains separately blocked because Idaho DHW still exposes no truthful public county-to-office routing contract for the remaining 27 blocked counties.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const newLine = '- Idaho remains blocked, but the district-root lane improved: Jefferson now clears from public sitemap-recovered `special-services` / `special-education` leaves, while Camas, Clark, Fremont, Oneida, and Shoshone still expose no reusable role-bearing education leaves; county-local stays separately blocked on the missing DHW county contract.';
  const lines = text.split('\n').filter((line) => !line.startsWith('- Idaho remains blocked'));
  const notesIndex = lines.findIndex((line) => line.trim() === '## Notes');
  if (notesIndex === -1) return `${lines.join('\n').trimEnd()}\n${newLine}\n`;
  const nextLines = [...lines];
  nextLines.splice(notesIndex + 2, 0, newLine);
  return `${nextLines.join('\n').trimEnd()}\n`;
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    `Updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Idaho',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` remains the highest-priority Idaho blocker, but one district recovered. Jefferson is no longer just a blank shell: the public `wp-sitemap.xml` now exposes district-owned `special-services`, `section-504`, `special-education`, and `student-services` leaves, and the live `special-education` page explicitly describes Jefferson Joint School District 251 special education services, Child Find flyer links, and a district Special Education Department contact form. The unresolved education blocker is now smaller and limited to the other live district hosts: Camas, Clark, Fremont, Oneida, and Shoshone still stay publicly reachable, but bounded homepage plus sitemap review still exposes no safely promotable role-bearing `special education`, `special services`, `student services`, `504`, or procedural-safeguards leaves. County-local remains separately blocked because the DHW office stack still exposes no truthful county-to-office routing contract for the remaining blocked counties.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official district-owned special-education, special-services, student-services, 504, or procedural-safeguards leaf on Camas, Clark, Fremont, Oneida, or Shoshone.',
    '- Any official Idaho DHW county-to-office crosswalk, service-area table, export, PDF, ArcGIS layer, or API that ties counties to named office leaves.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Idaho SDE School Districts](https://www.sde.idaho.gov/school-districts/)',
    '- [Camas County Schools root](https://www.camascountyschools.org/)',
    '- [Clark Co School District 161 root](https://www.clarkcountyschools161.org/)',
    '- [Fremont County Joint School District #215 root](https://www.sd215.net/)',
    '- [Fremont County Joint School District #215 sitemap](https://www.sd215.net/sitemap.xml)',
    '- [Oneida School District root](https://www.oneidaschooldistrict.org/)',
    '- [Oneida School District sitemap](https://www.oneidaschooldistrict.org/sitemap.xml)',
    '- [Oneida Child Find link](https://5il.co/26a73)',
    '- [Shoshone School District root](https://shoshonesd.org/)',
    '- [Shoshone School District sitemap](https://shoshonesd.org/sitemap.xml)',
    '- [Shoshone School District wp-sitemap](https://shoshonesd.org/wp-sitemap.xml)',
    '- [Jefferson School District 251 sitemap](https://www.jeffersonsd251.org/wp-sitemap.xml)',
    '- [Jefferson special education](https://www.jeffersonsd251.org/special-education/)',
    '- [Jefferson special services](https://www.jeffersonsd251.org/special-services/)',
    '- [Jefferson section 504](https://www.jeffersonsd251.org/section-504/)',
    '- [Jefferson student services](https://www.jeffersonsd251.org/student-services/)',
    '- [Idaho DHW offices](https://healthandwelfare.idaho.gov/offices)',
    '- [Idaho DHW sitemap](https://healthandwelfare.idaho.gov/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any newly published district-owned special-education or student-services leaf on Camas, Clark, Fremont, Oneida, or Shoshone.',
    '- Any official Idaho DHW county-to-office mapping contract for the 27 still-blocked counties.',
    '',
    '## Next State Order After Idaho',
    '',
    '1. Arizona',
    '2. Massachusetts',
    '3. New Mexico',
    '4. South Dakota',
    '5. Rhode Island',
    '6. Virginia',
    '7. West Virginia',
    '8. North Dakota',
    '9. Wisconsin',
    '10. Washington',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 350 Idaho Jefferson Leaf Recovery v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: recovered Jefferson district-owned education leaves from the public WordPress sitemap and narrowed the remaining Idaho education blocker',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch350IdahoJeffersonLeafRecoveryV1() {
  generateBatch349IdahoLiveRootLeafFinalityV1();

  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 84,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: FAILURE_CODE,
        evidence: EDUCATION_EVIDENCE,
        next_action: NEXT_ACTION,
      },
      ...(summary.final_blockers || []).filter((row) => row.family !== 'district_or_county_education_routing'),
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: EDUCATION_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: EDUCATION_STATUS, status_reason: EDUCATION_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
        ...row,
        family_status: EDUCATION_STATUS,
        sample_count: 20,
        blocker_code: FAILURE_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        query_basis: 'Reviewed live official Idaho district-owned education leaves already on disk, rechecked the remaining county-bearing district roots with homepage and sitemap review, and recovered Jefferson from its public WordPress sitemap.',
        samples: [
          ...(row.samples || []).filter((sample) => ![
            'Jefferson School District 251 blank challenge shell',
            'Idaho unresolved district remainder negative checks',
          ].includes(sample.sample_name)),
          {
            sample_name: 'Jefferson special education page',
            source_url: 'https://www.jeffersonsd251.org/special-education/',
            final_url: 'https://www.jeffersonsd251.org/special-education/',
            verification_status: 'verified',
            source_type: 'official_district_owned_special_education_leaf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live district-owned page says Jefferson Joint School District 251 provides special education services for students with disabilities ages 3-21, links Child Find flyers, and offers a district Special Education Department contact form plus district office contact info.',
          },
          {
            sample_name: 'Jefferson public district sitemap',
            source_url: 'https://www.jeffersonsd251.org/wp-sitemap.xml',
            final_url: 'https://www.jeffersonsd251.org/wp-sitemap.xml',
            verification_status: 'verified',
            source_type: 'official_public_sitemap_with_role_bearing_leaf_inventory',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public sitemap exposes district-owned `special-services`, `section-504`, `special-education`, and `student-services` leaves on the official Jefferson host.',
          },
          {
            sample_name: 'Camas County Schools live root without role-bearing education links',
            source_url: 'https://www.camascountyschools.org/',
            final_url: 'https://www.camascountyschools.org/',
            verification_status: 'blocked',
            source_type: 'bounded_homepage_negative_check',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official district root stayed live, but one-hop homepage review exposed no reusable `Special Education`, `Special Services`, `Student Services`, `504`, or procedural-safeguards link.',
          },
          {
            sample_name: 'Fremont County Joint School District #215 live sitemap without role-bearing education URLs',
            source_url: 'https://www.sd215.net/sitemap.xml',
            final_url: 'https://www.sd215.net/sitemap.xml',
            verification_status: 'blocked',
            source_type: 'bounded_sitemap_negative_check',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official sitemap stayed live, but the same-host URL inventory still did not materialize a reusable district-owned special-education or student-services leaf.',
          },
          {
            sample_name: 'Shoshone School District only special hit is records-destruction PDF',
            source_url: 'https://shoshonesd.org/',
            final_url: 'https://shoshonesd.org/',
            verification_status: 'blocked',
            source_type: 'bounded_homepage_and_sitemap_negative_check',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official root plus sitemap surfaces stayed live, but the only public `special` hit was `Special-Ed-Records-Distruction-1.pdf`, not a routing, department, or contact leaf.',
          },
        ],
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
          repair_lane: 'blocked_until_new_district_leaf_or_public_county_contract',
        }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'idaho'
        ? {
            ...row,
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: EDUCATION_STATUS,
            },
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));
  appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'idaho',
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_live_roots: 6,
    recovered_role_bearing_district_hosts: 1,
    live_homepage_roots_without_role_bearing_links: 5,
    challenge_shell_roots: 0,
    reviewed_exact_leaf_count_after_recovery: 14,
    result: 'jefferson_recovered_remaining_live_district_root_packet_still_incomplete',
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch350IdahoJeffersonLeafRecoveryV1();
  console.log(JSON.stringify(result, null, 2));
}
