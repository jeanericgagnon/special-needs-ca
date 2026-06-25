import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'vermont_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'vermont_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'vermont_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'vermont_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'vermont_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch385_vermont_blocker_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch385-vermont-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'vermont-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'official_ahs_district_jurisdiction_codes_are_public_but_no_cataloged_or_public_office_crosswalk_exists';

const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official Vermont county-local pass. The official DCF Vermont Child Care Provider Data dataset on `data.vermont.gov` remains current through 2026-06-15 and publicly preserves both `County` and `AHS District` fields. The official data.vermont.gov catalog search for `Agency of Human Services district` returned only three child-care datasets and no public office-crosswalk dataset that decodes the AHS district abbreviations into office names, addresses, contacts, or county-served assignments. The live AHS root `https://humanservices.vermont.gov/` returned HTTP 403 CloudFront on 2026-06-25, and the DCF offices page `https://dcf.vermont.gov/contacts/partners/offices` also returned HTTP 403 CloudFront on 2026-06-25. Vermont therefore still lacks a reviewable public county-to-office assignment contract.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Vermont California-Grade Audit Report v3',
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
    ...(failureRows.length ? failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`) : ['- none']),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...(nextRows.length ? nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`) : ['- none']),
    '',
    '## Repair decision',
    '',
    '- Vermont remains BLOCKED and not index-safe.',
    '- `county_local_disability_resources` is still the only remaining critical blocker.',
    '- The Vermont open-data lane proves AHS district jurisdiction codes still exist, but the official data catalog still exposes no public crosswalk that maps those abbreviations to office names or county-served contracts.',
    '- The live AHS root and DCF offices page both returned HTTP 403 CloudFront responses again on 2026-06-25, so there is still no reviewable public office directory to close the state.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 385 Vermont Blocker Refinement v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: retained Vermont as blocked while tightening the final county-local disability blocker with official catalog-search exhaustion and fresh 403 confirmation evidence',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch385VermontBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: 'batch385_vermont_blocker_refinement_v1',
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'official_ahs_district_jurisdiction_codes_exist_but_no_cataloged_or_public_office_crosswalk_exists',
        evidence: COUNTY_REASON,
        next_action: 'hold_blocked_until_vermont_publishes_public_ahs_district_code_to_office_or_county_service_area_contract',
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          status_reason: COUNTY_REASON,
        }
      : row
  ));

  const updatedFailureRows = [
    {
      state: 'vermont',
      state_code: 'VT',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'official_ahs_district_jurisdiction_codes_exist_but_no_cataloged_or_public_office_crosswalk_exists',
      evidence: COUNTY_REASON,
      next_action: 'hold_blocked_until_vermont_publishes_public_ahs_district_code_to_office_or_county_service_area_contract',
    },
  ];

  const updatedNextRows = [
    {
      state: 'vermont',
      state_code: 'VT',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'official_ahs_district_jurisdiction_codes_exist_but_no_cataloged_or_public_office_crosswalk_exists',
      next_action: 'hold_blocked_until_vermont_publishes_public_ahs_district_code_to_office_or_county_service_area_contract',
      evidence: 'Current official dataset preserves County and AHS District, but the official catalog still shows no public office crosswalk and the live AHS and DCF office pages both return HTTP 403 CloudFront.',
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') {
      return row;
    }

    return {
      ...row,
      query_basis: 'Reviewed 2026-06-25 the official Vermont DCF child-care provider dataset, official data.vermont.gov catalog searches, and the live AHS and DCF office-directory surfaces for a public county-to-office crosswalk.',
      blocker_code: 'official_ahs_district_jurisdiction_codes_exist_but_no_cataloged_or_public_office_crosswalk_exists',
      blocker_evidence: COUNTY_REASON,
      sample_count: 6,
      samples: [
        {
          sample_name: 'Vermont Child Care Provider Data dataset',
          source_url: 'https://data.vermont.gov/Education/Vermont-Child-Care-Provider-Data/ctdw-tmfz',
          final_url: 'https://data.vermont.gov/Education/Vermont-Child-Care-Provider-Data/ctdw-tmfz',
          verification_status: 'official_verified',
          source_type: 'official_open_data_dataset',
          source_table: 'county_offices',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The official DCF dataset remains current through 2026-06-15 and publicly preserves County and AHS District fields.',
        },
        {
          sample_name: 'AHS District jurisdiction field definition',
          source_url: 'https://api.us.socrata.com/api/catalog/v1?domains=data.vermont.gov&search_context=data.vermont.gov&q=AHS%20District',
          final_url: 'https://api.us.socrata.com/api/catalog/v1?domains=data.vermont.gov&search_context=data.vermont.gov&q=AHS%20District',
          verification_status: 'official_verified',
          source_type: 'official_open_data_field_definition',
          source_table: 'county_offices',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The reviewed field description says AHS District is the three-letter abbreviation for which Agency of Human Services district office jurisdiction the provider town is in.',
        },
        {
          sample_name: 'Official catalog search for Agency of Human Services district',
          source_url: 'https://api.us.socrata.com/api/catalog/v1?domains=data.vermont.gov&search_context=data.vermont.gov&q=%22Agency%20of%20Human%20Services%20district%22',
          final_url: 'https://api.us.socrata.com/api/catalog/v1?domains=data.vermont.gov&search_context=data.vermont.gov&q=%22Agency%20of%20Human%20Services%20district%22',
          verification_status: 'official_verified',
          source_type: 'official_open_data_catalog_search',
          source_table: 'county_offices',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The official catalog search returned only three child-care datasets and no public office-crosswalk dataset that decodes AHS district abbreviations into office names or county-served assignments.',
        },
        {
          sample_name: 'Vermont county and AHS district sample rows',
          source_url: 'https://data.vermont.gov/resource/ctdw-tmfz.csv?$select=provider_town,county,ahs_district&$limit=10',
          final_url: 'https://data.vermont.gov/resource/ctdw-tmfz.csv?$select=provider_town,county,ahs_district&$limit=10',
          verification_status: 'official_verified',
          source_type: 'official_open_data_rows',
          source_table: 'county_offices',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'Reviewed rows show Williston / Chittenden / BDO, East Montpelier / Washington / MDO, North Hero / Grand Isle / ADO, and Bethel / Windsor / HDO.',
        },
        {
          sample_name: 'Agency of Human Services root returns 403',
          source_url: 'https://humanservices.vermont.gov/',
          final_url: 'https://humanservices.vermont.gov/',
          verification_status: 'official_verified',
          source_type: 'official_host_status_check',
          source_table: 'county_offices',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The live AHS root returned HTTP 403 CloudFront during the 2026-06-25 reviewed office-directory pass.',
        },
        {
          sample_name: 'DCF offices page returns 403',
          source_url: 'https://dcf.vermont.gov/contacts/partners/offices',
          final_url: 'https://dcf.vermont.gov/contacts/partners/offices',
          verification_status: 'official_verified',
          source_type: 'official_host_status_check',
          source_table: 'county_offices',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The reviewed DCF offices page also returned HTTP 403 CloudFront on 2026-06-25, leaving no public official office-name or county-served crosswalk on the current host family.',
        },
      ],
    };
  });

  const batchSummary = {
    batch: 'batch385_vermont_blocker_refinement_v1',
    state: 'vermont',
    classification_before: 'BLOCKED',
    classification_after: 'BLOCKED',
    refined_blockers: ['county_local_disability_resources'],
    evidence_sources: [
      'https://data.vermont.gov/Education/Vermont-Child-Care-Provider-Data/ctdw-tmfz',
      'https://api.us.socrata.com/api/catalog/v1?domains=data.vermont.gov&search_context=data.vermont.gov&q=AHS%20District',
      'https://api.us.socrata.com/api/catalog/v1?domains=data.vermont.gov&search_context=data.vermont.gov&q=%22Agency%20of%20Human%20Services%20district%22',
      'https://humanservices.vermont.gov/',
      'https://dcf.vermont.gov/contacts/partners/offices',
    ],
  };

  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchReport = buildBatchReport();

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  return {
    summary: updatedSummary,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch385VermontBlockerRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
