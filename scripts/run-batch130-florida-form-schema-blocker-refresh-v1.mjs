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
  batchSummary: path.join(generatedDir, 'batch130_florida_form_schema_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch130-florida-form-schema-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const STATUS_REASON = 'Official Florida DCF county-local routing remains split between a reviewed Family Resource Center CSV that covers 34/67 counties and a MyACCESS public shell/proxy lane that still does not expose a public county-row contract. The live app config still points officeMapping at /dataexchangeproxy, but the fetched UXModule.flPartnerLocation bundle only exposes blank form-schema fields like id/locationName/phoneNumber/streetAddress plus a county select control rather than a reviewed public county-result dataset.';
const EVIDENCE = 'Reviewed 2026-06-22 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/dataexchangeproxy, and the live official bundle https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js. The Family Resource Center CSV still preserves reviewed storefront coverage for only 34/67 Florida counties. The public CPCPS entry and plain GET to /dataexchangeproxy both return the same 5165-byte MyACCESS shell instead of county results. Appconfig still exposes officeMapping=/dataexchangeproxy, but the fetched flPartnerLocation bundle only exposes county form controls and a blank location template (`id`, `locationName`, `phoneNumber`, `faxNumber`, `streetAddress`) rather than a documented public county-office search response or downloadable county dataset. Florida therefore still lacks reviewed first-party county-grade local-routing evidence for the remaining 33 counties.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '## Repair decision',
    '',
    '- Florida remains BLOCKED and not index-safe.',
    '- The reviewed official Family Resource Center CSV still clears only 34 counties.',
    '- The remaining MyACCESS lane is still not a public county-results contract: the shell and proxy return only the public app chrome, and the reviewed JS bundle exposes form-schema fields instead of a downloadable or queryable county-office dataset.',
    '- Florida should only reopen county-local once a first-party county dataset or documented anonymous search contract is public for the remaining 33 counties.',
  ].join('\n') + '\n';
}

export function generateBatch130FloridaFormSchemaBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, evidence: EVIDENCE }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        query_basis: 'Reviewed official DCF Family Resource Center CSV plus live MyACCESS public shell, appconfig proxy hints, plain proxy GET, and the fetched flPartnerLocation form-schema bundle.',
        blocker_evidence: EVIDENCE,
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, evidence: EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, evidence: EVIDENCE }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const batchSummary = {
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    blocker_family: 'county_local_disability_resources',
    counties_cleared_via_csv: 34,
    counties_still_missing_public_contract: 33,
    shell_bytes: 5165,
    bundle_signal: 'county_form_controls_plus_blank_location_template',
    lesson_added: false,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 130 Florida Form-Schema Blocker Refresh Report v1',
      '',
      'This pass does not broaden Florida discovery. It tightens the MyACCESS blocker by distinguishing a public form-schema bundle from a public county-results contract.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- counties_cleared_via_csv: ${batchSummary.counties_cleared_via_csv}`,
      `- counties_still_missing_public_contract: ${batchSummary.counties_still_missing_public_contract}`,
      `- bundle_signal: ${batchSummary.bundle_signal}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch130FloridaFormSchemaBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
