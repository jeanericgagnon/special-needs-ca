import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-hampshire_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-hampshire_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-hampshire_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-hampshire_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-hampshire_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch76_new_hampshire_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch76-new-hampshire-statewide-family-truth-refresh-report-v1.md'),
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

function mustFind(rows, family, label) {
  const row = rows.find((entry) => entry.family === family);
  if (!row) {
    throw new Error(`Missing ${label} row for family ${family}.`);
  }
  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows, batchSummary) {
  return [
    '# New Hampshire California-Grade Batch 76 Report v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Batch focus',
    '',
    '- Preserve the current truthful New Hampshire statewide packet instead of replaying the older PTI-only refresh semantics.',
    '- Confirm that statewide support families already verified on disk stay green.',
    '- Confirm that DHHS, DOE, and VR official host families still fail as host-wide blockers rather than faux-local gaps.',
    '',
    '## Preserved statewide verified families',
    '',
    ...batchSummary.preserved_statewide_support_families.map((family) => `- ${family}`),
    '',
    '## Confirmed host-family blockers',
    '',
    ...batchSummary.confirmed_host_family_blockers.map((family) => `- ${family}`),
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status}`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- New Hampshire remains BLOCKED and not index-safe.',
    '- PTI, P&A, legal aid, ABLE, and federal SSI/SSA crossover remain truthfully verified statewide supports.',
    '- Medicaid, DD, EI, county-local, statewide special education, district routing, and VR remain blocked because the reviewed official host families are still DNS-dead or return the same short `Access Denied` shell.',
    '- No California-grade completion claim is supportable until a public official New Hampshire DHHS, DOE, and VR review lane becomes available.',
  ].join('\n') + '\n';
}

export function generateBatch76NewHampshireStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  if (summary.classification !== 'BLOCKED' || summary.index_safe !== false || summary.completeness_pct !== 33) {
    throw new Error('New Hampshire statewide packet no longer matches the expected blocked baseline for batch76.');
  }

  const pti = mustFind(verifiedRows, 'parent_training_information_center', 'verified');
  const pa = mustFind(verifiedRows, 'protection_and_advocacy', 'verified');
  const legal = mustFind(verifiedRows, 'legal_aid', 'verified');
  const countyLocal = mustFind(verifiedRows, 'county_local_disability_resources', 'verified');
  const education = mustFind(verifiedRows, 'district_or_county_education_routing', 'verified');
  const vr = mustFind(verifiedRows, 'vocational_rehabilitation_pre_ets', 'verified');

  if (pti.family_status !== 'verified_state_grade') {
    throw new Error('PICNH should remain verified_state_grade.');
  }
  if (pa.family_status !== 'verified_state_grade') {
    throw new Error('DRC-NH should remain verified_state_grade.');
  }
  if (legal.family_status !== 'verified_state_grade') {
    throw new Error('NH legal aid should remain verified_state_grade.');
  }
  if (!countyLocal.blocker_evidence.includes('Access Denied')) {
    throw new Error('County-local blocker should preserve Access Denied host-family evidence.');
  }
  if (!education.blocker_evidence.includes('Access Denied')) {
    throw new Error('Education blocker should preserve Access Denied host-family evidence.');
  }
  if (!vr.blocker_evidence.includes('Access Denied')) {
    throw new Error('VR blocker should preserve Access Denied host-family evidence.');
  }

  const batchSummary = {
    batch: 'batch76_new_hampshire_statewide_family_truth_refresh_v1',
    state: 'new-hampshire',
    classification_before: summary.classification,
    classification_after: summary.classification,
    completeness_pct: summary.completeness_pct,
    preserved_statewide_support_families: [
      'parent_training_information_center',
      'protection_and_advocacy',
      'legal_aid',
      'able_program',
      'ssi_ssa_federal_reference',
    ],
    confirmed_host_family_blockers: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
      'county_local_disability_resources',
    ],
    result: 'new_hampshire_remains_truthfully_blocked_because_dhhs_doe_and_vr_host_families_are_not_publicly_reviewable',
  };

  const report = buildReport(summary, gapRows, failureRows, verifiedRows, nextRows, batchSummary);

  writeJson(OUTPUTS.summary, batchSummary);
  fs.mkdirSync(path.dirname(OUTPUTS.report), { recursive: true });
  fs.writeFileSync(OUTPUTS.report, report);

  return {
    summary,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch76NewHampshireStatewideFamilyTruthRefreshV1();
}
