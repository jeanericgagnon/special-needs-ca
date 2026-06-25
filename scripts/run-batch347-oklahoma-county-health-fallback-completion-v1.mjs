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
  maineSummary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  maineQueue: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch347_oklahoma_county_health_fallback_completion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch347-oklahoma-county-health-fallback-completion-report-v1.md'),
};

const BATCH_NAME = 'batch347_oklahoma_county_health_fallback_completion_v1';
const FAMILY_STATUS = 'verified_county_grade';
const PRIMARY_GAP_REASON = 'none';
const MAINTENANCE_NEXT_ACTION =
  'Preserve Oklahoma as COMPLETE/index_safe and rerun only maintenance truth audits unless the official Oklahoma county health department office or services contracts regress.';
const LESSON_HEADING = '### County Health Department Root Plus Services Leaves Can Be A Truth-Safe County Fallback';
const LESSON_BODY =
  '*   **Lesson:** If an official county health department root preserves county-specific address and phone while an exact same-county services leaf preserves benefit or disability-adjacent routing such as SoonerStart, SoonerCare, or Community Health Worker referrals, the pair can truthfully close a county-local fallback gap. Oklahoma cleared once each remaining blocked county had that exact county root-plus-services contract on the official state health host.';

const COUNTY_HEALTH_TARGETS = [
  ['Adair', 'https://oklahoma.gov/health/locations/county-health-departments/adair-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/adair-county-health-department/services.html'],
  ['Beaver', 'https://oklahoma.gov/health/locations/county-health-departments/beaver-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/beaver-county-health-department/county-services.html'],
  ['Blaine', 'https://oklahoma.gov/health/locations/county-health-departments/blaine-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/blaine-county-health-department/services.html'],
  ['Cimarron', 'https://oklahoma.gov/health/locations/county-health-departments/cimarron-county.html', 'https://oklahoma.gov/health/locations/county-health-departments/cimarron-county.html'],
  ['Coal', 'https://oklahoma.gov/health/locations/county-health-departments/coal-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/coal-county-health-department/county-services.html'],
  ['Dewey', 'https://oklahoma.gov/health/locations/county-health-departments/dewey-county.html', 'https://oklahoma.gov/health/locations/county-health-departments/dewey-county.html'],
  ['Ellis', 'https://oklahoma.gov/health/locations/county-health-departments/ellis-county.html', 'https://oklahoma.gov/health/locations/county-health-departments/ellis-county.html'],
  ['Grant', 'https://oklahoma.gov/health/locations/county-health-departments/grant-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/grant-county-health-department/services.html'],
  ['Greer', 'https://oklahoma.gov/health/locations/county-health-departments/greer-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/greer-county-health-department/services.html'],
  ['Harmon', 'https://oklahoma.gov/health/locations/county-health-departments/harmon-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/harmon-county-health-department/services.html'],
  ['Harper', 'https://oklahoma.gov/health/locations/county-health-departments/harper-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/harper-county-health-department/county-services.html'],
  ['Haskell', 'https://oklahoma.gov/health/locations/county-health-departments/haskell-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/haskell-county-health-department/services.html'],
  ['Hughes', 'https://oklahoma.gov/health/locations/county-health-departments/hughes-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/hughes-county-health-department/county-services.html'],
  ['Jefferson', 'https://oklahoma.gov/health/locations/county-health-departments/jefferson-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/jefferson-county-health-department/services.html'],
  ['Kingfisher', 'https://oklahoma.gov/health/locations/county-health-departments/kingfisher-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/kingfisher-county-health-department/services.html'],
  ['Kiowa', 'https://oklahoma.gov/health/locations/county-health-departments/kiowa-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/kiowa-county-health-department/services.html'],
  ['Logan', 'https://oklahoma.gov/health/locations/county-health-departments/logan-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/logan-county-health-department/services.html'],
  ['Major', 'https://oklahoma.gov/health/locations/county-health-departments/major-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/major-county-health-department/services.html'],
  ['Marshall', 'https://oklahoma.gov/health/locations/county-health-departments/marshall-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/marshall-county-health-department/services.html'],
  ['McClain', 'https://oklahoma.gov/health/locations/county-health-departments/mcclain-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/mcclain-county-health-department/county-services.html'],
  ['McIntosh', 'https://oklahoma.gov/health/locations/county-health-departments/mcintosh-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/mcintosh-county-health-department/services.html'],
  ['Murray', 'https://oklahoma.gov/health/locations/county-health-departments/murray-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/murray-county-health-department/services.html'],
  ['Noble', 'https://oklahoma.gov/health/locations/county-health-departments/noble-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/noble-county-health-department/county-services.html'],
  ['Nowata', 'https://oklahoma.gov/health/locations/county-health-departments/nowata-county.html', 'https://oklahoma.gov/health/locations/county-health-departments/nowata-county.html'],
  ['Okfuskee', 'https://oklahoma.gov/health/locations/county-health-departments/okfuskee-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/okfuskee-county-health-department/services.html'],
  ['Pawnee', 'https://oklahoma.gov/health/locations/county-health-departments/pawnee-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/pawnee-county-health-department/county-services.html'],
  ['Roger Mills', 'https://oklahoma.gov/health/locations/county-health-departments/roger-mills-county.html', 'https://oklahoma.gov/health/locations/county-health-departments/roger-mills-county.html'],
  ['Seminole', 'https://oklahoma.gov/health/locations/county-health-departments/seminole-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/seminole-county-health-department/county-services.html'],
  ['Tillman', 'https://oklahoma.gov/health/locations/county-health-departments/tillman-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/tillman-county-health-department/services.html'],
  ['Washita', 'https://oklahoma.gov/health/locations/county-health-departments/washita-county.html', 'https://oklahoma.gov/health/locations/county-health-departments/washita-county.html'],
  ['Woods', 'https://oklahoma.gov/health/locations/county-health-departments/woods-county-health-department', 'https://oklahoma.gov/health/locations/county-health-departments/woods-county-health-department/county-services.html'],
];

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

function normalizeWhitespace(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function extractSnippet(text, pattern, radius = 140) {
  const match = text.match(pattern);
  if (!match || match.index == null) return null;
  const start = Math.max(0, match.index - radius);
  const end = Math.min(text.length, match.index + match[0].length + radius);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function extractCountySection(text, county) {
  const pattern = new RegExp(`${county}\\s+County(?:\\s+Health\\s+Department)?`, 'i');
  const match = text.match(pattern);
  if (!match || match.index == null) return text;
  const start = Math.max(0, match.index - 80);
  const end = Math.min(text.length, match.index + 900);
  return text.slice(start, end);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; CodexStateAudit/1.0; +https://github.com/jeanericgagnon/special-needs-ca)',
    },
    redirect: 'follow',
  });
  return {
    status: response.status,
    finalUrl: response.url,
    text: await response.text(),
  };
}

function buildCountyValidation(county, rootUrl, serviceUrl, rootFetch, serviceFetch, fetchedAt) {
  const rootText = normalizeWhitespace(rootFetch.text);
  const serviceText = normalizeWhitespace(serviceFetch.text);
  const countyRootSection = extractCountySection(rootText, county);
  const combinedText = `${rootText} ${serviceText}`;
  const countyPattern = new RegExp(`${county}\\s+County`, 'i');
  const phonePattern = /\(\d{3}\)\s*\d{3}-\d{4}|\b\d{3}-\d{3}-\d{4}\b/;
  const addressPattern = /\b\d{2,5}\s+[^.]{0,100}?(?:OK\s*\d{5}|Oklahoma)\b/i;
  const servicePattern = /(SoonerStart|SoonerCare|Oklahoma Medicaid|Community Health Worker|applications and referrals for services)/i;
  const countyMatch = countyPattern.test(combinedText);
  const phoneSnippet = extractSnippet(countyRootSection, phonePattern) || extractSnippet(rootText, phonePattern) || extractSnippet(serviceText, phonePattern);
  const addressSnippet = extractSnippet(countyRootSection, addressPattern) || extractSnippet(rootText, addressPattern) || extractSnippet(serviceText, addressPattern);
  const serviceSnippet = extractSnippet(serviceText, servicePattern) || extractSnippet(rootText, servicePattern);
  const valid = rootFetch.status === 200 &&
    serviceFetch.status === 200 &&
    countyMatch &&
    Boolean(phoneSnippet) &&
    Boolean(addressSnippet) &&
    Boolean(serviceSnippet);

  return {
    county,
    root_url: rootUrl,
    root_final_url: rootFetch.finalUrl,
    root_status: rootFetch.status,
    service_url: serviceUrl,
    service_final_url: serviceFetch.finalUrl,
    service_status: serviceFetch.status,
    county_named: countyMatch,
    phone_evidence: phoneSnippet,
    address_evidence: addressSnippet,
    service_evidence: serviceSnippet,
    verification_status: valid ? 'verified' : 'blocked',
    fetched_at: fetchedAt,
  };
}

function buildCountyReason(fetchedDate, countyCount) {
  return `Reviewed ${fetchedDate} exact official Oklahoma county health department fallback pairs for the remaining county-local gap. Each previously unresolved county now has a live county-specific root on \`oklahoma.gov/health/locations/county-health-departments/*\` that preserves county identity plus local address and phone, and each same-county root or services leaf preserves disability/benefit-adjacent routing evidence such as \`SoonerStart\`, \`SoonerCare\`, \`Oklahoma Medicaid\`, \`Community Health Worker\`, or explicit applications-and-referrals language. The reviewed county health department pair therefore provides a truthful county-local fallback contract for all ${countyCount} previously unresolved Oklahoma counties instead of relying on the partial OKDHS widget or child-support-only tree.`;
}

function buildStateReport(summary, gapRows, verifiedRows, nextRows, countyReason, validations) {
  const countyNames = validations.map((row) => row.county).join(', ');
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
    '- none',
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## County-local repair',
    '',
    `- ${countyReason}`,
    `- The county-health fallback explicitly closes these 31 previously unresolved counties: ${countyNames}.`,
    '- The fallback is county-grade because each county now has a county-named official root plus a same-county services page or root carrying disability/benefit-adjacent routing evidence.',
    '- This replaces the partial OKDHS widget and child-support-only county tree as the controlling local proof lane.',
    '',
    '## Completion decision',
    '',
    '- Oklahoma is now `COMPLETE` and `index_safe=true`.',
    '- Education remains cleared by the current official OSDE State School and District Directory.',
    '- County-local now clears from the official Oklahoma county health department root-plus-services fallback across the full 77-county baseline.',
    '- Oklahoma can therefore remain broadly indexed under the current California-grade gate.',
  ].join('\n') + '\n';
}

function buildAllStateReport(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedStates = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));

  return [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    '- packet_coverage_count: 50',
    '- packet_missing_states: none',
    '',
    '## Classification counts',
    '',
    `- COMPLETE: ${allStateAudit.classifications.COMPLETE}`,
    `- BLOCKED: ${allStateAudit.classifications.BLOCKED}`,
    '',
    `- index-safe states: ${allStateAudit.indexSafeCount}`,
    `- complete states: ${completeStates.join(', ')}`,
    `- blocked states: ${blockedStates.join(', ')}`,
    '',
    '## Notes',
    '',
    '- Oklahoma is now COMPLETE/index-safe because the official Oklahoma county health department fallback closes the prior 31-county county-local gap with exact county root-plus-services page pairs carrying county-specific contact plus SoonerStart, SoonerCare, Oklahoma Medicaid, Community Health Worker, or applications-and-referrals evidence.',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- Nebraska remains COMPLETE/index-safe because the official DHHS N-FOCUS TANF `Employment First (EF) Offices` lane exposes a public county-office region contract across all 93 counties, with explicit county-specific office assignments and `Counties Served` fields on the official GIS owner family.',
    '- Maine is now the next blocked state in the active priority order because education is already cleared while county-local remains blocked on the missing DHHS county/service-area crosswalk.',
    '',
  ].join('\n');
}

function buildHandoff(allStateAudit, maineSummary, maineQueueRow) {
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
    '## Current Focus State: Maine',
    '',
    '### Blocker Reason',
    '',
    `\`county_local_disability_resources\` is the only remaining Maine critical blocker. ${maineSummary.final_blockers?.[0]?.evidence || maineQueueRow?.evidence || ''}`.trim(),
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Maine DHHS county or service-area crosswalk that ties counties to the named district office towns on the public DHHS office page.',
    '- Any official Maine DHHS office export, table, map, PDF, or API that exposes county-served labels or service-area fields for those offices.',
    '- Any official county-grade routing contract on a successor Maine DHHS surface that is public and reviewable without inference.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Maine DHHS District Office Locations](https://www.maine.gov/dhhs/about/contact/offices)',
    '- [Maine NEO Superintendent by SAU](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU)',
    '- [Maine NEO Superintendent by Town](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DHHS county/service-area crosswalk for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, Skowhegan, and the other named district office towns.',
    '- Any official export or embedded data source behind the public DHHS office locations page that exposes county assignments.',
    '',
    '## Next State Order After Maine',
    '',
    '1. Idaho',
    '2. Arizona',
    '3. Massachusetts',
    '4. New Mexico',
    '5. South Dakota',
    '6. Rhode Island',
    '7. Virginia',
    '8. West Virginia',
    '9. North Dakota',
    '10. Wisconsin',
    '',
  ].join('\n');
}

function buildBatchReport(validations, countyReason) {
  const example = validations.find((row) => row.county === 'Okfuskee') || validations[0];
  return [
    '# Batch 347 Oklahoma County Health Fallback Completion v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    `- change: replaced the old partial-OKDHS-widget blocker with a verified county health department fallback across ${validations.length} previously unresolved counties`,
    '',
    '## Evidence',
    '',
    `- ${countyReason}`,
    `- Example county pair: ${example.county} root preserves \`${example.address_evidence}\` and \`${example.phone_evidence}\`, while the services lane preserves \`${example.service_evidence}\`.`,
  ].join('\n') + '\n';
}

export async function generateBatch347OklahomaCountyHealthFallbackCompletionV1() {
  const fetchedAt = new Date().toISOString();
  const fetchedDate = fetchedAt.slice(0, 10);
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const maineSummary = readJson(INPUTS.maineSummary);
  const maineQueueRows = readJsonl(INPUTS.maineQueue);
  const maineQueueRow = maineQueueRows.find((row) => row.family === 'county_local_disability_resources') || maineQueueRows[0];

  const validations = [];
  for (const [county, rootUrl, serviceUrl] of COUNTY_HEALTH_TARGETS) {
    const [rootFetch, serviceFetch] = await Promise.all([fetchText(rootUrl), fetchText(serviceUrl)]);
    validations.push(buildCountyValidation(county, rootUrl, serviceUrl, rootFetch, serviceFetch, fetchedAt));
  }

  const invalidRows = validations.filter((row) => row.verification_status !== 'verified');
  if (invalidRows.length) {
    throw new Error(`Oklahoma county health fallback did not verify cleanly for: ${invalidRows.map((row) => row.county).join(', ')}`);
  }

  const countyReason = buildCountyReason(fetchedDate, validations.length);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'COMPLETE',
    index_safe: true,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: [],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: countyReason }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: FAMILY_STATUS,
      evidence_strength: 'strong',
      sample_count: 5,
      query_basis: `Reviewed ${fetchedDate} exact official Oklahoma county health department root-plus-services fallback pairs for all 31 previously unresolved counties.`,
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'County health root pattern',
          source_url: validations[0].root_url,
          final_url: validations[0].root_final_url,
          verification_status: 'verified',
          source_type: 'official_county_health_root',
          source_table: BATCH_NAME,
          fetched_at: fetchedAt,
          evidence_snippet: validations[0].address_evidence,
        },
        {
          sample_name: 'County health services pattern',
          source_url: validations[0].service_url,
          final_url: validations[0].service_final_url,
          verification_status: 'verified',
          source_type: 'official_county_health_services_leaf',
          source_table: BATCH_NAME,
          fetched_at: fetchedAt,
          evidence_snippet: validations[0].service_evidence,
        },
        {
          sample_name: 'Okfuskee county health worker referral evidence',
          source_url: validations.find((row) => row.county === 'Okfuskee').service_url,
          final_url: validations.find((row) => row.county === 'Okfuskee').service_final_url,
          verification_status: 'verified',
          source_type: 'official_county_health_services_leaf',
          source_table: BATCH_NAME,
          fetched_at: fetchedAt,
          evidence_snippet: validations.find((row) => row.county === 'Okfuskee').service_evidence,
        },
        {
          sample_name: 'McClain county address and phone evidence',
          source_url: validations.find((row) => row.county === 'McClain').root_url,
          final_url: validations.find((row) => row.county === 'McClain').root_final_url,
          verification_status: 'verified',
          source_type: 'official_county_health_root',
          source_table: BATCH_NAME,
          fetched_at: fetchedAt,
          evidence_snippet: `${validations.find((row) => row.county === 'McClain').address_evidence} ${validations.find((row) => row.county === 'McClain').phone_evidence}`,
        },
        {
          sample_name: 'All 31 previously unresolved counties covered by county-health fallback',
          source_url: 'https://oklahoma.gov/health/locations/county-health-departments.html',
          final_url: 'https://oklahoma.gov/health/locations/county-health-departments.html',
          verification_status: 'verified',
          source_type: 'official_county_health_fallback_matrix',
          source_table: BATCH_NAME,
          fetched_at: fetchedAt,
          evidence_snippet: `Validated county root-plus-services fallback pairs for ${validations.map((row) => row.county).join(', ')}.`,
        },
      ],
    };
  });

  const updatedNextRows = [
    {
      state: 'oklahoma',
      state_code: 'OK',
      priority_rank: 1,
      family: 'maintenance',
      severity: 'info',
      failure_code: 'none',
      next_action: MAINTENANCE_NEXT_ACTION,
      evidence: countyReason,
    },
  ];

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'oklahoma'
      ? {
        ...row,
        classification: 'COMPLETE',
        index_safe: true,
        completeness_pct: 100,
        missing_critical_families: 0,
        weak_critical_families: 0,
        primary_gap_reason: 'none',
        recommended_batch: 'complete_maintain',
        status: 'COMPLETE',
        repair_lane: 'maintain_truth_only',
      }
      : row
  ));

  const updatedAuditStates = allStateAudit.states.map((row) => (
    row.stateId === 'oklahoma'
      ? {
        ...row,
        classification: 'COMPLETE',
        indexSafe: true,
        strongCriticalFamilies: 12,
        weakCriticalFamilies: 0,
        missingCriticalFamilies: 0,
        completenessPct: 100,
        familyStatuses: {
          ...row.familyStatuses,
          county_local_disability_resources: FAMILY_STATUS,
        },
        packetBatch: BATCH_NAME,
        packetPrimaryGapReason: 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence',
        packetRecommendedBatch: 'complete_maintain',
      }
      : row
  ));

  const classifications = updatedAuditStates.reduce((acc, row) => {
    acc[row.classification] = (acc[row.classification] || 0) + 1;
    return acc;
  }, {});
  const indexSafeCount = updatedAuditStates.filter((row) => row.indexSafe).length;

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: fetchedAt,
    classifications,
    indexSafeCount,
    lessonsUpdate: 'Oklahoma county health department root-plus-services fallback now clears the final county-local blocker with exact official county pages.',
    states: updatedAuditStates,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, []);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextRows, countyReason, validations));
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(updatedAudit));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit, maineSummary, maineQueueRow));
  appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'oklahoma',
    classification: 'COMPLETE',
    index_safe: true,
    county_health_validation_count: validations.length,
    verified_county_health_validation_count: validations.filter((row) => row.verification_status === 'verified').length,
    validations,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(validations, countyReason));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch347OklahomaCountyHealthFallbackCompletionV1()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
