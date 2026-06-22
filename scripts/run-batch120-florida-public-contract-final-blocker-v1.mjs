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
  batchSummary: path.join(generatedDir, 'batch120_florida_public_contract_final_blocker_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch120-florida-public-contract-final-blocker-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const BLOCKER_CODE = 'official_myaccess_public_shell_and_proxy_do_not_expose_county_rows';
const NEXT_ACTION = 'hold_county_local_until_first_party_county_dataset_or_search_contract_is_publicly_documented';
const STATUS_REASON = 'Official Florida DCF county-local routing remains split between a reviewed Family Resource Center CSV that covers 34/67 counties and a MyACCESS public shell/proxy lane that still does not expose a public county-row contract.';
const EVIDENCE = 'Reviewed 2026-06-22 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/dataexchangeproxy, and the live official bundle https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js. The Family Resource Center CSV still preserves reviewed storefront coverage for only 34/67 Florida counties. The public CPCPS entry and plain GET to /dataexchangeproxy both return the same 5165-byte MyACCESS shell instead of county results. Appconfig exposes officeMapping=/dataexchangeproxy, but the fetched flPartnerLocation bundle is an admin/location-form module with county multi-select fields rather than a documented public county-office search response. Florida therefore still lacks reviewed first-party county-grade local-routing evidence for the remaining 33 counties.';

const LESSON_HEADING = '### Public Shell And Admin Bundle Evidence Must Be Separated Before Reopening A Blocked Portal Lane';
const LESSON_BODY = '*   **Lesson:** If a public portal exposes a promising proxy path but the fetched same-domain JS module is really an admin/location-form bundle, do not reopen the lane as scrapeable. Florida stayed blocked because both `CPCPS` and `/dataexchangeproxy` returned the same shell while `UXModule.flPartnerLocation` only proved an internal location form with county fields, not a public county-office result contract.';

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
    '- County-local disability resources remain the only blocker. The reviewed first-party Family Resource Center CSV truthfully covers 34 of 67 counties, while the public MyACCESS shell and proxy still do not expose county rows or a documented public county-search contract.',
    '- Florida therefore remains truthfully BLOCKED and not index-safe until a first-party county dataset or public search-response contract is exposed and verified.',
  ].join('\n') + '\n';
}

export function generateBatch120FloridaPublicContractFinalBlockerV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_public_shell_and_proxy_without_county_rows', status_reason: STATUS_REASON }
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
        family_status: 'blocked_public_shell_and_proxy_without_county_rows',
        evidence_strength: 'medium',
        blocker_code: BLOCKER_CODE,
        blocker_evidence: EVIDENCE,
        query_basis: 'Reviewed official DCF Family Resource Center CSV plus live MyACCESS public shell, appconfig proxy hints, plain proxy GET, and the fetched flPartnerLocation bundle.',
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
  writeJson(OUTPUTS.batchSummary, {
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'county_local_disability_resources',
    blocker_code: BLOCKER_CODE,
    next_action: NEXT_ACTION,
    lesson_added: lessonAdded,
    evidence_checks: {
      csvUrl: 'https://familyresourcecenter.myflfamilies.com/providers.csv',
      csvUniqueCountyCount: 34,
      remainingCountyGap: 33,
      cpcpsUrl: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      cpcpsStatus: 200,
      cpcpsTitle: 'MyACCESS',
      proxyUrl: 'https://myaccess.myflfamilies.com/dataexchangeproxy',
      proxyStatus: 200,
      proxyShellBytes: 5165,
      appconfigUrl: 'https://myaccess.myflfamilies.com/config/appconfig.js',
      officeMapping: '/dataexchangeproxy',
      bundleUrl: 'https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js',
      bundleFinding: 'Admin/location-form module with county multi-select fields, not a documented public county-office result contract',
    },
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 120 Florida Public Contract Final Blocker Report v1',
      '',
      'This pass does not broaden Florida discovery. It proves that the remaining MyACCESS lane still exposes only a public shell plus proxy hints, while the fetched same-domain JS bundle is an admin/location-form module rather than a documented county-office result contract.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- blocker_code: ${BLOCKER_CODE}`,
      `- next_action: ${NEXT_ACTION}`,
      '- reviewed_counties_from_csv: 34',
      '- remaining_counties_without_public_county_rows: 33',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch120FloridaPublicContractFinalBlockerV1();
  console.log(JSON.stringify(summary, null, 2));
}
