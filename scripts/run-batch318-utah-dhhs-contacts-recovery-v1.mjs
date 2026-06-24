import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'utah_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'utah_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'utah_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'utah_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'utah_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'utah-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch318_utah_dhhs_contacts_recovery_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch318-utah-dhhs-contacts-recovery-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'live_utah_dhhs_contacts_page_recovers_but_explicitly_defers_local_office_info_while_surviving_dws_public_api_still_lacks_any_county_contract';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION =
  'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices';
const FAMILY_STATUS =
  'blocked_live_dhhs_contacts_defers_local_offices_and_dws_inventory_still_lacks_county_contract';
const STATUS_REASON =
  'Utah county-local routing remains blocked in the current repo-side lane, but the official evidence has shifted. `https://dhhs.utah.gov/contacts/` is publicly reviewable again and now clearly acts as a central contacts hub, not a county-office directory: it links Utah 211 for community services, tells users they can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` The surviving official local-office lane is still the DWS office stack: `jobs.utah.gov/department/contact/index.html` still points users to an `Office Map`, `https://officesearch-api.jobs.utah.gov/api/v1/offices` still returns office inventory rows, and `https://officesearch-api.jobs.utah.gov/api/v1/services` still exposes only the three public service labels `All`, `USOR`, and `EC`. But that official public API surface still exposes no `county`, `countiesServed`, or equivalent service-area contract, and same-host county-style endpoints still do not materialize. Utah therefore still has no complete public county-grade disability-resource office contract.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Utah county-local pass from the repo-side lane. `https://dhhs.utah.gov/contacts/` is publicly reviewable again at HTTP 200 with the title `Contacts - Utah Department of Health and Human Services`, but the page now sharpens the blocker instead of clearing it. The live page routes broad community-service discovery to `https://211utah.org/`, says users can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` That means the recovered DHHS contacts page is a central contacts hub, not a county-to-office disability-resource contract. The surviving official local-office path remains the DWS family: `https://jobs.utah.gov/department/contact/index.html` still links users to an online `Office Map`, the legacy `/jsp/officesearch/` alias still routes into the live `https://jobs.utah.gov/office-search/` app, and the public API surface is still bounded to `https://officesearch-api.jobs.utah.gov/api/v1/offices` plus `https://officesearch-api.jobs.utah.gov/api/v1/services`. The offices payload still returns 99 rows covering 45 unique offices with inventory fields like `officeName`, address, city, ZIP, coordinates, serviceName, and instructions, but still exposes no `county`, `countiesServed`, or equivalent service-area field. The companion services payload only exposes three labels: `All Offices`, `USOR Services`, and `Employment Centers`. Same-host county-style probes like `/api/v1/counties`, `/api/v1/search`, and `/api/v1/offices/search` still do not materialize a county contract. Utah therefore still lacks any complete public county-to-office disability-resource mapping and remains blocked.';
const LESSON_HEADING = '### Recovered Official Contact Hubs Still Fail If They Explicitly Defer Local Office Proof';
const LESSON_BODY =
  '*   **Lesson:** If a formerly blocked official contacts page comes back live, re-check it before preserving the old shell blocker, but do not upgrade it unless it actually carries county-grade routing. Utah DHHS `contacts/` recovered to HTTP 200, yet it still acted only as a central contacts hub: it routed community discovery to Utah 211 and explicitly told users to visit division or program pages for local office information, so the county-local family stayed blocked.';

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

function replaceLineByPrefix(text, prefix, replacement) {
  const lines = text.split('\n');
  let replaced = false;
  const next = lines.map((line) => {
    if (!replaced && line.startsWith(prefix)) {
      replaced = true;
      return replacement;
    }
    return line;
  });
  return replaced ? next.join('\n') : `${text.trimEnd()}\n${replacement}\n`;
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Utah California-Grade Audit Report v2',
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
    '- Utah still keeps the education repair from the live Utah Schools Directory.',
    '- Utah county-local routing remains the only critical blocker.',
    '- The official Utah DHHS contacts page is live again, but it now clearly acts as a central contacts hub rather than a county office directory.',
    '- The recovered DHHS page explicitly sends broad community-service discovery to Utah 211 and tells users to visit specific division or program pages for local office information.',
    '- The surviving official local-office lane is still the DWS office stack, but its public API surface still stops at office inventory plus the three service labels: `All`, `USOR`, and `EC`.',
    '- No same-host county endpoint, county field, or service-area field materializes on the public Utah office stack.',
    '- Utah therefore still lacks a complete public county-to-office disability-resource mapping and remains BLOCKED / not index-safe.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current
    .split('\n')
    .map((line) => (line.startsWith('- Utah: `') ? `- Utah: \`${PRIMARY_GAP_REASON}\`` : line))
    .join('\n');

  const focusBlock = [
    '## Current Focus State: Utah',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the official Utah evidence has shifted again: `https://dhhs.utah.gov/contacts/` is publicly reviewable at HTTP 200, but it now clearly acts only as a central contacts hub. The page routes community-service discovery to Utah 211, says users can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` The surviving official local-office lane is still the DWS stack: `jobs.utah.gov/department/contact/index.html` still points to an `Office Map`, the redirected `jobs.utah.gov/office-search/` shell is still live, the public office API still returns office inventory rows, and the public services API still exposes only `All`, `USOR`, and `EC`. No public county endpoint or service-area field materializes on the same host. Utah therefore remains BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any public Utah successor directory, export, or leaf set that explicitly maps all 29 counties to local DWS, DHHS, or disability-resource offices.',
    '- Any reviewable Utah division or program page that actually materializes county-local office assignments instead of only central contact information.',
    '- Any public office API field or companion endpoint that adds `county`, `countiesServed`, or equivalent service-area assignments to the current Utah office inventory.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)',
    '- [Utah DHHS Contacts](https://dhhs.utah.gov/contacts/)',
    '- [DHHS customer service contact form](https://dhhs.utah.gov/customer-service/customer-service-contact-form/)',
    '- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)',
    '- [Legacy DWS office-search alias](https://jobs.utah.gov/jsp/officesearch/)',
    '- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)',
    '- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)',
    '- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)',
    '- [Missing county endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/counties)',
    '- [Missing search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/search)',
    '- [Missing office-search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/offices/search)',
    '- [Utah DHHS WordPress API root](https://dhhs.utah.gov/wp-json/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public Utah successor leaf or export that materially maps counties to local offices rather than just publishing office inventory.',
    '- Any public companion API artifact that adds `county` or service-area assignments to the current DWS office inventory.',
    '- Any reviewable official Utah division/program office page that preserves local county or service-area coverage on the current DHHS host.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n){1,12}/,
    [
      '## Next State Order After Utah',
      '',
      '1. Kansas',
      '2. Nebraska',
      '3. Nevada',
      '4. Florida',
      '5. Alaska',
      '6. South Carolina',
      '7. North Carolina',
      '8. New York',
      '9. Oklahoma',
      '10. Oregon',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  current = replaceLineByPrefix(
    current,
    '- Utah county-local routing is now explicitly sharpened',
    '- Utah county-local routing is now explicitly sharpened to a recovered DHHS contacts hub plus the surviving DWS office API: the official contacts page is live again but explicitly defers local office proof to division/program pages and Utah 211, while the DWS stack still stops at office inventory plus a three-label service taxonomy (`All`, `USOR`, `EC`) with no public county endpoint or county-service-area contract.'
  );
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 318 Utah DHHS Contacts Recovery Report v1',
    '',
    '- state: Utah',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed `https://dhhs.utah.gov/contacts/` is publicly reviewable again at HTTP 200 on the current official host.',
    '- Confirmed the recovered DHHS contacts page still acts as a central contacts hub and explicitly says `Please visit specific division or program pages for local office information.`',
    '- Confirmed the same live DHHS page routes broad community-service discovery to Utah 211 rather than exposing a county-to-office disability directory on the page itself.',
    '- Confirmed the surviving official local-office stack is still bounded to the DWS `office-search` app plus `offices` and `services` API routes.',
    '- Confirmed the public services API still exposes only three labels: `All Offices`, `USOR Services`, and `Employment Centers`.',
    '- Confirmed same-host county-style probes still do not materialize public county or service-area endpoints.',
    '',
    '## Why Utah remains blocked',
    '',
    '- The recovered DHHS contacts page does not itself provide county-grade office routing.',
    '- The same official page explicitly defers local office proof to other division or program pages.',
    '- The surviving DWS public API surface still stops at inventory plus service taxonomy.',
    '- No same-host county endpoint, county field, or service-area field materializes on the official Utah office stack.',
    '',
    '## Exact blocker',
    '',
    `- ${batchSummary.failure_code}`,
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch318UtahDhhsContactsRecoveryV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch318_utah_dhhs_contacts_recovery_v1',
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'county_local_disability_resources'
        ? { ...blocker, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
        : blocker
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'legacy_state_grade',
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The recovered DHHS contacts page explicitly defers local office information, and the surviving DWS public API surface still stops at office inventory plus three service labels without any county or service-area contract.',
          query_basis: 'Reviewed the current live DHHS contacts page, the DWS contact page, office-search shell, public offices API, public services API, and bounded same-host county-style endpoint probes.',
          samples: [
            {
              sample_name: 'DHHS contacts page recovered as central hub',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'verified',
              source_type: 'official_contacts_hub',
              source_table: 'batch318_utah_dhhs_contacts_recovery',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live official page is publicly reviewable again at HTTP 200 with the title `Contacts - Utah Department of Health and Human Services`.'
            },
            {
              sample_name: 'DHHS contacts page defers local office information',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'reviewed',
              source_type: 'official_contacts_hub_without_local_directory',
              source_table: 'batch318_utah_dhhs_contacts_recovery',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live DHHS contacts page explicitly says: `Please visit specific division or program pages for local office information.`'
            },
            {
              sample_name: 'DHHS contacts page routes community search to Utah 211',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'reviewed',
              source_type: 'official_contacts_hub_with_external_service_finder_referral',
              source_table: 'batch318_utah_dhhs_contacts_recovery',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live page tells users to call `2-1-1` or search online at `https://211utah.org/` to find resources and services in their community.'
            },
            {
              sample_name: 'Live DWS office inventory API',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch318_utah_dhhs_contacts_recovery',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The public payload still returns 99 rows covering 45 unique offices, but only inventory fields like officeName, address, city, ZIP, coordinates, serviceName, and instructions.'
            },
            {
              sample_name: 'Public service taxonomy remains tiny',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch318_utah_dhhs_contacts_recovery',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The only public service labels are `All Offices`, `USOR Services`, and `Employment Centers`.'
            },
            {
              sample_name: 'Same-host county endpoints still absent',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/counties',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/counties',
              verification_status: 'blocked',
              source_type: 'official_missing_public_endpoint',
              source_table: 'batch318_utah_dhhs_contacts_recovery',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'Bounded same-host probes for `/api/v1/counties`, `/api/v1/search`, and `/api/v1/offices/search` still do not materialize a public county contract.'
            },
          ],
          sample_count: 6,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: 'The recovered DHHS contacts page explicitly defers local office information, and the surviving DWS public API surface still stops at inventory plus the three service labels `All`, `USOR`, and `EC` with no county contract.',
        }
      : row
  ));

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'utah'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'utah'
        ? {
            ...row,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: FAMILY_STATUS,
            },
            packetBatch: 'batch318_utah_dhhs_contacts_recovery_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  updateHandoff();
  updateAllStateReport();
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    dhhs_contacts_status: 200,
    dhhs_contacts_title: 'Contacts - Utah Department of Health and Human Services',
    dhhs_local_office_deferral_present: true,
    dhhs_utah_211_referral_present: true,
    offices_api_status: 200,
    services_api_status: 200,
    services_api_labels: [
      'All Offices',
      'USOR Services',
      'Employment Centers',
    ],
    county_endpoint_status: 404,
    search_endpoint_status: 404,
    office_search_endpoint_status: 404,
    office_rows: 99,
    unique_offices: 45,
    next_action: NEXT_ACTION,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch318UtahDhhsContactsRecoveryV1();
  console.log(JSON.stringify(result, null, 2));
}
