import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'georgia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'georgia_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'georgia_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'georgia_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'georgia_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch140_georgia_public_region_replacement_check_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch140-georgia-public-region-replacement-check-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'official_county_page_omits_county_labels_while_public_region_replacements_lack_county_service_area_contract';
const FAILURE_CODE = 'official_county_page_omits_county_labels_while_public_region_replacements_lack_county_service_area_contract';
const NEXT_ACTION = 'hold_blocked_until_public_county_to_region_mapping_or_counties_served_contract_is_republished';
const STATUS_REASON = 'Georgia DBHDD now exposes public official replacement leaves for every region under /contacts/region-*-field-office and /locations/region-*-field-office, but the county-grade contract is still missing. The live county page still renders 159 blank first-column rows with only repeated legacy region-* links and no county labels in fetched HTML. The public replacement contact/location leaves preserve office identity, address, and phone, but they do not expose counties served, service area, or another county-to-region map in fetched public source, so a deterministic 159-county routing map still cannot be verified.';
const EVIDENCE = 'Reviewed 2026-06-22 bounded live official DBHDD sources: the county lookup page https://dbhdd.georgia.gov/regional-field-office-county, official sitemap entries under https://dbhdd.georgia.gov/sitemap.xml, public replacement leaves such as https://dbhdd.georgia.gov/contacts/region-1-field-office and https://dbhdd.georgia.gov/locations/region-1-field-office, and legacy region-* links. The county lookup page still contains 159 table rows whose first column is blank and whose second column repeats only legacy region-1 through region-6 links; fetched HTML still exposes no county labels. DBHDD now does publish public replacement leaves under /contacts/region-*-field-office and /locations/region-*-field-office, and those pages preserve region office titles plus contact/location details. But the reviewed public replacement leaves still do not expose counties served, service area, or another county-to-region contract, so Georgia still lacks verified county-grade DD routing evidence for all 159 counties.';

const DD_SAMPLES = [
  {
    sample_name: 'Regional Field Office by County',
    source_url: 'https://dbhdd.georgia.gov/regional-field-office-county',
    final_url: 'https://dbhdd.georgia.gov/regional-field-office-county',
    verification_status: 'blocked',
    source_type: 'official_county_lookup_without_county_labels',
    source_table: 'batch140_georgia_public_region_replacement_check',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The public county lookup still renders 159 rows with blank first-column cells and repeated Region links, so no county-to-region mapping is visible in fetched HTML.',
  },
  ...[1, 2, 3, 4, 5, 6].map((region) => ({
    sample_name: `Region ${region} Field Office Contact`,
    source_url: `https://dbhdd.georgia.gov/contacts/region-${region}-field-office`,
    final_url: `https://dbhdd.georgia.gov/contacts/region-${region}-field-office`,
    verification_status: 'verified',
    source_type: 'official_public_region_contact_leaf',
    source_table: 'batch140_georgia_public_region_replacement_check',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: `The public contact leaf for Region ${region} Field Office is live and preserves region office identity plus contact details, but no counties served or service-area contract is exposed in fetched page text.`,
  })),
  ...[1, 2, 3, 4, 5, 6].map((region) => ({
    sample_name: `Region ${region} Field Office Location`,
    source_url: `https://dbhdd.georgia.gov/locations/region-${region}-field-office`,
    final_url: `https://dbhdd.georgia.gov/locations/region-${region}-field-office`,
    verification_status: 'verified',
    source_type: 'official_public_region_location_leaf',
    source_table: 'batch140_georgia_public_region_replacement_check',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: `The public location leaf for Region ${region} Field Office is live and preserves office identity/location, but no counties served or county-to-region mapping is exposed in fetched page text.`,
  })),
];

const LESSON_HEADING = '### Official Sitemap Siblings Can Repair Dead Legacy Slugs Without Repairing County Coverage';
const LESSON_BODY = '*   **Lesson:** When a county lookup points to dead or unpublished legacy slugs, check the official sitemap for sibling `/contacts/...` or `/locations/...` leaves before declaring the whole family dead. But do not clear a county-grade family unless those replacement leaves also expose counties served or another public county-to-region contract. Georgia DBHDD had live replacement region leaves, but county mapping still stayed blocked.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Georgia California-Grade Audit Report v2',
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
    '## Georgia final blocker decision',
    '',
    '- Developmental disability routing remains blocked.',
    '- DBHDD now exposes public official region contact and location leaves, so the old “all region leaves are inaccessible” story is no longer true.',
    '- But the live county page still exposes only 159 blank county rows plus repeated region links, and the public replacement region leaves do not publish counties served or another county-to-region contract.',
    '- Georgia should reopen this family only if DBHDD republishes a public county-to-region mapping or adds counties-served evidence to a public official regional source.',
  ].join('\n') + '\n';
}

export function generateBatch140GeorgiaPublicRegionReplacementCheckV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const derivedFinalBlockers = failureRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { family: row.family, severity: row.severity, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : { family: row.family, severity: row.severity, failure_code: row.failure_code, evidence: row.evidence, next_action: row.next_action }
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: derivedFinalBlockers,
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, family_status: 'blocked_county_page_without_county_labels', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = [
    {
      state: 'georgia',
      state_code: 'GA',
      family: 'developmental_disability_idd_authority',
      severity: 'critical',
      failure_code: FAILURE_CODE,
      evidence: EVIDENCE,
      next_action: NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
        ...row,
        family_status: 'blocked_county_page_without_county_labels',
        evidence_strength: 'medium',
        sample_count: DD_SAMPLES.length,
        query_basis: 'Reviewed official DBHDD county lookup page, official sitemap-discovered /contacts and /locations region replacements, and legacy region links for a county-to-region contract.',
        blocker_code: FAILURE_CODE,
        blocker_evidence: EVIDENCE,
        samples: DD_SAMPLES,
      }
      : row
  ));

  const updatedNextRows = [
    {
      state: 'georgia',
      state_code: 'GA',
      priority_rank: 1,
      family: 'developmental_disability_idd_authority',
      severity: 'critical',
      failure_code: FAILURE_CODE,
      next_action: NEXT_ACTION,
      evidence: EVIDENCE,
    },
  ];

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'georgia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    blocker_family: 'developmental_disability_idd_authority',
    county_lookup_blank_rows: 159,
    public_region_contact_leaves: 6,
    public_region_location_leaves: 6,
    county_mapping_contract_found: false,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 140 Georgia Public Region Replacement Check Report v1',
      '',
      'This pass stays bounded to official DBHDD sources. It records that public sitemap siblings now preserve region leaf pages, but the county-grade mapping contract is still missing.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- county_lookup_blank_rows: ${batchSummary.county_lookup_blank_rows}`,
      `- public_region_contact_leaves: ${batchSummary.public_region_contact_leaves}`,
      `- public_region_location_leaves: ${batchSummary.public_region_location_leaves}`,
      `- county_mapping_contract_found: ${batchSummary.county_mapping_contract_found}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch140GeorgiaPublicRegionReplacementCheckV1();
  console.log(JSON.stringify(summary, null, 2));
}
