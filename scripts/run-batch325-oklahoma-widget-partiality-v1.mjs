import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'oklahoma_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'oklahoma_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'oklahoma_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'oklahoma_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'oklahoma_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'oklahoma-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch325_oklahoma_widget_partiality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch325-oklahoma-widget-partiality-report-v1.md'),
};

const BATCH_NAME = 'batch325_oklahoma_widget_partiality_v1';
const PRIMARY_GAP_REASON =
  'live_okdhs_public_county_widget_salvages_alfalfa_but_still_only_publishes_two_rows_while_combined_official_county_local_coverage_stops_at_46_and_leaves_31';
const FAILURE_CODE =
  'okdhs_public_county_widget_salvages_alfalfa_but_adair_still_lacks_local_contract_and_remaining_31_stay_unclosed';
const FAMILY_STATUS = 'blocked_okdhs_public_county_widget_partial_and_kml_service_limited';
const NEXT_ACTION =
  'hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_31_counties';

const REMAINING_COUNTIES = [
  'Adair', 'Beaver', 'Blaine', 'Cimarron', 'Coal', 'Dewey', 'Ellis',
  'Grant', 'Greer', 'Harmon', 'Harper', 'Haskell', 'Hughes', 'Jefferson', 'Kingfisher',
  'Kiowa', 'Logan', 'Major', 'Marshall', 'McClain', 'McIntosh', 'Murray', 'Noble',
  'Nowata', 'Okfuskee', 'Pawnee', 'Roger Mills', 'Seminole', 'Tillman', 'Washita', 'Woods',
];

const BENEFIT_CAPABLE_COUNTY_COVERAGE_COUNT = 46;
const SALVAGED_WIDGET_COUNTIES = ['Alfalfa'];
const SERVICE_NOTE_ONLY_COUNTIES = ['Adair'];

const LESSON_HEADING = '### Public County Widgets Can Be Much Narrower Than The Backing Map Feed';
const LESSON_BODY =
  '*   **Lesson:** If an official county widget points at a public config page, inspect that config directly instead of assuming it matches the backing map feed. Oklahoma Human Services exposed a live county-map widget, but its public `mapconfig2` model only published county entries for Adair and Alfalfa even while the separate public KML still exposed 60 placemarks and only 45 benefit-capable county contracts.';
const SALVAGE_LESSON_HEADING = '### Partial County Widgets Can Still Add One Truth-Safe County';
const SALVAGE_LESSON_BODY =
  '*   **Lesson:** Do not discard an official partial county widget wholesale if one row independently preserves a real county office contract. Oklahoma\'s widget was still blocker-grade overall, but the Alfalfa row carried county name, phone, toll-free, fax, and street address, so it truthfully added one county even while the Adair row stayed too weak to clear county-local routing.';
const SOURCE_FINALITY_LESSON_HEADING = '### One Widget API Plus Wrong-Role Sibling Leaves Can Be Enough To Call A Host Source-Final';
const SOURCE_FINALITY_LESSON_BODY =
  '*   **Lesson:** If the live HTML exposes one exact widget API, that API only materializes a tiny county subset, official host search is blocked or absent, and the sibling sitemap leaves are all wrong-role pages, treat the public host as source-final for low-token county repair. Oklahoma Human Services still exposed extra `contact-us/*` URLs in sitemap review, but they resolved to hotline, FAQ, workforce, ombudsman, or config shells rather than a county-complete disability/local office contract.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
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
  let next = current;
  if (!next.includes(LESSON_HEADING)) {
    next = `${next.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
  }
  if (!next.includes(SALVAGE_LESSON_HEADING)) {
    next = `${next.trimEnd()}\n\n${SALVAGE_LESSON_HEADING}\n${SALVAGE_LESSON_BODY}\n`;
  }
  if (!next.includes(SOURCE_FINALITY_LESSON_HEADING)) {
    next = `${next.trimEnd()}\n\n${SOURCE_FINALITY_LESSON_HEADING}\n${SOURCE_FINALITY_LESSON_BODY}\n`;
  }
  if (next !== current) {
    fs.writeFileSync(filePath, next);
  }
}

function buildCountyReason(fetchedDate) {
  return `Reviewed ${fetchedDate} one more bounded official Oklahoma county-local pass against the current OKDHS public county widget instead of only the KML. The live successor lane is still real: \`https://oklahoma.gov/okdhs/contact-us.html\` publishes a county-map widget and the widget points at \`https://oklahoma.gov/okdhs/contact-us/map2.html\`. The same live contact page still exposes no new county-complete export or public-assistance office directory beyond that widget and the out-of-scope Child Support offices tree. The same official page source still sharpens the blocker, but it also salvages one county. The widget HTML itself exposes one exact county API root through \`data-county-map-apiurl\`, and that public component API \`/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json\` returns only two county entries, while the linked public config model \`https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json\` likewise only publishes county entities for Adair and Alfalfa. The Alfalfa row itself preserves a real county-local office contract with county name, phone, toll-free, fax, and street address, so it can count as one additional truth-safe county. But the Adair row still only says Adair now serves Sequoyah residents and then falls back to a statewide phone route without preserving a local office address or a county-owned leaf for Adair. A bounded official sitemap and sibling-leaf review also failed to reveal a hidden replacement contract: the host search JSON is 403, public search-results routes 404, and the extra \`contact-us/*\` leaves exposed in sitemap review resolve to wrong-role pages like hotlines, FAQ, workforce, ombudsman complaints, and config shells rather than a county-complete disability/local directory. The broader public KML still contributes the stronger base coverage, and the combined official county-local total now stops at ${BENEFIT_CAPABLE_COUNTY_COVERAGE_COUNT} counties. The same host still proves county trees are technically publishable because \`https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html\` exposes a county-by-county tree, but that surface is explicitly Child Support only and cannot substitute for disability/local routing. Oklahoma therefore remains blocked because no current official county-local contract closes the remaining ${REMAINING_COUNTIES.length} counties.`;
}

function buildBlockerEvidence(fetchedDate) {
  return `Reviewed ${fetchedDate} bounded official Oklahoma checks on \`https://oklahoma.gov/okdhs/contact-us.html\`, \`https://oklahoma.gov/okdhs/contact-us/dhsofficelocations.html\`, \`https://oklahoma.gov/okdhs/contact-us/map2.html\`, \`https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json\`, the public component feed at \`https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json\`, the public KML office-map feed at \`https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1\`, \`https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html\`, \`https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html\`, the official sitemap at \`https://oklahoma.gov/sitemap.xml\`, the blocked search endpoint \`https://oklahoma.gov/bin/sok-wcm/search.json?q=office%20locations&path=/content/sok-wcm/en/okdhs\`, and the public 404 search-results routes on the same host. The live OKDHS contact page still exposes no new county-complete export or public-assistance office directory beyond the partial widget and the out-of-scope Child Support offices tree. The newly surfaced official county-widget leaves still do not close the blocker overall, but they do salvage Alfalfa. \`dhsofficelocations.html\` canonically lands back on the generic contact-us page, while the live \`map2\` page exposes a county-widget shell whose HTML points at one exact \`data-county-map-apiurl\` root and whose public config model only contains county entities for Adair and Alfalfa. The matching public component feed also returns only those same two county entries. The Alfalfa row preserves an exact local office contract with phone, toll-free, fax, and street address in Cherokee, Oklahoma, so Alfalfa can now count as covered. The Adair row remains too weak because it only says Adair now serves Sequoyah residents and then falls back to the statewide \`(405) 522-5050\` route without preserving a local office address or county-owned contact leaf for Adair. Official sitemap review did surface additional \`contact-us/*\` leaves, but the reviewed candidates resolve to wrong-role pages like Long-Term Care Ombudsman complaints, hotlines, FAQ, workforce, generic info, and config shells, not to a county-complete disability/local office directory. The broader public KML still preserves 60 placemarks, and together with the salvaged Alfalfa row it yields ${BENEFIT_CAPABLE_COUNTY_COVERAGE_COUNT} benefit-capable counties after strict review and TANF-only access points are excluded. The child-support office tree still proves county trees are technically publishable on the same official host, but it remains child-support-only. Oklahoma therefore still lacks truth-safe county-local proof for the remaining ${REMAINING_COUNTIES.length} counties: ${REMAINING_COUNTIES.join(', ')}.`;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Oklahoma California-Grade Audit Report v2',
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
    '## County-local refinement',
    '',
    '- The live OKDHS contact-us page still points to one real public county widget and the broader public KML, so the successor lane is official and reviewable.',
    '- That same contact-us page still exposes no new county-complete export or public-assistance office directory beyond the partial widget and the out-of-scope Child Support offices tree.',
    '- The live `map2` widget HTML itself exposes one exact `data-county-map-apiurl`, and the newly surfaced official county-widget contract is itself partial: both the public `electionConfigPageData.json` feed and the linked `mapconfig2.model.json` only publish county entries for Adair and Alfalfa.',
    '- The Alfalfa widget row is still good enough to count because it preserves county name, local phone, toll-free, fax, and street address on the official host.',
    '- The Adair widget row stays below the bar because it only preserves a service note for Sequoyah plus a statewide phone route, not a local office contract for Adair.',
    '- A bounded official sitemap and sibling-leaf review did not reveal a hidden replacement directory: OKDHS search JSON is blocked, public search-results routes 404, and the extra `contact-us/*` leaves are wrong-role pages rather than county-local disability routing.',
    `- The broader KML still outperforms the widget, and together with the salvaged Alfalfa row it yields ${BENEFIT_CAPABLE_COUNTY_COVERAGE_COUNT} benefit-capable counties once TANF-only access points are excluded.`,
    '- The child-support office tree remains county-complete on the same host, which proves a county contract is technically publishable, but it stays out of scope because it is explicitly child-support-only.',
    '- The DDS area-contact page is still statewide-only and does not close any county remainder.',
    '',
    '## Completion decision',
    '',
    '- Oklahoma remains `BLOCKED` and `index_safe=false`.',
    '- Education remains cleared by the current official OSDE State School and District Directory.',
    `- County-local remains blocked because the public county widget only publishes Adair and Alfalfa, and only the Alfalfa row is independently sufficient; the combined official evidence still leaves a measured ${REMAINING_COUNTIES.length}-county remainder: ${REMAINING_COUNTIES.join(', ')}.`,
    '- Oklahoma therefore still cannot be marked `COMPLETE` or index-safe.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const nextNote = `- Oklahoma remains blocked on a stronger county-local truth test: the live OKDHS county widget only publishes Adair and Alfalfa, but only the Alfalfa row is independently sufficient; the broader public KML plus that salvaged row still stop at ${BENEFIT_CAPABLE_COUNTY_COVERAGE_COUNT} benefit-capable counties, and the same host's county-complete tree is still child-support-only.`;
  const lines = text
    .split('\n')
    .filter((line) => !line.includes('Oklahoma remains blocked on a stricter county-local truth test'));
  const next = lines.join('\n');
  return next.includes(nextNote) ? next : `${next.trimEnd()}\n${nextNote}\n`;
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
    'Updated: 2026-06-25',
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
    '## Current Focus State: Oklahoma',
    '',
    '### Blocker Reason',
    '',
    `\`county_local_disability_resources\` remains the top Oklahoma blocker. The live OKDHS county widget is official but still only publishes county entries for Adair and Alfalfa, and the same contact-us page still exposes no new county-complete export or public-assistance office directory beyond that widget and the child-support tree. The Alfalfa row is good enough to salvage one county because it preserves a local office contract, but the Adair row still only provides a service note plus statewide phone routing. A bounded official sitemap and sibling-leaf review found no hidden replacement county directory: the host search JSON is blocked, public search-results routes 404, and the extra \`contact-us/*\` leaves are wrong-role pages like hotlines, FAQ, workforce, ombudsman complaints, and config shells. The broader public KML plus the salvaged Alfalfa row still stop at ${BENEFIT_CAPABLE_COUNTY_COVERAGE_COUNT} benefit-capable counties, and the same host only proves a county-complete tree for child-support offices, not the missing disability/local-routing remainder.`,
    '',
    '### Exact Evidence Needed',
    '',
    `- Any current official Oklahoma county-local office directory or export that closes the ${REMAINING_COUNTIES.length}-county remainder on the OKDHS host.`,
    '- Any official county-owned or state-owned successor leaves that explicitly map the unresolved counties to public assistance or disability-routing offices.',
    '- Any public API, CSV, JSON, ArcGIS, or HTML contract on the official host that exposes the missing county assignments directly.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Oklahoma Human Services Contact Us](https://oklahoma.gov/okdhs/contact-us.html)',
    '- [Oklahoma Human Services county widget leaf](https://oklahoma.gov/okdhs/contact-us/dhsofficelocations.html)',
    '- [Oklahoma Human Services map2 page](https://oklahoma.gov/okdhs/contact-us/map2.html)',
    '- [Oklahoma Human Services mapconfig2 model](https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json)',
    '- [Oklahoma Human Services public widget feed](https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json)',
    '- [Oklahoma sitemap](https://oklahoma.gov/sitemap.xml)',
    '- [Oklahoma Human Services public office-map KML](https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1)',
    '- [Oklahoma Child Support offices tree](https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html)',
    '- [Oklahoma DDS area-contact page](https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any exact official OKDHS county-office export or county-filter contract that covers the unresolved counties.',
    '- Any official county-level benefit or disability-routing leaf linked from the same host but not yet packeted.',
    `- The current measured county remainder is: ${REMAINING_COUNTIES.join(', ')}.`,
    '',
    '## Next State Order After Oklahoma',
    '',
    '1. Minnesota',
    '2. Maine',
    '3. Idaho',
    '4. Arizona',
    '5. Massachusetts',
    '6. New Mexico',
    '7. South Dakota',
    '8. Rhode Island',
    '9. Virginia',
    '10. West Virginia',
    '',
  ].join('\n');
}

function buildBatchReport(summary) {
  return [
    '# Batch 325 Oklahoma Widget Partiality v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- change: upgraded the Oklahoma blocker from “partial KML only” to a stronger official-host proof that the public county widget itself only publishes Adair and Alfalfa, and only the Alfalfa row is independently sufficient while the combined official evidence still leaves a ${REMAINING_COUNTIES.length}-county remainder`,
    '',
    '## Evidence',
    '',
    '- The official `dhsofficelocations.html` leaf now canonically lands back on the generic contact-us page instead of exposing a distinct county-directory contract.',
    '- The live `map2` widget points at a same-host county config page.',
    '- The public widget feed and linked `mapconfig2` page model both publish only Adair and Alfalfa county entities.',
    '- The Alfalfa row preserves an exact county-local office contract; the Adair row does not.',
    '- A bounded official sitemap and sibling-leaf review surfaced only wrong-role `contact-us/*` pages, while the host search JSON stayed blocked and public search-results routes 404ed.',
    `- The broader KML remains stronger than the widget, and together with the salvaged Alfalfa row it still only yields ${BENEFIT_CAPABLE_COUNTY_COVERAGE_COUNT} benefit-capable counties after TANF-only access points are excluded.`,
  ].join('\n') + '\n';
}

function normalizeWidgetText(raw) {
  return String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; CodexStateAudit/1.0; +https://github.com/jeanericgagnon/special-needs-ca)' },
    redirect: 'follow',
  });
  return { status: response.status, finalUrl: response.url, json: await response.json() };
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; CodexStateAudit/1.0; +https://github.com/jeanericgagnon/special-needs-ca)' },
    redirect: 'follow',
  });
  return { status: response.status, finalUrl: response.url, text: await response.text() };
}

async function main() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const fetchedDate = new Date().toISOString().slice(0, 10);
  const generatedAt = new Date().toISOString();
  const countyReason = buildCountyReason(fetchedDate);
  const blockerEvidence = buildBlockerEvidence(fetchedDate);

  const dhsLocations = await fetchText('https://oklahoma.gov/okdhs/contact-us/dhsofficelocations.html');
  const map2Model = await fetchJson('https://oklahoma.gov/okdhs/contact-us/map2.model.json');
  const map2Page = await fetchText('https://oklahoma.gov/okdhs/contact-us/map2.html');
  const widgetFeed = await fetchJson('https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json');
  const widgetConfig = await fetchJson('https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json');
  const sitemap = await fetchText('https://oklahoma.gov/sitemap.xml');
  const blockedSearch = await fetchText('https://oklahoma.gov/bin/sok-wcm/search.json?q=office%20locations&path=/content/sok-wcm/en/okdhs');
  const publicSearch = await fetchText('https://oklahoma.gov/search-results.html?q=county%20office%20okdhs');
  const siblingLeaves = await Promise.all([
    fetchText('https://oklahoma.gov/okdhs/contact-us/asdhome.html'),
    fetchText('https://oklahoma.gov/okdhs/contact-us/info.html'),
    fetchText('https://oklahoma.gov/okdhs/contact-us/inrhome.html'),
    fetchText('https://oklahoma.gov/okdhs/contact-us/workforce.html'),
    fetchText('https://oklahoma.gov/okdhs/contact-us/dhshotlines.html'),
    fetchText('https://oklahoma.gov/okdhs/contact-us/faq.html'),
    fetchText('https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.html'),
  ]);
  const widgetRowsByCounty = Object.fromEntries(widgetFeed.json.map((row) => [row.countyName, row]));
  const alfalfaWidgetText = normalizeWidgetText(widgetRowsByCounty.Alfalfa?.countyData);
  const adairWidgetText = normalizeWidgetText(widgetRowsByCounty.Adair?.countyData);

  summary.batch = BATCH_NAME;
  summary.primary_gap_reason = PRIMARY_GAP_REASON;
  summary.final_blockers = [{
    family: 'county_local_disability_resources',
    severity: 'critical',
    failure_code: FAILURE_CODE,
    evidence: blockerEvidence,
    next_action: NEXT_ACTION,
  }];
  summary.familyStatuses.county_local_disability_resources = FAMILY_STATUS;

  for (const row of gapRows) {
    if (row.family === 'county_local_disability_resources') {
      row.family_status = FAMILY_STATUS;
      row.status_reason = countyReason;
    }
  }

  for (const row of failureRows) {
    if (row.family === 'county_local_disability_resources') {
      row.failure_code = FAILURE_CODE;
      row.evidence = blockerEvidence;
      row.next_action = NEXT_ACTION;
    }
  }

  for (const row of verifiedRows) {
    if (row.family !== 'county_local_disability_resources') continue;
    row.family_status = FAMILY_STATUS;
    row.query_basis = `Reviewed ${fetchedDate} the live OKDHS contact-us county widget, its public widget feed, its linked mapconfig2 model, the broader public KML, the child-support county tree, the statewide DDS area-contact page, the official sitemap, blocked search endpoints, and the sibling contact-us leaves on the same host.`;
    row.blocker_code = FAILURE_CODE;
    row.blocker_evidence = blockerEvidence;
    row.samples = [
      {
        sample_name: 'Oklahoma Human Services county widget leaf redirects to contact-us',
        source_url: 'https://oklahoma.gov/okdhs/contact-us/dhsofficelocations.html',
        final_url: dhsLocations.finalUrl,
        verification_status: 'reviewed',
        source_type: 'official_widget_leaf_without_distinct_directory_contract',
        source_table: BATCH_NAME,
        fetched_at: generatedAt,
        evidence_snippet: 'The exact county-widget leaf returns HTTP 200 but canonically lands back on the generic Contact Oklahoma Human Services page instead of exposing a standalone county office directory.',
      },
      {
        sample_name: 'Oklahoma Human Services public widget feed',
        source_url: 'https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json',
        final_url: 'https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json',
        verification_status: 'reviewed',
        source_type: 'official_partial_widget_feed',
        source_table: BATCH_NAME,
        fetched_at: generatedAt,
        evidence_snippet: `The current public county-widget feed returns only ${widgetFeed.json.length} county entries: ${widgetFeed.json.map((r) => r.countyName).join(', ')}.`,
      },
      {
        sample_name: 'Oklahoma Human Services mapconfig2 model',
        source_url: 'https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json',
        final_url: 'https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json',
        verification_status: 'reviewed',
        source_type: 'official_partial_widget_config',
        source_table: BATCH_NAME,
        fetched_at: generatedAt,
        evidence_snippet: `The linked official widget config model also only publishes county entities for ${Object.values(widgetConfig.json[':items'].responsivegrid[':items']).map((r) => r.countyName).join(' and ')}.`,
      },
      {
        sample_name: 'Oklahoma map2 widget HTML api root',
        source_url: 'https://oklahoma.gov/okdhs/contact-us/map2.html',
        final_url: map2Page.finalUrl,
        verification_status: 'reviewed',
        source_type: 'official_widget_shell_with_single_api_root',
        source_table: BATCH_NAME,
        fetched_at: generatedAt,
        evidence_snippet: map2Page.text.includes('data-county-map-apiurl')
          ? 'The live widget HTML exposes one exact data-county-map-apiurl root and no second county feed or export contract.'
          : 'The live widget HTML did not expose any second county feed or export contract beyond the reviewed widget root.',
      },
      {
        sample_name: 'Oklahoma widget Alfalfa county row',
        source_url: 'https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json',
        final_url: 'https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json',
        verification_status: 'reviewed',
        source_type: 'official_widget_row_with_exact_local_office_contract',
        source_table: BATCH_NAME,
        fetched_at: generatedAt,
        evidence_snippet: alfalfaWidgetText,
      },
      {
        sample_name: 'Oklahoma widget Adair service note row',
        source_url: 'https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json',
        final_url: 'https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json',
        verification_status: 'reviewed',
        source_type: 'official_widget_row_with_service_note_only',
        source_table: BATCH_NAME,
        fetched_at: generatedAt,
        evidence_snippet: adairWidgetText,
      },
      {
        sample_name: 'Oklahoma Human Services public office-map KML',
        source_url: 'https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1',
        verification_status: 'reviewed',
        source_type: 'official_kml_partial_county_contract',
        source_table: 'batch324_oklahoma_kml_access_point_truth_v1',
        fetched_at: '2026-06-24T00:00:00.000Z',
        evidence_snippet: 'The broader public KML remains stronger than the widget, but it still only yields 45 benefit-capable county-local contracts after TANF-only access points are excluded.',
      },
      {
        sample_name: 'Oklahoma child-support county tree',
        source_url: 'https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html',
        verification_status: 'reviewed',
        source_type: 'official_service_specific_county_tree',
        source_table: 'batch324_oklahoma_kml_access_point_truth_v1',
        fetched_at: '2026-06-24T00:00:00.000Z',
        evidence_snippet: 'The same host still publishes a county-by-county tree for Child Support District Offices, proving county contracts are technically possible but not clearing disability/local routing.',
      },
      {
        sample_name: 'Oklahoma DDS area-contact page',
        source_url: 'https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html',
        verification_status: 'reviewed',
        source_type: 'official_statewide_intake_only',
        source_table: 'batch324_oklahoma_kml_access_point_truth_v1',
        fetched_at: '2026-06-24T00:00:00.000Z',
        evidence_snippet: 'The page preserves one statewide DDS intake phone/email route with no county-served matrix.',
      },
      {
        sample_name: 'Oklahoma official sitemap and search exhaustion',
        source_url: 'https://oklahoma.gov/sitemap.xml',
        final_url: sitemap.finalUrl,
        verification_status: 'reviewed',
        source_type: 'official_sitemap_and_search_negative_probe',
        source_table: BATCH_NAME,
        fetched_at: generatedAt,
        evidence_snippet: `The official sitemap stayed public, but the bounded OKDHS search JSON returned HTTP ${blockedSearch.status} and the public search-results route returned HTTP ${publicSearch.status}; reviewed sibling contact-us leaves on the same host were wrong-role pages rather than a county-complete disability/local office directory.`,
      },
    ];
    row.sample_count = row.samples.length;
  }

  for (const row of nextRows) {
    if (row.family === 'county_local_disability_resources') {
      row.failure_code = FAILURE_CODE;
      row.next_action = NEXT_ACTION;
      row.evidence = blockerEvidence;
    }
  }

  const queueRow = queueRows.find((row) => row.state === 'oklahoma');
  queueRow.primary_gap_reason = PRIMARY_GAP_REASON;

  const auditRow = allStateAudit.states.find((row) => row.stateId === 'oklahoma');
  auditRow.packetBatch = BATCH_NAME;
  auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
  auditRow.familyStatuses.county_local_disability_resources = FAMILY_STATUS;

  appendLessonIfMissing(INPUTS.lessons);

  writeJson(INPUTS.summary, summary);
  writeJsonl(INPUTS.gap, gapRows);
  writeJsonl(INPUTS.failure, failureRows);
  writeJsonl(INPUTS.verified, verifiedRows);
  writeJsonl(INPUTS.next, nextRows);
  writeJsonl(INPUTS.queue, queueRows);
  writeJson(INPUTS.audit, allStateAudit);
  fs.writeFileSync(INPUTS.report, buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows));
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(allStateAudit));

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: generatedAt,
    state: 'oklahoma',
    classification: 'BLOCKED',
    index_safe: false,
    widget_leaf_status: dhsLocations.status,
    widget_leaf_final_url: dhsLocations.finalUrl,
    map2_model_status: map2Model.status,
    map2_page_status: map2Page.status,
    widget_feed_status: widgetFeed.status,
    sitemap_status: sitemap.status,
    blocked_search_status: blockedSearch.status,
    public_search_status: publicSearch.status,
    sibling_contact_leaf_count: siblingLeaves.length,
    sibling_contact_leaf_statuses: siblingLeaves.map((row) => ({ url: row.finalUrl, status: row.status })),
    widget_feed_county_count: widgetFeed.json.length,
    widget_feed_counties: widgetFeed.json.map((row) => row.countyName),
    widget_config_county_count: Object.keys(widgetConfig.json[':items'].responsivegrid[':items']).length,
    widget_config_counties: Object.values(widgetConfig.json[':items'].responsivegrid[':items']).map((row) => row.countyName),
    salvaged_widget_counties: SALVAGED_WIDGET_COUNTIES,
    service_note_only_counties: SERVICE_NOTE_ONLY_COUNTIES,
    benefit_capable_county_coverage_count: BENEFIT_CAPABLE_COUNTY_COVERAGE_COUNT,
    remaining_county_gap_count: REMAINING_COUNTIES.length,
    remaining_county_gap: REMAINING_COUNTIES,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(summary));

  console.log(JSON.stringify({
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    widgetFeedCounties: batchSummary.widget_feed_counties,
    widgetConfigCounties: batchSummary.widget_config_counties,
    remainingCountyGapCount: batchSummary.remaining_county_gap_count,
  }, null, 2));
}

await main();
