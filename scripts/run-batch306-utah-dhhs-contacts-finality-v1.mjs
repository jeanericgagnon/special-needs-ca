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
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch306_utah_dhhs_contacts_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch306-utah-dhhs-contacts-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_usbe_district_lea_directory_clears_education_but_utah_dhhs_contacts_county_map_text_and_live_dws_office_stack_still_fail_to_expose_county_service_area_contract';
const FAILURE_CODE =
  'utah_dhhs_contacts_county_map_text_and_live_dws_office_stack_still_fail_to_expose_county_service_area_contract';
const NEXT_ACTION =
  'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_counties_to_local_disability_resource_offices';
const FAMILY_STATUS =
  'blocked_utah_contacts_map_text_plus_dws_city_zip_contract_without_county_assignment';
const STATUS_REASON =
  'The live official Utah Schools Directory still clears education, but Utah county-local routing remains blocked even after one more bounded official check on the live Utah DHHS contacts surface. `https://dhhs.utah.gov/contacts/` now explicitly says users can find services by clicking on a county in the map below or by using the search bar to find services by type, but the public reviewed text still does not expose county-to-office rows, county-to-disability-office assignments, or any reusable local-office contract; the same page also tells users to visit specific division or program pages for local office information. That leaves the DWS office-search stack as the closest live local-office lane, and it still only exposes a city/ZIP-oriented bundle contract plus office inventory rows without county or counties-served fields. Utah therefore still has no public county-grade disability-resource office contract.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Utah county-local pass focused on the live DHHS contacts surface plus the already-reviewed DWS office-search contract. The official `https://dhhs.utah.gov/contacts/` page explicitly says users can find services by clicking on a county in the map below or using the search bar to find services by type, but the same reviewed public text still exposes no county-by-county office rows, no county-to-disability-office assignments, and no reusable local-office export or leaf set; it also says `Please visit specific division or program pages for local office information.` That means the page is still a statewide contact shell, not a county-grade office contract. The live DWS office-search lane remains the closest reviewed local-office stack, but it still only exposes a first-party bundle that filters by `city` and `zipCode`, a public `/api/v1/offices` payload with office inventory fields only, a public `/api/v1/services` payload with service classes only, and no county or counties-served field. Utah therefore still has no reviewable official county-to-office routing contract for county-local disability resources.';

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
    '- The live DHHS contacts page is useful only as a statewide shell: it mentions a county-click service map and search-by-type workflow, but the reviewed public text still does not expose county-to-office rows, county-to-disability-office assignments, or a reusable local-office export.',
    '- The same DHHS contacts page also tells users to visit specific division or program pages for local office information, which confirms it is not itself the county-grade local-office contract.',
    '- The DWS office-search lane remains the closest reviewed local-office stack, but it still only exposes a city/ZIP-oriented bundle contract and office inventory rows without county or counties-served fields.',
    '- Utah therefore still lacks a public county-to-office disability-resource contract and remains BLOCKED / not index-safe.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');

  const focusBlock = [
    '## Current Focus State: Utah',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, but one more bounded official review on `https://dhhs.utah.gov/contacts/` confirms Utah still does not expose a county-grade disability-office contract. The reviewed official contacts page says users can find services by clicking on a county in the map below or by using the search bar to find services by type, but the public text still does not expose county-by-county office rows, county-to-disability-office assignments, or a reusable local-office export; it also tells users to visit specific division or program pages for local office information. The DWS office-search lane remains the closest reviewed local-office stack, but it still only exposes a city/ZIP-oriented first-party bundle plus office inventory rows without county or counties-served fields. Utah therefore remains BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any public Utah successor directory, export, or leaf set that explicitly maps counties to local DWS, DHHS, or disability-resource offices.',
    '- Any reviewed first-party page behind the DHHS county-click service map that actually materializes county-local disability office assignments.',
    '- Any public office API field or companion endpoint that adds `county`, `countiesServed`, or equivalent service-area assignments to the current Utah office inventory.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)',
    '- [Utah DHHS Contacts](https://dhhs.utah.gov/contacts/)',
    '- [Utah DHHS Customer Service](https://dhhs.utah.gov/customer-service/)',
    '- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)',
    '- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)',
    '- [Legacy DWS office-search alias](https://jobs.utah.gov/jsp/officesearch/)',
    '- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)',
    '- [Live DWS bundle entrypoint](https://jobs.utah.gov/office-search/main-NUCK4XJI.js)',
    '- [Live DWS bundle imported chunk](https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js)',
    '- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)',
    '- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)',
    '- [Exact office-services route](https://officesearch-api.jobs.utah.gov/api/v1/office-services)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public county-click child route or export behind the official DHHS contacts map that materializes county-local disability office assignments.',
    '- Any public companion API or downloadable artifact on `officesearch-api.jobs.utah.gov` that adds county or service-area assignments to the current office records.',
    '- Any official Utah successor local-office directory that explicitly names counties served instead of only office city or ZIP.',
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
      '3. Florida',
      '4. Alaska',
      '5. South Carolina',
      '6. North Carolina',
      '7. New York',
      '8. Oklahoma',
      '9. Oregon',
      '10. Ohio',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const oldNeedle = '- Utah county-local routing is now explicitly sharpened to the live DWS bundle contract itself: the public page only wires `/api/v1/offices`, `/api/v1/services`, and a still-broken `/api/v1/office-services` route, the search logic is city/ZIP-only plus nearest-office geocoding, the payload still lacks county/service-area fields, and the county remainder is still explicit at Daggett, Morgan, and Rich.';
  const newNeedle = '- Utah county-local routing is now explicitly sharpened past the statewide shells: the DHHS contacts page mentions a county-click service map but still exposes no county office assignments and tells users to visit division/program pages for local office information, while the DWS office-search stack remains city/ZIP-only and still lacks county/service-area fields.';
  if (current.includes(oldNeedle)) {
    current = current.replace(oldNeedle, newNeedle);
  } else if (!current.includes(newNeedle)) {
    current = `${current.trimEnd()}\n- Utah county-local routing is now explicitly sharpened past the statewide shells: the DHHS contacts page mentions a county-click service map but still exposes no county office assignments and tells users to visit division/program pages for local office information, while the DWS office-search stack remains city/ZIP-only and still lacks county/service-area fields.\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 306 Utah DHHS Contacts Finality Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the official Utah DHHS contacts page explicitly says users can find services by clicking on a county in the map below or by using the search bar to find services by type.',
    '- Confirmed the reviewed public contacts text still does not expose county-by-county office rows, county-to-disability-office assignments, or a reusable local-office export.',
    '- Confirmed the same DHHS contacts page tells users to visit specific division or program pages for local office information.',
    '- Confirmed the already-reviewed DWS office-search lane remains city/ZIP oriented and still lacks county/service-area fields.',
    '',
    '## Why Utah remains blocked',
    '',
    '- The official DHHS contacts surface is still a statewide navigation shell rather than a county-grade disability-office contract.',
    '- The closest reviewed local-office stack remains the DWS office-search system, and its public contract still does not assign counties to offices.',
    '- No reviewed official Utah surface currently exposes a reusable county-to-office disability-resource mapping.',
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

export function generateBatch306UtahDhhsContactsFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
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
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The reviewed DHHS contacts shell mentions a county-click service map but still exposes no county office assignments and explicitly defers local office details to division/program pages; the DWS office-search contract still lacks county/service-area fields.',
          query_basis: 'Reviewed the live official Utah DHHS contacts shell alongside the already-reviewed DWS office-search bundle and public office API.',
          samples: [
            {
              sample_name: 'Official DHHS contacts page points to county-click services map',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'verified',
              source_type: 'official_contacts_shell',
              source_table: 'batch306_utah_dhhs_contacts_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The reviewed page says users can find services by clicking on a county in the map below or by using the search bar to find services by type.'
            },
            {
              sample_name: 'Official DHHS contacts page still defers local office information',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'verified',
              source_type: 'official_contacts_shell',
              source_table: 'batch306_utah_dhhs_contacts_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The same page says: Please visit specific division or program pages for local office information.'
            },
            ...(row.samples || []).filter((sample) => sample.source_url !== 'https://dhhs.utah.gov/contacts/'),
          ],
          sample_count: Math.max((row.samples || []).filter((sample) => sample.source_url !== 'https://dhhs.utah.gov/contacts/').length + 2, row.sample_count || 0),
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: 'The reviewed DHHS contacts shell mentions a county-click service map but still exposes no county office assignments and explicitly defers local office details to division/program pages; the DWS office-search contract still lacks county/service-area fields.',
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
            packetBatch: 'batch306_utah_dhhs_contacts_finality_v1',
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

  const batchSummary = {
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    official_contacts_page: 'https://dhhs.utah.gov/contacts/',
    contacts_page_signals: [
      'county-click service map mentioned',
      'search by type mentioned',
      'local office information deferred to division/program pages',
    ],
    surviving_local_stack: 'https://jobs.utah.gov/office-search/',
    surviving_local_stack_limits: [
      'city search only',
      'zip search only',
      'no county field',
      'no counties-served field',
    ],
    next_action: NEXT_ACTION,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch306UtahDhhsContactsFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
