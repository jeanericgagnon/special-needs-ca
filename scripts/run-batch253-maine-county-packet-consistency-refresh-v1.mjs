import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maine_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  countyPacket: path.join(generatedDir, 'maine_county_local_disability_resources_mapping_packet_v1.json'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch253_maine_county_packet_consistency_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch253-maine-county-packet-consistency-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Maine California-Grade Audit Report v2',
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
    '- Maine remains BLOCKED and not index-safe.',
    '- Education still has a real public selector/workbook inventory lane on the official DOE host.',
    '- Maine education does not clear because both current named raw replays return the same HTTP 500 error shell instead of reusable local contact rows.',
    '- County-local remains blocked because the official DHHS office page publishes named office towns, but still no county or service-area mapping fields in public HTML.',
  ].join('\n') + '\n';
}

export function generateBatch253MaineCountyPacketConsistencyRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedCountyPacket = {
    ...countyPacket,
    current_problem_metrics: {
      ...countyPacket.current_problem_metrics,
      districtOfficeTownLookupVisible: true,
    },
    purpose: 'Deterministic packet for replacing Maine DOI and dead-locator county-office rows only where a truthful county-to-office mapping contract can be proven from the live DHHS district office page or another reviewed official crosswalk.',
    packet_complete_when: 'Every Maine county office row either maps to a reviewed DHHS district office with public county or service-area support or remains explicitly blocked because the live office directory lists office towns but still lacks a county or service-area mapping contract.',
  };

  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows));

  const batchSummary = {
    batch: 'batch253_maine_county_packet_consistency_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: summary.classification,
    index_safe: summary.index_safe,
    districtOfficeTownLookupVisible: updatedCountyPacket.current_problem_metrics.districtOfficeTownLookupVisible,
    unresolvedMultiOfficeCountyCount: updatedCountyPacket.unresolved_multi_office_counties.length,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 253 Maine County Packet Consistency Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- family updated: county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- Corrected the Maine county-local packet to preserve the true reviewed DHHS signal: district office towns are visible on the live office page even though county or service-area fields are still absent.',
    '- Rebuilt the Maine state report from the live ledgers so the close-out language no longer backslides into a false `zero town` claim.',
    '',
    '## Result',
    '',
    '- Maine remains BLOCKED and index_safe=false.',
    '- The blocker is now phrased precisely: office-town evidence exists, but no truthful county-to-office or service-area crosswalk exists on the reviewed official page.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch253MaineCountyPacketConsistencyRefreshV1();
}
