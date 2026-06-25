import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maine_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  idahoSummary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch348_maine_county_crosswalk_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch348-maine-county-crosswalk-finality-report-v1.md'),
};

const BATCH_NAME = 'batch348_maine_county_crosswalk_finality_v1';
const PRIMARY_GAP_REASON =
  'official_dhhs_office_page_and_same_host_contact_sitemap_surfaces_still_expose_no_county_or_service_area_crosswalk';
const COUNTY_STATUS = 'blocked_district_office_locations_and_same_host_followups_without_county_crosswalk';
const FAILURE_CODE = 'official_dhhs_office_page_and_same_host_followups_expose_zero_county_or_service_area_fields';
const NEXT_ACTION =
  'hold_blocked_until_official_maine_dhhs_county_or_service_area_crosswalk_is_publicly_reviewable';
const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official Maine DHHS county-local pass against the current public host family only: `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/about/contact/`, `https://www.maine.gov/dhhs/about/contact/administrative-offices`, `https://www.maine.gov/dhhs/offices-divisions`, and `https://www.maine.gov/dhhs/about/sitemap`. The live district office page still preserves office towns, addresses, phones, emails, map shortlinks, and OFI program links for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, Skowhegan, and others, but it still exposes zero county names and zero service-area labels in public HTML. The same-host follow-up surfaces stay negative too: the DHHS contact root, offices/divisions page, administrative offices page, and DHHS sitemap all remain public but still expose no county-served fields, no service-area crosswalk, and no alternate county-grade office export on the current official host family. Maine therefore remains blocked because the current official DHHS public stack still has office-grade contact proof without a truthful county-to-office routing contract.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Maine checks on `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/about/contact/`, `https://www.maine.gov/dhhs/about/contact/administrative-offices`, `https://www.maine.gov/dhhs/offices-divisions`, and `https://www.maine.gov/dhhs/about/sitemap`. The live district office page preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, OFI program links, and `Show Map` shortlinks for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But the office page still exposes zero county names such as Aroostook, Washington, or York, zero county-served labels, and zero service-area fields in public HTML. The same-host follow-up pages remain public yet equally negative: the contact root, administrative offices page, offices/divisions page, and DHHS sitemap all expose no county crosswalk and no alternate county-grade office export or service-area table. Maine therefore still has office-grade evidence without a truthful county-to-office routing contract on the current official public host family.';
const LESSON_HEADING = '### Same-Host Contact, Sitemap, And Office Hubs Can Be Enough To Freeze A County-Crosswalk Blocker';
const LESSON_BODY =
  '*   **Lesson:** If the official office page, contact root, offices/divisions hub, administrative-offices page, and same-host sitemap all stay public yet none expose county names, service areas, or a county-grade export, treat the host family as source-final for low-token county routing. Maine DHHS stayed office-grade across every bounded same-host follow-up, so more retries would only restate the same missing county crosswalk.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Maine California-Grade Audit Report v2',
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
    '- Maine remains BLOCKED and not index-safe.',
    '- Education remains cleared by the live official Superintendent-by-SAU and Superintendent-by-Town selectors.',
    '- County-local remains blocked because the official DHHS office page plus the bounded same-host contact, sitemap, offices/divisions, and administrative-office follow-ups still expose no county or service-area crosswalk in public HTML.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const prior = '- Maine now clears education from the live NEO superintendent selectors, but it remains blocked because DHHS district offices still expose no county/service-area crosswalk for the named office towns.';
  const next = '- Maine remains blocked on a stronger county-local finality check: the DHHS district office page, contact root, offices/divisions hub, administrative-offices page, and DHHS sitemap all stay public yet still expose no county names, service-area labels, or alternate county-grade office export.';
  const lines = text.split('\n').filter((line) => line !== prior && line !== next);
  return `${lines.join('\n').trimEnd()}\n${next}\n`;
}

function buildHandoff(allStateAudit, idahoSummary) {
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
    '`county_local_disability_resources` is the only remaining Maine critical blocker. Reviewed 2026-06-25 bounded official Maine DHHS checks on the district office page, contact root, administrative offices page, offices/divisions hub, and DHHS sitemap. All of those pages remain public, but none of them expose county names, county-served labels, service-area fields, or an alternate county-grade office export. The current official Maine DHHS public host family therefore still stops at office-grade contact proof without a truthful county-to-office routing contract.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Maine DHHS county or service-area crosswalk that ties counties to the named district office towns on the public DHHS office page.',
    '- Any official Maine DHHS office export, table, PDF, ArcGIS layer, or API that exposes county-served labels or service-area fields for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, Skowhegan, and the other named offices.',
    '- Any official county-grade routing contract on a successor Maine DHHS surface that is public and reviewable without inference.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Maine DHHS District Office Locations](https://www.maine.gov/dhhs/about/contact/offices)',
    '- [Maine DHHS Contact root](https://www.maine.gov/dhhs/about/contact/)',
    '- [Maine DHHS Administrative Office Locations](https://www.maine.gov/dhhs/about/contact/administrative-offices)',
    '- [Maine DHHS Offices/Divisions](https://www.maine.gov/dhhs/offices-divisions)',
    '- [Maine DHHS Sitemap](https://www.maine.gov/dhhs/about/sitemap)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DHHS county/service-area crosswalk for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan.',
    '- Any official export or embedded data source behind the DHHS district office page that exposes county assignments.',
    '',
    `## Next State Order After Maine`,
    '',
    `1. ${idahoSummary.state_name}`,
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

function buildBatchReport() {
  return [
    '# Batch 348 Maine County Crosswalk Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: sharpened the Maine county-local blocker from one office-page-only negative check into a same-host finality check across the DHHS office page, contact root, administrative offices page, offices/divisions hub, and DHHS sitemap',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch348MaineCountyCrosswalkFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const idahoSummary = readJson(INPUTS.idahoSummary);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_official_county_crosswalk_contract',
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: COUNTY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON }
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
        family_status: COUNTY_STATUS,
        sample_count: 5,
        blocker_code: FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        query_basis: 'Reviewed the live official Maine DHHS office page plus bounded same-host contact, sitemap, offices/divisions, and administrative-office follow-ups for county or service-area fields.',
        samples: [
          {
            sample_name: 'DHHS District Office Locations',
            source_url: 'https://www.maine.gov/dhhs/about/contact/offices',
            final_url: 'https://www.maine.gov/dhhs/about/contact/offices',
            verification_status: 'blocked',
            source_type: 'official_district_office_list_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The office page lists Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan with addresses, phones, emails, and map links, but it still exposes zero county names or service-area fields.',
          },
          {
            sample_name: 'DHHS contact root',
            source_url: 'https://www.maine.gov/dhhs/about/contact/',
            final_url: 'https://www.maine.gov/dhhs/about/contact/',
            verification_status: 'blocked',
            source_type: 'official_contact_hub_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The DHHS contact root stays public but only points back to district office locations and administrative offices without any county-served or service-area contract.',
          },
          {
            sample_name: 'DHHS administrative offices page',
            source_url: 'https://www.maine.gov/dhhs/about/contact/administrative-offices',
            final_url: 'https://www.maine.gov/dhhs/about/contact/administrative-offices',
            verification_status: 'blocked',
            source_type: 'official_admin_offices_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The administrative offices page remains public but exposes no county names, county-served fields, or district-to-county routing contract.',
          },
          {
            sample_name: 'DHHS offices/divisions page',
            source_url: 'https://www.maine.gov/dhhs/offices-divisions',
            final_url: 'https://www.maine.gov/dhhs/offices-divisions',
            verification_status: 'blocked',
            source_type: 'official_offices_divisions_hub_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The offices/divisions hub stays public but exposes no county labels, service areas, or county-grade office export for the DHHS district office family.',
          },
          {
            sample_name: 'DHHS sitemap',
            source_url: 'https://www.maine.gov/dhhs/about/sitemap',
            final_url: 'https://www.maine.gov/dhhs/about/sitemap',
            verification_status: 'blocked',
            source_type: 'official_same_host_sitemap_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The DHHS sitemap remains public but only repeats the same office and contact surfaces; it exposes no county-grade office export, no county list, and no service-area crosswalk.',
          },
        ],
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'maine'
      ? {
        ...row,
        classification: 'BLOCKED',
        index_safe: false,
        completeness_pct: 91,
        weak_critical_families: 1,
        primary_gap_reason: PRIMARY_GAP_REASON,
        recommended_batch: 'hold_for_new_official_county_crosswalk_contract',
        status: 'BLOCKED',
        repair_lane: 'blocked_until_new_official_public_county_contract',
      }
      : row
  ));

  const updatedAuditStates = allStateAudit.states.map((row) => (
    row.stateId === 'maine'
      ? {
        ...row,
        classification: 'BLOCKED',
        indexSafe: false,
        completenessPct: 91,
        strongCriticalFamilies: 11,
        weakCriticalFamilies: 1,
        familyStatuses: {
          ...row.familyStatuses,
          county_local_disability_resources: COUNTY_STATUS,
        },
        packetBatch: BATCH_NAME,
        packetPrimaryGapReason: PRIMARY_GAP_REASON,
        packetRecommendedBatch: 'hold_for_new_official_county_crosswalk_contract',
      }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    lessonsUpdate: 'Maine DHHS same-host office, contact, sitemap, and office-hub pages all remain county-crosswalk negative.',
    states: updatedAuditStates,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit, idahoSummary));
  appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'maine',
    classification: 'BLOCKED',
    index_safe: false,
    same_host_followups: [
      'https://www.maine.gov/dhhs/about/contact/offices',
      'https://www.maine.gov/dhhs/about/contact/',
      'https://www.maine.gov/dhhs/about/contact/administrative-offices',
      'https://www.maine.gov/dhhs/offices-divisions',
      'https://www.maine.gov/dhhs/about/sitemap',
    ],
    county_mentions_found: 0,
    service_area_fields_found: 0,
    result: 'source_final_without_public_county_crosswalk',
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch348MaineCountyCrosswalkFinalityV1();
  console.log(JSON.stringify(summary, null, 2));
}
