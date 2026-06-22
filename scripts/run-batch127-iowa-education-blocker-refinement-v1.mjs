import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'iowa_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'iowa_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'iowa_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'iowa_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'iowa_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch127_iowa_education_blocker_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch127-iowa-education-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'iowa-california-grade-audit-report-v2.md'),
};

const IOWA_SPECIAL_ED = 'https://educate.iowa.gov/pk-12/special-education';
const IOWA_DISPUTE = 'https://educate.iowa.gov/pk-12/special-education/dispute-resolution';
const IOWA_MAPS = 'https://educate.iowa.gov/pk-12/district-maps';
const IOWA_AEA = 'https://educate.iowa.gov/pk-12/aea-performance-accountability';
const IOWA_STRUCTURAL_BLOCKER = 'official_iowa_district_maps_and_aea_structures_expose_no_district_owned_special_education_leaves';
const IOWA_REASON = 'Reviewed current Iowa Department of Education district-maps, special-education, dispute-resolution, and AEA structural pages. The official district-maps surface links only statewide map/geodata artifacts, and the AEA page remains structural statewide governance content rather than district-owned special-education routing. No district-owned or county-grade special-education leaf is preserved on disk.';

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
    '# Iowa California-Grade Truth Refresh v2',
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
    '- Iowa remains BLOCKED and not index-safe because district_or_county_education_routing still lacks any reviewed district-owned or county-grade special-education routing leaf on disk.',
    '- The blocker is now sharper: the reviewed Iowa district-maps page only exposes statewide map and geodata artifacts, while the reviewed AEA page remains structural statewide content rather than local special-education routing proof.',
  ].join('\n') + '\n';
}

export function generateBatch127IowaEducationBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_structural_statewide_maps_only', status_reason: IOWA_REASON };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: IOWA_STRUCTURAL_BLOCKER,
      evidence: 'Reviewed 2026-06-22 official Iowa district-maps and AEA pages. The district-maps page links statewide map and geodata artifacts such as 2025-26 Iowa Public School District Boundaries and district map downloads, but no district-owned special-education routing leaves. The AEA Performance & Accountability page remains statewide structural/governance content rather than county-grade or district-grade special-education routing proof.',
      next_action: 'hold_blocked_until_reviewed_district_owned_special_education_leaves_are_authored',
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_structural_statewide_maps_only',
        evidence_strength: 'weak',
        blocker_code: IOWA_STRUCTURAL_BLOCKER,
        blocker_evidence: 'The official Iowa district-maps page exposes only structural map/geodata artifacts, and the AEA page is statewide structural content, not district-owned special-education routing.',
        sample_count: 4,
        samples: [
          {
            sample_name: 'Iowa Special Education',
            source_url: IOWA_SPECIAL_ED,
            verification_status: 'verified',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
          },
          {
            sample_name: 'Iowa Dispute Resolution',
            source_url: IOWA_DISPUTE,
            verification_status: 'verified',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
          },
          {
            sample_name: 'School District Maps',
            source_url: IOWA_MAPS,
            verification_status: 'verified',
            source_type: 'official_structural',
            source_table: 'batch127_iowa_education_blocker_refinement',
          },
          {
            sample_name: 'AEA Performance & Accountability',
            source_url: IOWA_AEA,
            verification_status: 'verified',
            source_type: 'official_structural',
            source_table: 'batch127_iowa_education_blocker_refinement',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = updatedFailureRows.map((row, index) => ({
    state: row.state,
    state_code: row.state_code,
    priority_rank: index + 1,
    family: row.family,
    severity: row.severity,
    failure_code: row.failure_code,
    next_action: row.next_action,
    evidence: row.evidence,
  }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: IOWA_STRUCTURAL_BLOCKER,
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'iowa'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 91,
          weak_critical_families: 1,
          missing_critical_families: 0,
          primary_gap_reason: IOWA_STRUCTURAL_BLOCKER,
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'iowa',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'district_or_county_education_routing',
    lesson_added: false,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 127 Iowa Education Blocker Refinement Report v1',
      '',
      'This pass does not reopen Iowa acquisition. It sharpens the last education blocker from a generic statewide-fallback note into a precise structural-evidence blocker tied to the reviewed district-maps and AEA pages.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- refined_family: ${batchSummary.refined_family}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch127IowaEducationBlockerRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
