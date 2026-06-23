import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'michigan_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'michigan_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'michigan_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'michigan_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'michigan_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch162_michigan_arcgis_contract_field_audit_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch162-michigan-arcgis-contract-field-audit-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'michigan-california-grade-audit-report-v2.md'),
};

const STATUS_REASON =
  'The official Michigan Schools and Districts ArcGIS stack is now contract-audited more precisely: the public district and ISD layers expose geometry and identifier fields only, while the reviewed school layer carries address-like fields but still no district special-education routing contract. That leaves Michigan blocked on education because the live public app still cannot produce county-to-district routing, district contacts, or district-owned special-education leaves from the official state contract alone.';
const BLOCKER_EVIDENCE =
  'Reviewed 2026-06-23 the official Michigan Schools and Districts ArcGIS app plus live layer metadata for the public district, ISD, and school services. The district layer only exposes fields such as FIPSCODE, FIPSNUM, NAME, LABEL, TYPE, DCODE, and ISD, and the ISD layer exposes only NAME, LABEL, TYPE, ISD, and identifier geometry fields like ISDCode. The school layer does carry school-level address fields such as STREET and CITY, but still no district routing contacts, district-owned special-education leaves, superintendent email/phone contract, or county-to-district routing table. Michigan therefore remains blocked because the official state map stack proves boundaries and identifiers, not California-grade local education routing.';

const LESSON_HEADING =
  '### ArcGIS Layer Metadata Can Close The Routing Question Without Feature Scraping';
const LESSON_BODY =
  '*   **Lesson:** When an official ArcGIS app is the last education lead, inspect the live layer metadata before scraping features at scale. Michigan’s district and ISD layers exposed only geometry and identifier fields, which was enough to prove the state map could not satisfy county-grade routing without reopening a broad district-leaf crawl.';

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
    '# Michigan California-Grade Audit Report v2',
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
    '- County-local disability resources still pass at county grade from the reviewed MDHHS county-office leaves.',
    '- District or county education routing remains blocked because the live official ArcGIS stack proves boundaries and identifiers only; it still does not publish district routing contacts, special-education leaves, or a county-to-district contract.',
    '- Michigan therefore remains `BLOCKED` and `index_safe=false` until the education-routing blocker is replaced with county-grade official routing evidence.',
  ].join('\n') + '\n';
}

export function generateBatch162MichiganArcgisContractFieldAuditV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: STATUS_REASON }
      : row
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, evidence: BLOCKER_EVIDENCE }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          query_basis: 'Reviewed 2026-06-23 the official Michigan ArcGIS app plus live district, ISD, and school layer metadata.',
          blocker_evidence: BLOCKER_EVIDENCE,
        }
      : row
  );

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, evidence: BLOCKER_EVIDENCE }
      : row
  );

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_mde_arcgis_district_and_isd_layers_expose_geometry_and_ids_without_local_routing_contract',
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'official_mde_arcgis_school_map_exposes_geometry_without_local_routing_contract',
        evidence: BLOCKER_EVIDENCE,
        next_action: 'hold_blocked_until_official_district_or_isd_routing_contract_exists',
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  const batchSummary = {
    state: 'michigan',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_blocker_sharpened: true,
    lessons_updated: lessonsUpdated,
    blocker_basis: 'arcgis_layer_metadata_contract_audit',
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch162MichiganArcgisContractFieldAuditV1();
  console.log(JSON.stringify(result, null, 2));
}
