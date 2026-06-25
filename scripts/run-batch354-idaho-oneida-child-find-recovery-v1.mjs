import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch350IdahoJeffersonLeafRecoveryV1 } from './run-batch350-idaho-jefferson-leaf-recovery-v1.mjs';

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
  summary: path.join(generatedDir, 'batch354_idaho_oneida_child_find_recovery_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch354-idaho-oneida-child-find-recovery-report-v1.md'),
};

const BATCH_NAME = 'batch354_idaho_oneida_child_find_recovery_v1';
const PRIMARY_GAP_REASON =
  'remaining_idaho_district_roots_now_reduce_to_live_homepage_and_sitemap_surfaces_without_role_bearing_leaves_after_jefferson_and_oneida_recovery';
const EDUCATION_STATUS =
  'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_jefferson_and_oneida_recovery';
const FAILURE_CODE =
  'remaining_live_idaho_district_roots_expose_zero_role_bearing_special_education_or_student_services_links_after_jefferson_and_oneida_recovery';
const NEXT_ACTION =
  'continue_exact_district_leaf_expansion_only_when_camas_clark_fremont_or_shoshone_publish_role_bearing_special_education_or_special_services_links';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 one more bounded official Idaho district-root pass and one known district-owned PDF lead, and the result improved on a second district. Jefferson remains recovered from its public WordPress sitemap and district-owned `special-education` leaf. Oneida now also clears from a district-owned Child Find PDF already linked from the official host: `https://5il.co/26a73` resolves to a live district-owned PDF asset on the Thrillshare file backend for Oneida School District, and bundled PDF extraction now cleanly reads `Jill Daniels - Special Education Director, 195 S 300 E, Malad, ID 83252, 208-534-6080, jill.daniels@malad.us` plus explicit Child Find scope for children ages 3 through 21 and district office contact routing. The unresolved education blocker therefore shrinks again to the other live district roots only: Camas, Clark, Fremont, and Shoshone still stay publicly reachable at their official roots, but bounded homepage plus sitemap review still exposes zero reusable role-bearing `special education`, `special services`, `student services`, `504`, or procedural-safeguards leaves that can be safely promoted in the low-token lane.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Idaho district-root checks on https://www.camascountyschools.org/, https://www.clarkcountyschools161.org/, https://www.sd215.net/, https://www.sd215.net/sitemap.xml, https://www.oneidaschooldistrict.org/, https://www.oneidaschooldistrict.org/sitemap.xml, https://shoshonesd.org/, https://shoshonesd.org/sitemap.xml, https://shoshonesd.org/wp-sitemap.xml, https://www.jeffersonsd251.org/wp-sitemap.xml, and the known Oneida Child Find PDF lead at https://5il.co/26a73. Jefferson remains positively recovered: the public sitemap exposes district-owned `special-services`, `section-504`, `special-education`, and `student-services` leaves, and the live `special-education` page explicitly says Jefferson Joint School District 251 provides special education services for students with disabilities ages 3-21, links Child Find flyers, and offers a district Special Education Department contact form plus district office contact information. Oneida is now also positively recovered: the district-owned Child Find PDF extracted cleanly with the bundled PDF stack and preserved `Jill Daniels - Special Education Director`, `195 S 300 E, Malad, ID 83252`, `208-534-6080`, `jill.daniels@malad.us`, explicit Child Find scope for children ages 3 through 21, and district office contact routing on the official district-owned asset. Camas and Clark both stayed live at their district roots but exposed no role-bearing special-education, special-services, student-services, 504, or procedural-safeguards links in one-hop public HTML. Fremont preserved a live homepage and live sitemap.xml file, yet the bounded same-host review still did not materialize a reusable district-owned special-education or student-services leaf. Shoshone preserved live homepage plus both sitemap surfaces, but the only public `special` hit was a `Special-Ed-Records-Distruction-1.pdf` file, not a routing, department, or contact leaf. Idaho therefore remains blocked on the smaller live district-host remainder after Jefferson and Oneida recovery.';
const LESSON_HEADING = '### District-Owned Child Find PDFs Can Clear Local Education Routing When They Carry Real Contacts';
const LESSON_BODY =
  '*   **Lesson:** If a district-owned Child Find PDF is already linked from the official host, run the bundled PDF extractor before treating it as a weak document-only lead. Oneida School District’s Child Find PDF carried the Special Education Director name, district address, phone, email, and explicit 3–21 Child Find scope, which was strong enough to recover county-grade education routing without any extra crawl.';

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
    '- Education improved again because Oneida now clears from a district-owned Child Find PDF with direct Special Education Director contact evidence, joining Jefferson.',
    '- Education still remains blocked overall because Camas, Clark, Fremont, and Shoshone still expose no safely promotable role-bearing education leaves in bounded public review.',
    '- County-local remains separately blocked because Idaho DHW still exposes no truthful public county-to-office routing contract for the remaining 27 blocked counties.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const newLine = '- Idaho remains blocked, but the district-root lane improved again: Oneida now clears from a district-owned Child Find PDF with Special Education Director contact evidence, joining Jefferson; Camas, Clark, Fremont, and Shoshone still expose no reusable role-bearing education leaves, and county-local stays separately blocked on the missing DHW county contract.';
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
    '`district_or_county_education_routing` remains the highest-priority Idaho blocker, but a second district recovered. Jefferson still clears from its district-owned `special-education` leaf. Oneida now also clears from a district-owned Child Find PDF already linked from the official host: the PDF extracts Jill Daniels as Special Education Director with district address, phone, email, and explicit Child Find scope for children ages 3 through 21. The unresolved education blocker is now smaller and limited to Camas, Clark, Fremont, and Shoshone, whose live district roots still expose no safely promotable role-bearing `special education`, `special services`, `student services`, `504`, or procedural-safeguards leaves in bounded review. County-local remains separately blocked because the DHW office stack still exposes no truthful county-to-office routing contract for the remaining blocked counties.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official district-owned special-education, special-services, student-services, 504, or procedural-safeguards leaf on Camas, Clark, Fremont, or Shoshone.',
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
    '- [Oneida Child Find PDF](https://5il.co/26a73)',
    '- [Shoshone School District root](https://shoshonesd.org/)',
    '- [Shoshone School District sitemap](https://shoshonesd.org/sitemap.xml)',
    '- [Shoshone School District wp-sitemap](https://shoshonesd.org/wp-sitemap.xml)',
    '- [Jefferson School District 251 sitemap](https://www.jeffersonsd251.org/wp-sitemap.xml)',
    '- [Jefferson special education](https://www.jeffersonsd251.org/special-education/)',
    '- [Idaho DHW offices](https://healthandwelfare.idaho.gov/offices)',
    '- [Idaho DHW sitemap](https://healthandwelfare.idaho.gov/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any newly published district-owned special-education or student-services leaf on Camas, Clark, Fremont, or Shoshone.',
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
    '# Batch 354 Idaho Oneida Child Find Recovery v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: recovered Oneida district-owned education routing from the official Child Find PDF and narrowed the remaining Idaho education blocker',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch354IdahoOneidaChildFindRecoveryV1() {
  generateBatch350IdahoJeffersonLeafRecoveryV1();

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
    completeness_pct: 85,
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
          sample_count: 22,
          query_basis: 'Reviewed live official Idaho district-owned education leaves already on disk, rechecked the remaining county-bearing district roots with homepage and sitemap review, recovered Jefferson from its public WordPress sitemap, and recovered Oneida from a district-owned Child Find PDF already linked from the official host.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          samples: [
            {
              sample_name: 'Oneida Child Find PDF',
              source_url: 'https://5il.co/26a73',
              final_url: 'https://files-backend.assets.thrillshare.com/documents/asset/uploaded_file/3807/Osd/42bba71c-f180-4aee-bbf6-d6a991d5d52c/Oneida_Child_Find_Notice_2023.docx.pdf?disposition=inline',
              verification_status: 'verified',
              source_type: 'district_owned_child_find_pdf',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The district-owned Child Find PDF preserves Jill Daniels as Special Education Director, 195 S 300 E Malad ID 83252, phone 208-534-6080, email jill.daniels@malad.us, and explicit Child Find scope for children ages 3 through 21.',
            },
            {
              sample_name: 'Oneida district root',
              source_url: 'https://www.oneidaschooldistrict.org/',
              final_url: 'https://www.oneidaschooldistrict.org/',
              verification_status: 'verified',
              source_type: 'official_root_with_child_find_pdf_link',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The official Oneida district host stays public and is the host family that links the Child Find PDF evidence.',
            },
            ...(row.samples || []).filter((sample) => !['Oneida Child Find PDF', 'Oneida district root'].includes(sample.sample_name)),
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
          completeness_pct: 85,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
          repair_lane: 'blocked_until_new_district_leaf_or_public_county_contract',
        }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    classifications: updatedQueueRows.reduce((acc, row) => {
      acc[row.classification] = (acc[row.classification] || 0) + 1;
      return acc;
    }, {}),
    indexSafeCount: updatedQueueRows.filter((row) => row.index_safe).length,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'idaho'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            completenessPct: 85,
            weakCriticalFamilies: 2,
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: EDUCATION_STATUS,
            },
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
          }
        : row
    )),
  };

  const batchSummary = {
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    recovered_role_bearing_district_hosts: 2,
    remaining_live_homepage_roots_without_role_bearing_links: 4,
    recovered_pdf_backed_district_hosts: 1,
    challenge_shell_roots: 0,
    reviewed_exact_leaf_count_after_recovery: 16,
    result: 'oneida_child_find_pdf_recovered_remaining_live_district_root_packet_still_incomplete',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));
  appendLessonIfMissing(INPUTS.lessons);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return {
    classification: updatedSummary.classification,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    batch: BATCH_NAME,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch354IdahoOneidaChildFindRecoveryV1();
  console.log(JSON.stringify(result, null, 2));
}
