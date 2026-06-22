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
  batchSummary: path.join(generatedDir, 'batch104_florida_myaccess_browser_403_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
  batchReport: path.join(docsGeneratedDir, 'batch104-florida-myaccess-browser-403-refinement-report-v1.md'),
};

const BLOCKER_CODE = 'official_myaccess_locator_cloudfront_403_blocks_browser_lane';
const NEXT_ACTION = 'hold_county_local_until_first_party_locator_is_reachable_or_documented_api_contract_is_available';
const EVIDENCE =
  'The official Family Resource Center page and same-domain providers.csv still preserve reviewed storefront rows for only 34 of Florida’s 67 counties. Earlier bounded static fetches showed the first-party MyACCESS Community Partner Search shell at https://myaccess.myflfamilies.com/Public/CPCPS plus appconfig.js officeMapping=/dataexchangeproxy, but a fresh bounded Playwright probe on 2026-06-22 now receives an immediate CloudFront 403 document response with body text "Request blocked" before any in-browser search interaction. The remaining 33 counties therefore cannot be truthfully marked as browser-repairable from the current environment and stay blocked pending first-party reachability or a documented API contract.';
const STATUS_REASON =
  'The replatformed DCF Family Resource Center chain preserves reviewed storefront coverage for 34/67 counties, but the remaining official MyACCESS county-locator lane now fails in the browser with an immediate CloudFront 403 Request blocked response.';
const LESSON_HEADING = '### Browser Lanes Must Be Rechecked When Static JS Shell Evidence Looks Promising';
const LESSON_BULLET = '*   **Lesson:** If static fetches show a live JS shell plus config hints, still run one bounded browser probe before promising browser-assisted completion. Florida MyACCESS looked browser-repairable from static shell evidence, but Playwright hit an immediate CloudFront 403 document block, so the lane had to be downgraded from “needs automation” to “official browser access blocked.”';

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

function ensureLesson() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BULLET}\n`);
}

function buildReport(summary, gapRows, verifiedRows, nextActions) {
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
    ...nextActions.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Florida repair decision',
    '',
    '- District or county education routing remains verified from the live official FDLRS county routing page.',
    '- County-local disability resources are still not California-grade complete. The reviewed Family Resource Center chain still covers only 34/67 counties, and the remaining official MyACCESS locator lane now fails even in the bounded browser lane with a CloudFront 403 Request blocked response.',
    '- Florida therefore remains truthfully BLOCKED and not index-safe until the first-party locator becomes reachable in-browser from the repair lane or the state exposes a documented office-mapping contract that can be verified without inference.',
  ].join('\n') + '\n';
}

export function generateBatch104FloridaMyaccessBrowser403RefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_browser_lane_cloudfront_403', status_reason: STATUS_REASON }
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
        family_status: 'blocked_browser_lane_cloudfront_403',
        blocker_code: BLOCKER_CODE,
        blocker_evidence: EVIDENCE,
        query_basis: 'Reviewed official DCF Family Resource Center storefront CSV plus bounded static MyACCESS shell/appconfig probes and a bounded Playwright browser probe that returned an immediate CloudFront 403.',
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
    primary_gap_reason: BLOCKER_CODE,
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
  ensureLesson();

  fs.writeFileSync(OUTPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextActions));
  writeJson(OUTPUTS.batchSummary, {
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'county_local_disability_resources',
    blocker_code: BLOCKER_CODE,
    next_action: NEXT_ACTION,
    evidence_checks: {
      staticShellHint: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      officeMappingHint: '/dataexchangeproxy',
      browserStatus: 403,
      browserTitle: 'ERROR: The request could not be satisfied',
      browserBodyContains: 'Request blocked',
    },
  });
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 104 Florida MyACCESS Browser 403 Refinement Report v1',
      '',
      'This pass does not broaden Florida discovery. It reruns one bounded browser check against the official MyACCESS lane and proves that the remaining county-local blocker is now a true first-party browser-access block, not merely an unsolved automation task.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- blocker_code: ${BLOCKER_CODE}`,
      `- next_action: ${NEXT_ACTION}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch104FloridaMyaccessBrowser403RefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
