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
  failures: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  educationPacket: path.join(generatedDir, 'maine_district_or_county_education_routing_manual_export_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'maine_county_local_disability_resources_mapping_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch161_maine_official_form_session_confirmation_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch161-maine-official-form-session-confirmation-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
};

const EDUCATION_STATUS =
  'blocked_live_public_org_selector_with_session_post_500';
const EDUCATION_REASON =
  'Maine now has stronger official education blocker evidence: the live NEO contact page publicly exposes the full organization selector and CSRF token in HTML, but a sessioned submit with a real OrgId still returns HTTP 500 before any local contact rows or export file are returned. All 16 county education rows still depend on statewide DOE fallbacks, so the next honest lane remains reviewed browser-assisted capture or manual export from the official selector, not more replay variations.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 current Maine education blocker artifacts plus one new live official session probe. The public NEO Primary Contacts By Organization page now proves a real result contract exists because the HTML embeds the __RequestVerificationToken, the POST action /DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, and the live OrgId catalog including Portland Public Schools (OrgId 364) and York Public Schools (OrgId 542). A bounded cookie-backed submit using the live token and OrgId 364 still returns HTTP 500 and a response shell titled NEO Contact Search [ v2.0.0.0 - A3 ] before any verified local contact rows or export file appear. Fourteen county rows still point at https://www.maine.gov/doe/learning/specialed and two still point at https://www.maine.gov/doe, so Maine remains blocked on reviewed manual export or browser-assisted capture rather than speculative POST retries.';
const EDUCATION_NEXT_ACTION =
  'use_live_public_org_selector_packet_for_reviewed_browser_capture_or_manual_export';

const COUNTY_REASON =
  'Maine now has sharper county-office blocker evidence: the live DHHS district office page is a real office-grade directory with addresses, phones, emails, and cross-office program notes, but it still does not publish county labels, town lookup, or service-area boundaries that would let a county row be mapped truthfully. DOI mirror rows and dead locator fallbacks therefore still need a reviewed mapping contract before any county can upgrade.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 current Maine county-office blocker artifacts plus the live DHHS District Office Locations page. The official page preserves real office-grade evidence such as addresses, phones, emails, and program-routing notes like For Long Term Care questions: see Machias Office and For Child Support services: see Lewiston Office. But the page still does not expose county labels, town lists, or service-area boundaries for those offices, so those cross-office notes cannot be promoted into county coverage proof. Sixteen current county-office rows still depend on the DOI mirror source https://doi.org/10.7910/DVN/AVRHMI and four still use the dead https://dhhs.maine.gov/locations fallback, with Aroostook, Washington, and York remaining multi-office counties.';
const COUNTY_NEXT_ACTION =
  'find_reviewed_county_or_town_to_district_office_contract_or_keep_mapped_counties_blocked';

const LESSON_HEADING =
  '### Public Org Selectors And Program Cross-Office Notes Still Do Not Equal County-Grade Coverage';
const LESSON_BODY =
  '*   **Lesson:** If an official page exposes live OrgIds, CSRF tokens, or cross-office program notes, preserve that as stronger blocker evidence, not as completion. Maine’s NEO selector proved a real education result contract existed, and DHHS office notes proved real office-grade routing, but neither surface published county- or district-grade proof until a local result row or mapping contract appeared.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
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
    '- Education is still blocked because the official NEO contact selector is definitely live and public, but a sessioned submit against the real form still returns HTTP 500 before any district-grade contact rows or export file are returned.',
    '- County-local is still blocked because the DHHS office page is office-grade and program-aware, but still never publishes county or town coverage boundaries that would support truthful county mapping.',
  ].join('\n') + '\n';
}

export function generateBatch161MaineOfficialFormSessionConfirmationV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const educationPacket = readJson(INPUTS.educationPacket);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: EDUCATION_STATUS, status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'official_live_org_selector_and_session_post_return_500',
        evidence: EDUCATION_EVIDENCE,
        next_action: EDUCATION_NEXT_ACTION,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        evidence: COUNTY_EVIDENCE,
        next_action: COUNTY_NEXT_ACTION,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_STATUS,
        query_basis: 'Reviewed current Maine DOE selector roots plus one live cookie-backed submit against the official public OrgId form.',
        blocker_code: 'official_live_org_selector_and_session_post_return_500',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed current Maine DHHS district office directory plus the office-level program-routing notes exposed on the live page.',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: 'official_live_org_selector_and_session_post_return_500', next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_live_org_selector_posts_return_500_and_dhhs_office_directory_lacks_county_or_town_mapping',
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'official_live_org_selector_and_session_post_return_500',
        evidence: EDUCATION_EVIDENCE,
        next_action: EDUCATION_NEXT_ACTION,
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'official_district_office_pages_lack_county_coverage_contract',
        evidence: COUNTY_EVIDENCE,
        next_action: COUNTY_NEXT_ACTION,
      },
    ],
  };

  const updatedEducationPacket = {
    ...educationPacket,
    current_problem_metrics: {
      ...educationPacket.current_problem_metrics,
      publicOrgSelectorEmbedded: true,
      csrfTokenExposed: true,
      sessionedPost500Confirmed: true,
      sessionedOrgIdTested: 364,
    },
    packet_complete_when: 'Every Maine county row either points at reviewed local SAU or district contact evidence or remains explicitly blocked because the official live OrgId selector still fails to return public result rows or export files.',
  };

  const updatedCountyPacket = {
    ...countyPacket,
    current_problem_metrics: {
      ...countyPacket.current_problem_metrics,
      districtOfficeCountyLabelsVisible: false,
      districtOfficeTownLookupVisible: false,
      programCrossOfficeNotesVisible: true,
    },
    packet_complete_when: 'Every Maine county office row either maps to a reviewed DHHS district office with public county or town coverage support or remains explicitly blocked because the live office directory still lacks a county or town mapping contract.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_blocker_sharpened: true,
    county_blocker_sharpened: true,
    lessons_updated: lessonsUpdated,
    education_failure_code: 'official_live_org_selector_and_session_post_return_500',
    county_failure_code: 'official_district_office_pages_lack_county_coverage_contract',
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${stateReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch161MaineOfficialFormSessionConfirmationV1();
  console.log(JSON.stringify(result, null, 2));
}
