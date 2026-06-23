import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch251_idaho_education_sample_dedupe_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch251-idaho-education-sample-dedupe-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
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
    '# Idaho California-Grade Audit Report v2',
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
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education is still a county-by-county exact-leaf expansion lane, but it now has eleven reviewed district-owned leaves, including a newly verified Gooding Joint District #231 Special Education page.',
    '- County-local remains the same explicit split: 17 clean office replacements plus the Canyon split are preserved, and 27 counties stay blocked until Idaho publishes a public county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch251IdahoEducationSampleDedupeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);

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
  const batchSummary = {
    batch: 'batch251_idaho_education_sample_dedupe_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: summary.classification,
    index_safe: summary.index_safe,
    reviewedExactLeafCount: packet.current_problem_metrics.reviewedExactLeafCount,
    verifiedEducationSampleCount: educationRow?.sample_count ?? 0,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 251 Idaho Education Sample Dedupe Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- family updated: district_or_county_education_routing',
    '',
    '## What changed',
    '',
    '- Removed duplicate Blaine County education samples from the live Idaho verified-sources artifact.',
    '- Recomputed the verified education sample count from the deduped sample array so the live report matches the actual reviewed evidence set.',
    '',
    '## Result',
    '',
    '- Idaho remains BLOCKED and index_safe=false.',
    '- The Idaho education blocker is unchanged in substance: eleven reviewed district-owned leaves are preserved, but county-grade coverage is still incomplete.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch251IdahoEducationSampleDedupeV1();
}
