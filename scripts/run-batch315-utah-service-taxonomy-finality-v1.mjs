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
  batchSummary: path.join(generatedDir, 'batch315_utah_service_taxonomy_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch315-utah-service-taxonomy-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'utah_dhhs_contacts_cloudflare_403_and_live_dws_public_api_surface_still_stops_at_inventory_and_three_service_labels_without_any_county_contract';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION =
  'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices';
const FAMILY_STATUS =
  'blocked_utah_dhhs_cloudflare_plus_dws_inventory_and_service_taxonomy_without_county_contract';
const STATUS_REASON =
  'Utah county-local routing remains blocked in the current repo-side lane. `https://dhhs.utah.gov/contacts/` now serves a Cloudflare `403 Attention Required` shell instead of a reviewable public county-contact surface. The surviving official local-office lane is still the DWS office stack: `jobs.utah.gov/department/contact/index.html` still points users to an `Office Map`, the redirected `jobs.utah.gov/office-search/` shell is still live, `https://officesearch-api.jobs.utah.gov/api/v1/offices` still returns office inventory rows, and `https://officesearch-api.jobs.utah.gov/api/v1/services` exposes only the three public service labels `All`, `USOR`, and `EC`. But that official public API surface still exposes no `county`, `countiesServed`, or equivalent service-area contract, and same-host county-style endpoints still do not materialize. Utah therefore still has no complete public county-grade disability-resource office contract.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Utah county-local pass from the repo-side lane. `https://dhhs.utah.gov/contacts/` now returns HTTP 403 with a Cloudflare `Attention Required` shell, so the former DHHS contacts text is no longer reviewable as a live county-contact source in this lane. The surviving official local-office path remains the DWS family: `https://jobs.utah.gov/department/contact/index.html` still links users to an online `Office Map`, the legacy `/jsp/officesearch/` alias still routes into the live `https://jobs.utah.gov/office-search/` app, and the public API surface is still bounded to `https://officesearch-api.jobs.utah.gov/api/v1/offices` plus `https://officesearch-api.jobs.utah.gov/api/v1/services`. The offices payload still returns 99 rows covering 45 unique offices with inventory fields like `officeName`, address, city, ZIP, coordinates, serviceName, and instructions, but still exposes no `county`, `countiesServed`, or equivalent service-area field. The companion services payload only exposes three labels: `All Offices`, `USOR Services`, and `Employment Centers`. Same-host county-style probes like `/api/v1/counties`, `/api/v1/search`, and `/api/v1/offices/search` still do not materialize a county contract. A bounded payload audit still finds only two unique county-like office labels in the public inventory: `Emery County (Castle Dale)` and `South County (Taylorsville)`. Those facts still do not provide a complete 29-county mapping or reusable county-to-office contract, so Utah remains blocked.';
const LESSON_HEADING = '### Tiny Public Service Taxonomies Still Do Not Create County Routing';
const LESSON_BODY =
  '*   **Lesson:** If an official office-search API only exposes inventory rows plus a tiny public service taxonomy like `All`, `USOR`, and `EC`, do not treat that as county-grade routing. Utah’s live DWS surface kept both `/api/v1/offices` and `/api/v1/services` public, but with no county field, no service-area field, and no live county endpoint, the state still lacked a reusable 29-county disability-resource contract.';

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
    '- The former DHHS contacts surface is no longer reviewable in the repo-side lane because it now serves a Cloudflare 403 challenge shell.',
    '- The surviving official local-office lane is still the DWS office stack, but its public API surface is still bounded to office inventory plus three service labels: `All`, `USOR`, and `EC`.',
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
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, but the current repo-side lane now sees `https://dhhs.utah.gov/contacts/` as a Cloudflare 403 challenge rather than a reviewable public county-contact page. The surviving official Utah office lane is still the DWS stack: `jobs.utah.gov/department/contact/index.html` still points to an `Office Map`, the redirected `jobs.utah.gov/office-search/` shell is still live, `https://officesearch-api.jobs.utah.gov/api/v1/offices` still returns office inventory rows, and `https://officesearch-api.jobs.utah.gov/api/v1/services` only exposes the three public labels `All`, `USOR`, and `EC`. No public county endpoint or service-area field materializes on the same host. Utah therefore remains BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any public Utah successor directory, export, or leaf set that explicitly maps all 29 counties to local DWS, DHHS, or disability-resource offices.',
    '- Any reviewable DHHS successor child route that materializes county-local disability office assignments without challenge gating.',
    '- Any public office API field or companion endpoint that adds `county`, `countiesServed`, or equivalent service-area assignments to the current Utah office inventory.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)',
    '- [Utah DHHS Contacts](https://dhhs.utah.gov/contacts/)',
    '- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)',
    '- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)',
    '- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)',
    '- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)',
    '- [Missing county endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/counties)',
    '- [Missing search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/search)',
    '- [Missing office-search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/offices/search)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public Utah successor leaf or export that materially maps counties to local offices rather than just publishing office inventory.',
    '- Any public companion API artifact that adds `county` or service-area assignments to the current DWS office inventory.',
    '- Any reviewable official DHHS local-office surface that becomes available without Cloudflare challenge gating.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[\s\S]*$/,
    [
      '## Next State Order After Utah',
      '',
      '1. Kansas',
      '2. Nebraska',
      '3. Florida',
      '4. Alaska',
      '5. New York',
      '6. Oklahoma',
      '7. Oregon',
      '8. Ohio',
      '9. Minnesota',
      '10. Maine',
      '',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const oldNeedles = [
    '- Utah county-local routing is now explicitly sharpened to the current live repo-side contract: `dhhs.utah.gov/contacts/` serves a Cloudflare 403 challenge, while the surviving DWS office stack still exposes only inventory rows and a few sparse county-like office labels without a complete 29-county service-area contract.',
  ];
  const newNeedle = '- Utah county-local routing is now explicitly sharpened to the full live public API surface: `dhhs.utah.gov/contacts/` serves a Cloudflare 403 challenge, while the surviving DWS stack still stops at office inventory plus a three-label service taxonomy (`All`, `USOR`, `EC`) with no public county endpoint or county-service-area contract.';
  for (const oldNeedle of oldNeedles) {
    if (current.includes(oldNeedle)) current = current.replace(oldNeedle, newNeedle);
  }
  if (!current.includes(newNeedle)) {
    current = `${current.trimEnd()}\n${newNeedle}\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 315 Utah Service Taxonomy Finality v1',
    '',
    '- state: Utah',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the current repo-side lane still sees `https://dhhs.utah.gov/contacts/` as a Cloudflare `403 Attention Required` shell.',
    '- Confirmed the surviving official local-office stack is still bounded to the DWS `office-search` app plus `offices` and `services` API routes.',
    '- Confirmed the public services API only exposes three labels: `All Offices`, `USOR Services`, and `Employment Centers`.',
    '- Confirmed same-host county-style probes still do not materialize public county or service-area endpoints.',
    '- Confirmed the public offices payload still exposes only sparse county-like office labels rather than a complete 29-county contract.',
    '',
    '## Why Utah remains blocked',
    '',
    '- The former DHHS local-office lead is currently challenge-gated in the repo-side lane.',
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

export function generateBatch315UtahServiceTaxonomyFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch315_utah_service_taxonomy_finality_v1',
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
          blocker_evidence: 'The DHHS contacts root now serves a Cloudflare 403 challenge, and the surviving DWS public API surface still stops at office inventory plus three service labels without any county or service-area contract.',
          query_basis: 'Reviewed the current DHHS contacts root, DWS contact page, office-search shell, public offices API, public services API, and bounded same-host county-style endpoint probes.',
          samples: [
            {
              sample_name: 'DHHS contacts root now challenge-gated',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'blocked',
              source_type: 'official_challenge_shell',
              source_table: 'batch315_utah_service_taxonomy_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The current repo-side request returns HTTP 403 with a Cloudflare `Attention Required` shell on the official DHHS contacts host.'
            },
            {
              sample_name: 'Older DWS contact page still points to Office Map',
              source_url: 'https://jobs.utah.gov/department/contact/index.html',
              final_url: 'https://jobs.utah.gov/department/contact/index.html',
              verification_status: 'verified',
              source_type: 'official_contact_leaf',
              source_table: 'batch315_utah_service_taxonomy_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official page still says: To find the Workforce Services office nearest you, visit our online Office Map.'
            },
            {
              sample_name: 'Live DWS office inventory API',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch315_utah_service_taxonomy_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public payload still returns 99 rows covering 45 unique offices, but only inventory fields like officeName, address, city, ZIP, coordinates, serviceName, and instructions.'
            },
            {
              sample_name: 'Public service taxonomy remains tiny',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch315_utah_service_taxonomy_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The only public service labels are `All Offices`, `USOR Services`, and `Employment Centers`.'
            },
            {
              sample_name: 'Same-host county endpoints still absent',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/counties',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/counties',
              verification_status: 'blocked',
              source_type: 'official_missing_public_endpoint',
              source_table: 'batch315_utah_service_taxonomy_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Bounded same-host probes for `/api/v1/counties`, `/api/v1/search`, and `/api/v1/offices/search` do not materialize a public county contract.'
            },
          ],
          sample_count: 5,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: 'The DHHS contacts root now serves a Cloudflare 403 challenge, and the surviving DWS public API surface still stops at inventory plus the three service labels `All`, `USOR`, and `EC` with no county contract.',
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
            packetBatch: 'batch315_utah_service_taxonomy_finality_v1',
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
    dhhs_contacts_status: 403,
    dhhs_contacts_shell: 'cloudflare_attention_required',
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
    unique_county_like_office_labels: 2,
    county_like_labels: [
      'Emery County (Castle Dale)',
      'South County (Taylorsville)',
    ],
    next_action: NEXT_ACTION,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch315UtahServiceTaxonomyFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
