import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  summary: path.join(generatedDir, 'batch349_idaho_live_root_leaf_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch349-idaho-live-root-leaf-finality-report-v1.md'),
};

const BATCH_NAME = 'batch349_idaho_live_root_leaf_finality_v1';
const PRIMARY_GAP_REASON =
  'remaining_idaho_district_roots_now_split_between_live_homepage_sitemap_surfaces_without_role_bearing_leaves_and_one_blank_shell_challenge_after_bounded_exact_leaf_review';
const EDUCATION_STATUS =
  'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_bounded_homepage_sitemap_review';
const FAILURE_CODE =
  'remaining_live_idaho_district_roots_expose_zero_role_bearing_special_education_or_student_services_links_and_jefferson_stays_blank_shell';
const NEXT_ACTION =
  'continue_exact_district_leaf_expansion_only_when_remaining_idaho_district_hosts_publish_role_bearing_special_education_or_special_services_links';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 one more bounded official Idaho district-root pass against the remaining county-bearing hosts only: https://www.camascountyschools.org/, https://www.clarkcountyschools161.org/, https://www.sd215.net/, https://www.oneidaschooldistrict.org/, https://shoshonesd.org/, and https://www.jeffersonsd251.org/, plus same-host sitemap or wp-sitemap follow-ups where they existed. The result is sharper than the prior guessed-leaf packet: Camas, Clark, Fremont, Oneida, and Shoshone all stayed publicly reachable at their official district roots, but one-hop homepage plus sitemap review still exposed zero reusable `special education`, `special services`, `student services`, `504`, or procedural-safeguards leaf links. Fremont and Oneida both preserved live `sitemap.xml` files without any role-bearing education URLs. Shoshone preserved live `sitemap.xml` and `wp-sitemap.xml`, but the only special-education hit on the public root was a records-destruction PDF, not a routing or department leaf. Jefferson still returned the same blank Incapsula-style shell with no title, no headings, and no reusable education content. Idaho therefore remains blocked because the remaining official district-host lane is now source-final for bounded low-token review: thirteen reviewed district-owned leaves are real, but the unresolved county-bearing hosts still expose no exact role-bearing education leaf worth promoting.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Idaho district-root checks on https://www.camascountyschools.org/, https://www.clarkcountyschools161.org/, https://www.sd215.net/, https://www.sd215.net/sitemap.xml, https://www.oneidaschooldistrict.org/, https://www.oneidaschooldistrict.org/sitemap.xml, https://shoshonesd.org/, https://shoshonesd.org/sitemap.xml, https://shoshonesd.org/wp-sitemap.xml, and https://www.jeffersonsd251.org/. Camas and Clark both stayed live at their district roots but exposed no role-bearing special-education, special-services, student-services, 504, or procedural-safeguards links in one-hop public HTML. Fremont and Oneida both preserved live homepages and live sitemap.xml files, yet the bounded same-host URL inventory still exposed zero role-bearing education URLs. Shoshone preserved live homepage plus both sitemap surfaces, but the only public `special` hit was a `Special-Ed-Records-Distruction-1.pdf` file, not a routing, department, or contact leaf. Jefferson still returned the same blank Incapsula-style shell with no reusable title, H1, headings, or substantive text. The remaining Idaho district-host packet is therefore exhausted for low-token exact-leaf authoring until one of those official hosts publishes a real role-bearing education page.';

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
    '- Education is now blocked on a sharper live-root finality check: the remaining district hosts are mostly live, but they still expose no role-bearing special-education or student-services leaves in bounded homepage and sitemap review, while Jefferson remains a blank challenge shell.',
    '- County-local remains separately blocked because Idaho DHW still exposes no truthful public county-to-office routing contract for the remaining 27 blocked counties.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const newLine = '- Idaho remains blocked on a stronger district-root finality check: the remaining official district hosts are mostly live, but bounded homepage and sitemap review still exposes no reusable special-education or student-services leaves, while Jefferson remains a blank challenge shell; county-local stays separately blocked on the missing DHW county contract.';
  const lines = text.split('\n').filter((line) => (
    !line.startsWith('- Idaho remains blocked on ') &&
    line !== '- Maine is now the next blocked state in the active priority order because education is already cleared while county-local remains blocked on the missing DHHS county/service-area crosswalk.'
  ));
  const notesIndex = lines.findIndex((line) => line.trim() === '## Notes');
  if (notesIndex === -1) return `${lines.join('\n').trimEnd()}\n${newLine}\n`;
  const insertAt = notesIndex + 2;
  const nextLines = [...lines];
  nextLines.splice(insertAt, 0, newLine);
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
    '`district_or_county_education_routing` remains the highest-priority Idaho blocker. Reviewed 2026-06-25 bounded official district-host checks on Camas, Clark, Fremont, Oneida, Shoshone, and Jefferson. Camas, Clark, Fremont, Oneida, and Shoshone all stayed live at their official roots, but bounded homepage plus sitemap review still exposed zero reusable `special education`, `special services`, `student services`, `504`, or procedural-safeguards leaves. Jefferson still resolves to a blank Incapsula-style shell. Idaho therefore still holds only thirteen reviewed county-grade district-owned education leaves, and the unresolved district-host lane is now source-final for low-token review until one of those official hosts publishes a real role-bearing leaf. County-local remains separately blocked because the DHW office stack still exposes no truthful county-to-office routing contract for the remaining blocked counties.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official district-owned special-education, special-services, student-services, 504, or procedural-safeguards leaf on the remaining Idaho county-bearing district hosts.',
    '- Any official Idaho DHW county-to-office crosswalk, service-area table, export, PDF, ArcGIS layer, or API that ties counties to named office leaves.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Idaho SDE School Districts](https://www.sde.idaho.gov/school-districts/)',
    '- [Bear Lake School District Special Education](https://www.blsd.net/en-US/special-education-e92c299d)',
    '- [Camas County Schools root](https://www.camascountyschools.org/)',
    '- [Clark Co School District 161 root](https://www.clarkcountyschools161.org/)',
    '- [Fremont County Joint School District #215 root](https://www.sd215.net/)',
    '- [Fremont County Joint School District #215 sitemap](https://www.sd215.net/sitemap.xml)',
    '- [Oneida School District root](https://www.oneidaschooldistrict.org/)',
    '- [Oneida School District sitemap](https://www.oneidaschooldistrict.org/sitemap.xml)',
    '- [Shoshone School District root](https://shoshonesd.org/)',
    '- [Shoshone School District sitemap](https://shoshonesd.org/sitemap.xml)',
    '- [Shoshone School District wp-sitemap](https://shoshonesd.org/wp-sitemap.xml)',
    '- [Jefferson School District 251 root](https://www.jeffersonsd251.org/)',
    '- [Idaho DHW offices](https://healthandwelfare.idaho.gov/offices)',
    '- [Idaho DHW sitemap](https://healthandwelfare.idaho.gov/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any newly published district-owned special-education or student-services leaf on Camas, Clark, Fremont, Jefferson, Oneida, or Shoshone.',
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
    '# Batch 349 Idaho Live Root Leaf Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: replaced guess-heavy unresolved district-leaf wording with a live-root finality check across the remaining official district hosts',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch349IdahoLiveRootLeafFinalityV1() {
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
    completeness_pct: 83,
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
        sample_count: 19,
        blocker_code: FAILURE_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        query_basis: 'Reviewed live official Idaho district-owned education leaves already on disk, then rechecked the remaining county-bearing district roots with one-hop homepage and sitemap review.',
        samples: [
          ...(row.samples || []).filter((sample) => ![
            'Idaho unresolved district remainder negative checks',
            'Camas County Schools live root without role-bearing education links',
            'Fremont County Joint School District #215 live sitemap without role-bearing education URLs',
            'Shoshone School District only special hit is records-destruction PDF',
            'Jefferson School District 251 blank challenge shell',
          ].includes(sample.sample_name)),
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
            evidence_snippet: 'The official sitemap stayed live, but the same-host URL inventory exposed zero reusable `special education`, `special services`, `student services`, `504`, or procedural-safeguards paths.',
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
          {
            sample_name: 'Jefferson School District 251 blank challenge shell',
            source_url: 'https://www.jeffersonsd251.org/',
            final_url: 'https://www.jeffersonsd251.org/',
            verification_status: 'blocked',
            source_type: 'challenge_shell',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official district root still returned a blank Incapsula-style shell with no reusable title, headings, or substantive education text.',
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

  const updatedStateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

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
          completenessPct: 83,
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
    state: 'idaho',
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_live_roots: 6,
    live_homepage_roots_without_role_bearing_links: 5,
    live_sitemaps_without_role_bearing_urls: 4,
    challenge_shell_roots: 1,
    reviewed_exact_leaf_count: 13,
    result: 'source_final_for_current_exact_district_root_packet',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedStateReport);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return {
    classification: updatedSummary.classification,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    batch: BATCH_NAME,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch349IdahoLiveRootLeafFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
