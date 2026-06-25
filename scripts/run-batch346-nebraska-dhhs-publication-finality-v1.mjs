import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nebraska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nebraska_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'nebraska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nebraska_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'nebraska_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch346_nebraska_dhhs_publication_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch346-nebraska-dhhs-publication-finality-report-v1.md'),
};

const BATCH = 'batch346_nebraska_dhhs_publication_finality_v1';
const PRIMARY_GAP_REASON =
  'official_nebraska_dhhs_site_has_no_public_sitemap_or_search_recovery_and_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf';
const NEXT_ACTION =
  'hold_blocked_until_official_service_area_table_county_assignment_artifact_new_public_county_leaf_or_searchable_dhhs_publication_index_is_published';
const FAMILY_STATUS =
  'blocked_official_dhhs_publication_layer_and_portal_search_both_fail_to_materialize_county_assignment_contract';
const STATUS_REASON =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass and confirmed both official publication lanes still fail closed. `https://dhhs.ne.gov/robots.txt` is live, but `https://dhhs.ne.gov/sitemap.xml` returns 404, the live SharePoint wrapper still loops `Public Assistance Offices` back to the same locator stack, and bounded DHHS SharePoint search API queries for office-routing terms return only 500/400 errors instead of a searchable public publication index. The official GIS portal search still returns only the same locator trilogy for `Public Assistance Offices`: one web map item, one feature service, and one map service, all with no county-assignment table, directory leaf, or alternate public item. Nebraska therefore still lacks a public statewide county-to-office assignment contract.';
const EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass across both the DHHS publication layer and the ArcGIS publication stack. `https://dhhs.ne.gov/robots.txt` is live, but `https://dhhs.ne.gov/sitemap.xml` returns HTTP 404, so there is still no first-party sitemap publication index for office leaves. The live SharePoint HTML for `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx`, `https://dhhs.ne.gov/Pages/Contact-DHHS.aspx`, and `https://dhhs.ne.gov/Pages/economic-assistance.aspx` still loops users only to the same office wrapper and sibling economic-assistance pages, while bounded SharePoint search API queries such as `_api/search/query?querytext=\'Public Assistance Offices\'` return only HTTP 500/400 errors rather than any searchable county office leaves. On the ArcGIS side, `https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json` still returns only three public items with the same office-location title and owner family: the web map item `4bdbf8e8703743b0b2ff290f98737825`, the feature service item `cf70cb74fcc94634afc89f0a22a7d06f`, and the map service item `90a19933cfc444be836f51d15e2e23ec`. No table item, CSV, county assignment app item, or county directory leaf appears anywhere in either official publication lane. Nebraska therefore still has no public county-assignment item anywhere on the current official stack.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Nebraska California-Grade Truth Refresh v2',
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
    '- Nebraska remains BLOCKED and index_safe=false.',
    '- district_or_county_education_routing remains verified_county_grade through the official county-selectable NDE directory host.',
    '- county_local_disability_resources remains the only critical blocker.',
    '- The DHHS publication layer still exposes no recoverable county office index: robots is live, sitemap is 404, and SharePoint search does not yield a public office leaf.',
    '- The official GIS portal search still returns only the same office-locator trilogy: one web map, one feature service, and one map service.',
    '- Nebraska therefore still lacks a public statewide county-to-office assignment contract.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current
    .split('\n')
    .map((line) => (line.startsWith('- Nebraska: `') ? `- Nebraska: \`${PRIMARY_GAP_REASON}\`` : line))
    .join('\n');

  const focusBlock = [
    '## Current Focus State: Nebraska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The official publication layer now fails closed just as clearly as the ArcGIS layer: `https://dhhs.ne.gov/robots.txt` is live, but `https://dhhs.ne.gov/sitemap.xml` returns 404, the live SharePoint wrapper still loops `Public Assistance Offices` back to the same locator stack, and bounded DHHS SharePoint search API queries do not produce a searchable county office leaf. The official public GIS portal search still returns only the same office-locator trilogy, namely one web map item, one feature service, and one map service, all with the same Nebraska DHHS office-location title and no county-assignment table, county directory leaf, or alternate routing artifact. Nebraska therefore remains BLOCKED and not index-safe because there is still no public statewide county-to-office assignment bridge anywhere on the current official stack.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Nebraska DHHS county-to-office assignment table, export, or service-area artifact that maps all 93 counties to public assistance offices.',
    '- Any public ArcGIS table, related layer, popup expression, output schema, or config datasource on the current office stack that explicitly enumerates served counties, assigned counties, or coverage areas for each office.',
    '- Any exact first-party DHHS county office page or county directory leaf that publishes county coverage instead of only contact-card inventory or a loop back to the current wrapper page.',
    '- Any searchable first-party DHHS sitemap or search publication surface that actually materializes county office leaves rather than only the current wrapper and portal stack.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Nebraska DHHS robots.txt](https://dhhs.ne.gov/robots.txt)',
    '- [Nebraska DHHS sitemap.xml](https://dhhs.ne.gov/sitemap.xml)',
    '- [Nebraska DHHS Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)',
    '- [Nebraska DHHS Economic Assistance](https://dhhs.ne.gov/Pages/economic-assistance.aspx)',
    '- [Nebraska DHHS Contact DHHS](https://dhhs.ne.gov/Pages/Contact-DHHS.aspx)',
    '- [Official GIS portal search: Public Assistance Offices](https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json)',
    '- [Official GIS portal search: Public Assistance Office Location Lookup](https://gis.ne.gov/portal/sharing/rest/search?q=Public%20Assistance%20Office%20Location%20Lookup&f=json)',
    '- [ExperienceBuilder item data](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)',
    '- [ExperienceBuilder resource list](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json)',
    '- [ExperienceBuilder config resource](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json?f=json)',
    '- [Nebraska public web map item data](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json)',
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.',
    '- Any new public ArcGIS resource, web map table, config datasource, or output field that explicitly carries county assignment data rather than only office contact fields.',
    '- An exact first-party county office page or county directory leaf on `dhhs.ne.gov` that publishes county coverage instead of only wrapper-page loops or wrong-role local health department links.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n?){1,12}/,
    [
      '## Next State Order After Nebraska',
      '',
      '1. Nevada',
      '2. Florida',
      '3. Alaska',
      '4. South Carolina',
      '5. North Carolina',
      '6. New York',
      '7. Oklahoma',
      '8. Oregon',
      '9. Ohio',
      '10. Minnesota',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  const note =
    '- Nebraska remains blocked because both official publication lanes now fail closed: the DHHS site has live robots but no public sitemap or searchable county-office leaf, and the GIS portal search still returns only the same office-locator trilogy with no county-assignment table or county directory leaf.';
  const current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  fs.writeFileSync(INPUTS.allStateReport, replaceLineByPrefix(current, '- Nebraska remains blocked because', note));
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 346 Nebraska DHHS Publication Finality Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the official DHHS publication layer does not expose a public office sitemap: `robots.txt` is live, but `/sitemap.xml` returns 404.',
    '- Confirmed bounded DHHS SharePoint search API queries do not materialize a searchable county office leaf.',
    '- Confirmed the official GIS portal search still returns only three public items: one web map, one feature service, and one map service.',
    '- Confirmed no public county-assignment table, alternate directory app, county-routing leaf, or export artifact appears in either official publication lane.',
    '',
    '## Why Nebraska remains blocked',
    '',
    '- There is still no public county-assignment item anywhere on the official Nebraska office stack.',
    '- The DHHS publication layer and ArcGIS publication layer both stop at wrappers, locator infrastructure, and contact-card surfaces rather than a statewide county-to-office contract.',
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch346NebraskaDhhsPublicationFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'county_local_disability_resources'
        ? { ...blocker, failure_code: PRIMARY_GAP_REASON, evidence: EVIDENCE, next_action: NEXT_ACTION }
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
      ? { ...row, failure_code: PRIMARY_GAP_REASON, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          blocker_code: PRIMARY_GAP_REASON,
          blocker_evidence: 'The official DHHS publication layer still has live robots but no public sitemap or searchable county-office leaf, and the official GIS portal search still returns only the same office-location web map, feature service, and map service without a county-assignment artifact.',
          samples: [
            {
              sample_name: 'Nebraska DHHS robots.txt is live but sitemap.xml is 404',
              source_url: 'https://dhhs.ne.gov/robots.txt',
              final_url: 'https://dhhs.ne.gov/robots.txt',
              verification_status: 'blocked',
              source_type: 'official_sharepoint_publication_index_missing',
              source_table: 'bounded_live_nebraska_recheck',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The official DHHS host publishes robots.txt, but the first-party sitemap endpoint `https://dhhs.ne.gov/sitemap.xml` returns HTTP 404, so there is still no public sitemap index for county office leaves.',
            },
            {
              sample_name: 'DHHS SharePoint search queries fail closed',
              source_url: 'https://dhhs.ne.gov/_api/search/query?querytext=%27Public%20Assistance%20Offices%27',
              final_url: 'https://dhhs.ne.gov/_api/search/query?querytext=%27Public%20Assistance%20Offices%27',
              verification_status: 'blocked',
              source_type: 'official_sharepoint_search_failure',
              source_table: 'bounded_live_nebraska_recheck',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'Bounded official SharePoint search API queries for office-routing terms return only HTTP 500/400 responses instead of a searchable public county office leaf.',
            },
            {
              sample_name: 'Official portal search returns only locator trilogy',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json',
              verification_status: 'blocked',
              source_type: 'official_portal_search_locator_only',
              source_table: 'bounded_live_nebraska_recheck',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The official portal search still returns only one web map, one feature service, and one map service, with no county-assignment table, directory leaf, or alternate office-routing item.',
            },
            ...(row.samples || []).filter((sample) => ![
              'Nebraska DHHS robots.txt is live but sitemap.xml is 404',
              'DHHS SharePoint search queries fail closed',
              'Official portal search returns only locator trilogy',
            ].includes(sample.sample_name)),
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: PRIMARY_GAP_REASON, next_action: NEXT_ACTION, evidence: 'The official DHHS publication layer still has live robots but no public sitemap or searchable county-office leaf, and the official GIS portal search still returns only the same office-location web map, feature service, and map service without a county-assignment artifact.' }
      : row
  ));

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'nebraska'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: (allStateAudit.states || []).map((row) => (
      row.stateId === 'nebraska'
        ? {
            ...row,
            packetBatch: BATCH,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...(row.familyStatuses || {}),
              county_local_disability_resources: FAMILY_STATUS,
            },
          }
        : row
    )),
  };

  const batchSummary = {
    state: 'nebraska',
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: PRIMARY_GAP_REASON,
    robots_status: 200,
    sitemap_status: 404,
    sharepoint_search_statuses: [500, 400],
    official_portal_result_count: 3,
    official_portal_result_types: ['Web Map', 'Feature Service', 'Map Service'],
    next_action: NEXT_ACTION,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  updateHandoff();
  updateAllStateReport();

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch346NebraskaDhhsPublicationFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
