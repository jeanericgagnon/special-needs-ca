import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  reviewedLeaves: path.join(generatedDir, 'kansas_reviewed_district_owned_special_education_leaves_v1.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch252_kansas_education_sample_dedupe_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch252-kansas-education-sample-dedupe-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Audit Report v2',
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
    '- Kansas remains BLOCKED and not index-safe.',
    '- Education is sharper again because reviewed district-owned leaves now exist for seven counties instead of six.',
    '- Wyandotte now clears from the district-owned Kansas City Kansas Public Schools `/special-education` leaf.',
    '- Sedgwick remains frozen as a non-match, and Kansas still does not clear until reviewed district-owned special-education or student-services leaves expand county by county across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

export function generateBatch252KansasEducationSampleDedupeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const reviewedLeaves = readJsonl(INPUTS.reviewedLeaves);

  const reviewedLeafUrls = new Set(reviewedLeaves.map((row) => row.exact_leaf_url || row.source_url).filter(Boolean));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    const seen = new Set();
    const dedupedSamples = [];
    for (const sample of row.samples || []) {
      const key = `${sample.source_url}|${sample.final_url}|${sample.sample_name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      dedupedSamples.push(sample);
    }
    return {
      ...row,
      sample_count: dedupedSamples.length,
      samples: dedupedSamples,
    };
  });

  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(summary, gapRows, failureRows, updatedVerifiedRows, nextRows));

  const educationRow = updatedVerifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  const dedupedLeafSampleCount = (educationRow?.samples || []).filter((sample) => reviewedLeafUrls.has(sample.source_url)).length;
  const batchSummary = {
    batch: 'batch252_kansas_education_sample_dedupe_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: summary.classification,
    index_safe: summary.index_safe,
    reviewedDistrictOwnedLeafCount: packet.current_problem_metrics.reviewedDistrictOwnedLeafCount,
    verifiedEducationSampleCount: educationRow?.sample_count ?? 0,
    dedupedLeafSampleCount,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 252 Kansas Education Sample Dedupe Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- family updated: district_or_county_education_routing',
    '',
    '## What changed',
    '',
    '- Removed repeated Atchison, Butler, Douglas, Finney, Johnson, and Shawnee district-owned sample rows from the live Kansas verified-sources artifact.',
    '- Recomputed the verified education sample count from the deduped sample array so the live report matches the actual seven reviewed district-owned leaves plus the explicit non-matching probes.',
    '',
    '## Result',
    '',
    '- Kansas remains BLOCKED and index_safe=false.',
    '- The Kansas education blocker is unchanged in substance: seven reviewed district-owned leaves are preserved, but county-grade education coverage is still incomplete across the 105-county packet.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch252KansasEducationSampleDedupeV1();
}
