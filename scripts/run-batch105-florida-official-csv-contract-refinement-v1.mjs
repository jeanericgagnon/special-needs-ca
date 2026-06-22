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
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch105_florida_official_csv_contract_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
  batchReport: path.join(docsGeneratedDir, 'batch105-florida-official-csv-contract-refinement-report-v1.md'),
};

const BLOCKER_CODE = 'official_family_resource_center_csv_only_covers_34_counties';
const NEXT_ACTION = 'hold_county_local_until_first_party_family_resource_center_dataset_expands_or_new_official_county_locator_is_published';
const EVIDENCE =
  'Reviewed 2026-06-22 live first-party Family Resource Center homepage https://familyresourcecenter.myflfamilies.com/ and its published dataset https://familyresourcecenter.myflfamilies.com/providers.csv. The homepage JavaScript explicitly fetches providers.csv to populate the county filter, and the official CSV contains only 39 rows covering 34 unique Florida counties. The public first-party dataset therefore stops at 34/67 counties, so the remaining 33 counties are absent from the published county-local routing contract rather than merely hidden behind the blocked MyACCESS browser lane.';
const STATUS_REASON =
  'The public first-party Family Resource Center contract is now explicit: the homepage fetches providers.csv to power the county filter, and that official CSV covers only 34/67 Florida counties.';

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
    '- County-local disability resources are still not California-grade complete. The public first-party Family Resource Center homepage openly uses providers.csv as its county filter dataset, and that official CSV still covers only 34 of Florida’s 67 counties.',
    '- Florida therefore remains truthfully BLOCKED and not index-safe until the first-party Family Resource Center dataset expands to the remaining counties or a new official county locator is published.',
  ].join('\n') + '\n';
}

export function generateBatch105FloridaOfficialCsvContractRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_official_csv_contract_partial', status_reason: STATUS_REASON }
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
        family_status: 'blocked_official_csv_contract_partial',
        blocker_code: BLOCKER_CODE,
        blocker_evidence: EVIDENCE,
        query_basis: 'Reviewed official Family Resource Center homepage JavaScript plus the published providers.csv county dataset.',
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
      homepageUrl: 'https://familyresourcecenter.myflfamilies.com/',
      csvUrl: 'https://familyresourcecenter.myflfamilies.com/providers.csv',
      homepageUsesCsvFetch: true,
      csvRowCount: 39,
      csvUniqueCountyCount: 34,
      remainingCountyGap: 33,
    },
  });
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 105 Florida Official CSV Contract Refinement Report v1',
      '',
      'This pass does not broaden Florida discovery. It replaces the vague browser-lane blocker with the sharper first-party truth that the public Family Resource Center contract is the homepage plus providers.csv, and that published dataset still covers only 34 counties.',
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
  const summary = generateBatch105FloridaOfficialCsvContractRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
