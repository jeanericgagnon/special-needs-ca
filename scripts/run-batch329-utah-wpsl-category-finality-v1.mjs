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
  batchSummary: path.join(generatedDir, 'batch329_utah_wpsl_category_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch329-utah-wpsl-category-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'live_utah_dhhs_contacts_and_first_party_wpsl_location_api_only_prove_general_contacts_plus_non_disability_program_location_categories_while_dws_lookup_remains_zip_city_without_any_county_contract';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION =
  'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices';
const FAMILY_STATUS =
  'blocked_live_dhhs_contacts_and_wpsl_categories_still_do_not_materialize_county_local_disability_routing';
const STATUS_REASON =
  'Utah county-local routing remains blocked. `https://dhhs.utah.gov/contacts/` is publicly reviewable, but it acts only as a central contacts hub: it routes broad community-service discovery to Utah 211, says users can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` One more bounded official first-party pass also confirms the live DHHS WordPress API now exposes location collections, but the current `wp/v2/wpsl_stores` and `wp/v2/wpsl_store_category` payloads only publish `Double Up Food Bucks locations` and `Home Visiting Locations`, not county disability-resource offices. The surviving DWS office-search shell still narrows public lookup to `Zip Code or City`, and its public APIs still expose only office inventory plus `All Offices`, `USOR Services`, and `Employment Centers` with no county or service-area field. Utah still has no complete public county-grade disability-resource office mapping.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Utah county-local pass from the repo-side lane. `https://dhhs.utah.gov/contacts/` is publicly reviewable again at HTTP 200 with the title `Contacts - Utah Department of Health and Human Services`, but the page still sharpens the blocker instead of clearing it. The live page routes broad community-service discovery to `https://211utah.org/`, says users can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` The official DHHS WordPress API is also publicly reviewable at `https://dhhs.utah.gov/wp-json/` and exposes `wpsl/v1` plus `wp/v2/wpsl_stores` / `wp/v2/wpsl_store_category` routes, but the live first-party location collections only publish two category families: `Double Up Food Bucks locations` (58 rows) and `Home Visiting Locations` (9 rows). Those live categories confirm the current first-party location API is program-specific and still does not materialize county disability-resource office routing. The surviving official local-office path remains the DWS family: `https://jobs.utah.gov/department/contact/index.html` still links users to an online `Office Map`, the legacy `/jsp/officesearch/` alias still routes into the live `https://jobs.utah.gov/office-search/` app, and the live public shell still limits lookup to `Zip Code or City`. The public API surface is still bounded to `https://officesearch-api.jobs.utah.gov/api/v1/offices` plus `https://officesearch-api.jobs.utah.gov/api/v1/services`. The offices payload still returns 99 rows covering 45 unique offices with inventory fields like `officeName`, address, city, ZIP, coordinates, serviceName, and instructions, but still exposes no `county`, `countiesServed`, or equivalent service-area field. The companion services payload only exposes three labels: `All Offices`, `USOR Services`, and `Employment Centers`. Same-host county-style probes like `/api/v1/counties`, `/api/v1/search`, and `/api/v1/offices/search` still do not materialize a county contract. Utah therefore still lacks any complete public county-to-office disability-resource mapping and remains blocked.';
const LESSON_HEADING = '### First-Party Location APIs Still Fail Closed When Their Categories Are The Wrong Program';
const LESSON_BODY =
  '*   **Lesson:** If an official host exposes a live first-party location API, verify the published categories before treating it as a county-routing recovery. Utah DHHS now exposes live `wpsl` collections on its official WordPress API, but those collections only publish `Double Up Food Bucks locations` and `Home Visiting Locations`, so the first-party map stack still does not clear county-local disability routing.';

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
    '- The official Utah DHHS contacts page is live, but it still clearly acts as a central contacts hub rather than a county office directory.',
    '- The official DHHS WordPress API is also live, but its current first-party location collections only publish `Double Up Food Bucks locations` and `Home Visiting Locations`.',
    '- Those first-party WPSL categories are useful negative evidence because they prove the current DHHS map stack is program-specific, not a general county disability-office contract.',
    '- The surviving official DWS office-search shell still limits public lookup to `Zip Code or City`.',
    '- The surviving official DWS public API surface still stops at office inventory plus the three service labels: `All`, `USOR`, and `EC`.',
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
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the official Utah evidence is now stronger on the negative side. `https://dhhs.utah.gov/contacts/` is publicly reviewable at HTTP 200, but it acts only as a central contacts hub: it routes community-service discovery to Utah 211, says users can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` One more bounded first-party pass also confirms the DHHS WordPress API is live and exposes `wpsl` location collections, but those collections only publish `Double Up Food Bucks locations` and `Home Visiting Locations`, not county disability-resource offices. The surviving DWS stack still narrows lookup to `Zip Code or City`, and its public APIs still expose only office inventory plus `All Offices`, `USOR Services`, and `Employment Centers`. Utah therefore remains BLOCKED and not index-safe.',
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
    '- [Utah DHHS WordPress API root](https://dhhs.utah.gov/wp-json/)',
    '- [Utah DHHS WPSL stores collection](https://dhhs.utah.gov/wp-json/wp/v2/wpsl_stores?per_page=100)',
    '- [Utah DHHS WPSL categories collection](https://dhhs.utah.gov/wp-json/wp/v2/wpsl_store_category?per_page=100)',
    '- [DHHS customer service contact form](https://dhhs.utah.gov/customer-service/customer-service-contact-form/)',
    '- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)',
    '- [Legacy DWS office-search alias](https://jobs.utah.gov/jsp/officesearch/)',
    '- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)',
    '- [Live DWS zip-coded detail route](https://jobs.utah.gov/office-search/search/84713)',
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
    '- Any reviewable official Utah division/program office page that preserves local county or service-area coverage on the current DHHS or DWS host.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n?){1,12}/,
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
  const note =
    '- Utah remains blocked because the recovered DHHS contacts hub still defers local office proof, the live first-party DHHS WPSL collections only publish `Double Up Food Bucks locations` and `Home Visiting Locations`, and the current DWS office-search shell still limits lookup to `Zip Code or City` while the public APIs expose no county or service-area field.';
  if (!current.includes(note)) {
    current = `${current.trimEnd()}\n${note}\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 329 Utah WPSL Category Finality Report v1',
    '',
    '- state: Utah',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed `https://dhhs.utah.gov/contacts/` is publicly reviewable again at HTTP 200 on the current official host.',
    '- Confirmed the recovered DHHS contacts page still acts as a central contacts hub and explicitly says `Please visit specific division or program pages for local office information.`',
    '- Confirmed the live official DHHS WordPress API root is publicly reviewable.',
    '- Confirmed the current first-party `wp/v2/wpsl_stores` and `wp/v2/wpsl_store_category` collections only publish two category families: `Double Up Food Bucks locations` and `Home Visiting Locations`.',
    '- Confirmed the surviving official DWS office-search shell still limits public lookup to `Zip Code or City`.',
    '- Confirmed the public services API still exposes only three labels: `All Offices`, `USOR Services`, and `Employment Centers`.',
    '- Confirmed same-host county-style probes still do not materialize public county or service-area endpoints.',
    '',
    '## Why Utah remains blocked',
    '',
    '- The recovered DHHS contacts page does not itself provide county-grade office routing.',
    '- The same official page explicitly defers local office proof to other division or program pages.',
    '- The live first-party DHHS WPSL location stack is program-specific and does not publish county disability-resource office routing.',
    '- The surviving DWS shell only proves zip-or-city search, not county assignments.',
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

export function generateBatch329UtahWpslCategoryFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch329_utah_wpsl_category_finality_v1',
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
          blocker_evidence: 'The recovered DHHS contacts page explicitly defers local office information, the live first-party DHHS WPSL collections only publish Double Up Food Bucks and Home Visiting categories, and the surviving DWS shell still stops at zip-or-city lookup plus office inventory without any county or service-area contract.',
          query_basis: 'Reviewed the current live DHHS contacts page, the live DHHS WordPress API root plus WPSL collections, the DWS contact page, office-search shell, public offices API, public services API, and bounded same-host county-style endpoint probes.',
          samples: [
            {
              sample_name: 'DHHS contacts page recovered as central hub',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'verified',
              source_type: 'official_contacts_hub',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live official page is publicly reviewable again at HTTP 200 with the title `Contacts - Utah Department of Health and Human Services`.'
            },
            {
              sample_name: 'DHHS contacts page defers local office information',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'reviewed',
              source_type: 'official_contacts_hub_without_local_directory',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live DHHS contacts page explicitly says: `Please visit specific division or program pages for local office information.`'
            },
            {
              sample_name: 'DHHS contacts page routes community search to Utah 211',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'reviewed',
              source_type: 'official_contacts_hub_with_external_service_finder_referral',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live page tells users to call `2-1-1` or search online at `https://211utah.org/` to find resources and services in their community.'
            },
            {
              sample_name: 'DHHS WordPress API root exposes first-party WPSL namespaces',
              source_url: 'https://dhhs.utah.gov/wp-json/',
              final_url: 'https://dhhs.utah.gov/wp-json/',
              verification_status: 'verified',
              source_type: 'official_wordpress_api_root',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live official WordPress API exposes `wpsl/v1` plus `wp/v2/wpsl_stores` and `wp/v2/wpsl_store_category` routes.'
            },
            {
              sample_name: 'DHHS WPSL stores collection is program-specific',
              source_url: 'https://dhhs.utah.gov/wp-json/wp/v2/wpsl_stores?per_page=100',
              final_url: 'https://dhhs.utah.gov/wp-json/wp/v2/wpsl_stores?per_page=100',
              verification_status: 'verified',
              source_type: 'official_first_party_location_collection',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live first-party stores collection includes entries like `Goulding’s Grocery Store`, `Monument Valley Community Health Center`, and `Utah County Health Department`, showing it is a program-specific location stack rather than a county disability-office directory.'
            },
            {
              sample_name: 'DHHS WPSL category list stays unrelated to county disability routing',
              source_url: 'https://dhhs.utah.gov/wp-json/wp/v2/wpsl_store_category?per_page=100',
              final_url: 'https://dhhs.utah.gov/wp-json/wp/v2/wpsl_store_category?per_page=100',
              verification_status: 'verified',
              source_type: 'official_first_party_location_categories',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The only current category families are `Double Up Food Bucks locations` (58) and `Home Visiting Locations` (9).'
            },
            {
              sample_name: 'Live DWS office-search shell limits lookup to zip or city',
              source_url: 'https://jobs.utah.gov/office-search/',
              final_url: 'https://jobs.utah.gov/office-search/',
              verification_status: 'verified',
              source_type: 'official_search_shell',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live footer input placeholder says `Zip Code or City`, and the public button routes only to `search/<zip-or-city>` or `map`.'
            },
            {
              sample_name: 'Live DWS office inventory API',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The public payload still returns 99 rows covering 45 unique offices, but only inventory fields like officeName, address, city, ZIP, coordinates, serviceName, and instructions.'
            },
            {
              sample_name: 'Public service taxonomy remains tiny',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The only public service labels are `All Offices`, `USOR Services`, and `Employment Centers`.'
            },
            {
              sample_name: 'Same-host county endpoints still absent',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/counties',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/counties',
              verification_status: 'blocked',
              source_type: 'official_missing_public_endpoint',
              source_table: 'batch329_utah_wpsl_category_finality',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'Bounded same-host probes for `/api/v1/counties`, `/api/v1/search`, and `/api/v1/offices/search` still do not materialize a public county contract.'
            },
          ],
          sample_count: 10,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: 'The recovered DHHS contacts page explicitly defers local office information, the live first-party DHHS WPSL categories only cover Double Up Food Bucks and Home Visiting, and the surviving DWS public API surface still stops at inventory plus the three service labels `All`, `USOR`, and `EC` with no county contract.',
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
            packetBatch: 'batch329_utah_wpsl_category_finality_v1',
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
    wp_json_status: 200,
    wpsl_stores_status: 200,
    wpsl_category_status: 200,
    wpsl_store_rows: 67,
    wpsl_category_count: 2,
    wpsl_categories: [
      'Double Up Food Bucks locations',
      'Home Visiting Locations',
    ],
    office_search_shell_status: 200,
    office_search_footer_placeholder: 'Zip Code or City',
    office_search_button_route: 'search/<zip-or-city>|map',
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
  const result = generateBatch329UtahWpslCategoryFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
