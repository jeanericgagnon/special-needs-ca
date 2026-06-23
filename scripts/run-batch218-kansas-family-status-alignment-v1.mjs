import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const FILES = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch218_kansas_family_status_alignment_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch218-kansas-family-status-alignment-report-v1.md'),
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

export function generateBatch218KansasFamilyStatusAlignmentV1() {
  const summary = readJson(FILES.summary);
  const gapRows = readJsonl(FILES.gap);
  const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');

  summary.familyStatuses ||= {};
  summary.familyStatuses.district_or_county_education_routing = districtGap.family_status;

  writeJson(FILES.summary, summary);

  const batchSummary = {
    batch: 'batch_218_kansas_family_status_alignment_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    aligned_family: 'district_or_county_education_routing',
    aligned_status: districtGap.family_status,
    previous_stale_status: 'blocked_live_ksde_directory_roots_without_local_contract',
  };
  writeJson(FILES.batchSummary, batchSummary);

  const report = [
    '# Kansas Family Status Alignment Report v1',
    '',
    '- state: kansas',
    '- aligned_family: district_or_county_education_routing',
    '- previous_stale_status: blocked_live_ksde_directory_roots_without_local_contract',
    `- aligned_status: ${districtGap.family_status}`,
    '',
    'This pass fixes a stale summary-only blocker shape. Kansas is still BLOCKED and not index-safe, but the summary now matches the current packet truth: the state is past a root-only education blocker and already has a small set of reviewed district-owned leaves on disk.',
    '',
  ].join('\n');
  fs.writeFileSync(FILES.batchReport, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch218KansasFamilyStatusAlignmentV1();
  console.log(JSON.stringify(summary, null, 2));
}
