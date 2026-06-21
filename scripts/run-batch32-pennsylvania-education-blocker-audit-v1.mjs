import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const STATE = 'pennsylvania';
const STATE_CODE = 'PA';
const GENERIC_IU_DIRECTORY_URL = 'https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx';

const INPUTS = {
  summary: path.join(generatedDir, 'pennsylvania_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'pennsylvania_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'pennsylvania_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'pennsylvania_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'pennsylvania_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'pennsylvania-california-grade-audit-report-v2.md'),
  exactLeafs: path.join(generatedDir, 'batch28_pennsylvania_verified_leaf_targets_v1.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch32_pennsylvania_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch32-pennsylvania-repair-report-v1.md'),
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

export function collectPennsylvaniaEducationBlockerMetrics() {
  const db = new Database(dbPath, { readonly: true });
  try {
    const totals = db.prepare(`
      select
        count(*) as total_rows,
        sum(case when lower(coalesce(sd.source_url, sd.website, '')) = lower(?) then 1 else 0 end) as generic_iu_directory_rows,
        sum(case when lower(coalesce(sd.source_url, sd.website, '')) != lower(?) then 1 else 0 end) as non_generic_rows
      from school_districts sd
      join counties c on c.id = sd.county_id
      where c.state_id = ?
    `).get(GENERIC_IU_DIRECTORY_URL, GENERIC_IU_DIRECTORY_URL, STATE);

    const genericCountyRows = db.prepare(`
      select
        c.name as county_name,
        sd.name as district_name,
        coalesce(sd.source_url, sd.website) as source_url,
        sd.verification_status,
        sd.source_type
      from school_districts sd
      join counties c on c.id = sd.county_id
      where c.state_id = ?
        and lower(coalesce(sd.source_url, sd.website, '')) = lower(?)
      order by c.name
      limit 8
    `).all(STATE, GENERIC_IU_DIRECTORY_URL);

    return {
      totalRows: Number(totals.total_rows || 0),
      genericIntermediateUnitDirectoryRows: Number(totals.generic_iu_directory_rows || 0),
      nonGenericRows: Number(totals.non_generic_rows || 0),
      sampleGenericCountyRows: genericCountyRows,
    };
  } finally {
    db.close();
  }
}

function updateGapRows(gapRows, metrics, exactLeafs) {
  return gapRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      family_status: 'exact_leaf_targets_verified_partial',
      status_reason: `Reviewed Pennsylvania district exact leaves verified (${exactLeafs.length}), but ${metrics.genericIntermediateUnitDirectoryRows}/${metrics.totalRows} school-district routing rows still point to the generic PDE Intermediate Units directory instead of county/district exact leaves.`,
    };
  });
}

function updateFailureRows(failureRows, metrics, exactLeafs) {
  return failureRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      failure_code: 'generic_intermediate_unit_directory_still_used_for_county_grade_routing',
      evidence: `${metrics.genericIntermediateUnitDirectoryRows}/${metrics.totalRows} Pennsylvania district-routing rows still use ${GENERIC_IU_DIRECTORY_URL}; only ${exactLeafs.length} reviewed district-owned exact leaves are currently proven (${exactLeafs.map((leaf) => leaf.final_url).join(', ')}).`,
      next_action: 'replace_generic_intermediate_unit_directory_rows_with_county_or_district_exact_leaves',
    };
  });
}

function updateVerifiedRows(verifiedRows, metrics, exactLeafs) {
  return verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      family_status: 'exact_leaf_targets_verified_partial',
      evidence_strength: 'medium',
      sample_count: exactLeafs.length,
      query_basis: `${row.query_basis}; Batch 32 Pennsylvania blocker audit quantified remaining generic Intermediate Unit directory rows`,
      blocker_code: 'generic_intermediate_unit_directory_still_used_for_county_grade_routing',
      blocker_evidence: `${metrics.genericIntermediateUnitDirectoryRows}/${metrics.totalRows} Pennsylvania district-routing rows still resolve to the generic PDE Intermediate Units directory instead of county/district exact leaves.`,
    };
  });
}

function updateNextRows(nextRows, metrics) {
  return nextRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      failure_code: 'generic_intermediate_unit_directory_still_used_for_county_grade_routing',
      next_action: 'replace_generic_intermediate_unit_directory_rows_with_county_or_district_exact_leaves',
      evidence: `${metrics.genericIntermediateUnitDirectoryRows}/${metrics.totalRows} Pennsylvania district-routing rows still use the generic PDE Intermediate Units directory.`,
    };
  });
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows, metrics, exactLeafs) {
  return [
    '# Pennsylvania California-Grade Audit Report v2',
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
    '## Batch 32 Pennsylvania education blocker audit',
    '',
    `- verified exact district leaves still proven: ${exactLeafs.length}`,
    `- generic Intermediate Units directory rows remaining: ${metrics.genericIntermediateUnitDirectoryRows}/${metrics.totalRows}`,
    `- next repair lane: replace_generic_intermediate_unit_directory_rows_with_county_or_district_exact_leaves`,
    `- blocker URL still overused: ${GENERIC_IU_DIRECTORY_URL}`,
  ].join('\n') + '\n';
}

function buildBatchReport(metrics, exactLeafs) {
  return [
    '# Batch 32 Pennsylvania Repair Report v1',
    '',
    'This pass does not broaden scraping. It quantifies the remaining county-grade education blocker from current Pennsylvania packet artifacts and DB evidence.',
    '',
    `- exact district leaves already proven: ${exactLeafs.length}`,
    `- generic Intermediate Units directory rows remaining: ${metrics.genericIntermediateUnitDirectoryRows}/${metrics.totalRows}`,
    `- next repair lane: replace_generic_intermediate_unit_directory_rows_with_county_or_district_exact_leaves`,
  ].join('\n');
}

export function generateBatch32PennsylvaniaEducationBlockerAuditV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const exactLeafs = readJsonl(INPUTS.exactLeafs);
  const metrics = collectPennsylvaniaEducationBlockerMetrics();

  const updatedGapRows = updateGapRows(gapRows, metrics, exactLeafs);
  const updatedFailureRows = updateFailureRows(failureRows, metrics, exactLeafs);
  const updatedVerifiedRows = updateVerifiedRows(verifiedRows, metrics, exactLeafs);
  const updatedNextRows = updateNextRows(nextRows, metrics);
  const updatedReport = buildStateReport(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, metrics, exactLeafs);

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_32_pennsylvania_education_blocker_audit_v1',
    generated_at: new Date().toISOString(),
    state: STATE,
    state_code: STATE_CODE,
    classification: summary.classification,
    index_safe: summary.index_safe,
    exact_district_leaves_verified: exactLeafs.length,
    district_routing_rows_total: metrics.totalRows,
    generic_intermediate_unit_directory_rows_remaining: metrics.genericIntermediateUnitDirectoryRows,
    next_repair_lane: 'replace_generic_intermediate_unit_directory_rows_with_county_or_district_exact_leaves',
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport(metrics, exactLeafs)}\n`);
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch32PennsylvaniaEducationBlockerAuditV1();
  console.log(JSON.stringify(summary, null, 2));
}
