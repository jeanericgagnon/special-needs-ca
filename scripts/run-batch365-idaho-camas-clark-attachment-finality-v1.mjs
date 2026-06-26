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
  summary: path.join(generatedDir, 'batch365_idaho_camas_clark_attachment_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch365-idaho-camas-clark-attachment-finality-report-v1.md'),
};

const BATCH_NAME = 'batch365_idaho_camas_clark_attachment_finality_v1';
const PRIMARY_GAP_REASON =
  'remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing';
const DISTRICT_STATUS =
  'blocked_remaining_camas_and_clark_surfaces_only_materialize_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_after_shoshone_recovery';
const FAILURE_CODE =
  'remaining_camas_and_clark_surfaces_materialize_contact_board_roster_title_ix_or_general_education_notice_leaves_but_zero_role_bearing_special_education_or_student_services_routing';
const NEXT_ACTION =
  'continue_exact_district_leaf_expansion_only_when_camas_or_clark_publish_role_bearing_special_education_special_services_student_services_504_child_find_or_procedural_safeguards_leaves_with_local_contact';
const DISTRICT_REASON =
  'Reviewed 2026-06-25 one more bounded official Idaho district pass on the residual two-district remainder and tightened both weak-lead lanes. Camas still only materializes a district-owned `Contact Information` leaf with district address and phone, and a fresh same-host link scan on both the root and contact page still surfaces no district-owned `special`, `504`, `student-services`, `child-find`, or procedural-safeguards leaf at all. The only additional non-root artifact still reachable from the reviewed Camas lane is the same district-linked Google Doc, and it still resolves to a board-of-trustees roster rather than special-education, student-services, 504, Child Find, or procedural-safeguards routing. Clark still materially exposes reviewed district-owned `Contact Us`, `Title IX`, `Parent Notification of General Education Instruction`, and `Parent Resources` leaves, but a fresh same-host link scan on the root and Parent Resources leaf still surfaces no role-bearing district-owned special-education or student-services URL. The parent-notification page links district-hosted PDFs whose filenames and prior bounded binary inspection confirmed the same general-education intervention notice lane. The Parent Resources page also links district-hosted `Idaho Child Find` PDFs, but bounded review still only confirms image-only flyer artifacts with no extractable Clark-, Dubois-, phone-, screening-, or district-specific special-education routing evidence. Idaho therefore remains blocked, but the residual education remainder is now sharper than generic wrong-role leaves: the surviving Camas and Clark artifacts are real and public, yet they are still the wrong role or too thin to serve as local special-education routing proof.';
const DISTRICT_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Idaho district-root checks on `https://www.camascountyschools.org/`, `https://www.camascountyschools.org/contact-information`, the district-linked Google Doc exported from `https://docs.google.com/document/d/1OHWebOtQk9Wvwy8zMd5eFYwub5xPQ7Pg_nnMT20hOOA/export?format=txt`, `https://www.clarkcountyschools161.org/`, `https://www.clarkcountyschools161.org/about-us/contact-us-ccsd`, `https://www.clarkcountyschools161.org/administration/title-ix`, `https://www.clarkcountyschools161.org/about-us/parent-notification-of-general-education-instruction`, `https://www.clarkcountyschools161.org/parent-resources`, and the district-hosted PDF attachments linked from those Clark pages. The Camas root stayed live and the Contact Information page still only preserved district address and phone; a fresh same-host href scan across those reviewed Camas pages surfaced no district-owned `special`, `504`, `student-services`, `child-find`, or procedural-safeguards leaf at all. The district-linked Google Doc still exported as a board-of-trustees roster with zone names and trustee names, not special-education or student-services routing. Clark stayed live and still exposed exact district-owned `Contact Us`, `Title IX`, `Parent Notification of General Education Instruction`, and `Parent Resources` leaves. A fresh same-host href scan across the Clark root and Parent Resources page likewise surfaced no district-owned role-bearing `special-education`, `special-services`, `student-services`, or procedural-safeguards URL. The parent-notification page linked district-hosted PDFs whose filenames and prior bounded binary inspection confirmed the same general-education intervention notice lane. The Parent Resources page linked district-hosted `Idaho Child Find` flyers, but bounded review still only confirms image-only PDF artifacts titled `Child Find Flyer 2025-2026 English` and `Child Find Flyer 2025-2026 Spanish` without extractable Clark-, Dubois-, phone-, screening-, or district-specific special-education routing evidence. Idaho therefore remains blocked because the remaining Camas and Clark surfaces are public and reviewable but still the wrong role or too thin for local special-education routing.';
const LESSON_HEADING =
  '### District-Linked Attachments Still Fail If They Resolve To Board Rosters Or General-Education Notices';
const LESSON_BODY =
  '*   **Lesson:** If a remaining district contact or notice page links a same-host or district-linked attachment, inspect it once before assuming it opens a new local-routing lane. Idaho Camas linked a Google Doc that resolved only to a board-of-trustees roster, and Clark linked district-hosted PDFs that stayed within a general-education intervention notice lane, so neither attachment upgraded the special-education blocker.';
const CHILD_FIND_LESSON_HEADING =
  '### District-Hosted Child Find Flyers Still Need Local Routing Evidence';
const CHILD_FIND_LESSON_BODY =
  '*   **Lesson:** A district-hosted file with a promising title like `Child Find` still does not clear a local education-routing blocker unless the reviewed artifact preserves district-specific routing or contact evidence. Idaho Clark linked official `Idaho Child Find` PDFs from its Parent Resources page, but bounded inspection only confirmed image-only flyer artifacts with no extractable Clark-, Dubois-, phone-, or special-education routing terms.';
const COUNTY_LOCAL_REASON =
  'Reviewed 2026-06-25 one more bounded live Idaho DHW confirmation on the official office root plus the existing office-leaf packet. The public root at https://healthandwelfare.idaho.gov/offices is still live with title `Find a Service Location` and still preserves exact city office cards like Caldwell Office in HTML, but it still exposes no public county terms, county-served fields, or service-area contract. A fresh bounded content scan on the live root did surface office-inventory labels such as `Boise Office - Westgate Building` and `Grangeville Office - Camas Resource Center`, which confirms the page is richer office inventory rather than a dead shell. But those office-name and resource-center labels still do not bind counties to offices, and the exact office leaf https://healthandwelfare.idaho.gov/dhw/caldwell-office is still live with title `Caldwell Office`, confirming that the packet is grounded in real reviewable DHW office leaves. Idaho county-local routing therefore still splits cleanly into 17 safe county-to-exact-office replacements plus one Canyon split that still rejects Nampa as SWITC-only, while 27 counties remain blocked because the public DHW stack still exposes no truthful county-to-office contract for them.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  let next = current;
  let changed = false;
  if (!next.includes(LESSON_HEADING)) {
    next = `${next.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
    changed = true;
  }
  if (!next.includes(CHILD_FIND_LESSON_HEADING)) {
    next = `${next.trimEnd()}\n\n${CHILD_FIND_LESSON_HEADING}\n${CHILD_FIND_LESSON_BODY}\n`;
    changed = true;
  }
  if (changed) fs.writeFileSync(filePath, next);
  return changed;
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
    '- Education is narrower again: the residual remainder is now specifically Camas and Clark wrong-role contact, board-roster, Title IX, general-education-notice, and image-only Child Find flyer lanes rather than any unknown district root.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- Idaho remains blocked'));
  const next = '- Idaho remains blocked after a final Camas-and-Clark attachment pass: Camas only exposes contact routing plus a board-roster Google Doc, and Clark only exposes Contact Us, Title IX, general-education notice attachments, and image-only Child Find flyers without local special-education routing proof.';
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
    '`district_or_county_education_routing` remains the highest-priority Idaho blocker, but the residual district remainder is now fully reduced to Camas and Clark wrong-role artifacts. Jefferson still clears from district-owned special-education / special-services / section-504 / student-services leaves. Oneida still clears from the district-owned Child Find PDF. Fremont still clears from the public official Apptegy events API. Shoshone still clears from the district-owned `Early Childhood Find` page. Camas only exposes a district-owned `Contact Information` leaf with address and phone, and the one linked document on that page exports as a board-of-trustees roster rather than a local special-education route. Clark exposes exact district-owned `Contact Us`, `Title IX`, `Parent Notification of General Education Instruction`, and `Parent Resources` leaves. The parent-notification page links district-hosted PDFs that remain part of a general-education intervention notice lane, and the Parent Resources page links official `Idaho Child Find` PDFs that still do not preserve extractable local Clark routing or contact evidence. Idaho remains BLOCKED because the remaining district-owned surfaces are real but still the wrong role or too thin for local special-education routing.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official district-owned special-education, special-services, student-services, 504, Child Find, or procedural-safeguards leaf on Camas or Clark that also preserves local contact or routing evidence.',
    '- Any district-owned PDF, handbook, or notice on those two hosts that explicitly preserves special-education routing plus named district contact information rather than only a board roster, general-education notice, or image-only Child Find flyer.',
    '- Any official Idaho DHW county-to-office crosswalk, service-area table, export, PDF, ArcGIS layer, or API that ties counties to named office leaves.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Camas root](https://www.camascountyschools.org/)',
    '- [Camas Contact Information](https://www.camascountyschools.org/contact-information)',
    '- [Camas linked Google Doc export](https://docs.google.com/document/d/1OHWebOtQk9Wvwy8zMd5eFYwub5xPQ7Pg_nnMT20hOOA/export?format=txt)',
    '- [Clark root](https://www.clarkcountyschools161.org/)',
    '- [Clark Contact Us](https://www.clarkcountyschools161.org/about-us/contact-us-ccsd)',
    '- [Clark Title IX](https://www.clarkcountyschools161.org/administration/title-ix)',
    '- [Clark Parent Notification of General Education Instruction](https://www.clarkcountyschools161.org/about-us/parent-notification-of-general-education-instruction)',
    '- [Clark Parent Resources](https://www.clarkcountyschools161.org/parent-resources)',
    '- [Oneida Child Find PDF](https://5il.co/26a73)',
    '- [Fremont district events API](https://thrillshare-cmsv2.services.thrillshare.com/api/v4/o/12771/cms/events)',
    '- [Shoshone Early Childhood Find](https://shoshonesd.org/early-childhood-find/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current district-owned special-education, student-services, 504, procedural-safeguards, or Child Find leaf for Camas or Clark.',
    '- Any current district-owned Camas or Clark PDF/handbook that names special-education routing or district special-ed contact information.',
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
    '# Batch 365 Idaho Camas Clark Attachment Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the residual Idaho education blocker by proving the last Camas and Clark attachments and Child Find flyers are still insufficient local-routing artifacts',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch365IdahoCamasClarkAttachmentFinalityV1() {
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
    final_blockers: summary.final_blockers.map((blocker) => {
      if (blocker.family === 'district_or_county_education_routing') {
        return {
          family: 'district_or_county_education_routing',
          severity: 'critical',
          failure_code: FAILURE_CODE,
          evidence: DISTRICT_EVIDENCE,
          next_action: NEXT_ACTION,
        };
      }
      if (blocker.family === 'county_local_disability_resources') {
        return {
          ...blocker,
          evidence: COUNTY_LOCAL_REASON,
        };
      }
      return blocker;
    }),
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: DISTRICT_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: DISTRICT_STATUS, status_reason: DISTRICT_REASON }
      : row.family === 'county_local_disability_resources'
        ? { ...row, status_reason: 'The Idaho DHW office lane remains an explicit split, not a generic local-office blocker. The live official office root still exposes no county terms or county-served fields, so it does not prove county-grade routing by itself. But the existing deterministic office packet safely materializes 17 clean county-to-exact-office leaf matches plus one Canyon split, while 27 counties remain blocked because no public county-to-office contract exists.' }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: DISTRICT_EVIDENCE, next_action: NEXT_ACTION }
      : row.family === 'county_local_disability_resources'
        ? { ...row, evidence: COUNTY_LOCAL_REASON }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      const samples = [...row.samples];
      replaceSample(samples, 'Idaho DHW office root', {
        sample_name: 'Idaho DHW office root',
        source_url: 'https://healthandwelfare.idaho.gov/offices',
        final_url: 'https://healthandwelfare.idaho.gov/offices',
        verification_status: 'verified',
        source_type: 'official_office_root_without_county_terms',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-25T00:00:00.000Z',
        evidence_snippet: 'The live DHW office root is titled Find a Service Location and still preserves exact city office cards like Caldwell Office, but it still exposes no public county terms or county-served fields in reviewable HTML.',
      });
      replaceSample(samples, 'Idaho DHW Caldwell Office', {
        sample_name: 'Idaho DHW Caldwell Office',
        source_url: 'https://healthandwelfare.idaho.gov/dhw/caldwell-office',
        final_url: 'https://healthandwelfare.idaho.gov/dhw/caldwell-office',
        verification_status: 'verified',
        source_type: 'official_exact_office_leaf',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-25T00:00:00.000Z',
        evidence_snippet: 'Caldwell Office is still a live exact DHW office leaf and remains the safe county-office replacement inside the 17 clean exact replacements set.',
      });
      replaceSample(samples, 'Idaho office packet clean replacements', {
        sample_name: 'Idaho office packet clean replacements',
        source_url: 'data/generated/idaho_county_local_disability_resources_leaf_authoring_packet_v1.json',
        final_url: 'data/generated/idaho_county_local_disability_resources_leaf_authoring_packet_v1.json',
        verification_status: 'verified',
        source_type: 'reviewed_packet_with_17_clean_exact_replacements',
        source_table: 'generated_artifact',
        fetched_at: '2026-06-25T00:00:00.000Z',
        evidence_snippet: 'The deterministic Idaho county-local packet still materializes 17 clean exact county-to-office replacements plus an explicit Canyon split and 27 unresolved legacy counties.',
      });
      replaceSample(samples, 'Nampa mention resolves only to SWITC', {
        sample_name: 'Nampa mention resolves only to SWITC',
        source_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
        final_url: 'https://healthandwelfare.idaho.gov/offices?page=2',
        verification_status: 'blocked',
        source_type: 'official_city_match_wrong_role',
        source_table: 'batch182_idaho_office_leaf_materialization',
        fetched_at: '2026-06-25T00:00:00.000Z',
        evidence_snippet: 'The only public Nampa mention still resolves to Southwest Idaho Treatment Center (SWITC), not to a county office or benefits office leaf.',
      });
      return {
        ...row,
        blocker_evidence: COUNTY_LOCAL_REASON,
        samples,
      };
    }
    if (row.family !== 'district_or_county_education_routing') return row;
    const samples = [...row.samples];
    replaceSample(samples, 'Camas Contact Information leaf', {
      sample_name: 'Camas Contact Information leaf',
      source_url: 'https://www.camascountyschools.org/contact-information',
      final_url: 'https://www.camascountyschools.org/contact-information',
      verification_status: 'reviewed',
      source_type: 'official_contact_leaf_wrong_role_for_special_education_routing',
      source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Contact Information page only preserves Camas district address and phone; it does not expose special-education, student-services, 504, Child Find, or procedural-safeguards routing.',
    });
    replaceSample(samples, 'Camas linked Google Doc board roster', {
      sample_name: 'Camas linked Google Doc board roster',
      source_url: 'https://docs.google.com/document/d/1OHWebOtQk9Wvwy8zMd5eFYwub5xPQ7Pg_nnMT20hOOA/export?format=txt',
      final_url: 'https://docs.google.com/document/d/1OHWebOtQk9Wvwy8zMd5eFYwub5xPQ7Pg_nnMT20hOOA/export?format=txt',
      verification_status: 'reviewed',
      source_type: 'district_linked_attachment_wrong_role_board_roster',
      source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The linked document exports only board-of-trustees zones and trustee names, not special-education, student-services, 504, Child Find, or procedural-safeguards routing.',
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
    replaceSample(samples, 'Clark Parent Resources leaf', {
      sample_name: 'Clark Parent Resources leaf',
      source_url: 'https://www.clarkcountyschools161.org/parent-resources',
      final_url: 'https://www.clarkcountyschools161.org/parent-resources',
      verification_status: 'reviewed',
      source_type: 'official_parent_resources_leaf_with_child_find_links_but_no_local_special_education_routing',
      source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-owned Parent Resources page links Idaho Child Find English and Spanish PDFs, but the page itself still preserves no district special-education contact, student-services contact, or local routing language.',
    });
    replaceSample(samples, 'Clark district-hosted parent-notification PDF attachments', {
      sample_name: 'Clark district-hosted parent-notification PDF attachments',
      source_url: 'https://resources.finalsite.net/images/v1731011152/clarkcountyschools161org/ax3e7hf8qqxwse8gdgde/ParentNotificationofGeneralEducationInstructionInterventionFINAL10302024PDF.pdf',
      final_url: 'https://resources.finalsite.net/images/v1731011152/clarkcountyschools161org/ax3e7hf8qqxwse8gdgde/ParentNotificationofGeneralEducationInstructionInterventionFINAL10302024PDF.pdf',
      verification_status: 'reviewed',
      source_type: 'district_hosted_attachment_wrong_role_general_education_notice',
      source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-hosted attachments sit behind the Parent Notification of General Education Instruction page and remain part of the same general-education intervention notice lane, not a local special-education or student-services routing contract.',
    });
    replaceSample(samples, 'Clark district-hosted Child Find flyers', {
      sample_name: 'Clark district-hosted Child Find flyers',
      source_url: 'https://resources.finalsite.net/images/v1761760861/clarkcountyschools161org/okrhbefejmucrlv1evy1/ChildFindFlyer2025-2026English.pdf',
      final_url: 'https://resources.finalsite.net/images/v1761760861/clarkcountyschools161org/okrhbefejmucrlv1evy1/ChildFindFlyer2025-2026English.pdf',
      verification_status: 'reviewed',
      source_type: 'district_hosted_child_find_flyers_without_extractable_local_routing',
      source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The district-hosted Child Find flyer PDFs linked from Parent Resources are live, but bounded inspection only confirms image-only flyer artifacts with no extractable Clark-, Dubois-, phone-, screening-, or district-specific special-education routing evidence.',
    });

    return {
      ...row,
      family_status: DISTRICT_STATUS,
      sample_count: 41,
      blocker_code: FAILURE_CODE,
      blocker_evidence: DISTRICT_EVIDENCE,
      query_basis: 'Reviewed the residual Camas and Clark official district leaves again, plus the one district-linked Camas document, the district-hosted Clark parent-notification attachments, and the district-hosted Clark Child Find flyers, while preserving Jefferson, Oneida, Fremont, and Shoshone as positive local routing recoveries.',
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: DISTRICT_EVIDENCE }
      : row.family === 'county_local_disability_resources'
        ? { ...row, evidence: COUNTY_LOCAL_REASON }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
          completeness_pct: 87,
        }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'idaho'
        ? {
            ...row,
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
            completenessPct: 87,
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: DISTRICT_STATUS,
            },
          }
        : row
    )),
  };

  const batchSummary = {
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    camas_contact_leaf_live: true,
    camas_google_doc_live: true,
    camas_google_doc_is_board_roster: true,
    clark_contact_leaf_live: true,
    clark_title_ix_leaf_live: true,
    clark_parent_notification_leaf_live: true,
    clark_parent_notification_pdf_live: true,
    clark_parent_notification_pdf_is_general_education_notice_lane: true,
    clark_parent_resources_leaf_live: true,
    clark_child_find_flyers_live: true,
    clark_child_find_flyers_image_only_or_no_local_contact: true,
    remaining_wrong_role_districts: 2,
    county_crosswalk_found: false,
    result: 'camas_and_clark_attachments_and_child_find_flyers_reviewed_but_still_insufficient_for_local_special_education_routing',
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

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch365IdahoCamasClarkAttachmentFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
