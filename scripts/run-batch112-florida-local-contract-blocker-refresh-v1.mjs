import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch112_florida_local_contract_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch112-florida-local-contract-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const BLOCKER_CODE = 'official_frc_csv_partial_and_myaccess_remaining_counties_browser_only';
const NEXT_ACTION = 'hold_county_local_until_browser_assisted_or_documented_myaccess_office_contract_yields_remaining_33_counties';
const STATUS_REASON = 'Official Florida DCF local-routing proof is split between a reviewed first-party Family Resource Center CSV that covers only 34/67 counties and a remaining MyACCESS county-search lane that still renders as a JavaScript shell plus appconfig officeMapping contract rather than static county office evidence.';
const EVIDENCE = 'Reviewed 2026-06-22 bounded live official checks on https://www.myflfamilies.com/sitemap.xml, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://familyresourcecenter.myflfamilies.com/, https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, and https://myaccess.myflfamilies.com/config/appconfig.js. The public-assistance pages and sitemap expose the Family Resource Center and Community Partner Search surfaces, but no second static county-grade locator. The reviewed first-party providers.csv still covers only 39 rows across 34 unique Florida counties. The remaining MyACCESS Community Partner Search is a JavaScript shell, appconfig.js exposes officeMapping=/dataexchangeproxy, and the partner-location bundle shows county dropdown UI semantics without a reviewed static county-office dataset. Florida therefore still lacks reviewed first-party county-grade local-routing evidence for the remaining 33 counties.';

const LESSON_HEADING = '### Official App Config Hints Are Not County-Grade Evidence By Themselves';
const LESSON_BODY = '*   **Lesson:** If an official portal app config exposes a promising endpoint like `officeMapping=/dataexchangeproxy`, do not treat that hint as verified county-routing proof unless a bounded same-domain check also yields reviewed county rows or a documented API contract. Florida still stays blocked because the remaining counties only appear behind a MyACCESS JavaScript shell and an undocumented office-mapping lane.';

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

function buildReport(summary, gapRows, verifiedRows, nextRows) {
  return [
    '# Florida California-Grade Audit Report v2',
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
    `- county_local_disability_resources: ${BLOCKER_CODE} :: ${EVIDENCE}`,
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Florida repair decision',
    '',
    '- District or county education routing remains verified from the live official FDLRS county routing page.',
    '- County-local disability resources remain the only blocker. The reviewed first-party Family Resource Center CSV truthfully covers 34 of 67 counties, while the remaining county search still sits behind the MyACCESS JavaScript shell and undocumented office-mapping contract.',
    '- Florida therefore remains truthfully BLOCKED and not index-safe until browser-assisted extraction or a documented first-party office-mapping contract yields county-grade evidence for the remaining 33 counties.',
  ].join('\n') + '\n';
}

export function generateBatch112FloridaLocalContractBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_browser_only_remaining_county_locator_contract', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailures = [
    {
      state: 'florida',
      state_code: 'FL',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: BLOCKER_CODE,
      evidence: EVIDENCE,
      next_action: NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        family_status: 'blocked_browser_only_remaining_county_locator_contract',
        evidence_strength: 'medium',
        blocker_code: BLOCKER_CODE,
        blocker_evidence: EVIDENCE,
        query_basis: 'Reviewed official DCF sitemap/public-assistance roots, first-party Family Resource Center CSV, and MyACCESS shell/appconfig contract.',
      }
      : row
  ));

  const updatedNextActions = [
    {
      state: 'florida',
      state_code: 'FL',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: BLOCKER_CODE,
      next_action: NEXT_ACTION,
      evidence: EVIDENCE,
    },
  ];

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    primary_gap_reason: BLOCKER_CODE,
    critical_gap_families: ['county_local_disability_resources'],
    major_gap_families: [],
    complete_ready: false,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: BLOCKER_CODE,
        evidence: EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailures);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextActions);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextActions));

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'county_local_disability_resources',
    blocker_code: BLOCKER_CODE,
    next_action: NEXT_ACTION,
    lesson_added: lessonAdded,
    evidence_checks: {
      sitemap: 'https://www.myflfamilies.com/sitemap.xml',
      publicAssistance: 'https://www.myflfamilies.com/services/public-assistance',
      applying: 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
      familyResourceCenter: 'https://familyresourcecenter.myflfamilies.com/',
      csvUrl: 'https://familyresourcecenter.myflfamilies.com/providers.csv',
      csvUniqueCountyCount: 34,
      remainingCountyGap: 33,
      myaccess: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      appconfig: 'https://myaccess.myflfamilies.com/config/appconfig.js',
      officeMapping: '/dataexchangeproxy',
      bundleSignal: 'UXModule.flPartnerLocation county dropdown UI present but no reviewed static county-office dataset exposed in bounded inspection',
    },
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 112 Florida Local Contract Blocker Refresh Report v1',
      '',
      'This pass does not broaden Florida discovery. It sharpens the final county-local blocker by proving the official Florida DCF lane splits into a reviewed first-party CSV for 34 counties and a browser-only MyACCESS county search contract for the remaining 33 counties.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- blocker_code: ${BLOCKER_CODE}`,
      `- next_action: ${NEXT_ACTION}`,
      '- reviewed_counties_from_csv: 34',
      '- remaining_counties_browser_only: 33',
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch112FloridaLocalContractBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
