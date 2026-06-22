import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const OUTPUTS = {
  summary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch100_florida_county_local_browser_lane_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
  batchReport: path.join(docsGeneratedDir, 'batch100-florida-county-local-browser-lane-refinement-report-v1.md'),
};

const BROWSER_LANE_BLOCKER_CODE =
  'official_myaccess_county_locator_requires_browser_assisted_or_api_contract_repair';
const BROWSER_LANE_NEXT_ACTION =
  'move_county_local_disability_resources_to_browser_assisted_myaccess_office_mapping_repair';
const BROWSER_LANE_EVIDENCE =
  'The official Family Resource Center page and same-domain providers.csv preserve reviewed storefront rows for only 34 of Florida’s 67 counties. The live first-party MyACCESS Community Partner Search at https://myaccess.myflfamilies.com/Public/CPCPS is a JavaScript shell, appconfig.js exposes officeMapping=/dataexchangeproxy, and a bounded plain GET to https://myaccess.myflfamilies.com/dataexchangeproxy returns the same shell instead of county results. The remaining 33 counties therefore require browser-assisted or documented API-contract extraction from the official first-party lane.';
const BROWSER_LANE_STATUS_REASON =
  'The replatformed DCF Family Resource Center chain preserves reviewed storefront coverage for 34/67 counties, but the remaining county-grade office search now sits behind the live first-party MyACCESS Community Partner Search JavaScript shell and officeMapping dataexchangeproxy lane.';

const EVIDENCE_CHECKS = {
  cpcpsUrl: 'https://myaccess.myflfamilies.com/Public/CPCPS',
  cpcpsStatus: 200,
  cpcpsTitle: 'MyACCESS',
  cpcpsShellEvidence:
    'Bounded live fetch returned a JavaScript shell with no county office rows in static HTML and a noscript prompt requiring JavaScript.',
  appConfigUrl: 'https://myaccess.myflfamilies.com/config/appconfig.js',
  appConfigOfficeMapping: '/dataexchangeproxy',
  officeMappingUrl: 'https://myaccess.myflfamilies.com/dataexchangeproxy',
  officeMappingStatus: 200,
  officeMappingShellEvidence:
    'Bounded plain GET returned the same MyACCESS shell instead of county office result content, so the official county-local lane is not statically scrapeable as-is.',
};

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

function buildUpdatedGapRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'blocked_browser_assisted_official_locator',
      status_reason: BROWSER_LANE_STATUS_REASON,
    };
  });
}

function buildUpdatedFailures() {
  return [
    {
      state: 'florida',
      state_code: 'FL',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: BROWSER_LANE_BLOCKER_CODE,
      evidence: BROWSER_LANE_EVIDENCE,
      next_action: BROWSER_LANE_NEXT_ACTION,
    },
  ];
}

function buildUpdatedVerifiedRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'blocked_browser_assisted_official_locator',
      evidence_strength: 'medium',
      blocker_code: BROWSER_LANE_BLOCKER_CODE,
      blocker_evidence: BROWSER_LANE_EVIDENCE,
      query_basis: 'Reviewed official DCF Family Resource Center storefront CSV plus bounded first-party MyACCESS shell and appconfig officeMapping probes.',
    };
  });
}

function buildUpdatedSummary(existingSummary) {
  return {
    ...existingSummary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    primary_gap_reason: BROWSER_LANE_BLOCKER_CODE,
    critical_gap_families: ['county_local_disability_resources'],
    major_gap_families: [],
    complete_ready: false,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: BROWSER_LANE_BLOCKER_CODE,
        evidence: BROWSER_LANE_EVIDENCE,
        next_action: BROWSER_LANE_NEXT_ACTION,
      },
    ],
  };
}

function buildNextActions() {
  return [
    {
      state: 'florida',
      state_code: 'FL',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: BROWSER_LANE_BLOCKER_CODE,
      next_action: BROWSER_LANE_NEXT_ACTION,
      evidence: BROWSER_LANE_EVIDENCE,
    },
  ];
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
    `- county_local_disability_resources: ${BROWSER_LANE_BLOCKER_CODE} :: ${BROWSER_LANE_EVIDENCE}`,
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
    '- County-local disability resources are still not California-grade complete. The reviewed Family Resource Center chain still covers only 34/67 counties, and the remaining official locator lane now resolves to the live first-party MyACCESS JS shell rather than static county office rows.',
    '- Florida therefore remains truthfully BLOCKED and not index-safe until the remaining 33 counties are repaired through a browser-assisted or documented API-contract extraction from the official MyACCESS office-mapping lane.',
    '',
    '## Evidence checks',
    '',
    `- Family Resource Center partial coverage: 34/67 counties remain preserved from reviewed same-domain storefront rows.`,
    `- MyACCESS Community Partner Search: ${EVIDENCE_CHECKS.cpcpsUrl} returned ${EVIDENCE_CHECKS.cpcpsStatus} with title "${EVIDENCE_CHECKS.cpcpsTitle}" but only a JavaScript shell and no county office rows in static HTML.`,
    `- MyACCESS app config: ${EVIDENCE_CHECKS.appConfigUrl} exposes officeMapping=${EVIDENCE_CHECKS.appConfigOfficeMapping}.`,
    `- Office-mapping endpoint check: bounded plain GET to ${EVIDENCE_CHECKS.officeMappingUrl} returned ${EVIDENCE_CHECKS.officeMappingStatus} with the same shell, so the remaining county-local office evidence is browser-assisted or API-contract-only in the current lane.`,
    '',
    '## Final family count',
    '',
    `- strong_critical_families: ${summary.strong_critical_families}`,
    `- weak_critical_families: ${summary.weak_critical_families}`,
    `- missing_critical_families: ${summary.missing_critical_families}`,
    '- county_local_disability_resources: blocked_browser_assisted_official_locator',
  ].join('\n') + '\n';
}

function buildBatchReport(summary) {
  return [
    '# Batch 100 Florida County-Local Browser-Lane Refinement Report v1',
    '',
    'This pass does not broaden Florida discovery. It sharpens the only remaining blocker by proving that the uncovered county-local office lane now depends on the live first-party MyACCESS JavaScript search flow instead of a static same-domain locator.',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- county_local_blocker_code: ${BROWSER_LANE_BLOCKER_CODE}`,
    `- county_local_next_action: ${BROWSER_LANE_NEXT_ACTION}`,
    `- partial_static_county_coverage: 34/67`,
    `- browser_lane_required: true`,
  ].join('\n') + '\n';
}

export function generateBatch100FloridaCountyLocalBrowserLaneRefinementV1() {
  const summary = readJson(OUTPUTS.summary);
  const gapRows = readJsonl(OUTPUTS.gap);
  const verifiedRows = readJsonl(OUTPUTS.verified);

  const updatedGapRows = buildUpdatedGapRows(gapRows);
  const updatedFailures = buildUpdatedFailures();
  const updatedVerifiedRows = buildUpdatedVerifiedRows(verifiedRows);
  const updatedSummary = buildUpdatedSummary(summary);
  const updatedNextActions = buildNextActions();
  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextActions);

  writeJson(OUTPUTS.summary, updatedSummary);
  writeJsonl(OUTPUTS.gap, updatedGapRows);
  writeJsonl(OUTPUTS.failures, updatedFailures);
  writeJsonl(OUTPUTS.verified, updatedVerifiedRows);
  writeJsonl(OUTPUTS.nextActions, updatedNextActions);
  fs.writeFileSync(OUTPUTS.report, updatedReport);

  const batchSummary = {
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'county_local_disability_resources',
    blocker_code: BROWSER_LANE_BLOCKER_CODE,
    next_action: BROWSER_LANE_NEXT_ACTION,
    evidence_checks: EVIDENCE_CHECKS,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch100FloridaCountyLocalBrowserLaneRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
