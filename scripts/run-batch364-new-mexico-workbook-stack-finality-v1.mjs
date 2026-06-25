import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-mexico_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-mexico_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-mexico_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-mexico_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-mexico_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch364_new_mexico_workbook_stack_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch364-new-mexico-workbook-stack-finality-report-v1.md'),
};

const BATCH_NAME = 'batch364_new_mexico_workbook_stack_finality_v1';
const PRIMARY_GAP_REASON =
  'official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate';
const DISTRICT_STATUS =
  'blocked_official_sharepoint_lists_and_six_public_workbooks_live_but_verified_county_crosswalk_still_missing';
const FAILURE_CODE =
  'official_webed_sharepoint_lists_and_six_public_workbooks_verified_live_but_no_county_crosswalk_or_rec_service_area_contract';
const NEXT_ACTION =
  'author_official_county_crosswalk_from_webed_directory_or_rec_contract';
const DISTRICT_REASON =
  'Reviewed 2026-06-25 one more bounded official New Mexico education directory pass on the live PED-managed SharePoint host. The official `2017 NM Schools` list is still live and REST-backed, and the public workbook stack is broader than the earlier packet captured: `NM Schools.xlsx`, `Superintendents.xlsx`, `REC Directors.xlsx`, `Elementary School Principals.xlsx`, `Middle School Principals.xlsx`, and `High School Principals.xlsx` all download successfully from the same official host. A follow-up schema and folder inventory pass also closed the remaining uncertainty on that host: the public list fields still expose district, REC, location, address, city, zip, and code columns but no county or service-area field; the public `Document Library` contains only those six workbook files; and `SitePages` contains only `Home.aspx`, `RECHome.aspx`, `How To Use This Library.aspx`, `Home1.aspx`, and `untitled_1.aspx`, with no separate county-crosswalk page. But that fuller official export stack still stops short of county-grade routing. `NM Schools.xlsx` preserves `District Name`, `District Code`, `District Type`, `Location Name`, `Location Address`, `Location City`, `State`, `Zip`, `School Level`, `Location Type`, `Location Status`, and `Location Phone Number`, but no county field. `Superintendents.xlsx` preserves district names, codes, contacts, and addresses, but no county field. `REC Directors.xlsx` preserves only REC number, director, addresses, phone, fax, and email, but no county-service-area field. The elementary, middle, and high school principal workbooks each preserve school/district/contact columns, but no county field. The public `RECHome.aspx` page is also live and still groups districts under REC headings rather than exposing counties or REC service-area labels. New Mexico education therefore remains blocked on a missing official county-to-district or county-to-REC crosswalk, not on absence of public PED directory artifacts.';
const DISTRICT_EVIDENCE =
  'Reviewed 2026-06-25 bounded official New Mexico PED SharePoint surfaces on `https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Lists/2017%20NM%20Schools/AllItems.aspx`, the public SharePoint REST inventory and field schema for that list family, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/NM%20Schools.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Superintendents.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/REC%20Directors.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Elementary%20School%20Principals.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Middle%20School%20Principals.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/High%20School%20Principals.xlsx`, and `https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx`. The official SharePoint host is genuinely live and materially useful, but every public list and workbook still omits county or REC service-area fields. The reviewed public list fields preserve district, location, address, city, zip, REC number, and code columns only. The public `Document Library` inventory closes at six workbook files and `SitePages` closes at five public pages, none of which is a county crosswalk or REC service-area contract. The `2017 NM Schools` list and `NM Schools.xlsx` expose district/location columns only; `Superintendents.xlsx` exposes district contact columns only; `REC Directors.xlsx` exposes REC number/director/address/phone only; and the principal workbooks expose district/location/contact columns only. `RECHome.aspx` still groups districts under REC headings without county labels or service-area text. New Mexico education therefore remains blocked on a missing official county-to-district or county-to-REC crosswalk, not on absence of public PED education inventory.';

const LESSON_HEADING =
  '### Live SharePoint Workbook Stacks Without County Fields Are Final Negative Evidence';
const LESSON_BODY =
  '*   **Lesson:** If a live official SharePoint directory host exposes not just one export but the full public workbook stack for schools, superintendents, REC directors, and principals, inspect the header rows before reopening local-routing discovery. New Mexico PED\'s six public workbooks were all real and current, but every one still omitted county or REC service-area fields, so the honest blocker stayed `missing county crosswalk` rather than `missing public directory`.';
const INVENTORY_LESSON_HEADING =
  '### SharePoint Folder Inventories Can Close Official Discovery Without Crawling';
const INVENTORY_LESSON_BODY =
  '*   **Lesson:** When a PED-style SharePoint host is already public, inspect both the public field schema and the public folder inventories before reopening discovery. New Mexico\'s WebED host closed cleanly at six workbook files and five site pages, and the field schemas still lacked county/service-area columns, so we could preserve the blocker without broad crawling or speculative leaf hunting.';

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
  let next = current.trimEnd();
  let changed = false;
  if (!current.includes(LESSON_HEADING)) {
    next = `${next}\n\n${LESSON_HEADING}\n${LESSON_BODY}`;
    changed = true;
  }
  if (!current.includes(INVENTORY_LESSON_HEADING)) {
    next = `${next}\n\n${INVENTORY_LESSON_HEADING}\n${INVENTORY_LESSON_BODY}`;
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, `${next}\n`);
  }
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Mexico Blocker Packets v8',
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
    '## Current education-host finality',
    '',
    '- The live official WebED host is now stronger than a single-workbook blocker: the public SharePoint list, REST inventory, REC grouping page, and six public workbooks are all reviewable on the PED-managed host.',
    '- The same host now also has a closed public inventory on disk: the `Document Library` exposes only six workbook files and `SitePages` exposes only five public pages, none of which is a county crosswalk or REC service-area contract.',
    '- That broader official stack still does not expose a county field or REC county-service-area field in any reviewed public list or workbook.',
    '- New Mexico therefore remains blocked on an absent official county crosswalk or county-labeled REC contract, not on absence of public PED directory artifacts.',
    '',
    '## Completion decision',
    '',
    '- New Mexico remains `BLOCKED` and `index_safe=false`.',
    '- County-local still clears from the current official HCA `Field Offices` page across all 33 counties.',
    '- Education remains the highest-priority blocker because the live official SharePoint directory plus six public workbooks still stop short of a county crosswalk or county-labeled REC service-area contract.',
    '- VR remains blocked on the 401 DVR host plus zero reviewed alternate official roots.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- New Mexico remains BLOCKED/index-safe=false'));
  const next = '- New Mexico remains BLOCKED/index-safe=false, and the education blocker is now tightened to the fuller official failure mode: the live PED SharePoint directory host, its REST-backed `2017 NM Schools` list, the REC grouping page, the complete six-file public workbook library, and the five public SharePoint site pages are all reviewable, but none publishes a county field or REC county-service-area contract.';
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
    '## Current Focus State: New Mexico',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is still the highest-priority New Mexico blocker, but the official failure mode is now more exhaustive than the earlier packet. The live PED-managed SharePoint host preserves the public `2017 NM Schools` list with REST-backed rows, the public `RECHome.aspx` grouping page, six public workbook exports (`NM Schools.xlsx`, `Superintendents.xlsx`, `REC Directors.xlsx`, `Elementary School Principals.xlsx`, `Middle School Principals.xlsx`, and `High School Principals.xlsx`), and a closed public folder inventory of five site pages and six workbook files. That broader official stack proves the state has a public directory lane, but every reviewed list, workbook, and public page still omits county or REC service-area fields. `NM Schools.xlsx` and the REST list preserve district/location columns only. `Superintendents.xlsx` preserves district contacts only. `REC Directors.xlsx` preserves REC contact rows only. The principal workbooks preserve school and contact columns only. `RECHome.aspx` still groups districts under REC headings without county labels or REC service-area text. New Mexico remains BLOCKED because the public official PED stack still lacks a truthful county-to-district or county-to-REC crosswalk.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official PED-managed county-to-district crosswalk, county column, county selector, or county-keyed export on the live WebED host.',
    '- Any official PED-managed REC service-area artifact that explicitly labels counties served by each REC.',
    '- Any official district-owned or REC-owned local special-education routing leaf that proves county-grade coverage without inference.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [PED SharePoint school directory home](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx)',
    '- [2017 NM Schools list](https://webed.ped.state.nm.us/sites/schooldirectory/Lists/2017%20NM%20Schools/AllItems.aspx)',
    '- [NM Schools workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/NM%20Schools.xlsx)',
    '- [Superintendents workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Superintendents.xlsx)',
    '- [REC Directors workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/REC%20Directors.xlsx)',
    '- [Elementary School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Elementary%20School%20Principals.xlsx)',
    '- [Middle School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Middle%20School%20Principals.xlsx)',
    '- [High School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/High%20School%20Principals.xlsx)',
    '- [REC home page](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx)',
    '- [Special Education Bureau page](https://webnew.ped.state.nm.us/bureaus/special-education/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any live WebED list, workbook, or site page with an explicit county column or county-keyed filter.',
    '- Any official REC service-area contract with county labels on the PED-managed host or REC-owned official hosts.',
    '- Any official district-owned local special-education or student-services leaf that can clear counties without relying on statewide PED exports.',
    '',
    '## Next State Order After New Mexico',
    '',
    '1. Arizona',
    '2. New Hampshire',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 364 New Mexico Workbook Stack Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: widened the official New Mexico PED blocker evidence from three public exports to the full six-workbook SharePoint stack plus live lists and REC page',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch364NewMexicoWorkbookStackFinalityV1() {
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
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_official_county_crosswalk_or_rec_service_area_contract',
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
    const samples = [...row.samples];
    replaceSample(samples, 'Elementary School Principals workbook', {
      sample_name: 'Elementary School Principals workbook',
      source_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Elementary%20School%20Principals.xlsx',
      final_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Elementary%20School%20Principals.xlsx',
      verification_status: 'blocked',
      source_type: 'official_public_principal_workbook_without_county_field',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: '`Elementary School Principals.xlsx` downloaded successfully and preserves principal, district, school, address, city, zip, phone, and email columns, but no county field.',
    });
    replaceSample(samples, 'Middle School Principals workbook', {
      sample_name: 'Middle School Principals workbook',
      source_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Middle%20School%20Principals.xlsx',
      final_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Middle%20School%20Principals.xlsx',
      verification_status: 'blocked',
      source_type: 'official_public_principal_workbook_without_county_field',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: '`Middle School Principals.xlsx` downloaded successfully and preserves principal, district, school, address, city, zip, phone, and email columns, but no county field.',
    });
    replaceSample(samples, 'High School Principals workbook', {
      sample_name: 'High School Principals workbook',
      source_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/High%20School%20Principals.xlsx',
      final_url: 'https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/High%20School%20Principals.xlsx',
      verification_status: 'blocked',
      source_type: 'official_public_principal_workbook_without_county_field',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: '`High School Principals.xlsx` downloaded successfully and preserves principal, district, school, address, city, zip, phone, and email columns, but no county field.',
    });
    return {
      ...row,
      family_status: DISTRICT_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: DISTRICT_EVIDENCE,
      query_basis: 'Reviewed 2026-06-25 the full official WebED SharePoint list and workbook stack for county-grade routing fields.',
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: DISTRICT_EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'new-mexico'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_official_county_crosswalk_or_rec_service_area_contract',
          repair_lane: 'repair_from_state_packet',
        }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'new-mexico'
        ? {
            ...row,
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_official_county_crosswalk_or_rec_service_area_contract',
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: DISTRICT_STATUS,
            },
          }
        : row
    )),
  };

  appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    webed_sharepoint_home_live: true,
    webed_rest_backed_school_list_live: true,
    public_workbooks_verified_live: 6,
    site_pages_verified_live: 5,
    public_workbooks_with_county_field: 0,
    public_workbooks_with_rec_service_area_field: 0,
    public_site_pages_with_county_crosswalk: 0,
    result: 'official_webed_lists_and_six_public_workbooks_live_but_no_county_crosswalk_or_rec_service_area_contract',
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
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch364NewMexicoWorkbookStackFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
