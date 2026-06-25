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
  summary: path.join(generatedDir, 'batch359_idaho_shoshone_early_childhood_find_recovery_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch359-idaho-shoshone-early-childhood-find-recovery-report-v1.md'),
};

const BATCH_NAME = 'batch359_idaho_shoshone_early_childhood_find_recovery_v1';
const PRIMARY_GAP_REASON =
  'remaining_idaho_district_roots_now_reduce_to_camas_and_clark_wrong_role_leaves_without_special_education_or_student_services_routing';
const DISTRICT_STATUS =
  'blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_title_ix_or_general_education_leaves_after_shoshone_recovery';
const FAILURE_CODE =
  'remaining_live_idaho_district_roots_materialize_contact_title_ix_or_general_education_leaves_but_zero_role_bearing_special_education_or_student_services_routing';
const NEXT_ACTION =
  'continue_exact_district_leaf_expansion_only_when_camas_or_clark_publish_role_bearing_special_education_special_services_student_services_504_or_procedural_safeguards_leaves';
const DISTRICT_REASON =
  'Reviewed 2026-06-25 one more bounded official Idaho district pass and upgraded Shoshone from exact district-owned evidence. Shoshone now exposes a public district-owned `Early Childhood Find` page that preserves pre-eligibility child screening language for resident 3 to 5-year-old children, developmental-concerns intake language, and direct district office phone routing on the official district host. That is enough to treat Shoshone as a real local Child Find routing lane rather than a generic federal-program or contact survivor. The unresolved remainder is now down to two districts. Camas still only materializes a district-owned `Contact Information` leaf with district address and phone. Clark still materially exposes three reviewed district-owned leaves, but all three stay wrong-role: `Contact Us` only lists district office staff and superintendent routing, `Title IX` only links a Title IX policy and repeats generic district accessibility language, and `Parent Notification of General Education Instruction` remains a general-education intervention notice rather than special-education or student-services routing. Idaho therefore remains blocked, but the education remainder is now down to Camas and Clark.';
const DISTRICT_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Idaho district-root checks on `https://www.camascountyschools.org/`, `https://www.camascountyschools.org/contact-information`, `https://www.clarkcountyschools161.org/`, `https://www.clarkcountyschools161.org/about-us/contact-us-ccsd`, `https://www.clarkcountyschools161.org/administration/title-ix`, `https://www.clarkcountyschools161.org/about-us/parent-notification-of-general-education-instruction`, `https://shoshonesd.org/`, `https://shoshonesd.org/early-childhood-find/`, and the previously reviewed Jefferson, Oneida, and Fremont recovery sources. Jefferson remains positively recovered from district-owned `special-education`, `special-services`, `section-504`, and `student-services` leaves. Oneida remains positively recovered from the district-owned Child Find PDF. Fremont remains positively recovered from the public official district events API. Shoshone is now positively recovered from the district-owned `Early Childhood Find` page: the live page preserves pre eligibility child screening language for resident 3 to 5-year-old children, developmental-concerns intake language, and district office phone routing on the official host family. The residual two districts now finalize as wrong-role survivors rather than unknown roots: Camas only exposes a district-owned `Contact Information` leaf with address and phone, while Clark exposes exact district-owned `Contact Us`, `Title IX`, and `Parent Notification of General Education Instruction` leaves, but no special-education or student-services routing. Idaho therefore remains blocked because the remaining district-owned leaves are still the wrong role for local special-education routing.';
const LESSON_HEADING =
  '### District-Owned Early Childhood Find Pages Can Clear Local Education Routing When They Preserve Screening Scope And District Contact';
const LESSON_BODY =
  '*   **Lesson:** If a district-owned `Early Childhood Find` page preserves pre-eligibility screening scope, age range, developmental-concern intake language, and a direct district contact path, that can be strong enough to clear local education routing even without a `special education` slug. Idaho Shoshone cleared once the district-owned Early Childhood Find page preserved 3-to-5 screening language plus district office phone routing on the official host.';

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

function replaceSample(samples, sampleName, replacement) {
  const index = samples.findIndex((sample) => sample.sample_name === sampleName);
  if (index >= 0) samples[index] = replacement;
  else samples.push(replacement);
}

function removeSample(samples, sampleName) {
  return samples.filter((sample) => sample.sample_name !== sampleName);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
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
    '- County-local remains explicitly split between the existing clean exact-office replacements and the legacy counties that still lack a public county contract.',
    '- Education is narrower again: Shoshone now clears from a district-owned Early Childhood Find page, leaving only Camas and Clark as the residual wrong-role district roots.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- Idaho remains blocked'));
  const next = '- Idaho remains blocked after Shoshone Early Childhood Find recovery: Shoshone now clears from a district-owned Early Childhood Find page with screening scope and district contact evidence, but Camas and Clark still only materialize wrong-role district leaves rather than local special-education routing.';
  return `${lines.join('\n').trimEnd()}\n${next}\n`;
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
    '`district_or_county_education_routing` remains the highest-priority Idaho blocker, but the residual district remainder is now down to two districts. Jefferson still clears from district-owned special-education / special-services / section-504 / student-services leaves. Oneida still clears from the district-owned Child Find PDF. Fremont still clears from the public official Apptegy events API. Shoshone now also clears from the district-owned `Early Childhood Find` page, which preserves pre-eligibility screening language for resident 3 to 5-year-old children, developmental-concerns intake language, and district office phone routing on the official host. The two remaining district roots still materialize only wrong-role leaves. Camas only exposes a district-owned `Contact Information` leaf with address and phone. Clark exposes exact district-owned `Contact Us`, `Title IX`, and `Parent Notification of General Education Instruction` leaves, but they only provide generic district office, compliance, or general-education intervention routing. Idaho remains BLOCKED because the remaining district-owned leaves are real but still the wrong role for local special-education routing.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official district-owned special-education, special-services, student-services, 504, procedural-safeguards, or Child Find leaf on Camas or Clark.',
    '- Any district-owned PDF, handbook, or notice on those two hosts that explicitly preserves special-education routing plus named contact information.',
    '- Any official Idaho DHW county-to-office crosswalk, service-area table, export, PDF, ArcGIS layer, or API that ties counties to named office leaves.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Camas root](https://www.camascountyschools.org/)',
    '- [Camas Contact Information](https://www.camascountyschools.org/contact-information)',
    '- [Clark root](https://www.clarkcountyschools161.org/)',
    '- [Clark Contact Us](https://www.clarkcountyschools161.org/about-us/contact-us-ccsd)',
    '- [Clark Title IX](https://www.clarkcountyschools161.org/administration/title-ix)',
    '- [Clark Parent Notification of General Education Instruction](https://www.clarkcountyschools161.org/about-us/parent-notification-of-general-education-instruction)',
    '- [Shoshone root](https://shoshonesd.org/)',
    '- [Shoshone Early Childhood Find](https://shoshonesd.org/early-childhood-find/)',
    '- [Oneida Child Find PDF](https://5il.co/26a73)',
    '- [Fremont district events API](https://thrillshare-cmsv2.services.thrillshare.com/api/v4/o/12771/cms/events)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current district-owned special-education, student-services, 504, or procedural-safeguards leaf for Camas or Clark.',
    '- Any district-owned Child Find PDF or special-ed handbook already linked from those two hosts but not yet surfaced on the homepage HTML.',
    '- Any public Idaho DHW county-to-office contract that can reduce the separate county-local blocker.',
    '',
    '## Next State Order After Idaho',
    '',
    '1. New Mexico',
    '2. Arizona',
    '3. New Hampshire',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 359 Idaho Shoshone Early Childhood Find Recovery v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: recovered Shoshone local education routing from the district-owned Early Childhood Find page and narrowed the residual blocker to Camas and Clark',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch359IdahoShoshoneEarlyChildhoodFindRecoveryV1() {
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
    completeness_pct: 87,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
    final_blockers: summary.final_blockers.map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? {
            family: 'district_or_county_education_routing',
            severity: 'critical',
            failure_code: FAILURE_CODE,
            evidence: DISTRICT_EVIDENCE,
            next_action: NEXT_ACTION,
          }
        : blocker
    )),
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: DISTRICT_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: DISTRICT_STATUS, status_reason: DISTRICT_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: DISTRICT_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    let samples = [...row.samples];
    replaceSample(samples, 'Camas Contact Information leaf', {
      sample_name: 'Camas Contact Information leaf',
      source_url: 'https://www.camascountyschools.org/contact-information',
      final_url: 'https://www.camascountyschools.org/contact-information',
      verification_status: 'reviewed',
      source_type: 'official_contact_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Contact Information page only preserves Camas district address and phone; it does not expose special-education, student-services, 504, or procedural-safeguards routing.',
    });
    replaceSample(samples, 'Clark Contact Us leaf', {
      sample_name: 'Clark Contact Us leaf',
      source_url: 'https://www.clarkcountyschools161.org/about-us/contact-us-ccsd',
      final_url: 'https://www.clarkcountyschools161.org/about-us/contact-us-ccsd',
      verification_status: 'reviewed',
      source_type: 'official_contact_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Contact Us page lists district office staff, superintendent, address, and phone, but no special-education or student-services routing.',
    });
    replaceSample(samples, 'Clark Title IX leaf', {
      sample_name: 'Clark Title IX leaf',
      source_url: 'https://www.clarkcountyschools161.org/administration/title-ix',
      final_url: 'https://www.clarkcountyschools161.org/administration/title-ix',
      verification_status: 'reviewed',
      source_type: 'official_compliance_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Title IX page only links Title IX policy and repeats generic accessibility language; it does not expose special-education, 504, or student-services routing.',
    });
    replaceSample(samples, 'Clark Parent Notification of General Education Instruction leaf', {
      sample_name: 'Clark Parent Notification of General Education Instruction leaf',
      source_url: 'https://www.clarkcountyschools161.org/about-us/parent-notification-of-general-education-instruction',
      final_url: 'https://www.clarkcountyschools161.org/about-us/parent-notification-of-general-education-instruction',
      verification_status: 'reviewed',
      source_type: 'official_general_education_notification_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned page title is `Parent Notification of General Education Instruction`; it preserves general-education intervention notice routing, not special-education, student-services, 504, or procedural-safeguards routing.',
    });
    replaceSample(samples, 'Shoshone Early Childhood Find page', {
      sample_name: 'Shoshone Early Childhood Find page',
      source_url: 'https://shoshonesd.org/early-childhood-find/',
      final_url: 'https://shoshonesd.org/early-childhood-find/',
      verification_status: 'verified',
      source_type: 'district_owned_early_childhood_find_page',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Early Childhood Find page preserves pre eligibility child screening language for resident 3 to 5-year-old children, developmental-concerns intake language, and direct district office phone routing at (208) 886-2381 on the official Shoshone host.',
    });
    samples = removeSample(samples, 'Shoshone district-office and federal-program menu');
    samples = removeSample(samples, 'Shoshone District Documents notification PDF lane');
    return {
      ...row,
      family_status: DISTRICT_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: DISTRICT_EVIDENCE,
      sample_count: samples.length,
      query_basis: 'Reviewed Camas and Clark wrong-role leaves again, then recovered Shoshone from the district-owned Early Childhood Find page while preserving Jefferson, Oneida, and Fremont as positive local routing recoveries.',
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: DISTRICT_EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? {
          ...row,
          completeness_pct: 87,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
        }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'idaho'
        ? {
            ...row,
            completenessPct: 87,
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: DISTRICT_STATUS,
            },
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
          }
        : row
    )),
  };

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: new Date().toISOString(),
    state: 'idaho',
    classification: 'BLOCKED',
    index_safe: false,
    camas_contact_leaf_live: true,
    clark_contact_leaf_live: true,
    clark_title_ix_leaf_live: true,
    clark_parent_notification_leaf_live: true,
    shoshone_early_childhood_find_live: true,
    remaining_wrong_role_districts: 2,
    recovered_districts_via_role_bearing_child_find: 1,
    lessons_updated: lessonsUpdated,
    result: 'shoshone_recovered_via_district_owned_early_childhood_find_but_camas_and_clark_still_materialize_wrong_role_leaves',
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch359IdahoShoshoneEarlyChildhoodFindRecoveryV1();
  console.log(JSON.stringify(result, null, 2));
}
